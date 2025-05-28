/**
 * @module Server
 * @description Express server for SLIP39 KeyTag Converter application.
 * Provides minimal HTTP server with static file serving, automatic browser
 * launch, and development convenience features for local testing.
 * @author AXIVO
 * @license MIT
 */

const express = require('express');
const path = require('path');
const open = require('open');

/**
 * Express application instance for serving SLIP39 KeyTag Converter.
 * Configured with static file serving for public assets and library files.
 *
 * @type {express.Application}
 */
const app = express();

/**
 * Server port configuration for local development.
 *
 * @type {number}
 * @default 3000
 */
const PORT = 3000;

/**
 * Configure static file serving for public directory.
 * Serves HTML, CSS, JavaScript, and asset files directly.
 */
app.use(express.static('public'));

/**
 * Configure static file serving for library directory.
 * Provides access to core conversion classes via /lib route.
 */
app.use('/lib', express.static('lib'));

/**
 * Main application route handler.
 * Serves the primary application interface at root path.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Start HTTP server and launch browser for development convenience.
 * Binds to configured port and automatically opens application in default browser.
 */
app.listen(PORT, () => {
  console.log(`SLIP39 KeyTag Converter running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
