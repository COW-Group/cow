# Vercel Deployment Guide

This guide explains how to deploy each app in the cow monorepo as individual Vercel projects.

## Apps Available for Deployment

| App | Type | Vercel Config | Build Command |
|-----|------|---------------|---------------|
| **mauna-app** | Next.js | `apps/mauna-app/vercel.json` | `npm run build:mauna-app` |
| **platform-app** | React/Webpack | `apps/platform-app/vercel.json` | `npm run build:platform-app` |
| **missions-app** | React/Webpack | `apps/missions-app/vercel.json` | `npm run build:missions-app` |
| **public-site** | React/Webpack | `apps/public-site/vercel.json` | `npm run build:public-site` |
| **products-site** | React/Webpack | `apps/products-site/vercel.json` | `npm run build:products-site` |
| **support-center** | React/Webpack | `apps/support-center/vercel.json` | `npm run build:support-center` |
| **admin-portal** | React/Webpack | `apps/admin-portal/vercel.json` | `npm run build:admin-portal` |

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy each app individually**:
   ```bash
   # Navigate to each app directory and deploy
   cd apps/mauna-app && vercel --prod
   cd ../platform-app && vercel --prod
   cd ../missions-app && vercel --prod
   cd ../public-site && vercel --prod
   cd ../products-site && vercel --prod
   cd ../support-center && vercel --prod
   cd ../admin-portal && vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Create New Project**: For each app, create a new Vercel project
3. **Configure Project Settings**:
   - **Root Directory**: Set to the app's directory (e.g., `apps/mauna-app`)
   - **Framework Preset**:
     - Next.js for `mauna-app`
     - Other for React apps
   - **Build Settings**: Will be automatically detected from `vercel.json`

### Option 3: GitHub Integration (Recommended)

1. **Set up GitHub Integration**: Connect your repo to Vercel
2. **Configure Branch Deployment**:
   - Create separate branches for each app if needed
   - Or use path-based deployment with Vercel's monorepo support

## Environment Variables

Make sure to set up environment variables for each app in the Vercel dashboard:

- Database URLs
- API keys
- Authentication secrets
- Third-party service credentials

## Custom Domains

Once deployed, you can configure custom domains for each app:

- `mauna-app`: `app.cyclesofwealth.com`
- `platform-app`: `platform.cyclesofwealth.com`
- `missions-app`: `missions.cyclesofwealth.com`
- `public-site`: `cyclesofwealth.com`
- `products-site`: `products.cyclesofwealth.com`
- `support-center`: `support.cyclesofwealth.com`
- `admin-portal`: `admin.cyclesofwealth.com`

## Monitoring

Each deployed app will have its own:
- Analytics dashboard
- Performance monitoring
- Error tracking
- Deployment logs

## Notes

- All apps are configured to install dependencies from the monorepo root
- Build commands run from the root directory to leverage shared dependencies
- React apps use SPA routing with fallback to `index.html`
- Next.js app (mauna-app) uses server-side rendering capabilities