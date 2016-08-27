'use strict';

module.exports = {
  regexIndexOf(string, regex, startpos) {
    const indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  },
  regexLastIndexOf(string, regex, startpos) {
    let regexCopy = new RegExp(regex);
    let startPosCopy = startpos;
    if (!regexCopy.global) {
      const ignoreCase = regex.ignoreCase ? 'i' : '';
      const multiLine = regex.multiLine ? 'm' : '';
      regexCopy = new RegExp(regexCopy.source, `g${ignoreCase}${multiLine}`);
    }
    if (typeof (startpos) === 'undefined') {
      startPosCopy = string.length;
    } else if (startpos < 0) {
      startPosCopy = 0;
    }
    const stringToWorkWith = string.substring(0, startPosCopy + 1);
    let lastIndexOf = -1;
    let result = regexCopy.exec(stringToWorkWith);
    while (result !== null) {
      lastIndexOf = result.index;
      regexCopy.lastIndex = result.index + result[0].length;
      result = regexCopy.exec(stringToWorkWith);
    }
    return lastIndexOf;
  },
};
