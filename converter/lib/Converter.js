/**
 * Core conversion logic class for SLIP39 to OneKey KeyTag dotmap patterns.
 * Provides bidirectional conversion between SLIP39 mnemonic words and OneKey KeyTag
 * dot patterns with comprehensive validation and error reporting. Uses optimized
 * reverse lookup table for efficient word-to-index mapping during conversion operations.
 *
 * @class Converter
 * @author AXIVO
 * @license MIT
 */
class Converter {
  /**
   * Initialize converter with SLIP39 wordlist and build reverse lookup table.
   * Creates optimized word-to-index mapping for efficient conversion operations.
   *
   * @param {Object} wordlist - SLIP39 wordlist mapping indices to words
   * @param {string} wordlist.1 - First word "academic" at index 1
   * @param {string} wordlist.2 - Second word "acid" at index 2
   * @param {string} wordlist.1024 - Last word "zero" at index 1024
   * @throws {Error} When wordlist is invalid or empty
   */
  constructor(wordlist) {
    this.wordlist = wordlist;
    this.reverseWordlist = this.buildReverseWordlist(wordlist);
  }

  /**
   * Build reverse lookup table for optimized word-to-index mapping.
   * Creates case-insensitive mapping from words to their SLIP39 indices
   * for high-performance conversion operations.
   *
   * @param {Object} wordlist - SLIP39 wordlist mapping indices to words
   * @returns {Object} Reverse lookup table mapping words to indices
   * @returns {number} returns.word - Index value for each word key
   * @throws {Error} When wordlist contains invalid entries
   */
  buildReverseWordlist(wordlist) {
    const reverse = {};
    for (const [index, word] of Object.entries(wordlist)) {
      reverse[word.toLowerCase()] = parseInt(index);
    }
    return reverse;
  }

  /**
   * Validate and convert complete mnemonic with detailed error reporting.
   * Processes mnemonic phrase (string or array) and converts each valid word
   * to dot pattern while collecting validation errors for invalid words.
   *
   * @param {string|string[]} mnemonic - Mnemonic phrase to convert
   * @returns {Object} Complete conversion result with validation status
   * @returns {boolean} returns.isValid - True if all words are valid
   * @returns {number} returns.wordCount - Total number of words processed
   * @returns {string[]} returns.words - Successfully processed words
   * @returns {Object[]} returns.patterns - Conversion results for valid words
   * @returns {string} returns.patterns[].word - Original word
   * @returns {number} returns.patterns[].index - SLIP39 index (1-1024)
   * @returns {string} returns.patterns[].binary - 12-bit binary representation
   * @returns {string} returns.patterns[].dots - Dot pattern using ● and ○
   * @returns {string[]} returns.patterns[].columns - Three 4-dot column groups
   * @returns {Object[]} returns.errors - Validation errors for invalid words
   * @returns {number} returns.errors[].position - Word position in mnemonic (1-based)
   * @returns {string} returns.errors[].word - Invalid word that caused error
   * @returns {string} returns.errors[].error - Detailed error message
   * @throws {Error} When mnemonic format is completely invalid
   */
  convertWithValidation(mnemonic) {
    const words = Array.isArray(mnemonic) ? mnemonic : mnemonic.trim().split(/\s+/);
    const result = {
      isValid: true,
      wordCount: words.length,
      words: [],
      patterns: [],
      errors: []
    };
    words.forEach((word, index) => {
      try {
        const conversion = this.convertWordToDots(word);
        result.words.push(word);
        result.patterns.push(conversion);
      } catch (error) {
        result.isValid = false;
        result.errors.push({
          position: index + 1,
          word: word,
          error: error.message
        });
      }
    });
    return result;
  }

  /**
   * Convert single SLIP39 word to OneKey KeyTag dot pattern.
   * Performs case-insensitive lookup and generates complete dot pattern
   * representation including binary, visual dots, and column layout.
   *
   * @param {string} word - SLIP39 word to convert (case-insensitive)
   * @returns {Object} Complete dot pattern conversion result
   * @returns {string} returns.word - Original input word
   * @returns {number} returns.index - SLIP39 wordlist index (1-1024)
   * @returns {string} returns.binary - 12-bit binary representation
   * @returns {string} returns.dots - Visual dot pattern using ● (filled) and ○ (empty)
   * @returns {string[]} returns.columns - Three 4-dot groups for KeyTag layout
   * @returns {string} returns.columns[0] - Bits 11-8: [2048][1024][512][256]
   * @returns {string} returns.columns[1] - Bits 7-4: [128][64][32][16]
   * @returns {string} returns.columns[2] - Bits 3-0: [8][4][2][1]
   * @throws {Error} When word is not found in SLIP39 wordlist
   * @throws {Error} When DotPattern creation fails (index out of range)
   */
  convertWordToDots(word) {
    const index = this.reverseWordlist[word.toLowerCase()];
    if (!index) {
      throw new Error(`Word "${word}" not found in SLIP39 wordlist`);
    }
    const pattern = new DotPattern(index);
    return {
      word: word,
      index: index,
      binary: pattern.toBinary(),
      dots: pattern.toDots(),
      columns: pattern.toColumns()
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Converter;
} else if (typeof window !== 'undefined') {
  window.Converter = Converter;
}
