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
if (! _$jscoverage['/hdump.js']) {
  _$jscoverage['/hdump.js'] = {};
  _$jscoverage['/hdump.js'].lineData = [];
  _$jscoverage['/hdump.js'].lineData[1] = 0;
  _$jscoverage['/hdump.js'].lineData[3] = 0;
  _$jscoverage['/hdump.js'].lineData[5] = 0;
  _$jscoverage['/hdump.js'].lineData[6] = 0;
  _$jscoverage['/hdump.js'].lineData[8] = 0;
  _$jscoverage['/hdump.js'].lineData[9] = 0;
  _$jscoverage['/hdump.js'].lineData[11] = 0;
  _$jscoverage['/hdump.js'].lineData[12] = 0;
  _$jscoverage['/hdump.js'].lineData[13] = 0;
  _$jscoverage['/hdump.js'].lineData[15] = 0;
  _$jscoverage['/hdump.js'].lineData[17] = 0;
  _$jscoverage['/hdump.js'].lineData[19] = 0;
  _$jscoverage['/hdump.js'].lineData[20] = 0;
  _$jscoverage['/hdump.js'].lineData[22] = 0;
  _$jscoverage['/hdump.js'].lineData[24] = 0;
  _$jscoverage['/hdump.js'].lineData[25] = 0;
  _$jscoverage['/hdump.js'].lineData[27] = 0;
  _$jscoverage['/hdump.js'].lineData[29] = 0;
  _$jscoverage['/hdump.js'].lineData[32] = 0;
  _$jscoverage['/hdump.js'].lineData[34] = 0;
  _$jscoverage['/hdump.js'].lineData[37] = 0;
  _$jscoverage['/hdump.js'].lineData[50] = 0;
  _$jscoverage['/hdump.js'].lineData[51] = 0;
  _$jscoverage['/hdump.js'].lineData[53] = 0;
  _$jscoverage['/hdump.js'].lineData[54] = 0;
  _$jscoverage['/hdump.js'].lineData[56] = 0;
  _$jscoverage['/hdump.js'].lineData[57] = 0;
  _$jscoverage['/hdump.js'].lineData[58] = 0;
  _$jscoverage['/hdump.js'].lineData[61] = 0;
  _$jscoverage['/hdump.js'].lineData[64] = 0;
  _$jscoverage['/hdump.js'].lineData[66] = 0;
  _$jscoverage['/hdump.js'].lineData[68] = 0;
  _$jscoverage['/hdump.js'].lineData[69] = 0;
  _$jscoverage['/hdump.js'].lineData[70] = 0;
  _$jscoverage['/hdump.js'].lineData[72] = 0;
  _$jscoverage['/hdump.js'].lineData[74] = 0;
  _$jscoverage['/hdump.js'].lineData[75] = 0;
  _$jscoverage['/hdump.js'].lineData[77] = 0;
  _$jscoverage['/hdump.js'].lineData[79] = 0;
  _$jscoverage['/hdump.js'].lineData[81] = 0;
  _$jscoverage['/hdump.js'].lineData[84] = 0;
  _$jscoverage['/hdump.js'].lineData[85] = 0;
  _$jscoverage['/hdump.js'].lineData[86] = 0;
  _$jscoverage['/hdump.js'].lineData[88] = 0;
  _$jscoverage['/hdump.js'].lineData[90] = 0;
  _$jscoverage['/hdump.js'].lineData[92] = 0;
  _$jscoverage['/hdump.js'].lineData[94] = 0;
  _$jscoverage['/hdump.js'].lineData[95] = 0;
  _$jscoverage['/hdump.js'].lineData[96] = 0;
  _$jscoverage['/hdump.js'].lineData[99] = 0;
  _$jscoverage['/hdump.js'].lineData[100] = 0;
  _$jscoverage['/hdump.js'].lineData[101] = 0;
  _$jscoverage['/hdump.js'].lineData[104] = 0;
  _$jscoverage['/hdump.js'].lineData[105] = 0;
  _$jscoverage['/hdump.js'].lineData[108] = 0;
  _$jscoverage['/hdump.js'].lineData[109] = 0;
  _$jscoverage['/hdump.js'].lineData[110] = 0;
  _$jscoverage['/hdump.js'].lineData[113] = 0;
  _$jscoverage['/hdump.js'].lineData[119] = 0;
  _$jscoverage['/hdump.js'].lineData[121] = 0;
  _$jscoverage['/hdump.js'].lineData[122] = 0;
  _$jscoverage['/hdump.js'].lineData[123] = 0;
  _$jscoverage['/hdump.js'].lineData[125] = 0;
  _$jscoverage['/hdump.js'].lineData[127] = 0;
  _$jscoverage['/hdump.js'].lineData[130] = 0;
  _$jscoverage['/hdump.js'].lineData[134] = 0;
  _$jscoverage['/hdump.js'].lineData[136] = 0;
  _$jscoverage['/hdump.js'].lineData[137] = 0;
  _$jscoverage['/hdump.js'].lineData[138] = 0;
  _$jscoverage['/hdump.js'].lineData[139] = 0;
  _$jscoverage['/hdump.js'].lineData[141] = 0;
  _$jscoverage['/hdump.js'].lineData[142] = 0;
  _$jscoverage['/hdump.js'].lineData[144] = 0;
  _$jscoverage['/hdump.js'].lineData[146] = 0;
  _$jscoverage['/hdump.js'].lineData[147] = 0;
  _$jscoverage['/hdump.js'].lineData[150] = 0;
  _$jscoverage['/hdump.js'].lineData[154] = 0;
  _$jscoverage['/hdump.js'].lineData[155] = 0;
  _$jscoverage['/hdump.js'].lineData[156] = 0;
  _$jscoverage['/hdump.js'].lineData[158] = 0;
  _$jscoverage['/hdump.js'].lineData[160] = 0;
  _$jscoverage['/hdump.js'].lineData[161] = 0;
  _$jscoverage['/hdump.js'].lineData[164] = 0;
  _$jscoverage['/hdump.js'].lineData[166] = 0;
  _$jscoverage['/hdump.js'].lineData[169] = 0;
  _$jscoverage['/hdump.js'].lineData[171] = 0;
  _$jscoverage['/hdump.js'].lineData[173] = 0;
  _$jscoverage['/hdump.js'].lineData[174] = 0;
  _$jscoverage['/hdump.js'].lineData[175] = 0;
  _$jscoverage['/hdump.js'].lineData[177] = 0;
  _$jscoverage['/hdump.js'].lineData[179] = 0;
  _$jscoverage['/hdump.js'].lineData[180] = 0;
  _$jscoverage['/hdump.js'].lineData[182] = 0;
  _$jscoverage['/hdump.js'].lineData[184] = 0;
  _$jscoverage['/hdump.js'].lineData[188] = 0;
  _$jscoverage['/hdump.js'].lineData[192] = 0;
  _$jscoverage['/hdump.js'].lineData[196] = 0;
}
if (! _$jscoverage['/hdump.js'].functionData) {
  _$jscoverage['/hdump.js'].functionData = [];
  _$jscoverage['/hdump.js'].functionData[0] = 0;
  _$jscoverage['/hdump.js'].functionData[1] = 0;
  _$jscoverage['/hdump.js'].functionData[2] = 0;
  _$jscoverage['/hdump.js'].functionData[3] = 0;
}
if (! _$jscoverage['/hdump.js'].branchData) {
  _$jscoverage['/hdump.js'].branchData = {};
  _$jscoverage['/hdump.js'].branchData['5'] = [];
  _$jscoverage['/hdump.js'].branchData['5'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['8'] = [];
  _$jscoverage['/hdump.js'].branchData['8'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['12'] = [];
  _$jscoverage['/hdump.js'].branchData['12'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['19'] = [];
  _$jscoverage['/hdump.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['24'] = [];
  _$jscoverage['/hdump.js'].branchData['24'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['51'] = [];
  _$jscoverage['/hdump.js'].branchData['51'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['54'] = [];
  _$jscoverage['/hdump.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['54'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['54'][3] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['57'] = [];
  _$jscoverage['/hdump.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['57'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['57'][3] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['64'] = [];
  _$jscoverage['/hdump.js'].branchData['64'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['72'] = [];
  _$jscoverage['/hdump.js'].branchData['72'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['74'] = [];
  _$jscoverage['/hdump.js'].branchData['74'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['75'] = [];
  _$jscoverage['/hdump.js'].branchData['75'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['75'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['75'][3] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['88'] = [];
  _$jscoverage['/hdump.js'].branchData['88'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['90'] = [];
  _$jscoverage['/hdump.js'].branchData['90'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['94'] = [];
  _$jscoverage['/hdump.js'].branchData['94'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['95'] = [];
  _$jscoverage['/hdump.js'].branchData['95'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['99'] = [];
  _$jscoverage['/hdump.js'].branchData['99'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['104'] = [];
  _$jscoverage['/hdump.js'].branchData['104'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['108'] = [];
  _$jscoverage['/hdump.js'].branchData['108'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['122'] = [];
  _$jscoverage['/hdump.js'].branchData['122'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['127'] = [];
  _$jscoverage['/hdump.js'].branchData['127'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['130'] = [];
  _$jscoverage['/hdump.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['130'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['139'] = [];
  _$jscoverage['/hdump.js'].branchData['139'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['141'] = [];
  _$jscoverage['/hdump.js'].branchData['141'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['142'] = [];
  _$jscoverage['/hdump.js'].branchData['142'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['144'] = [];
  _$jscoverage['/hdump.js'].branchData['144'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['154'] = [];
  _$jscoverage['/hdump.js'].branchData['154'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['158'] = [];
  _$jscoverage['/hdump.js'].branchData['158'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['160'] = [];
  _$jscoverage['/hdump.js'].branchData['160'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['169'] = [];
  _$jscoverage['/hdump.js'].branchData['169'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['169'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['171'] = [];
  _$jscoverage['/hdump.js'].branchData['171'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['174'] = [];
  _$jscoverage['/hdump.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['174'][2] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['174'][3] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['179'] = [];
  _$jscoverage['/hdump.js'].branchData['179'][1] = new BranchData();
  _$jscoverage['/hdump.js'].branchData['182'] = [];
  _$jscoverage['/hdump.js'].branchData['182'][1] = new BranchData();
}
_$jscoverage['/hdump.js'].branchData['174'][3].init(20, 7);
function visit50_174_3(result) {
  _$jscoverage['/hdump.js'].branchData['174'][3].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['174'][2].init(9, 7);
function visit49_174_2(result) {
  _$jscoverage['/hdump.js'].branchData['174'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['99'][1].init(8, 9);
function visit48_99_1(result) {
  _$jscoverage['/hdump.js'].branchData['99'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['182'][1].init(13, 13);
function visit47_182_1(result) {
  _$jscoverage['/hdump.js'].branchData['182'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['179'][1].init(9, 47);
function visit46_179_1(result) {
  _$jscoverage['/hdump.js'].branchData['179'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['174'][1].init(9, 18);
function visit45_174_1(result) {
  _$jscoverage['/hdump.js'].branchData['174'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['144'][1].init(8, 41);
function visit44_144_1(result) {
  _$jscoverage['/hdump.js'].branchData['144'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['95'][1].init(12, 4);
function visit43_95_1(result) {
  _$jscoverage['/hdump.js'].branchData['95'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['57'][3].init(32, 31);
function visit42_57_3(result) {
  _$jscoverage['/hdump.js'].branchData['57'][3].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['171'][1].init(8, 4);
function visit41_171_1(result) {
  _$jscoverage['/hdump.js'].branchData['171'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['169'][2].init(9, 54);
function visit40_169_2(result) {
  _$jscoverage['/hdump.js'].branchData['169'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['142'][1].init(12, 4);
function visit39_142_1(result) {
  _$jscoverage['/hdump.js'].branchData['142'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['94'][1].init(12, 4);
function visit38_94_1(result) {
  _$jscoverage['/hdump.js'].branchData['94'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['75'][3].init(22, 17);
function visit37_75_3(result) {
  _$jscoverage['/hdump.js'].branchData['75'][3].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['57'][2].init(7, 21);
function visit36_57_2(result) {
  _$jscoverage['/hdump.js'].branchData['57'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['54'][3].init(27, 17);
function visit35_54_3(result) {
  _$jscoverage['/hdump.js'].branchData['54'][3].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['169'][1].init(9, 85);
function visit34_169_1(result) {
  _$jscoverage['/hdump.js'].branchData['169'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['141'][1].init(7, 4);
function visit33_141_1(result) {
  _$jscoverage['/hdump.js'].branchData['141'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['104'][1].init(7, 10);
function visit32_104_1(result) {
  _$jscoverage['/hdump.js'].branchData['104'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['90'][1].init(7, 4);
function visit31_90_1(result) {
  _$jscoverage['/hdump.js'].branchData['90'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['75'][2].init(6, 12);
function visit30_75_2(result) {
  _$jscoverage['/hdump.js'].branchData['75'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['57'][1].init(7, 56);
function visit29_57_1(result) {
  _$jscoverage['/hdump.js'].branchData['57'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['54'][2].init(6, 17);
function visit28_54_2(result) {
  _$jscoverage['/hdump.js'].branchData['54'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['160'][1].init(6, 10);
function visit27_160_1(result) {
  _$jscoverage['/hdump.js'].branchData['160'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['139'][1].init(8, 21);
function visit26_139_1(result) {
  _$jscoverage['/hdump.js'].branchData['139'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['130'][2].init(20, 26);
function visit25_130_2(result) {
  _$jscoverage['/hdump.js'].branchData['130'][2].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['108'][1].init(21, 35);
function visit24_108_1(result) {
  _$jscoverage['/hdump.js'].branchData['108'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['88'][1].init(8, 25);
function visit23_88_1(result) {
  _$jscoverage['/hdump.js'].branchData['88'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['75'][1].init(6, 33);
function visit22_75_1(result) {
  _$jscoverage['/hdump.js'].branchData['75'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['74'][1].init(8, 19);
function visit21_74_1(result) {
  _$jscoverage['/hdump.js'].branchData['74'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['54'][1].init(6, 38);
function visit20_54_1(result) {
  _$jscoverage['/hdump.js'].branchData['54'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['158'][1].init(21, 14);
function visit19_158_1(result) {
  _$jscoverage['/hdump.js'].branchData['158'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['154'][1].init(11, 9);
function visit18_154_1(result) {
  _$jscoverage['/hdump.js'].branchData['154'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['130'][1].init(5, 41);
function visit17_130_1(result) {
  _$jscoverage['/hdump.js'].branchData['130'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['127'][1].init(17, 34);
function visit16_127_1(result) {
  _$jscoverage['/hdump.js'].branchData['127'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['122'][1].init(5, 16);
function visit15_122_1(result) {
  _$jscoverage['/hdump.js'].branchData['122'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['72'][1].init(13, 14);
function visit14_72_1(result) {
  _$jscoverage['/hdump.js'].branchData['72'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['64'][1].init(15, 23);
function visit13_64_1(result) {
  _$jscoverage['/hdump.js'].branchData['64'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['51'][1].init(13, 14);
function visit12_51_1(result) {
  _$jscoverage['/hdump.js'].branchData['51'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['24'][1].init(5, 13);
function visit11_24_1(result) {
  _$jscoverage['/hdump.js'].branchData['24'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['19'][1].init(5, 18);
function visit10_19_1(result) {
  _$jscoverage['/hdump.js'].branchData['19'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['12'][1].init(5, 2);
function visit9_12_1(result) {
  _$jscoverage['/hdump.js'].branchData['12'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['8'][1].init(5, 32);
function visit8_8_1(result) {
  _$jscoverage['/hdump.js'].branchData['8'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].branchData['5'][1].init(5, 11);
function visit7_5_1(result) {
  _$jscoverage['/hdump.js'].branchData['5'][1].ranCondition(result);
  return result;
}
_$jscoverage['/hdump.js'].lineData[1]++;
function readHexDumpAddr(line) {
  _$jscoverage['/hdump.js'].functionData[0]++;
  _$jscoverage['/hdump.js'].lineData[3]++;
  var m = line.match(/^\s*([^\s]*)\s(?!$)/);
  _$jscoverage['/hdump.js'].lineData[5]++;
  if (visit7_5_1(!m || !m[1])) {
    _$jscoverage['/hdump.js'].lineData[6]++;
    return null;
  }
  _$jscoverage['/hdump.js'].lineData[8]++;
  if (visit8_8_1(m[1].match(/^[0-9a-fA-F]{0,3}$/))) {
    _$jscoverage['/hdump.js'].lineData[9]++;
    return null;
  }
  _$jscoverage['/hdump.js'].lineData[11]++;
  m = m[1].replace(/[^a-fA-F0-9]/g, '');
  _$jscoverage['/hdump.js'].lineData[12]++;
  if (visit9_12_1(!m)) {
    _$jscoverage['/hdump.js'].lineData[13]++;
    return null;
  }
  _$jscoverage['/hdump.js'].lineData[15]++;
  return parseInt(m, 16);
}
_$jscoverage['/hdump.js'].lineData[17]++;
function hexDumpLinePrefixLength(str, addr) {
  _$jscoverage['/hdump.js'].functionData[1]++;
  _$jscoverage['/hdump.js'].lineData[19]++;
  if (visit10_19_1(addr === undefined)) {
    _$jscoverage['/hdump.js'].lineData[20]++;
    addr = readHexDumpAddr(str);
  }
  _$jscoverage['/hdump.js'].lineData[22]++;
  var ret;
  _$jscoverage['/hdump.js'].lineData[24]++;
  if (visit11_24_1(addr !== null)) {
    _$jscoverage['/hdump.js'].lineData[25]++;
    ret = str.match(/^\s*([^\s]+)[^a-fA-F0-9]*/)[0].length;
  } else {
    _$jscoverage['/hdump.js'].lineData[27]++;
    ret = str.match(/^\s*/)[0].length;
  }
  _$jscoverage['/hdump.js'].lineData[29]++;
  return ret;
}
_$jscoverage['/hdump.js'].lineData[32]++;
function extractHex(str) {
  _$jscoverage['/hdump.js'].functionData[2]++;
  _$jscoverage['/hdump.js'].lineData[34]++;
  var lines = str.split('\n');
  _$jscoverage['/hdump.js'].lineData[37]++;
  var ret = '';
  _$jscoverage['/hdump.js'].lineData[50]++;
  var lastAddr = readHexDumpAddr(lines[0]), longestLine = 0;
  _$jscoverage['/hdump.js'].lineData[51]++;
  for (var t = 1; visit12_51_1(t < lines.length); t++) {
    _$jscoverage['/hdump.js'].lineData[53]++;
    var thisAddr = readHexDumpAddr(lines[t]);
    _$jscoverage['/hdump.js'].lineData[54]++;
    if (visit20_54_1(visit28_54_2(thisAddr !== null) && visit35_54_3(lastAddr !== null))) {
      _$jscoverage['/hdump.js'].lineData[56]++;
      var thisLen = thisAddr - lastAddr;
      _$jscoverage['/hdump.js'].lineData[57]++;
      if (visit29_57_1(visit36_57_2(thisLen > longestLine) && visit42_57_3(thisLen * 3 + 6 < lines[t].length))) {
        _$jscoverage['/hdump.js'].lineData[58]++;
        longestLine = thisLen;
      }
    }
    _$jscoverage['/hdump.js'].lineData[61]++;
    lastAddr = thisAddr;
  }
  _$jscoverage['/hdump.js'].lineData[64]++;
  longestLine = visit13_64_1(longestLine || Infinity);
  _$jscoverage['/hdump.js'].lineData[66]++;
  var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s{4})|(\s+)|./y;
  _$jscoverage['/hdump.js'].lineData[68]++;
  var nextAddr = readHexDumpAddr(lines[0]);
  _$jscoverage['/hdump.js'].lineData[69]++;
  var tmp, remaining, prefixLength;
  _$jscoverage['/hdump.js'].lineData[70]++;
  var lastSpace;
  _$jscoverage['/hdump.js'].lineData[72]++;
  for (var t = 0; visit14_72_1(t < lines.length); t++) {
    _$jscoverage['/hdump.js'].lineData[74]++;
    tmp = visit21_74_1(t == lines.length - 1) ? null : readHexDumpAddr(lines[t + 1]);
    _$jscoverage['/hdump.js'].lineData[75]++;
    if (visit22_75_1(visit30_75_2(tmp !== null) && visit37_75_3(nextAddr !== null))) {
      _$jscoverage['/hdump.js'].lineData[77]++;
      remaining = Math.min(tmp - nextAddr, longestLine);
    } else {
      _$jscoverage['/hdump.js'].lineData[79]++;
      remaining = Infinity;
    }
    _$jscoverage['/hdump.js'].lineData[81]++;
    prefixLength = hexDumpLinePrefixLength(lines[t], nextAddr);
    _$jscoverage['/hdump.js'].lineData[84]++;
    nextAddr = tmp;
    _$jscoverage['/hdump.js'].lineData[85]++;
    mregex.lastIndex = prefixLength;
    _$jscoverage['/hdump.js'].lineData[86]++;
    lastSpace = 0;
    _$jscoverage['/hdump.js'].lineData[88]++;
    while (visit23_88_1(m = mregex.exec(lines[t]))) {
      _$jscoverage['/hdump.js'].lineData[90]++;
      if (visit31_90_1(m[1])) {
        _$jscoverage['/hdump.js'].lineData[92]++;
        remaining--;
      } else {
        _$jscoverage['/hdump.js'].lineData[94]++;
        if (visit38_94_1(m[2])) {
          break;
        } else {
          _$jscoverage['/hdump.js'].lineData[95]++;
          if (visit43_95_1(m[3])) {
            _$jscoverage['/hdump.js'].lineData[96]++;
            lastSpace = mregex.lastIndex;
          } else {
            _$jscoverage['/hdump.js'].lineData[99]++;
            if (visit48_99_1(lastSpace)) {
              _$jscoverage['/hdump.js'].lineData[100]++;
              mregex.lastIndex = lastSpace;
            }
            _$jscoverage['/hdump.js'].lineData[101]++;
            break;
          }
        }
      }
      _$jscoverage['/hdump.js'].lineData[104]++;
      if (visit32_104_1(!remaining)) {
        _$jscoverage['/hdump.js'].lineData[105]++;
        break;
      }
    }
    _$jscoverage['/hdump.js'].lineData[108]++;
    mregex.lastIndex = visit24_108_1(mregex.lastIndex || lines[t].length);
    _$jscoverage['/hdump.js'].lineData[109]++;
    tmp = lines[t].slice(prefixLength, mregex.lastIndex).replace(/[^a-fA-F0-9]/g, '');
    _$jscoverage['/hdump.js'].lineData[110]++;
    ret += tmp;
  }
  _$jscoverage['/hdump.js'].lineData[113]++;
  return ret;
}
_$jscoverage['/hdump.js'].lineData[119]++;
function extractText(str) {
  _$jscoverage['/hdump.js'].functionData[3]++;
  _$jscoverage['/hdump.js'].lineData[121]++;
  var lines = str.split('\n');
  _$jscoverage['/hdump.js'].lineData[122]++;
  if (visit15_122_1(lines.length < 2)) {
    _$jscoverage['/hdump.js'].lineData[123]++;
    return str;
  }
  _$jscoverage['/hdump.js'].lineData[125]++;
  var asciiIndex = 0;
  _$jscoverage['/hdump.js'].lineData[127]++;
  var firstLine = visit16_127_1(lines[0].length >= lines[1].length) ? 0 : 1;
  _$jscoverage['/hdump.js'].lineData[130]++;
  if (visit17_130_1(!asciiIndex && visit25_130_2(lines.length - firstLine > 1))) {
    _$jscoverage['/hdump.js'].lineData[134]++;
    var line = lines[firstLine];
    _$jscoverage['/hdump.js'].lineData[136]++;
    var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s)|./y;
    _$jscoverage['/hdump.js'].lineData[137]++;
    mregex.lastIndex = hexDumpLinePrefixLength(line);
    _$jscoverage['/hdump.js'].lineData[138]++;
    var m, curChars = 0;
    _$jscoverage['/hdump.js'].lineData[139]++;
    while (visit26_139_1(m = mregex.exec(line))) {
      _$jscoverage['/hdump.js'].lineData[141]++;
      if (visit33_141_1(m[1])) {
        curChars++;
      } else {
        _$jscoverage['/hdump.js'].lineData[142]++;
        if (visit39_142_1(m[2])) {
          _$jscoverage['/hdump.js'].lineData[144]++;
          if (visit44_144_1(line.length - mregex.lastIndex === curChars)) {
            _$jscoverage['/hdump.js'].lineData[146]++;
            asciiIndex = mregex.lastIndex;
            _$jscoverage['/hdump.js'].lineData[147]++;
            break;
          }
        } else {
          _$jscoverage['/hdump.js'].lineData[150]++;
          break;
        }
      }
    }
  }
  _$jscoverage['/hdump.js'].lineData[154]++;
  var ret = visit18_154_1(firstLine) ? lines[0] : '', m;
  _$jscoverage['/hdump.js'].lineData[155]++;
  var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s{4})|(\s)|./y;
  _$jscoverage['/hdump.js'].lineData[156]++;
  var readChars, lastGood;
  _$jscoverage['/hdump.js'].lineData[158]++;
  for (var t = firstLine; visit19_158_1(t < lines.length); t++) {
    _$jscoverage['/hdump.js'].lineData[160]++;
    if (visit27_160_1(asciiIndex)) {
      _$jscoverage['/hdump.js'].lineData[161]++;
      ret += lines[t].slice(asciiIndex);
    } else {
      _$jscoverage['/hdump.js'].lineData[164]++;
      mregex.lastIndex = hexDumpLinePrefixLength(lines[t]);
      _$jscoverage['/hdump.js'].lineData[166]++;
      readChars = lastGood = '';
      _$jscoverage['/hdump.js'].lineData[169]++;
      while (visit34_169_1(visit40_169_2(lines[t].length - mregex.lastIndex >= readChars.length + 3) && (m = mregex.exec(lines[t])))) {
        _$jscoverage['/hdump.js'].lineData[171]++;
        if (visit41_171_1(m[1])) {
          _$jscoverage['/hdump.js'].lineData[173]++;
          c = parseInt(m[1], 16);
          _$jscoverage['/hdump.js'].lineData[174]++;
          if (visit45_174_1(visit49_174_2(c >= 32) && visit50_174_3(c < 127))) {
            _$jscoverage['/hdump.js'].lineData[175]++;
            readChars += String.fromCharCode(c);
          } else {
            _$jscoverage['/hdump.js'].lineData[177]++;
            readChars += '.';
          }
          _$jscoverage['/hdump.js'].lineData[179]++;
          if (visit46_179_1(lines[t].slice(-readChars.length) === readChars)) {
            _$jscoverage['/hdump.js'].lineData[180]++;
            lastGood = readChars;
          }
        } else {
          _$jscoverage['/hdump.js'].lineData[182]++;
          if (visit47_182_1(m[2] || !m[3])) {
            _$jscoverage['/hdump.js'].lineData[184]++;
            break;
          }
        }
      }
      _$jscoverage['/hdump.js'].lineData[188]++;
      ret += lastGood;
    }
  }
  _$jscoverage['/hdump.js'].lineData[192]++;
  return ret;
}
_$jscoverage['/hdump.js'].lineData[196]++;
module.exports = {extractHex, extractText};
