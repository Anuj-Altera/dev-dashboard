/**
 * config.js
 * 
 * This file contains configuration settings for the IRIS Dashboard application.
 * Central place to store URLs, API endpoints, and other configuration parameters.
 */

// API configuration
export const API_CONFIG = {
  // Server URL for the PFM database API
  SERVER_URL: 'http://azupfmdevserver:52773',
  
  // API base paths
  API_BASE_PATH: '/api/pfmdb',
};

// Other configuration settings can be added here as needed
export const APP_CONFIG = {
  // Default date range (in months)
  DEFAULT_DATE_RANGE: 6,
  
  // Application version
  VERSION: '1.0.0',
};