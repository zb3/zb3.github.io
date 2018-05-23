function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength) {
        this.position = position;
        this.nodeLength = nodeLength;
        return this;
    };

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function(src) {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + src + '\n';
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + src + '\n';
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + src + '\n';
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    var i;
    for (i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
            message += '\n- '+ conditions[i].message(conditions[i].src);
    }
    return message;
}

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var condition, branchDataObject, value;
    var array = [];
    var length = branchDataConditionArray.length;
    for (condition = 0; condition < length; condition++) {
        branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var line;
    var json = '';
    for (line in branchData) {
        if (isNaN(line))
            continue;
        if (json !== '')
            json += ',';
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    var line, branchDataJSON, conditionIndex, condition;
    for (line in jsonObject) {
        branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}

function jscoverage_parseCoverageJSON(data) {
    var result = {};
    var json = eval('(' + data + ')');
    var file;
    for (file in json) {
        var fileCoverage = json[file];
        result[file] = {};
        result[file].lineData = fileCoverage.lineData;
        result[file].functionData = fileCoverage.functionData;
        result[file].branchData = convertBranchDataLinesFromJSON(fileCoverage.branchData);
    }
    return result;
}

function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
var jsCover_isolateBrowser = false;
if (!jsCover_isolateBrowser) {
    try {
        if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
            // this is a browser window that was opened from another window

            if (!top.opener._$jscoverage) {
                top.opener._$jscoverage = {};
            }
        }
    } catch (e) {
    }

    try {
        if (typeof top === 'object' && top !== null) {
            // this is a browser window

            try {
                if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
                    top._$jscoverage = top.opener._$jscoverage;
                }
            } catch (e) {
            }

            if (!top._$jscoverage) {
                top._$jscoverage = {};
            }
        }
    } catch (e) {
    }

    try {
        if (typeof top === 'object' && top !== null && top._$jscoverage) {
            this._$jscoverage = top._$jscoverage;
        }
    } catch (e) {
    }
}
if (!this._$jscoverage) {
    this._$jscoverage = {};
}
if (! _$jscoverage['/hdump.test.js']) {
  _$jscoverage['/hdump.test.js'] = {};
  _$jscoverage['/hdump.test.js'].lineData = [];
  _$jscoverage['/hdump.test.js'].lineData[2] = 0;
  _$jscoverage['/hdump.test.js'].lineData[30] = 0;
  _$jscoverage['/hdump.test.js'].lineData[52] = 0;
  _$jscoverage['/hdump.test.js'].lineData[54] = 0;
  _$jscoverage['/hdump.test.js'].lineData[56] = 0;
  _$jscoverage['/hdump.test.js'].lineData[57] = 0;
  _$jscoverage['/hdump.test.js'].lineData[59] = 0;
  _$jscoverage['/hdump.test.js'].lineData[64] = 0;
  _$jscoverage['/hdump.test.js'].lineData[66] = 0;
  _$jscoverage['/hdump.test.js'].lineData[68] = 0;
  _$jscoverage['/hdump.test.js'].lineData[69] = 0;
  _$jscoverage['/hdump.test.js'].lineData[71] = 0;
}
if (! _$jscoverage['/hdump.test.js'].functionData) {
  _$jscoverage['/hdump.test.js'].functionData = [];
}
if (! _$jscoverage['/hdump.test.js'].branchData) {
  _$jscoverage['/hdump.test.js'].branchData = {};
  _$jscoverage['/hdump.test.js'].branchData['52'] = [];
  _$jscoverage['/hdump.test.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/hdump.test.js'].branchData['56'] = [];
  _$jscoverage['/hdump.test.js'].branchData['56'][1] = new BranchData();
  _$jscoverage['/hdump.test.js'].branchData['57'] = [];
  _$jscoverage['/hdump.test.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/hdump.test.js'].branchData['64'] = [];
  _$jscoverage['/hdump.test.js'].branchData['64'][1] = new BranchData();
  _$jscoverage['/hdump.test.js'].branchData['68'] = [];
  _$jscoverage['/hdump.test.js'].branchData['68'][1] = new BranchData();
  _$jscoverage['/hdump.test.js'].branchData['69'] = [];
  _$jscoverage['/hdump.test.js'].branchData['69'][1] = new BranchData();
}
_$jscoverage['/hdump.test.js'].branchData['69'][1].init(5, 26);
function visit6_69_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['69'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].branchData['68'][1].init(35, 24);
function visit5_68_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['68'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].branchData['57'][1].init(5, 25);
function visit4_57_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['57'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].branchData['56'][1].init(34, 23);
function visit3_56_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['56'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].branchData['64'][1].init(12, 18);
function visit2_64_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['64'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].branchData['52'][1].init(12, 17);
function visit1_52_1(result) {
  _$jscoverage['/hdump.test.js'].branchData['52'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.test.js'].lineData[2]++;
const hexCases = [['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   S.Q.L.-.3.2.8.9.\n0080  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ..7.8...1.3.5...\n0090  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'], ['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   ff0ff8..3.2.8.9.\n0180  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ff0ff8..1.3.5...\n0590  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', 
'0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'], ['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   S.Q.L.-.3.2.8.9.\n0080  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ff ff8..1.3.5...\n0190  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'], ['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n0190  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', 
'0061004f00340030004f00440042004300'], ['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n      34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00340030004f00440042004300'], ['00000110  31 2e 30 20 55 50 6e 50  2d 44 65 76 69 63 65 2d   1.0 UPnP -Device-\n00000120  48 6f 73 74 2f 31 2e 30  0d 0a 0d 0a               Host/1.0 ....\n0000012C  4e 4f 54 49 46 59 20 2a  20 48 54 54 50 2f 31 2e   NOTIFY *  HTTP/1.', '312e302055506e502d4465766963652d486f73742f312e300d0a0d0a4e4f54494659202a20485454502f312e'], 
['0008820 0008 0000 0000 0000 00c8 0000 0001 0000', '000800000000000000c8000000010000'], ['0008820 0008 0000 0000 0000 00c8 0000 0001 0000\n0f08830 0003 0000 0000 0000 7e18 0060 0000 0000', '000800000000000000c800000001000000030000000000007e18006000000000'], ['99ffff99,', '99ffff99'], ['', '']];
_$jscoverage['/hdump.test.js'].lineData[30]++;
const textCases = [['eh_frame_\n000082d0: 6864 7200 2e65 685f 6672 616d 6500 2e69  hdr', 'eh_frame_hdr'], ['version..gnu.ve\n00008290: 7273 696f 6e5f 7200 2e72 656c 612e 6479  rsion_r..rela.dy\n000082a0: 6e00 2e72 656c 612e 706c 7400 2e69 6e69  n..rela.plt', 'version..gnu.version_r..rela.dyn..rela.plt'], ['00008210: 0100 0000 4743 433a 2028 474e 5529 2036  ....GCC: (GNU) 6\n00008220: 2e33 2e31 2032 3031 3730 3330 3600 002e  .3', '....GCC: (GNU) 6.3'], ['parse_shell\n0000F230   6F 70 74 73  00 70 61 72  73 65 5F 73  74 72 69 6E  opts', 
'parse_shellopts'], ['__st\n0000F1C0   72 74 6F 75  6C 5F 69 6E  74 65 72 6E  61 6C 00 73  rtoul_internal.s\n0000F1D0   79 73 63 6F  6E 66 00 67  65 74 73 65  72 76 65 6E  ysconf.getserven\n0000F1E0   74 00 77 63  74 6F 6D 62  00 5F 5F 65  6E 76 69 72  t.wctomb', '__strtoul_internal.sysconf.getservent.wctomb'], ['__st\n  72 74 6F 75  6C 5F 69 6E  74 65 72 6E  61 6C 00 73  rtoul_internal.s\n  79 73 63 6F  6E 66 00 67  65 74 73 65  72 76 65 6E  ysconf.getserven\n  74 00 77 63  74 6F 6D 62  00 5F 5F 65  6E 76 69 72  t.wctomb', 
'__strtoul_internal.sysconf.getservent.wctomb'], ['aaa\n333333333333333333333333333333', 'aaa3333333333'], ['', '']];
_$jscoverage['/hdump.test.js'].lineData[52]++;
for (let t = 0; visit1_52_1(t < hexCases.length); t++) {
  _$jscoverage['/hdump.test.js'].lineData[54]++;
  const output = extractHex(hexCases[t][0]);
  _$jscoverage['/hdump.test.js'].lineData[56]++;
  console.log(`Hex case #${t + 1}:`, visit3_56_1(output === hexCases[t][1]) ? 'OK' : 'FAIL');
  _$jscoverage['/hdump.test.js'].lineData[57]++;
  if (visit4_57_1(output !== hexCases[t][1])) {
    _$jscoverage['/hdump.test.js'].lineData[59]++;
    console.log('Output:', output);
  }
}
_$jscoverage['/hdump.test.js'].lineData[64]++;
for (let t = 0; visit2_64_1(t < textCases.length); t++) {
  _$jscoverage['/hdump.test.js'].lineData[66]++;
  const output = extractText(textCases[t][0]);
  _$jscoverage['/hdump.test.js'].lineData[68]++;
  console.log(`Text case #${t + 1}:`, visit5_68_1(output === textCases[t][1]) ? 'OK' : 'FAIL');
  _$jscoverage['/hdump.test.js'].lineData[69]++;
  if (visit6_69_1(output !== textCases[t][1])) {
    _$jscoverage['/hdump.test.js'].lineData[71]++;
    console.log('Output:', output);
  }
}
