# Cloudyoncé Tasks ✨

A modern Angular task management application with AI-powered insights using AWS services.

## 🚀 Project Overview

Cloudyoncé Tasks is a sophisticated task management application built with Angular 17 that leverages AWS AI services for intelligent task analysis, sentiment detection, language processing, and audio reminders.

### ✨ Key Features

- **Task Management**: Create, edit, and organize tasks with due dates
- **AI-Powered Insights**: Sentiment analysis, language detection, and categorization
- **File Attachments**: Upload and analyze images using AWS Rekognition
- **Audio Reminders**: Text-to-speech reminders using AWS Polly
- **Multi-language Support**: Translation services via AWS Translate
- **Analytics Dashboard**: Visual insights into task patterns and productivity
- **Dark/Light Theme**: Modern UI with theme switching
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Angular 17** - Modern web framework with standalone components
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming for HTTP requests

### Backend & AI Services
- **AWS API Gateway** - RESTful API endpoints
- **AWS Lambda** - Serverless functions
- **AWS Comprehend** - Sentiment analysis and language detection
- **AWS Translate** - Multi-language translation
- **AWS Polly** - Text-to-speech conversion
- **AWS Rekognition** - Image analysis and labeling
- **AWS S3** - File storage for attachments

### Deployment
- **Vercel** - Frontend hosting and deployment
- **AWS** - Backend services and infrastructure

## 📁 Project Structure

```
cloudyonce-tasks-angular/
├── src/
│   ├── app/
│   │   ├── components/          # Angular components
│   │   │   ├── analytics/       # Analytics dashboard
│   │   │   ├── nav-bar/         # Navigation component
│   │   │   ├── settings/        # App settings
│   │   │   ├── task-detail/     # Task detail view
│   │   │   ├── task-form/       # Task creation form
│   │   │   ├── task-item/       # Task list item
│   │   │   └── task-list/       # Task list view
│   │   ├── models/              # TypeScript interfaces
│   │   ├── services/            # Angular services
│   │   │   ├── ai.service.ts    # AWS AI services integration
│   │   │   ├── file.service.ts  # File upload handling
│   │   │   ├── settings.service.ts # App settings
│   │   │   └── task.service.ts  # Task management
│   │   └── app.routes.ts        # Application routing
│   ├── environments/            # Environment configurations
│   └── styles.css              # Global styles
├── tailwind.config.js          # Tailwind CSS configuration
├── angular.json                # Angular CLI configuration
├── vercel.json                 # Vercel deployment config
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- AWS Account with configured services
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudyonce-tasks-angular
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `src/environments/environment.ts` for development:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://your-api-gateway-url.amazonaws.com/Dev',
     enableLogging: true
   };
   ```

   Update `src/environments/environment.prod.ts` for production:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-api-gateway-url.amazonaws.com/Dev',
     enableLogging: false
   };
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4200`

## 🏗️ Build & Deployment

### Development Build
```bash
# Fast development build (optimized for speed)
npm run build:fast

# Development build with source maps
npm run build
```

### Production Build
```bash
# Optimized production build
npm run build:prod
```

### Deployment to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

## ⚙️ AWS Configuration

### Required AWS Services

1. **API Gateway**: RESTful API endpoints
2. **Lambda Functions**: Serverless backend logic
3. **S3 Bucket**: File storage for attachments
4. **Comprehend**: Text analysis and sentiment detection
5. **Translate**: Multi-language translation
6. **Polly**: Text-to-speech conversion
7. **Rekognition**: Image analysis

### API Endpoints

The application expects the following API endpoints:

- `POST /ai/analyze` - Text sentiment analysis
- `POST /ai/translate` - Text translation
- `POST /ai/polly` - Text-to-speech generation
- `POST /ai/image-analyze` - Image analysis
- `POST /files` - File upload (presigned URL generation)
- `GET /tasks` - Retrieve tasks
- `POST /tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## 🐛 Known Issues & Troubleshooting

### Issue 1: CORS Errors on Vercel Deployment

**Problem**: AWS AI services work locally but fail on Vercel with CORS errors.

**Error Message**:
```
Access to XMLHttpRequest at 'https://wnrph10p1c.execute-api.us-east-1.amazonaws.com/Dev/files' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
The 'Access-Control-Allow-Origin' header has a value 'http://localhost:4200' 
that is not equal to the supplied origin.
```

