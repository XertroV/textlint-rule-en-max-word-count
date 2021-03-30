"use strict";

var _unistUtilMap = _interopRequireDefault(require("unist-util-map"));

var _textlintUtilToString = _interopRequireDefault(require("textlint-util-to-string"));

var _sentenceSplitter = require("sentence-splitter");

var _splitWords = require("./split-words");

var _objectAssign = _interopRequireDefault(require("object-assign"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Default options
var defaultOptions = {
  // max count of words >
  max: 50
};
/**
 * @param {TextLintRuleContext} context
 * @param {Object} options
 */

function report(context) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var Syntax = context.Syntax,
      getSource = context.getSource,
      RuleError = context.RuleError,
      report = context.report;
  var maxWordCount = options.max ? options.max : defaultOptions.max;
  return _defineProperty({}, Syntax.Paragraph, function (node) {
    // replace code with dummy code
    // if you want to filter(remove) code, use https://github.com/eush77/unist-util-filter
    var filteredNode = (0, _unistUtilMap["default"])(node, function (node) {
      if (node.type === Syntax.Code) {
        // only change `value` to dummy
        return (0, _objectAssign["default"])({}, node, {
          value: "code"
        });
      }

      return node;
    });
    var source = new _textlintUtilToString["default"](filteredNode); // text in a paragraph

    var text = source.toString(); // get sentences from Paragraph

    var sentences = (0, _sentenceSplitter.split)(text).filter(function (node) {
      // ignore break line
      return node.type === _sentenceSplitter.Syntax.Sentence;
    }); // text in a sentence

    sentences.forEach(function (sentence) {
      /* sentence object is a node
      {
          type: "Sentence",
          raw: text,
          value: text,
          loc: loc,
          range: range
      };
       */
      var sentenceText = sentence.value; // words in a sentence

      var words = (0, _splitWords.splitWords)(sentenceText); // over count of word, then report error

      if (words.length > maxWordCount) {
        // get original index value of sentence.loc.start
        var originalIndex = source.originalIndexFromPosition(sentence.loc.start);
        var sentenceFragment = "".concat(words.slice(0, 3).join(' '), " ...");
        var ruleError = new RuleError("Maximum word count (".concat(maxWordCount, ") exceeded (").concat(words.length, ") by \"").concat(sentenceFragment, "\"."), {
          index: originalIndex
        });
        report(node, ruleError);
      }
    });
  });
}

module.exports = report;
//# sourceMappingURL=textlint-rule-en-max-word-count.js.map