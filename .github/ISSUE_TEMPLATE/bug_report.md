Here is a refined and detailed version of the bug report issue template to ensure clarity and completeness when reporting bugs:

```markdown
---
name: Bug report
about: Create a report for a bug or incorrect behavior of the project
title: '[Bug] Short description'
labels: bug
assignees: dev-charles15531
---

## 🐛 Bug Report

### 📋 Description

A clear and concise description of what the bug is.

### 🛠️ To Reproduce

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

### ✅ Expected Behavior

A clear and concise description of what you expected to happen.

### 📸 Screenshots

If applicable, add screenshots to help explain your problem.

### ℹ️ Module Information

- **Version**: <INSTALLED_MODULE_VERSION>
- **Complete Configuration of `nuxtFortify` from your `nuxt.config.ts`**:

```typescript
export default defineNuxtConfig({
    modules: ['nuxt-fortify'],

    nuxtFortify: {
        baseUrl: 'http://localhost:3000/api',
        origin: 'http://localhost:3000',
        authMode: 'cookie',
        authHome: '/dashboard',
        endpoints: {
        csrf: '/sanctum/csrf-cookie',
        user: '/user',
        // other endpoints...
        },
        features: {
            registration: true,
            resetPasswords: true,
            twoFactorAuthentication: true,
        // other features...
        }
        // other configurations...
    }
    },
});
```

### 🌐 Nuxt Environment

- **Version**: YOUR_NUXT_VERSION
- **SSR Enabled**: (yes / no)
- **Environment**: (local / production)

### 🖥️ Laravel Environment

- **Version**: YOUR_LARAVEL_VERSION
- **Sanctum installed via Breeze**: (yes / no)
- **Session Domain from your `config/session.php`**: [e.g. `domain.test`]
- **List of Stateful Domains from your `config/sanctum.php`**:

```php
return [
    'stateful' => explode(
        ',',
        env(
            'SANCTUM_STATEFUL_DOMAINS',
            sprintf('%s','localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1')
        )
    ),
];
```

or

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000
```

- **CORS Settings from your `config/cors.php`**:

```php
return [
    'paths' => ['*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 📜 Additional Context

Add any other context about the problem here. For instance, you can attach the details about the request/response of the application or logs from the backend to make this problem easier to understand.
