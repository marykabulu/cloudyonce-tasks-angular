export const environment = {
  production: true,
  apiUrl: '/api', // Use Vercel proxy instead of direct AWS API Gateway
  enableLogging: true, // Enable logging in production to debug Vercel issues
  corsEnabled: true
};

// Debug logging to verify environment is loaded
console.log('🌍 Production Environment Loaded:', environment);