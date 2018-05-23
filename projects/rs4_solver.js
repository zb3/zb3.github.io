var rs, solved, x=6, y=6, ctable, win = win;

Array.prototype.extend = function(array)
{
 for (var t=0,tl = array.length;t<tl;++t)
 this.push(array[t]);  
 return this; 
}
function oneVal(no, sel, board)
{
 var tt, tt2, tt4 = rs+1, pt = Math.min(no, sel), step = (Math.abs(no-sel)<x)?1:x, ret = board[no];
 for(tt=0;tt<tt4;tt++)
 {
  if (board[pt+tt*step]!=ret) return -1;
 }
 return ret;
}
function markMove(no, sel, board, mark)
{
 var tt, tt2, tt4 = rs+1, pt = Math.min(no, sel), step = (Math.abs(no-sel)<x)?1:x;
 for(tt=0;tt<tt4;tt++)
 {
  board[pt+tt*step] = mark;
 }
}
function doReverse(no, sel, board)
{
 var tt, tt4 = (rs+1)/2>>0, step = (sel-no==rs)?1:x, good=0;
 for(tt=0;tt<tt4;tt++)
 {
  if (board[no+tt*step]!=board[no+(rs-tt)*step]) good=1;
  board[no+tt*step] ^= board[no+(rs-tt)*step];
  board[no+(rs-tt)*step] ^= board[no+tt*step];
  board[no+tt*step] ^= board[no+(rs-tt)*step];
 }
 return good;
}

function generateMoves(board)
{
 var t, cx, cy, moves = [];
 for(var t=0;t<board.length;t++)
 {
  cx = t%x; cy = t/x>>0;
  if (cy<(y-rs)) moves.push([t, x*(cy+rs)+cx]);
  if (cx<(x-rs)) moves.push([t, x*cy+cx+rs]);
 }
 return moves;
}
function properRank(board)
{
 var t, ret=0, bl = board.length;
 for(t=0;t<bl;++t)
 {
  if (board[t]==solved[t]) ++ret;
 }
 return ret;
}
function phaseBigBO(rf, gain, lim)
{
 if (gain===undefined) gain=4;
 var board = new Uint8Array(ctable.slice(0));
 var moves = generateMoves(board), ml = moves.length, t, t2, tmt;
 var rank = rf(board), nr;
 var cdepth = 0, ms = [];
 stack = new Uint8Array(99);

 if (tmt=trySequence(board))
 {
  console.log('sequence detected');
  return tmt;
 }
 mn:for(nomoves=1;;nomoves++)
 {
  stack[cdepth] = 0; cdepth=0;
  while(stack[0]<ml)
  {
   if (cdepth==nomoves || stack[cdepth]==ml)
   {
    cdepth--;
    //now undoing parent
    doReverse(moves[stack[cdepth]][0], moves[stack[cdepth]][1], board);
    stack[cdepth]++;
    continue;
   }
   if (cdepth && stack[cdepth-1]==stack[cdepth] || !doReverse(moves[stack[cdepth]][0], moves[stack[cdepth]][1], board))
   {
    stack[cdepth]++; continue;
   }
   if (cdepth==nomoves-1)
   {
    nr = rf(board);
    if (nr-rank>=gain || (rank>=lim && nr-rank>0) || nr==win)
    {
     rank = nr;
     for(t=0;t<=cdepth;t++)
     ms.push(moves[stack[t]]);
     console.log('top', rank, ms.length);
     if (rank==win) {return ms;}
     else if (rank==34 && (tmt=trySequence(board)))
     {
      console.log('sequence detected');
      ms.extend(tmt);
      return ms;
     }
     nomoves=0;
     continue mn;
    }
   }
   cdepth++; stack[cdepth] = 0;
  }
 }
 return false;
}
function phaseBigB(rf, gain, lim)
{
 if (lim===undefined) lim=3; 
 if (gain===undefined) gain=4;

 var ogain = gain;
 var board = new Uint8Array(ctable.slice(0));
 var moves = generateMoves(board), ml = moves.length, t, t2, tmt;
 var rank = rf(board), nr;
 var cdepth = 0, ms = [];
 stack = new Uint8Array(99);

 if (tmt=trySequence(board))
 {
  console.log('sequence detected', tmt);
  return tmt;
 }
 mn:for(nomoves=1;;nomoves++)
 {
  stack[cdepth] = 0; cdepth=0;
  while(stack[0]<ml)
  {
   if (cdepth==nomoves || stack[cdepth]==ml)
   {
    cdepth--;
    doReverse(moves[stack[cdepth]][0], moves[stack[cdepth]][1], board);
    stack[cdepth]++;
    continue;
   }
   if (cdepth && stack[cdepth-1]==stack[cdepth] || !doReverse(moves[stack[cdepth]][0], moves[stack[cdepth]][1], board))
   {
    stack[cdepth]++; continue;
   }
   if (cdepth==nomoves-1)
   {
    nr = rf(board);
    if (nr-rank>=gain || nr==win)
    {
     rank = nr;
     for(t=0;t<=cdepth;t++)
     ms.push(moves[stack[t]]);
     console.log('top', rank, ms.length);
     postMessage({board: board});
     if (rank==win) {return ms;}
     else if (rank==34 && (tmt=trySequence(board)))
     {
      console.log('sequence detected');
      ms.extend(tmt);
      return ms;
     }
     nomoves=0;
     if (ogain>gain) gain=ogain;
     continue mn;
    }
   }
   cdepth++; stack[cdepth] = 0;
  }
  if (nomoves>lim && gain>1) {gain--; nomoves=0; continue mn;} 
 }
 return false;
}

