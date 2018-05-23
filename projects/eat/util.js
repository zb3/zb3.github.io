"use strict";
/*
correctness issues:
1. epsilons should be where divisions, comparisons with 0, or comparisons of stuff coming from different formula are
3. ray should be sligtly more than width*sqrt(2)
in this case ~715
(again, that's for meter)
(not here - in meter, make sure to add big epsilon for illegal area - like 0.01)

4. epsilon consequence needed - if we choose that it lies on this side
then if sides aren't equal - it has to intersect no matter what.

*/

eat.util = {};
eat.util.epsilon = 0.000000001; //There should be more epsilons, but at least you can find cases for it
eat.util.bigepsilon = 0.0001; //for purging vertices, false positive doesn't break

//ray should be p. force means is MUST intersect, so don't check t
eat.util.lineline = function(px, py, prx, pry, qx, qy, qsx, qsy, force) {
  //update to return the point

  var rx = prx - px,
    ry = pry - py,
    sx = qsx - qx,
    sy = qsy - qy;
  var kx = qx - px,
    ky = qy - py;
  var rxs = rx * sy - ry * sx;
  var na = kx * sy - ky * sx,
    nb = kx * ry - ky * rx;
  var t, u;

  if (Math.abs(rxs) < eat.util.epsilon) { //parallel. division here, so epsilon reasonable

    if (Math.abs(na) < eat.util.epsilon && Math.abs(nb) < eat.util.epsilon) { //epsilon reasonable - false negative is dangerous here

      //I wouldn't copy paste, this may be wrong - I've made it
      //however all other solutions were....... wrong here.
      //interesting cases:
      //(0, 0, 1000, 0, 1005, 0, 106, 0) - true
      //(0, 0, 1000, 0, 1005, 0, 1006, 0) - false

      if (Math.min(px, prx) <= Math.max(qx, qsx) && Math.min(qx, qsx) <= Math.max(px, prx) && Math.min(py, pry) <= Math.max(qy, qsy) && Math.min(qy, qsy) <= Math.max(py, pry)) {
        //isn't it the closest point to p?
        var nearest = [
          [Math.sqrt(rx * rx + ry * ry), prx, pry],
          [Math.sqrt(kx * kx + ky * ky), qx, qy],
          [Math.sqrt((qsx - px) * (qsx - px) + (qsy - py) * (qsy - py)), qsx, qsy]
        ];
        nearest.sort(function(a, b) {
          return a[0] - b[0];
        });
        return [nearest[0][1], nearest[0][2]];
      } else return false;
    } else return false;
  } else {
    t = na / rxs;
    u = nb / rxs;
    if (force || (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1)) {
      return [px + rx * t, py + ry * t];
    }
  }
};
eat.util.linewithcircle = function(x1, y1, x2, y2, cx, cy, r, both) {
  //we want t to be the smallest one.
  var dx = x2 - x1,
    dy = y2 - y1,
    fx = x1 - cx,
    fy = y1 - cy;
  var a = dx * dx + dy * dy,
    b = 2 * (fx * dx + fy * dy),
    c = fx * fx + fy * fy - r * r,
    d = b * b - 4 * a * c,
    t1, t2, t, ret;
  if (d < 0) return false;
  else {
    d = Math.sqrt(d);
    t1 = (-b - d) / (2 * a);
    t2 = (-b + d) / (2 * a);
    if (t1 >= 0 && t1 <= 1) {
      if (t2 >= 0 && t2 <= 1) {
        t = Math.min(t1, t2);
        if (both) {
          return [x1 + Math.min(t1, t2) * dx, y1 + Math.min(t1, t2) * dy, x1 + Math.max(t1, t2) * dx, y1 + Math.max(t1, t2) * dy];
        }
      } else
        t = t1;
    } else if ((t2 >= 0 && t2 <= 1)) {
      t = t2;
    } else return false;
    return [x1 + t * dx, y1 + t * dy];
  }
};
eat.util.pointlinedist = function(x1, y1, x2, y2, x0, y0) { //1-v, 2-w 
  var dx = x2 - x1,
    dy = y2 - y1;
  var l2 = dx * dx + dy * dy;
  if (Math.abs(l2) < eat.util.epsilon) //division
    return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
  var t = ((x0 - x1) * dx + (y0 - y1) * dy) / l2;
  if (t < 0) return Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
  if (t > 1) return Math.sqrt((x2 - x0) * (x2 - x0) + (y2 - y0) * (y2 - y0));

  var nx = x1 + t * (x2 - x1),
    ny = y1 + t * (y2 - y1);
  return Math.sqrt((x0 - nx) * (x0 - nx) + (y0 - ny) * (y0 - ny));
};
eat.util.insideFrame = function(frame, x, y) {
  if (frame[0] == 0) //polygon
  {
    var ret = false,
      t, tt;
    for (t = 0, tt = frame.length - 2; t < frame.length - 1; tt = t++)
      if (((frame[t + 1][1] > y) != (frame[tt + 1][1] > y)) && (x < (frame[tt + 1][0] - frame[t + 1][0]) * (y - frame[t + 1][1]) / (frame[tt + 1][1] - frame[t + 1][1]) + frame[t + 1][0]))
        ret = !ret;
    return ret;
  } else //ellipse
  {
    x /= frame[2];
    y /= frame[3];
    return x * x + y * y <= frame[1] * frame[1];
  }
};
eat.util.adiff = function(a1, a2, nosign) {
  var r = a2 - a1;
  if (Math.abs(r) < eat.util.epsilon) return 0; //epsilon could be omitted
  if (r > Math.PI) r -= 2 * Math.PI;
  if (r < -Math.PI) r += 2 * Math.PI;
  return nosign ? r : Math.sign(r);
};
eat.util.cosVectors = function(v1x, v1y, v2x, v2y) {
  return (v1x * v2x + v1y * v2y) / (Math.sqrt(v1x * v1x + v1y * v1y) * Math.sqrt(v2x * v2x + v2y * v2y));
};
eat.util.triangleArea = function(ax, ay, bx, by, cx, cy) {
  return Math.abs(ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) / 2;
};
eat.util.lineSide = function(x1, y1, x2, y2, x, y, bias) {
  var v = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
  if (Math.abs(v) < eat.util.epsilon && !bias) //epsilon for normalizePoly
    v = 0;
  return Math.sign(v) || bias;
};
//normalize - remove duplicate, degenerate till none exists
//doesn't modify
eat.util.normalizePoly = function(poly) {
  var t, prev, next, sweeped = true;
  var poly = poly.slice();
  while (sweeped) {
    sweeped = false;
    for (t = 0; t < poly.length; t++) {
      prev = (poly.length + t - 1) % poly.length;
      next = (t + 1) % poly.length;

      if (Math.abs(poly[t][0] - poly[next][0]) < eat.util.bigepsilon && Math.abs(poly[t][1] - poly[next][1]) < eat.util.bigepsilon) {
        sweeped = true;
        poly.splice(t--, 1);
        continue;
      }

      if (!eat.util.lineSide(poly[t][0], poly[t][1], poly[next][0], poly[next][1], poly[prev][0], poly[prev][1])) //prev lies on this->next
      {
        sweeped = true;
        poly.splice(t--, 1);
        continue;
      }
    }
  }
  return poly.length > 2 ? poly : [];
};
eat.util.splitPolysByLine = function(polys, d, x, y, angle, radius, betweenX, betweenY) {
  var lx1 = x - radius * Math.cos(angle),
    ly1 = y - radius * Math.sin(angle),
    lx2 = x + radius * Math.cos(angle),
    ly2 = y + radius * Math.sin(angle);

  var px, poly, nt, newpolys = [],
    newpoly;
  var t, sortfunc, p0, p1;
  if (betweenX !== undefined) {
    d = eat.util.lineSide(lx1, ly1, lx2, ly2, betweenX, betweenY);
  }

  for (px = 0; px < polys.length; px++) {
    //remove duplicates, remove degenerate vertices
    //poly = eat.util.normalizePoly(polys[px]); //one level copy ONLY
    //speedup - assume normalized
    poly = polys[px].slice(); //one level copy ONLY

    var newvx = [];
    for (t = 0; t < poly.length; t++) {
      p0 = t % poly.length;
      p1 = (t + 1) % poly.length;

      //only if sides are not the same - this slows it down, but also makes it possible to trick algorithm into tricking no point intersects with line
      if (eat.util.lineSide(lx1, ly1, lx2, ly2, poly[p0][0], poly[p0][1], -d) != eat.util.lineSide(lx1, ly1, lx2, ly2, poly[p1][0], poly[p1][1], -d) && (nt = eat.util.lineline(lx1, ly1, lx2, ly2, poly[p0][0], poly[p0][1], poly[p1][0], poly[p1][1], true))) //use force option
      {
        poly.splice(p1, 0, nt);
        t++;
        newvx.push(nt);
      }
    }

    //sort. dir doesn't matter
    if (lx1 != lx2) sortfunc = function(a, b) {
      return a[0] - b[0]
    };
    else sortfunc = function(a, b) {
      return a[1] - b[1]
    };
    newvx.sort(sortfunc);


    //remove not complying, inserting sth inside
    for (t = 0; t < poly.length; t++) {
      //don't troll if in newvx, coz in that case leave it
      if (newvx.indexOf(poly[t]) == -1 && eat.util.lineSide(lx1, ly1, lx2, ly2, poly[t][0], poly[t][1], -d) == -d) //if wrong (coz 0 is ok)
      {
        //=null. but if previous was null, splice
        poly[t] = null;
        if (t && poly[t - 1] == null) {
          poly.splice(t--, 1);
        }
      }
    }

    if (poly[0] === null && poly[poly.length - 1] === null)
      poly.length--;

    while (poly.length) //while there are non-null points in the set. but there can't be only null points
    {
      p1 = 0;
      while (poly[p1] == null) {
        p1 = (p1 + 1) % poly.length;
      }
      p0 = poly[p1]
      newpoly = []
      while (true) //nonsense
      {
        p1 = (p1 + 1) % poly.length; // /by0
        if (poly[p1] == p0) {
          newpoly.push(poly[p1]);
          poly.splice(p1, 1);
          p1 = (poly.length + p1 - 1) % poly.length;
          break;
        } else if (poly[p1] == null) {
          //connect vertices
          //this creates an edge on the line
          t = newvx.indexOf(newpoly[newpoly.length - 1]);
          if (t % 2) t--;
          else t++;

          poly.splice(p1, 1);

          p1 = poly.indexOf(newvx[t]);
          if (p1 == -1) break;

          p1 = (poly.length + p1 - 1) % poly.length;
        } else {
          newpoly.push(poly[p1]);
          poly.splice(p1, 1);
          p1 = (poly.length + p1 - 1) % poly.length;
        }
      }
      //omitted, newpolys.push(eat.util.normalizePoly(newpoly)). not needed and generally it will NEVER go through a vertex. just roundoff won't let it happen
      newpolys.push(newpoly);
    }
  }
  return newpolys;
};
eat.util.polysArea = function(polys) {
  var px, poly, t, area = 0,
    tarea = 0;
  for (px = 0; px < polys.length; px++) {
    //remove duplicates, remove degenerate vertices
    poly = polys[px]; //one level copy ONLY
    tarea = 0;
    for (t = 0; t < poly.length; t++) {
      tarea += poly[t][0] * poly[(t + 1) % poly.length][1] - poly[(t + 1) % poly.length][0] * poly[t][1];
    }
    //FAIL HERE. fires even though it is.
    //because polys aren't separated
    if (tarea < 0) console.warning('is it ccw?');
    area += Math.abs(tarea);
  }
  return area / 2;
};
eat.util.polyAreaFromAngles = function(polys, x, y, a1, a2, safe) {
  var abetween = a1 + eat.util.adiff(a1, a2, true) / 2;
  var betweenX = x + Math.cos(abetween),
    betweenY = y + Math.sin(abetween);
  polys = eat.util.splitPolysByLine(polys, null, x, y, a1, safe, betweenX, betweenY);
  polys = eat.util.splitPolysByLine(polys, null, x, y, a2, safe, betweenX, betweenY)
  var ret = eat.util.polysArea(polys);
  return ret;
};
eat.util.circleSegmentArea = function(x, y, r, x1, y1, x2, y2, bigger) {
  var n0 = Math.atan2(y1 - y, x1 - x),
    n1 = Math.atan2(y2 - y, x2 - x);
  var smallerAngle = Math.abs(eat.util.adiff(n0, n1, true));

  if (bigger) {
    return (Math.PI * r * r * (2 * Math.PI - smallerAngle) / (2 * Math.PI)) + Math.sin(smallerAngle) * r * r / 2;
  } else {
    return (Math.PI * r * r * (smallerAngle) / (2 * Math.PI)) - Math.sin(smallerAngle) * r * r / 2;
  }
};
eat.util.ellipseAreaFromAngles = function(frame, x, y, a1, a2, safe) {
  x /= frame[2];
  y /= frame[3];

  //this time scaled
  var xa1 = x + safe * Math.cos(a1) / frame[2],
    ya1 = y + safe * Math.sin(a1) / frame[3];
  var xa2 = x + safe * Math.cos(a2) / frame[2],
    ya2 = y + safe * Math.sin(a2) / frame[3];

  var abetween = a1 + eat.util.adiff(a1, a2, true) / 2,
    betweenX = x + safe * Math.cos(abetween) / frame[2],
    betweenY = y + safe * Math.sin(abetween) / frame[3];

  var d1 = eat.util.lineSide(x, y, xa1, ya1, betweenX, betweenY)
  var d2 = eat.util.lineSide(x, y, xa2, ya2, betweenX, betweenY);
  if (!d1 || !d2) {
    throw 'looks like angle is too small...';
  }
  var ca = frame[1] * frame[1] * Math.PI;
  var area = 0,
    nta1, nta2;


  //now check if xy is outside
  if (x * x + y * y >= frame[1] * frame[1]) {
    nta1 = eat.util.linewithcircle(x, y, xa1, ya1, 0, 0, frame[1], true);
    nta2 = eat.util.linewithcircle(x, y, xa2, ya2, 0, 0, frame[1], true);

    if (nta1.length == 4) {
      area += eat.util.circleSegmentArea(0, 0, frame[1], nta1[0], nta1[1], nta1[2], nta1[3], (eat.util.lineSide(x, y, xa1, ya1, 0, 0, 1) == d1) ? true : false);
    }
    if (nta2.length == 4) {
      area += eat.util.circleSegmentArea(0, 0, frame[1], nta2[0], nta2[1], nta2[2], nta2[3], (eat.util.lineSide(x, y, xa2, ya2, 0, 0, 1) == d2) ? true : false);
    }

    if (area > ca)
      area -= ca;
  } else {
    nta1 = eat.util.linewithcircle(x, y, xa1, ya1, 0, 0, frame[1], true);
    nta2 = eat.util.linewithcircle(x, y, xa2, ya2, 0, 0, frame[1], true);
    if (nta1.length != 2 || nta2.length != 2)
      throw 'dafuq?';

    var n0 = Math.atan2(nta1[1], nta1[0]),
      n1 = Math.atan2(nta2[1], nta2[0]);

    var delta = n1 - n0;
    if (delta < 0)
      delta += 2 * Math.PI;

    //add slice area
    area += frame[1] * frame[1] * delta / 2;

    if (Math.abs(x) > eat.util.epsilon || Math.abs(y) > eat.util.epsilon) //epsilon could be omitted
    {
      //we need to add/subtract triangle areas
      var originAngle = Math.atan2(y, x);
      area += eat.util.triangleArea(0, 0, x, y, nta1[0], nta1[1]) * eat.util.adiff(originAngle, n0); //*1 if less than n0
      area += eat.util.triangleArea(0, 0, x, y, nta2[0], nta2[1]) * eat.util.adiff(n1, originAngle); //*1 if more than n1
    }
  }

  return area * frame[2] * frame[3];
};
eat.util.computeArea = function(frame, x, y, angles, safe, wholearea, reflexAngleIdx) {
  var ret = [],
    l, polys, wholearea;

  if (!wholearea)
    console.error('wholearea not given!');

  if (frame[0] == 0)
    polys = [frame.slice(1)];

  for (var t = 0; t < angles.length; t++) //not, compute only non reflex angles
  {
    if (reflexAngleIdx !== t) //if not reflex
    {
      if (frame[0] == 0)
        ret.push(eat.util.polyAreaFromAngles(polys, x, y, angles[t], angles[(t + 1) % angles.length], safe));
      else
        ret.push(eat.util.ellipseAreaFromAngles(frame, x, y, angles[t], angles[(t + 1) % angles.length], safe));
    }
  }

  if (angles.length == 3 && ret.length == 2)
    ret[2] = wholearea - ret[0] - ret[1];
  else if (angles.length == 2 && ret.length == 1)
    ret[1] = wholearea - ret[0];


  ret[0] /= wholearea;
  ret[1] /= wholearea;

  if (angles.length == 3)
    ret[2] /= wholearea;

  return ret;
};
eat.util.lpo = function(target, start) {
  if (!start) start = 1;

  while (2 * start <= target) {
    start *= 2;
  }
  return start;
};

