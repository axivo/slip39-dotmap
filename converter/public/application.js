/**
 * Main application controller for SLIP39 KeyTag Converter frontend interface.
 * Handles user interactions, manages dot grid visualization, processes mnemonic
 * conversions, and provides validation feedback for educational purposes.
 * Integrates with conversion library classes and manages application state.
 *
 * @class Application
 * @author AXIVO
 * @license MIT
 */
class Application {
  /**
   * Initialize application with default state and start initialization sequence.
   * Sets up core properties for wordlist management, converter instances,
   * UI state tracking, and network security monitoring.
   */
  constructor() {
    this.wordlist = null;
    this.converter = null;
    this.validator = null;
    this.currentWordCount = 20;
    this.dotRows = [];
    this.isOnline = false;
    this.init();
  }

  /**
   * Clear all user input and reset application to initial state.
   * Removes mnemonic input text, resets all dot patterns, and clears error messages.
   */
  clearAll() {
    const mnemonicInput = document.getElementById('mnemonicInput');
    mnemonicInput.value = '';
    this.clearDots();
    this.clearErrors();
  }

  /**
   * Reset all dot patterns to empty state and clear word displays.
   * Iterates through all dot rows and removes filled state from dots.
   */
  clearDots() {
    this.dotRows.forEach(row => {
      const dots = Array.from(row.dots);
      dots.forEach(dot => {
        dot.classList.remove('filled');
        dot.classList.add('empty');
      });
      const wordDisplay = row.element.querySelector('.word-display');
      wordDisplay.textContent = '#0';
      wordDisplay.className = 'word-display empty';
    });
  }