function tryToOptimize(source)
{
 console.log(ctable.toSource());
 var moves = source.slice(0), ch = {}, hh, tboard, t, olen=moves.length;
 var ctables = [];
 ctables[0] = ctable.slice(0); ch[ctables[0].toString()] = 1;
 tboard = ctable.slice(0);
 for(t=0;t<moves.length;t++)
 {
  doReverse(moves[t][0], moves[t][1], tboard);
  ctables.push(tboard.slice(0));
  if (hh=ch[ctables[t+1].toString()])
  {
   console.log('after move', t, 'it looks like', hh-1);
   ctables.splice(hh-1, t-hh+2); moves.splice(hh-1, t-hh+2);
   t = hh-2;
  }
  else
  ch[ctables[t+1].toString()] = t+2;
 }
 console.log('new moves length', moves.length);

 for(t=0;t<x*y;t++)
 {
  tboard[t] = -1;
 }
 var om; 
 for(t=0;t<moves.length;t++)
 {
  if ((om=oneVal(moves[t][0], moves[t][1], tboard))!=-1)
  {
   console.log('omg');
   moves.splice(om, 1); ctables.splice(om+1, 1);
   t--;
   for(t2=0;t2<x*y;t2++)
   tboard[t2] = tboard[t2]==om?-1:tboard[t2]>om?tboard[t2]-1:tboard[t2];

   moves.splice(t, 1); ctables.splice(t+1, 1);
   t--;
   for(t2=0;t2<x*y;t2++)
   tboard[t2] = tboard[t2]==t?-1:tboard[t2]>t?tboard[t2]-1:tboard[t2];
  }
  else
  markMove(moves[t][0], moves[t][1], tboard, t);
 }
 console.log('new moves length', moves.length)
 if (moves.length!=olen)
 return tryToOptimize(moves);
 return moves;
}


var problems = {4: [[[0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 1, 2, 2, 2, 3, 3, 3], [[12, 16], [13, 17], [11, 35], [13, 17], [11, 35], [12, 16]]], [[0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 3, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 3, 3, 2, 2, 2, 3, 3, 3], [[13, 17], [12, 16], [9, 33], [12, 16], [9, 33], [13, 17]]], [[0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 3, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 1, 3, 2, 2, 2, 3, 3, 3], [[0, 24], [6, 10], [30, 34], [10, 34], [6, 10], [0, 24], [30, 34]]], [[0, 0, 0, 1, 1, 1, 0, 0, 0, 3, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 1, 3, 3], [[7, 11], [6, 10], [9, 33], [6, 10], [7, 11], [9, 33]]], [[0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 1], [[6, 10], [7, 11], [11, 35], [7, 11], [6, 10], [11, 35]]], [[0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 3, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 2, 2, 2, 3, 1, 3], [[0, 24], [6, 10], [30, 34], [6, 30], [6, 10], [0, 24], [30, 34]]]], 5: [[[0, 0, 0, 1, 1, 1, 3, 0, 0, 1, 1, 0, 0, 3, 0, 1, 1, 1, 2, 0, 2, 3, 2, 3, 2, 2, 2, 3, 3, 1, 2, 2, 2, 3, 3, 3], [[5, 35], [6, 11], [5, 35], [6, 11], [18, 23], [1, 31], [18, 23], [1, 31]]]]};


