# GitHub Pages Deployment Guide

This guide will help you deploy your Angular application to GitHub Pages so recruiters can view it.

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository

## Step-by-Step Instructions

### 1. Push Your Code to GitHub

If you haven't already, create a repository on GitHub and push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cloudyonce-tasks-angular.git
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your actual GitHub username.

### 2. Update the Base Href (if needed)

If your repository name is different from `cloudyonce-tasks-angular`, you need to update the base href in two places:

1. **package.json** - Update the `build:gh-pages` script:
   ```json
   "build:gh-pages": "ng build --configuration production --base-href /YOUR_REPO_NAME/"
   ```

2. **404.html** - Update the base href:
   ```html
   <base href="/YOUR_REPO_NAME/">
   ```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
5. Save the settings

### 4. Enable GitHub Actions Permissions

1. Still in **Settings**, go to **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### 5. Trigger the Deployment

The GitHub Actions workflow will automatically run when you:
- Push to the `main` or `master` branch
- Or manually trigger it from the **Actions** tab

To manually trigger:
1. Go to the **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

### 6. Access Your Deployed App

Once the workflow completes successfully, your app will be available at:

```
https://YOUR_USERNAME.github.io/cloudyonce-tasks-angular/
```

You can find the exact URL in:
- Repository **Settings** → **Pages** section
- Or in the workflow run output

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### 404 Errors on Routes
- Make sure `404.html` is copied to the build output
- Verify the base href matches your repository name
- Check that the workflow step "Copy 404.html for routing support" ran successfully

### Assets Not Loading
- Ensure the base href is correct (must include trailing slash)
- Check browser console for 404 errors on assets
- Verify paths in your components use relative paths or the base href

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Copy 404.html for routing support
cp 404.html dist/cloudyonce-tasks-angular/browser/404.html

# Then push the dist/cloudyonce-tasks-angular/browser folder to gh-pages branch
```

## Notes

- The deployment uses GitHub Actions for automatic builds
- Each push to main/master will trigger a new deployment
- The app uses Angular's PathLocationStrategy (clean URLs, no hash)
- The 404.html file handles routing for direct URL access

## Custom Domain (Optional)

If you want to use a custom domain:
1. Add a `CNAME` file in `src/assets/` with your domain
2. Configure DNS settings with your domain provider
3. Update the base href to `/` instead of `/cloudyonce-tasks-angular/`
