export const environment = {
  production: false,
  apiUrl: 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev', // Direct AWS for development
  enableLogging: true
};

// Debug logging to verify environment is loaded
console.log('🌍 Development Environment Loaded:', environment);