function notTheSame(a, b)
{
 for(var t=0;t<a.length;t++) if (a[t]!=b[t]) return true;
 return false;
}
function flipX(board)
{
 var t, t2, board2 = [], tt=[1,0,3,2];
 for(t=0;t<y;t++)
 for(t2=0;t2<x;t2++)
 board2[t*x+x-1-t2] = tt[board[t*x+t2]];
 for(t=0;t<x*y;t++)
 board[t] = board2[t];
}
function flipY(board)
{
 var t, t2, board2 = [], tt=[2,3,0,1];
 for(t=0;t<y;t++)
 for(t2=0;t2<x;t2++)
 board2[(y-1-t)*x+t2] = tt[board[t*x+t2]];
 for(t=0;t<x*y;t++)
 board[t] = board2[t];
}
function transpose(board)
{
 var t, t2, board2 = [], tt=[0,2,1,3];
 for(t=0;t<y;t++)
 for(t2=0;t2<x;t2++)
 board2[t*x+t2] = tt[board[t2*x+t]];
 for(t=0;t<x*y;t++)
 board[t] = board2[t];
}
//we can optimize doReverse, we know what's smaller
function applySequence(seq, board)
{
 for(var t=0,tl=seq.length;t<tl;t++)
 doReverse(seq[t][0], seq[t][1], board);
}
function trySequence(board)
{
 var ret=null, prob, t, t2, tx, ty;
 if (!problems[rs]) return null;
 for(prob=0;prob<problems[rs].length;prob++)
 for(t=0;t<8;t++)
 {
  if (t&4) transpose(board);
  if (t&1) flipX(board);
  if (t&2) flipY(board);
//flipX then transpose is good... but
  if (!notTheSame(board, problems[rs][prob][0]))
  {
console.log('detected', prob, t&1, t&2, t&4);
   ret = [];
   for(t2=0;t2<problems[rs][prob][1].length;t2++)
   {
    tx=problems[rs][prob][1][t2][0]%x; ty = problems[rs][prob][1][t2][0]/y>>0;
    ret[t2] = [(t&1?x-1-tx:tx)*(t&4?x:1)+(t&2?y-1-ty:ty)*(t&4?1:x)];
    tx=problems[rs][prob][1][t2][1]%x; ty = problems[rs][prob][1][t2][1]/y>>0;
    ret[t2].push((t&1?x-1-tx:tx)*(t&4?x:1)+(t&2?y-1-ty:ty)*(t&4?1:x));
    if (ret[t2][0]>ret[t2][1]) ret[t2].reverse();
   }
   t=8;prob=Infinity;
  }
  if (t&2) flipY(board);
  if (t&1) flipX(board);
  if (t&4) transpose(board);

 }
 return ret;
}


var solvers =[[phaseBigBO, 1, undefined],
[phaseBigB, 4, 3],
[phaseBigB, 5, 3],
[phaseBigBO, 4, 28],
[phaseBigB, 4, 4],
[phaseBigBO, 4, undefined],
[phaseBigBO, 5, undefined],
[phaseBigBO, 22, undefined]];

onmessage = function(msg)
{
 x=msg.data.x; y=msg.data.y; rs=msg.data.rs; ctable=msg.data.ctable; solved=msg.data.solved;
 win = x*y;
 if (x==4 && rs==3) msg.data.type=7;
 var tmoves = solvers[msg.data.type][0](properRank, solvers[msg.data.type][1], solvers[msg.data.type][2]), tmoves2;
 if (tmoves)
 {
  tmoves = tryToOptimize(tmoves);
  postMessage({moves: tmoves});
 }
 else 
 postMessage("fail");
}

/*
rs5:
"[0, 0, 0, 1, 1, 1, 3, 0, 0, 1, 1, 0, 0, 3, 0, 1, 1, 1, 2, 0, 2, 3, 2, 3, 2, 2, 2, 3, 3, 1, 2, 2, 2, 3, 3, 3]"
[5, 35], [6, 11], [5, 35], [6, 11], [18, 23], [1, 31], [18, 23], [1, 31]
*/