/*
-start from point x,y
-test if we getter results by moving in some direction by reach
-if we find the best dir, try to move by 2*reach etc... until moving makes it worse
-divide reach by 2 and start again
*/

eat.util.spaceSearch2 = function(x, y, mnx, mx, mny, my, pointFunc, targetEpsilon, reachEpsilon) {
  var best = pointFunc(x, y),
    found = false,
    reach = eat.util.lpo(Math.floor((mx - mnx) / 2), reachEpsilon),
    tscore, bestdir, nx, ny, t, camefromx = NaN,
    camefromy = NaN,
    camefromx2 = NaN,
    camefromy2 = NaN;
  var kompare = 0,
    nbest, tnx, tny;
  while (best > targetEpsilon && reach >= reachEpsilon) {
    found = false;
    nx = x;
    ny = y;
    for (t = 0; t < eat.util.spaceSearch2.dir.length; t++) {
      tnx = x + reach * eat.util.spaceSearch2.dir[t][0];
      tny = y + reach * eat.util.spaceSearch2.dir[t][1];
      if (tnx >= mnx && tnx < mx && tny >= mny && tny < my) {
        if (tnx == camefromx && tny == camefromy) continue;
        if (tnx == camefromx2 && tny == camefromy2) continue;
        kompare++;
        tscore = pointFunc(tnx, tny);
        if (tscore < best) {
          found = true;
          nx = tnx;
          ny = tny;
          best = tscore;
          bestdir = t;
        }
      }
    }
    if (found) {
      while (true) {
        tnx = nx + reach * eat.util.spaceSearch2.dir[bestdir][0];
        tny = ny + reach * eat.util.spaceSearch2.dir[bestdir][1];
        if (tnx >= mnx && tnx < mx && tny >= mny && tny < my) {
          kompare++;
          tscore = pointFunc(tnx, tny);
          if (tscore < best) {
            found = true;
            nx = tnx;
            ny = tny;
            best = tscore;
          } else {
            camefromx2 = tnx;
            camefromy2 = tny;
            break;
          }
        } else break;
      }
    }

    if (found) {
      camefromx = x;
      camefromy = y;
      x = nx;
      y = ny;
    } else {
      reach /= 2;
    }

  }
  //console.log('kompare', kompare);
  return [x, y, best];
};
eat.util.spaceSearch2.dir = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1]
];


eat.util.shapeSize = function(s) {
  return 2 * Math.ceil(1.1 * s);
};