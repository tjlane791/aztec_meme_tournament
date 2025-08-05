// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'https://3.26.45.220',
    NODE_ENV: 'development'
  },
  production: {
    API_BASE_URL: 'https://3.26.45.220',
    NODE_ENV: 'production'
  },
  test: {
    API_BASE_URL: 'https://3.26.45.220',
    NODE_ENV: 'test'
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env] || config.development;

// Export configuration
export const API_BASE_URL = currentConfig.API_BASE_URL;
export const NODE_ENV = currentConfig.NODE_ENV;

// Log configuration for debugging
console.log('Environment:', NODE_ENV);
console.log('API Base URL:', API_BASE_URL);
console.log('Deployment URL:', window.location.origin); 