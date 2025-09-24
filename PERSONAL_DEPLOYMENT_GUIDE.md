# Personal Account Deployment Guide

## Issue Identified
The Vercel CLI is automatically linking projects to the `cow-group` team account instead of your personal account (`cowgirllikki`). This happens because existing projects with the same names already exist in the team.

## Solution: Deploy via Vercel Dashboard

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Make sure you're on your **personal account** (`cowgirllikki`), not the team account
3. If you're on the team account, click your profile and switch to personal

### Step 2: Import Repository
1. Click "Add New Project"
2. Import your GitHub repository: `cow`
3. You'll create **7 separate projects**, one for each app

### Step 3: Configure Each App

#### Project 1: Mauna App
- **Project Name**: `cow-mauna-app`
- **Root Directory**: `apps/mauna-app`
- **Framework Preset**: `Next.js`
- **Build Command**: `cd ../.. && npm run build:mauna-app`
- **Output Directory**: `.next`
- **Install Command**: `cd ../.. && npm install`

#### Project 2: Platform App
- **Project Name**: `cow-platform-app`
- **Root Directory**: `apps/platform-app`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:platform-app`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

#### Project 3: Missions App
- **Project Name**: `cow-missions-app`
- **Root Directory**: `apps/missions-app`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:missions-app`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

#### Project 4: Public Site
- **Project Name**: `cow-public-site`
- **Root Directory**: `apps/public-site`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:public-site`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

#### Project 5: Products Site
- **Project Name**: `cow-products-site`
- **Root Directory**: `apps/products-site`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:products-site`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

#### Project 6: Support Center
- **Project Name**: `cow-support-center`
- **Root Directory**: `apps/support-center`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:support-center`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

#### Project 7: Admin Portal
- **Project Name**: `cow-admin-portal`
- **Root Directory**: `apps/admin-portal`
- **Framework Preset**: `Other`
- **Build Command**: `cd ../.. && npm run build:admin-portal`
- **Output Directory**: `dist`
- **Install Command**: `cd ../.. && npm install`

### Step 4: Environment Variables
For each app, add necessary environment variables in the project settings.

### Step 5: Custom Domains (Optional)
Once deployed, you can configure custom domains:
- `cow-mauna-app` → `app.cowgirllikki.com`
- `cow-platform-app` → `platform.cowgirllikki.com`
- `cow-missions-app` → `missions.cowgirllikki.com`
- `cow-public-site` → `cowgirllikki.com`
- `cow-products-site` → `products.cowgirllikki.com`
- `cow-support-center` → `support.cowgirllikki.com`
- `cow-admin-portal` → `admin.cowgirllikki.com`

## Alternative: CLI with Project Names
If you prefer CLI, you can try:
1. Delete existing team projects first
2. Use `vercel --prod --yes` from each app directory
3. When prompted for project name, use different names than the team projects

## Expected URLs After Deployment
Each app will get a URL like:
- `https://cow-mauna-app-[hash].vercel.app`
- `https://cow-platform-app-[hash].vercel.app`
- etc.

This approach ensures all projects are created under your personal account rather than the team account.