# File Upload Troubleshooting Guide

## Issue: "Failed to fetch" Error on GitHub Pages

### Root Cause
The CORS proxy (`corsproxy.io`) is failing or blocking the presigned URL request to `/files` endpoint.

### Solutions

#### Option 1: Try a Different CORS Proxy (Quick Fix)

Edit `src/environments/environment.prod.ts`:

```typescript
corsProxyUrl: 'https://api.allorigins.win/raw?url=',
```

Or try:
```typescript
corsProxyUrl: 'https://cors-anywhere.herokuapp.com/',
```

**Note**: Free proxies are unreliable and may have rate limits.

#### Option 2: Deploy Your Own Proxy (Recommended)

See `CORS_PROXY_SETUP.md` for instructions on deploying a Vercel/Netlify/AWS Lambda proxy.

**Benefits**:
- ✅ Reliable
- ✅ No rate limits
- ✅ Better security
- ✅ Full control

#### Option 3: Update API Gateway CORS (Best Long-term Solution)

If you have AWS access, update API Gateway CORS settings:

1. Go to AWS API Gateway Console
2. Select your API → Resources → `/files`
3. Click "Actions" → "Enable CORS"
4. Add allowed origin: `https://marykabulu.github.io`
5. Or use `*` for all origins (less secure)
6. Deploy the API

### Testing

After making changes:

1. **Check browser console** for detailed error messages
2. **Look for these logs**:
   - `📁 File Service: Starting upload`
   - `🔄 Using CORS proxy`
   - `❌ Presigned URL generation failed`

3. **Test the proxy directly**:
   ```javascript
   // In browser console on GitHub Pages
   fetch('https://corsproxy.io/?https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev/files', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ fileName: 'test.txt', contentType: 'text/plain', taskId: '123' })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```

### Current Configuration

- **CORS Proxy**: `corsproxy.io`
- **API Gateway**: `wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev`
- **GitHub Pages**: `marykabulu.github.io/cloudyonce-tasks-angular`

### Next Steps

1. Try Option 1 first (different proxy) - quickest
2. If that fails, deploy your own proxy (Option 2)
3. Long-term: Update API Gateway CORS (Option 3)
