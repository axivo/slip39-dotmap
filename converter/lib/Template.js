/**
 * Template management service for Handlebars template compilation and rendering.
 * Provides template caching, custom helper registration, and error handling
 * with graceful fallback capabilities for browser environments.
 *
 * @class Template
 * @author AXIVO
 * @license MIT
 */
class Template {
  /**
   * Creates new Template instance with template cache and helper registration.
   * Initializes Handlebars environment and registers custom helpers for SLIP39
   * application-specific formatting and display requirements.
   *
   * @param {Object} dependencies - Service dependencies object
   * @param {Object} dependencies.handlebars - Handlebars instance for template compilation
   */
  constructor(dependencies = {}) {
    this.handlebars = dependencies.handlebars || (typeof window !== 'undefined' ? window.Handlebars : null);
    this.templateCache = new Map();
    this.helpersRegistered = false;
    this.initializeHelpers();
  }

  /**
   * Clears all cached templates and forces recompilation on next render.
   * Useful during development for template modifications and debugging.
   *
   * @returns {Object} Operation result with success status and message
   * @returns {boolean} returns.success - Cache clearing success indicator
   * @returns {string} returns.message - Operation status message
   * @returns {number} returns.clearedCount - Number of templates cleared from cache
   */
  clearCache() {
    const clearedCount = this.templateCache.size;
    this.templateCache.clear();
    return {
      success: true,
      message: `Template cache cleared successfully`,
      clearedCount: clearedCount
    };
  }

  /**
   * Compiles Handlebars template from source string with error handling.
   * Caches compiled templates for performance optimization and provides
   * fallback error handling when compilation fails.
   *
   * @param {string} templateSource - Handlebars template source string
   * @param {string} templateName - Template identifier for caching and debugging
   * @returns {Object} Compilation result with template function or error
   * @returns {boolean} returns.success - Compilation success indicator
   * @returns {Function|null} returns.template - Compiled template function
   * @returns {string} returns.message - Operation status or error message
   * @throws {Error} When Handlebars unavailable or compilation fails critically
   */
  compileTemplate(templateSource, templateName) {
    if (!this.handlebars) {
      throw new Error('Handlebars not available for template compilation');
    }
    if (this.templateCache.has(templateName)) {
      return {
        success: true,
        template: this.templateCache.get(templateName),
        message: 'Template loaded from cache'
      };
    }
    try {
      const compiledTemplate = this.handlebars.compile(templateSource);
      this.templateCache.set(templateName, compiledTemplate);
      return {
        success: true,
        template: compiledTemplate,
        message: 'Template compiled successfully'
      };
    } catch (error) {
      return {
        success: false,
        template: null,
        message: `Template compilation failed: ${error.message}`
      };
    }
  }

  /**
   * Fetches template source from file path with browser-compatible loading.
   * Handles both relative and absolute template paths with proper error
   * handling for network failures and file access issues.
   *
   * @param {string} templatePath - Template file path relative to public/templates directory
   * @returns {Promise<Object>} Template loading result with source or error
   * @returns {boolean} returns.success - Template loading success indicator
   * @returns {string|null} returns.source - Template source content
   * @returns {string} returns.message - Operation status or error message
   */
  async fetchTemplate(templatePath) {
    try {
      const fullPath = templatePath.startsWith('/') ? templatePath : `/templates/${templatePath}`;
      const response = await fetch(fullPath);
      if (!response.ok) {
        return {
          success: false,
          source: null,
          message: `Template fetch failed: ${response.status} ${response.statusText}`
        };
      }
      const source = await response.text();
      return {
        success: true,
        source: source,
        message: 'Template loaded successfully'
      };
    } catch (error) {
      return {
        success: false,
        source: null,
        message: `Template fetch error: ${error.message}`
      };
    }
  }

  /**
   * Retrieves cached template statistics and performance metrics.
   * Provides debugging information about template cache usage and
   * compilation performance for development optimization.
   *
   * @returns {Object} Cache statistics with performance metrics
   * @returns {number} returns.cacheSize - Number of cached templates
   * @returns {string[]} returns.templateNames - Array of cached template identifiers
   * @returns {boolean} returns.helpersRegistered - Helper registration status
   * @returns {boolean} returns.handlebarsAvailable - Handlebars availability status
   */
  getCacheStats() {
    return {
      cacheSize: this.templateCache.size,
      templateNames: Array.from(this.templateCache.keys()),
      helpersRegistered: this.helpersRegistered,
      handlebarsAvailable: !!this.handlebars
    };
  }

  /**
   * Registers custom Handlebars helpers for SLIP39 application functionality.
   * Provides specialized helpers for date formatting, dot pattern display,
   * conditional logic, and text formatting specific to KeyTag requirements.
   */
  initializeHelpers() {
    if (!this.handlebars || this.helpersRegistered) {
      return;
    }
    this.handlebars.registerHelper('displayDots', (dotPattern) => {
      if (!dotPattern || typeof dotPattern !== 'string') {
        return '';
      }
      return dotPattern.split('').join(' ');
    });
    this.handlebars.registerHelper('eq', (a, b) => {
      return a === b;
    });
    this.handlebars.registerHelper('formatDate', (timestamp) => {
      if (!timestamp) {
        return new Date().toLocaleString();
      }
      return new Date(timestamp).toLocaleString();
    });
    this.handlebars.registerHelper('pluralize', (count, singular, plural) => {
      return count === 1 ? singular : (plural || singular + 's');
    });
    this.helpersRegistered = true;
  }

  /**
   * Renders template with provided data context and error handling.
   * Supports both cached and dynamic template compilation with fallback
   * error handling and graceful degradation for critical failures.
   *
   * @param {string} templatePath - Template file path or cached template name
   * @param {Object} data - Template data context for rendering
   * @param {Object} options - Rendering options and configuration
   * @param {boolean} options.useCache - Enable template caching for performance
   * @param {string} options.fallbackHtml - Fallback HTML when rendering fails
   * @returns {Promise<Object>} Rendering result with HTML or error information
   * @returns {boolean} returns.success - Template rendering success indicator
   * @returns {string} returns.html - Rendered HTML content
   * @returns {string} returns.message - Operation status or error message
   */
  async renderTemplate(templatePath, data = {}, options = {}) {
    const { useCache = true, fallbackHtml = '<div class="error">Template rendering failed</div>' } = options;
    try {
      const templateResult = await this.fetchTemplate(templatePath);
      if (!templateResult.success) {
        return {
          success: false,
          html: fallbackHtml,
          message: templateResult.message
        };
      }
      const templateName = useCache ? templatePath : `${templatePath}_${Date.now()}`;
      const compileResult = this.compileTemplate(templateResult.source, templateName);
      if (!compileResult.success) {
        return {
          success: false,
          html: fallbackHtml,
          message: compileResult.message
        };
      }
      const html = compileResult.template(data);
      return {
        success: true,
        html: html,
        message: 'Template rendered successfully'
      };
    } catch (error) {
      return {
        success: false,
        html: fallbackHtml,
        message: `Template rendering error: ${error.message}`
      };
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Template;
} else if (typeof window !== 'undefined') {
  window.Template = Template;
}
