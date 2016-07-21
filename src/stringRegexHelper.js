'use strict';

module.exports = {
  regexIndexOf(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  },
  regexLastIndexOf(string, regex, startpos) {
      regex = (regex.global) 
        ? regex 
        : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
      if(typeof (startpos) == "undefined") {
          startpos = string.length;
      } else if(startpos < 0) {
          startpos = 0;
      }
      var stringToWorkWith = string.substring(0, startpos + 1);
      var lastIndexOf = -1;
      let result = regex.exec(stringToWorkWith);
      while (result !== null) {
        lastIndexOf = result.index;
        regex.lastIndex = result.index + result[0].length;
        result = regex.exec(stringToWorkWith);
      }
      return lastIndexOf;
  }
};