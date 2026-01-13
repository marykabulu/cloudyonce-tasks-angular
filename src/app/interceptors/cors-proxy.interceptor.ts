import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * CORS Proxy Interceptor
 * 
 * This interceptor automatically routes API requests through a CORS proxy
 * when the app is deployed on GitHub Pages (or any domain that's not localhost).
 * 
 * The proxy bypasses CORS restrictions by making requests server-side.
 */
export const corsProxyInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Check if we're on GitHub Pages or a production domain (not localhost)
  const isProduction = environment.production;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isGitHubPages = window.location.hostname.includes('github.io');
  const shouldUseProxy = (isProduction && !isLocalhost) || isGitHubPages;

  // Only proxy requests to the API Gateway
  const apiGatewayUrl = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com';
  const isApiGatewayRequest = req.url.startsWith(apiGatewayUrl) || req.url.startsWith(environment.apiUrl);

  if (shouldUseProxy && isApiGatewayRequest && environment.useCorsProxy) {
    // Use CORS proxy - supports multiple proxy services
    const proxyUrl = environment.corsProxyUrl || 'https://api.allorigins.win/raw?url=';
    const targetUrl = encodeURIComponent(req.url);
    
    // Handle different proxy URL formats
    let proxiedUrl: string;
    if (proxyUrl.includes('?')) {
      // Proxy with query parameter (e.g., allorigins.win, corsproxy.io)
      proxiedUrl = `${proxyUrl}${targetUrl}`;
    } else {
      // Proxy with path parameter (e.g., custom proxy)
      proxiedUrl = `${proxyUrl}?url=${targetUrl}`;
    }

    if (environment.enableLogging) {
      console.log('🔄 Using CORS proxy:', {
        original: req.url,
        proxied: proxiedUrl,
        method: req.method,
        hostname: window.location.hostname
      });
    }

    // Create proxied request
    // Note: allorigins.win and similar proxies forward POST bodies automatically
    const proxiedReq = req.clone({
      url: proxiedUrl,
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next(proxiedReq);
  }

  // For localhost or non-API requests, use direct connection
  return next(req);
};
