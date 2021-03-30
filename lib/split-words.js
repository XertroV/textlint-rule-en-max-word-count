"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitWords = splitWords;

function splitWords(string) {
  if (!string) return [];
  var match = string.match(/"(?:\\"|[^"])+"|[^\s]+/g);

  if (!match) {
    return [];
  }

  return match.map(function (word) {
    return word.replace(/^\"|\"$/g, "");
  }); // Remove quotes from start and end of quoted strings matched above
}
//# sourceMappingURL=split-words.js.map