**Root Cause**: AWS API Gateway CORS configuration only allows `http://localhost:4200` but Vercel app runs on a different domain.

**Solutions Attempted**:
1. ❌ Vercel proxy configuration (`/api/*` rewrites)
2. ❌ Environment-based API URL switching
3. ❌ Custom CORS headers in vercel.json

**Recommended Solution**: Update AWS API Gateway CORS settings

1. **Via AWS Console**:
   - Go to AWS API Gateway console
   - Select your API
   - For each resource, enable CORS with:
     - **Access-Control-Allow-Origin**: `*` or your Vercel domain
     - **Access-Control-Allow-Headers**: `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
     - **Access-Control-Allow-Methods**: `GET,POST,PUT,DELETE,OPTIONS`
   - Deploy the API

2. **Via Lambda Functions**:
   ```python
   return {
       'statusCode': 200,
       'headers': {
           'Access-Control-Allow-Origin': '*',
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token',
           'Content-Type': 'application/json'
       },
       'body': json.dumps(response_data)
   }
   ```

### Issue 2: Slow Build Times

**Problem**: Initial builds were taking 10+ seconds due to Tailwind CSS processing.

**Solution**: Implemented aggressive Tailwind optimizations:
- Disabled 50+ unused core plugins
- Optimized content scanning paths
- Created separate dev/prod configurations
- Added safelist for dynamic classes

**Result**: 40-60% faster build times

### Issue 3: Angular 17 Output Directory

**Problem**: Vercel 404 errors due to incorrect output directory configuration.

**Solution**: Updated `vercel.json` to use `dist/cloudyonce-tasks-angular/browser/` (Angular 17's new output structure)

## 🔧 Performance Optimizations

### Tailwind CSS Optimizations
- **Content Scanning**: Only scans component files
- **Core Plugins**: Disabled unused features (transforms, filters, etc.)
- **Safelist**: Preserves dynamic classes
- **Environment Configs**: Fast dev config, optimized prod config

### Angular Optimizations
- **Standalone Components**: Reduced bundle size
- **Lazy Loading**: Route-based code splitting
- **OnPush Change Detection**: Improved performance
- **Tree Shaking**: Automatic unused code removal

### Build Scripts
```json
{
  "start": "cross-env NODE_ENV=development ng serve",
  "start:fast": "cross-env NODE_ENV=development ng serve --configuration development",
  "build:fast": "cross-env NODE_ENV=development ng build --configuration development --source-map=false --optimization=false",
  "build:prod": "cross-env NODE_ENV=production ng build --configuration production",
  "build:analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/cloudyonce-tasks-angular/stats.json"
}
```

## 📊 Bundle Analysis

To analyze bundle size and identify optimization opportunities:

```bash
npm run build:analyze
```

This generates a visual report showing:
- Bundle composition
- Largest dependencies
- Code splitting effectiveness
- Optimization opportunities

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run e2e
```

### AI Service Testing
The application includes an AI test service (`ai-test.service.ts`) for testing all AI endpoints:

```typescript
// Test all AI endpoints
this.aiTestService.testAllEndpoints().subscribe(results => {
  console.log('AI Service Test Results:', results);
});
```

## 🔐 Security Considerations

### Environment Variables
- Never commit API keys or secrets to version control
- Use environment-specific configurations
- Implement proper CORS policies

### AWS Security
- Use IAM roles with minimal required permissions
- Enable CloudTrail for API monitoring
- Implement rate limiting on API Gateway
- Use VPC endpoints for internal communication

## 📈 Monitoring & Logging

### Development
- Console logging enabled via `environment.enableLogging`
- Detailed error messages and stack traces
- Network request/response logging

### Production
- AWS CloudWatch integration
- Error tracking and alerting
- Performance monitoring
- Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for new features
- Update documentation for API changes
- Test on multiple browsers and devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. Check the [Known Issues](#-known-issues--troubleshooting) section
2. Review AWS service configurations
3. Verify environment variables
4. Check browser console for errors
5. Review Vercel deployment logs

For additional support, please open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time task synchronization
- [ ] Team collaboration features
- [ ] Mobile app (Ionic/React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with calendar applications
- [ ] Voice-to-text task creation
- [ ] AI-powered task prioritization
- [ ] Offline support with PWA
- [ ] Custom AI model training
- [ ] API rate limiting and caching

---

**Built with ❤️ using Angular, AWS, and modern web technologies**