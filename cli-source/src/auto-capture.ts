/**
 * EasyAI Auto-Capture Entry Point
 * 
 * This module enables automatic HTTP request logging when imported.
 * It intercepts axios and fetch calls to log API usage automatically.
 */

// Import and initialize auto-capture
import './utils/auto-capture'

// Export for potential programmatic use
export { default } from './utils/auto-capture'