  /**
   * Hide and clear all error display containers.
   * Removes validation error messages and resets error container visibility.
   */
  clearErrors() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.classList.add('hidden');
      errorContainer.innerHTML = '';
    }
  }

  /**
   * Convert mnemonic input to dot patterns with comprehensive validation.
   * Processes user input, validates each word, and updates dot grid visualization
   * with appropriate error handling and user feedback.
   */
  convertMnemonicToDots() {
    const mnemonicInput = document.getElementById('mnemonicInput');
    const words = mnemonicInput.value.trim().toLowerCase().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return;
    try {
      const result = this.converter.convertWithValidation(words);
      if (!result.isValid) {
        this.showValidationErrors(result.errors);
        return;
      }
      this.clearDots();
      result.patterns.forEach((pattern, index) => {
        if (index < this.currentWordCount) {
          this.setRowFromPattern(index + 1, pattern);
        }
      });
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion failed: ${error.message}`);
    }
  }

  /**
   * Create individual dot row element with interactive dots and word display.
   * Generates DOM structure for single row including row number, dot groups,
   * and word display with appropriate event handlers for dot interaction.
   *
   * @param {number} rowNumber - Row index for identification and display
   * @returns {HTMLElement} Complete dot row element ready for grid insertion
   */
  createDotRow(rowNumber) {
    const row = document.createElement('div');
    row.className = 'dot-row';
    row.dataset.rowIndex = rowNumber;
    const rowNum = document.createElement('div');
    rowNum.className = 'row-number';
    rowNum.textContent = rowNumber;
    const dotGroups = document.createElement('div');
    dotGroups.className = 'dot-groups';
    for (let groupIndex = 0; groupIndex < 3; groupIndex++) {
      const group = document.createElement('div');
      group.className = 'dot-group';
      for (let dotIndex = 0; dotIndex < 4; dotIndex++) {
        const dot = document.createElement('div');
        dot.className = 'dot empty';
        dot.dataset.groupIndex = groupIndex;
        dot.dataset.dotIndex = dotIndex;
        if (groupIndex === 0 && dotIndex === 0) {
          dot.classList.add('disabled');
        } else {
          dot.addEventListener('click', () => {
            this.handleDotClick(rowNumber, groupIndex, dotIndex);
          });
        }
        group.appendChild(dot);
      }
      dotGroups.appendChild(group);
    }
    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'word-display empty';
    wordDisplay.textContent = '#0';
    row.appendChild(rowNum);
    row.appendChild(dotGroups);
    row.appendChild(wordDisplay);
    return row;
  }

  /**
   * Generate complete dot grid interface with 33 rows for maximum mnemonic length.
   * Creates DOM structure for dot pattern visualization and stores row references
   * for efficient manipulation during conversion operations.
   */
  generateDotGrid() {
    const gridContainer = document.getElementById('dotmapGrid');
    gridContainer.innerHTML = '';
    for (let rowIndex = 1; rowIndex <= 33; rowIndex++) {
      const dotRow = this.createDotRow(rowIndex);
      gridContainer.appendChild(dotRow);
      this.dotRows.push({
        element: dotRow,
        index: rowIndex,
        dots: dotRow.querySelectorAll('.dot')
      });
    }
    this.updateVisibleRows();
  }

  /**
   * Extract current dot patterns from grid for educational reference.
   * Scans visible rows and builds pattern data structure with position,
   * dot states, and associated word information.
   *
   * @returns {Object[]} Array of pattern objects with position, dots, and word data
   * @returns {number} returns[].position - Row position in grid (1-based)
   * @returns {string} returns[].dots - Dot pattern string using ● and ○
   * @returns {string} returns[].word - Associated word display text
   */
  getCurrentPatterns() {
    const patterns = [];
    for (let i = 0; i < this.currentWordCount; i++) {
      const row = this.dotRows[i];
      const dots = Array.from(row.dots);
      const dotString = dots.map(dot =>
        dot.classList.contains('filled') ? '●' : '○'
      ).join('');
      const wordDisplay = row.element.querySelector('.word-display');
      const wordText = wordDisplay.textContent;
      if (wordText !== '#0') {
        patterns.push({
          position: i + 1,
          dots: dotString,
          word: wordText
        });
      }
    }
    return patterns;
  }

  /**
   * Extract word list from current patterns for mnemonic reconstruction.
   * Parses word display text and filters out empty entries.
   *
   * @returns {string[]} Array of SLIP39 words from current patterns
   */
  getCurrentWords() {
    const patterns = this.getCurrentPatterns();
    return patterns.map(p => {
      const match = p.word.match(/#\d+\s+(.+)/);
      return match ? match[1] : '';
    }).filter(word => word);
  }

  /**
   * Create or retrieve error display container for validation feedback.
   * Ensures error container exists in DOM and returns reference for content updates.
   *
   * @returns {HTMLElement} Error container element for message display
   */
  getOrCreateErrorContainer() {
    let container = document.getElementById('error-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'error-container';
      container.className = 'error-container hidden';
      const controls = document.querySelector('.controls');
      controls.parentNode.insertBefore(container, controls.nextSibling);
    }
    return container;
  }

  /**
   * Handle dot click interactions for manual pattern entry.
   * Toggles dot state between filled and empty, updates visual appearance,
   * and triggers word display update for immediate feedback.
   *
   * @param {number} rowIndex - Target row number (1-based)
   * @param {number} groupIndex - Dot group within row (0-2)
   * @param {number} dotIndex - Dot position within group (0-3)
   */
  handleDotClick(rowIndex, groupIndex, dotIndex) {
    const row = this.dotRows[rowIndex - 1];
    const dotGroups = row.element.querySelectorAll('.dot-group');
    const dot = dotGroups[groupIndex].children[dotIndex];
    if (dot.classList.contains('empty')) {
      dot.classList.remove('empty');
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
      dot.classList.add('empty');
    }
    this.updateWordDisplay(rowIndex);
  }

  /**
   * Initialize application components and start main functionality.
   * Coordinates wordlist loading, class initialization, event setup,
   * grid generation, and security monitoring activation.
   */
  async init() {
    await this.loadWordlist();
    this.initializeClasses();
    this.setupEventListeners();
    this.generateDotGrid();
    this.setupNetworkDetection();
  }

  /**
   * Initialize converter and validator classes with dependencies.
   * Creates converter instance for word-to-pattern operations and assigns validator
   * class for binary validation.
   */
  initializeClasses() {
    if (this.wordlist) {
      this.converter = new Converter(this.wordlist);
      this.validator = Validator;
    }
  }

  /**
   * Load SLIP39 wordlist from assets with error handling.
   * Fetches JSON wordlist file and stores for conversion operations
   * with appropriate error logging for debugging.
   */
  async loadWordlist() {
    try {
      const response = await fetch('./assets/wordlist.json');
      this.wordlist = await response.json();
      console.log('SLIP39 wordlist loaded:', Object.keys(this.wordlist).length, 'words');
    } catch (error) {
      console.error('Failed to load SLIP39 wordlist:', error);
    }
  }

  /**
   * Apply dot pattern to specific row from conversion result.
   * Updates row dots based on pattern data and refreshes word display
   * to reflect the applied pattern.
   *
   * @param {number} rowIndex - Target row number (1-based)
   * @param {Object} pattern - Pattern data from conversion
   * @param {number} pattern.index - SLIP39 wordlist index
   */
  setRowFromPattern(rowIndex, pattern) {
    if (rowIndex > this.dotRows.length) return;
    const row = this.dotRows[rowIndex - 1];
    const dots = Array.from(row.dots);
    const dotPattern = new DotPattern(pattern.index);
    const bits = dotPattern.toBitArray();
    dots.forEach((dot, index) => {
      const bit = bits[index];
      if (bit === 1) {
        dot.classList.remove('empty');
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
        dot.classList.add('empty');
      }
    });
    this.updateWordDisplay(rowIndex);
  }

  /**
   * Configure event listeners for user interface interactions.
   * Binds handlers for word count selection, mnemonic input,
   * and conversion triggers.
   */
  setupEventListeners() {
    const wordCountSelect = document.getElementById('wordCount');
    wordCountSelect.addEventListener('change', (e) => {
      this.currentWordCount = parseInt(e.target.value);
      this.updateVisibleRows();
    });
    const mnemonicInput = document.getElementById('mnemonicInput');
    mnemonicInput.addEventListener('input', () => {
      this.clearDots();
    });
    const convertBtn = document.getElementById('convertBtn');
    convertBtn.addEventListener('click', () => {
      this.convertMnemonicToDots();
    });
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', () => {
      this.clearAll();
    });
  }

  /**
   * Initialize network connection monitoring for security warnings.
   * Detects online status and configures event listeners for
   * connection state changes with appropriate warning display.
   */
  setupNetworkDetection() {
    this.isOnline = navigator.onLine;
    this.updateNetworkWarning();
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateNetworkWarning();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateNetworkWarning();
    });
  }

  /**
   * Display error with basic formatting for educational feedback.
   * Provides simple error presentation for educational use cases.
   *
   * @param {string} message - Primary error message for user display
   * @param {Object} options - Error display options and configuration
   * @param {string} options.severity - Error severity level (low, medium, high, critical)
   * @param {string} options.title - Error title for header display
   */
  async showError(message, options = {}) {
    const errorContainer = this.getOrCreateErrorContainer();
    const {
      title = 'Error'
    } = options;
    
    errorContainer.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
    `;
    errorContainer.classList.remove('hidden');
  }

  /**
   * Display validation errors with detailed formatting.
   * Creates validation error display with position information,
   * word context, and specific error details for user guidance.
   *
   * @param {Object[]} errors - Array of validation error objects
   * @param {number} errors[].position - Word position in mnemonic (1-based)
   * @param {string} errors[].word - Invalid word that caused error
   * @param {string} errors[].error - Detailed error message
   */
  async showValidationErrors(errors) {
    const validationMessage = `Found ${errors.length} validation ${errors.length === 1 ? 'error' : 'errors'} in mnemonic input`;
    const errorDetails = errors.map(err => `Position ${err.position}: ${err.error} (word: "${err.word}")`).join('<br>');
    
    await this.showError(`${validationMessage}<br><br>${errorDetails}`, {
      title: 'Validation Failed'
    });
  }

  /**
   * Update network warning visibility based on connection status.
   * Shows security warning when online connection is detected
   * for educational safety during conversion operations.
   */
  updateNetworkWarning() {
    const warning = document.getElementById('network-warning');
    if (this.isOnline) {
      warning.classList.remove('hidden');
    } else {
      warning.classList.add('hidden');
    }
  }

  /**
   * Update dot row visibility based on selected word count.
   * Shows or hides rows to match current word count selection
   * for clean interface presentation.
   */
  updateVisibleRows() {
    this.dotRows.forEach((row, index) => {
      if (index < this.currentWordCount) {
        row.element.classList.remove('hidden');
      } else {
        row.element.classList.add('hidden');
      }
    });
  }

  /**
   * Update word display for specific row based on current dot pattern.
   * Converts dot states to binary, validates against SLIP39 constraints,
   * and updates word display with appropriate feedback.
   *
   * @param {number} rowIndex - Target row number (1-based)
   */
  updateWordDisplay(rowIndex) {
    const row = this.dotRows[rowIndex - 1];
    const dots = Array.from(row.dots);
    const wordDisplay = row.element.querySelector('.word-display');
    const binaryString = dots.slice(1).map(dot =>
      dot.classList.contains('filled') ? '1' : '0'
    ).join('');
    const wordIndex = parseInt(binaryString, 2);
    const validation = this.validator.validateBinary('0' + binaryString);
    if (!validation.isValid) {
      dots.forEach(dot => {
        if (!dot.classList.contains('disabled')) {
          dot.classList.remove('filled');
          dot.classList.add('empty');
        }
      });
      wordDisplay.textContent = '#0';
      wordDisplay.className = 'word-display empty';
      return;
    }
    if (wordIndex === 0) {
      wordDisplay.textContent = '#0';
      wordDisplay.className = 'word-display empty';
    } else if (this.wordlist && this.wordlist[wordIndex.toString()]) {
      const word = this.wordlist[wordIndex.toString()];
      wordDisplay.textContent = `#${wordIndex} ${word}`;
      wordDisplay.className = 'word-display';
    } else {
      wordDisplay.textContent = `#${wordIndex} (unknown)`;
      wordDisplay.className = 'word-display empty';
    }
  }
}

/**
 * Initialize application when DOM content is fully loaded.
 * Creates Application instance to start SLIP39 KeyTag Converter functionality.
 */
document.addEventListener('DOMContentLoaded', () => {
  new Application();
});
