# @cow/supabase-client

Shared Supabase client package for the COW monorepo.

## Purpose

Provides a consistent, configured Supabase client across all apps in the monorepo:
- missions-app
- mauna-app
- admin-portal
- platform-app
- support-center

## Features

- ✅ Single source of truth for Supabase configuration
- ✅ Consistent auth behavior across apps
- ✅ Type-safe client exports
- ✅ Environment variable support (Next.js and React)
- ✅ Singleton pattern to avoid multiple instances

## Installation

This package is internal to the COW monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@cow/supabase-client": "workspace:*"
  }
}
```

## Usage

### Import the singleton client

```typescript
import { supabase } from '@cow/supabase-client';

// Use directly in your code
const { data, error } = await supabase
  .from('boards')
  .select('*');
```

### Create a custom client (advanced)

```typescript
import { createSupabaseClient } from '@cow/supabase-client';

const customClient = createSupabaseClient({
  url: 'https://custom.supabase.co',
  anonKey: 'custom-key',
  options: {
    auth: {
      autoRefreshToken: false
    }
  }
});
```

## Environment Variables

Set these in your app's `.env.local`:

```bash
# Next.js apps (mauna-app, admin-portal, etc.)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# React apps (missions-app)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Configuration

The client is pre-configured with:

```typescript
{
  auth: {
    autoRefreshToken: true,   // Automatically refresh expired tokens
    persistSession: true,      // Persist session in localStorage
    detectSessionInUrl: true   // Handle OAuth callbacks
  }
}
```

## Migration from App-Specific Clients

### Before (app-specific client):

```typescript
// In missions-app/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### After (shared client):

```typescript
// In any app
import { supabase } from '@cow/supabase-client';

// Use directly - no setup needed!
const { data } = await supabase.from('boards').select('*');
```

## Benefits

1. **Consistency**: All apps use the same Supabase configuration
2. **Maintainability**: Update auth config in one place
3. **Type Safety**: TypeScript definitions included
4. **DRY**: Don't repeat client setup code in every app

## Development

Build the package:

```bash
cd packages/supabase-client
npm install
npm run build
```

Watch for changes:

```bash
npm run dev
```

## Related Packages

- `@cow/shared-types` - Shared TypeScript types for database entities
- `@cow/shared-ui` - Shared UI components (future)
- `@cow/shared-utils` - Shared utility functions (future)
