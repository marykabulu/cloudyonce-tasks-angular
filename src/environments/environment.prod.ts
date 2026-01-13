export const environment = {
  production: true,
  apiUrl: 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev',
  enableLogging: true,
  corsEnabled: true,
  // CORS Proxy for GitHub Pages deployment
  // Free options: 
  //   - 'https://api.allorigins.win/raw?url=' (may have POST limitations)
  //   - 'https://corsproxy.io/?' (better POST support)
  // Or deploy your own proxy server (see CORS_PROXY_SETUP.md)
  corsProxyUrl: 'https://corsproxy.io/?',
  useCorsProxy: true // Enabled for production/GitHub Pages
};

console.log('🌍 Production Environment Loaded:', environment);