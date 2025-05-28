/**
 * Dot pattern manipulation class with binary operations for OneKey KeyTag hardware.
 * Converts SLIP39 wordlist indices (1-1024) to 12-bit binary representations and
 * visual dot patterns compatible with OneKey KeyTag physical layout. Implements
 * efficient caching for repeated operations and provides multiple output formats
 * for different use cases.
 *
 * @class DotPattern
 * @module DotPattern
 * @author AXIVO
 * @license MIT
 */
class DotPattern {
  /**
   * Initialize dot pattern from SLIP39 wordlist index with validation.
   * Creates pattern object with lazy-loaded caching for binary, dots, and column
   * representations to optimize repeated access operations.
   *
   * @param {number} index - SLIP39 wordlist index (1-1024 inclusive)
   * @throws {Error} When index is outside valid SLIP39 range (1-1024)
   */
  constructor(index) {
    if (index < 1 || index > 1024) {
      throw new Error(`Index ${index} out of SLIP39 range (1-1024)`);
    }
    this.index = index;
    this._binary = null;
    this._dots = null;
    this._columns = null;
  }

  /**
   * Create DotPattern instance from visual dot string representation.
   * Parses dot string using ● (filled) and ○ (empty) symbols and converts
   * to binary representation for index calculation. Handles whitespace removal.
   *
   * @static
   * @param {string} dotString - String of ● and ○ characters (12 total)
   * @returns {DotPattern} New DotPattern instance with calculated index
   * @throws {Error} When dot string length is not exactly 12 characters
   * @throws {Error} When dot string contains invalid characters (not ● or ○)
   * @throws {Error} When resulting index is outside SLIP39 range
   */
  static fromDots(dotString) {
    const cleanDots = dotString.replace(/\s/g, '');
    if (cleanDots.length !== 12) {
      throw new Error(`Dot string must be 12 characters long, got ${cleanDots.length}`);
    }
    const binary = cleanDots.split('').map(dot => {
      if (dot === '●') return '1';
      if (dot === '○') return '0';
      throw new Error(`Invalid dot character: ${dot}. Use ● or ○`);
    }).join('');
    const index = parseInt(binary, 2);
    return new DotPattern(index);
  }

  /**
   * Convert index to 12-bit binary string with MSB=0 for SLIP39 compliance.
   * Returns cached result on subsequent calls for performance optimization.
   * Always produces exactly 12 bits with leading zeros as needed.
   *
   * @returns {string} 12-bit binary representation with leading zeros
   */
  toBinary() {
    if (this._binary === null) {
      this._binary = this.index.toString(2).padStart(12, '0');
    }
    return this._binary;
  }

  /**
   * Convert binary representation to array of individual bit values.
   * Returns array of 12 integers (0 or 1) for bit manipulation operations.
   *
   * @returns {number[]} Array of 12 bit values (0 or 1)
   */
  toBitArray() {
    return this.toBinary().split('').map(bit => parseInt(bit));
  }

  /**
   * Split dots into 3 groups of 4 for OneKey KeyTag physical layout.
   * Returns cached result for performance. Groups correspond to KeyTag columns
   * with specific bit position mappings for hardware implementation.
   *
   * @returns {string[]} Array of 3 dot groups (4 dots each)
   * @returns {string} returns[0] - Bits 11-8: [2048][1024][512][256] powers
   * @returns {string} returns[1] - Bits 7-4: [128][64][32][16] powers
   * @returns {string} returns[2] - Bits 3-0: [8][4][2][1] powers
   */
  toColumns() {
    if (this._columns === null) {
      const dots = this.toDots();
      this._columns = [
        dots.substring(0, 4),
        dots.substring(4, 8),
        dots.substring(8, 12)
      ];
    }
    return this._columns;
  }

  /**
   * Get formatted display string with spaces between column groups.
   * Provides human-readable format for KeyTag layout visualization.
   *
   * @returns {string} Spaced dot pattern for display purposes
   */
  toDisplayString() {
    const columns = this.toColumns();
    return columns.join(' ');
  }

  /**
   * Convert binary representation to visual dot pattern symbols.
   * Uses ● for filled holes (bit=1) and ○ for intact areas (bit=0).
   * Returns cached result for performance on repeated calls.
   *
   * @returns {string} Visual dot pattern using ● (filled) and ○ (empty) symbols
   */
  toDots() {
    if (this._dots === null) {
      const binary = this.toBinary();
      this._dots = binary.split('').map(bit => bit === '1' ? '●' : '○').join('');
    }
    return this._dots;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DotPattern;
} else if (typeof window !== 'undefined') {
  window.DotPattern = DotPattern;
}
