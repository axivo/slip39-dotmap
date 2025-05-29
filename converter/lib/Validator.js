/**
 * Input validation class for SLIP39 compliance and binary format verification.
 * Validates binary strings against SLIP39 requirements including length constraints,
 * character validation, MSB restrictions, and index range compliance. Provides
 * structured error reporting with contextual information for debugging.
 *
 * @class Validator
 * @author AXIVO
 * @license MIT
 */
class Validator {
  /**
   * Validate binary string for SLIP39 compliance and format correctness.
   * Performs comprehensive validation including length check, character validation,
   * SLIP39-specific constraints (MSB=0), and index range verification.
   *
   * @static
   * @param {string} binary - Binary string to validate (should be 12 bits)
   * @returns {Object} Validation result with status and contextual information
   * @returns {boolean} returns.isValid - True if binary passes all validation checks
   * @returns {string|null} returns.error - Detailed error message or null if valid
   * @returns {number|null} returns.index - Calculated index value or null if invalid
   * @throws {Error} Never throws - all validation errors returned in result object
   */
  static validateBinary(binary) {
    if (!binary || typeof binary !== 'string') {
      return {
        isValid: false,
        error: 'Binary must be a non-empty string',
        index: null
      };
    }
    if (binary.length !== 12) {
      return {
        isValid: false,
        error: `Binary must be 12 bits long, got ${binary.length}`,
        index: null
      };
    }
    if (!/^[01]+$/.test(binary)) {
      return {
        isValid: false,
        error: 'Binary string must contain only 0 and 1',
        index: null
      };
    }
    const index = parseInt(binary, 2);
    if (binary[0] === '1') {
      return {
        isValid: false,
        error: 'First bit must be 0 for SLIP39',
        index: index
      };
    }
    if (index < 1 || index > 1024) {
      return {
        isValid: false,
        error: `Index ${index} out of SLIP39 range (1-1024)`,
        index: index
      };
    }
    return {
      isValid: true,
      error: null,
      index: index
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
} else if (typeof window !== 'undefined') {
  window.Validator = Validator;
}
