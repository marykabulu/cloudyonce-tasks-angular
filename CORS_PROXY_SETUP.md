# CORS Proxy Setup for GitHub Pages

Since your API Gateway only allows requests from `localhost:4200`, we need a CORS proxy for GitHub Pages deployment.

## How It Works

The app automatically detects when it's running on GitHub Pages and routes API requests through a CORS proxy. The proxy makes requests server-side, bypassing browser CORS restrictions.

## Option 1: Free Public Proxy (Current Setup)

The app is configured to use **allorigins.win** by default. This is a free, public CORS proxy service.

**Pros:**
- ✅ Free
- ✅ No setup required
- ✅ Works immediately

**Cons:**
- ⚠️ Public service (not ideal for production)
- ⚠️ May have rate limits
- ⚠️ Not suitable for sensitive data

## Option 2: Deploy Your Own Proxy (Recommended for Production)

### Option 2A: Vercel Serverless Function (Recommended)

1. **Create a new file** `api/proxy.ts` in your project:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow requests to your API Gateway
  const allowedOrigin = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com';
  const targetUrl = req.query.url as string;

  if (!targetUrl || !targetUrl.startsWith(allowedOrigin)) {
    return res.status(403).json({ error: 'Invalid target URL' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.body && { 'Content-Length': JSON.stringify(req.body).length.toString() })
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
```

2. **Update `environment.prod.ts`**:
```typescript
corsProxyUrl: 'https://your-vercel-app.vercel.app/api/proxy?url='
```

3. **Deploy to Vercel**:
```bash
vercel --prod
```

### Option 2B: Netlify Function

1. **Create** `netlify/functions/proxy.js`:

```javascript
exports.handler = async (event, context) => {
  const targetUrl = event.queryStringParameters.url;
  const allowedOrigin = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com';

  if (!targetUrl || !targetUrl.startsWith(allowedOrigin)) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Invalid target URL' })
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: event.body
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

2. **Update `environment.prod.ts`**:
```typescript
corsProxyUrl: 'https://your-netlify-app.netlify.app/.netlify/functions/proxy?url='
```

### Option 2C: AWS Lambda Proxy Function

Create a Lambda function that proxies requests:

```python
import json
import urllib.request
import urllib.parse

def lambda_handler(event, context):
    target_url = event['queryStringParameters']['url']
    allowed_origin = 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com'
    
    if not target_url.startswith(allowed_origin):
        return {
            'statusCode': 403,
            'body': json.dumps({'error': 'Invalid target URL'})
        }
    
    try:
        req = urllib.request.Request(target_url)
        req.add_header('Content-Type', 'application/json')
        
        if event['httpMethod'] != 'GET':
            req.data = event['body'].encode('utf-8')
        
        response = urllib.request.urlopen(req)
        data = response.read().decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': data
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

## Option 3: Update API Gateway CORS (Best Long-term Solution)

If you have access to your AWS API Gateway configuration:

1. Go to API Gateway Console
2. Select your API
3. Go to **Actions** → **Enable CORS**
4. Add your GitHub Pages domain:
   - `https://marykabulu.github.io`
   - Or use `*` for all origins (less secure)

This is the best solution but requires AWS access.

## Current Configuration

The app is currently set to use **allorigins.win** for GitHub Pages. To change it:

1. Edit `src/environments/environment.prod.ts`
2. Update `corsProxyUrl` with your proxy URL
3. Rebuild and redeploy

## Testing

1. Deploy to GitHub Pages
2. Open browser console
3. Look for: `🔄 Using CORS proxy:` messages
4. Test AI features - they should work now!

## Troubleshooting

**Proxy not working?**
- Check browser console for errors
- Verify `corsProxyUrl` is correct in `environment.prod.ts`
- Test the proxy URL directly in browser

**Still getting CORS errors?**
- Ensure `useCorsProxy: true` in `environment.prod.ts`
- Check that requests are going through the proxy (check Network tab)
- Try a different proxy service

**Rate limiting?**
- Deploy your own proxy (Option 2)
- Or update API Gateway CORS (Option 3)
