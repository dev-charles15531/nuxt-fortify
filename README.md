# 🎉 Nuxt Laravel Fortify and Sanctum Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

This Nuxt module seamlessly integrates Nuxt with Laravel Fortify and Sanctum in an SSR-friendly way, offering a rich set of authentication features. With this module, you can leverage Laravel Fortify's capabilities and perform both API Token and SPA cookie-based authentication.

## 🚀 Features

- **Registration** 📋
- **Reset Passwords** 🔄
- **Email Verification** 📧
- **Update Profile Information** ✏️
- **Update Passwords** 🔐
- **Two-Factor Authentication** 🔒

## 🛠️ Installation and Configuration

To get started, you need to install Laravel Fortify and Sanctum in your backend Laravel application and follow the configuration steps below.

### 🍪 For Cookie Mode

1. **Disable Fortify Views**: Set `'views' => false` in your Fortify config.
2. **Sanctum Configuration**: Follow the steps in the [Sanctum documentation](https://laravel.com/docs/11.x/sanctum#spa-configuration) to configure your First-Party domains.
3. **User Endpoint**: Create a `POST` request endpoint to return the currently authenticated user.
    ```php
    use Illuminate\Http\Request;

    Route::post('/user', function (Request $request) {
        return $request->user();
    })->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')]);
    ```
4. **Override Reset Password Route**: Override the default reset link route.
    ```php
    use Laravel\Fortify\Http\Controllers\NewPasswordController;
    use Laravel\Fortify\RoutePath;

    Route::get(RoutePath::for('password.reset', '/reset-password/{token}'), [NewPasswordController::class, 'create'])
        ->middleware(['guest:' . config('fortify.guard')])
        ->name('password.reset');
    ```

### 🧩 For Token Mode

1. **Fortify Config**:
    - Set `guard` to `'sanctum'`.
    - Set `middleware` to `['api']`.
    - Set `'views' => false`.
2. **Environment Variables**:
    - Set `SANCTUM_STATEFUL_DOMAINS` to `null` in `.env`.
    - Set `supports_credentials` to `false` in your CORS config.
3. **User Endpoint**: Create a `POST` request endpoint to return the currently authenticated user.
    ```php
    use Illuminate\Http\Request;

    Route::post('/user', function (Request $request) {
        return $request->user();
    })->middleware(['auth:sanctum']);
    ```
4. **Login Endpoint**: Create a `POST` request endpoint to authenticate the request.
    ```php
    use Illuminate\Http\Request;
    use App\Models\User;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Validation\ValidationException;
    use Laravel\Fortify\TwoFactorAuthenticatable;

    Route::post('/login', function (Request $request) {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $request->has('device_name') ?
            $user->createToken($request->device_name)->plainTextToken :
            $user->createToken($request->email)->plainTextToken;

        if (
            optional($user)->two_factor_secret &&
            !is_null(optional($user)->two_factor_confirmed_at) &&
            in_array(TwoFactorAuthenticatable::class, class_uses_recursive($user))
        ) {
            return response()->json([
                'two_factor' => true,
                'token' => $token,
            ]);
        } else {
            return response()->json(['token' => $token]);
        }
    });
    ```
5. **Logout Endpoint**: Create a `POST` request endpoint to revoke tokens.
    ```php
    use Illuminate\Http\Request;

    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['logged out']);
    })->middleware('auth:sanctum');
    ```
6. **Override Reset Password Route**: Override the default reset link route.
    ```php
    use Laravel\Fortify\Http\Controllers\NewPasswordController;
    use Laravel\Fortify\RoutePath;

    Route::get(RoutePath::for('password.reset', '/reset-password/{token}'), [NewPasswordController::class, 'create'])
        ->middleware(['guest:' . config('fortify.guard')])
        ->name('password.reset');
    ```
7. **Confirm Password Endpoint**: Override the default confirm password route.
    ```php
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Hash;
    use Laravel\Fortify\Contracts\FailedPasswordConfirmationResponse;
    use Laravel\Fortify\Contracts\PasswordConfirmedResponse;

    Route::post('/user/confirm-password', function (Request $request) {
        $user = $request->user();
        $password = $request->input('password');

        $confirmed = Hash::check($password, $user->password);

        return $confirmed
            ? app(PasswordConfirmedResponse::class)
            : app(FailedPasswordConfirmationResponse::class);
    })->middleware([config('fortify.auth_middleware', 'auth') . ':' . config('fortify.guard')])->name('password.confirm');
    ```
8. **Registration Endpoint**: Override the default register route.
    ```php
    use Illuminate\Http\Request;
    use Laravel\Fortify\Fortify;
    use Laravel\Fortify\Contracts\CreatesNewUsers;
    use Illuminate\Auth\Events\Registered;
    use Illuminate\Support\Str;
    use Laravel\Fortify\Contracts\RegisterResponse;

    Route::post('/register', function (Request $request, CreatesNewUsers $creator) {
        if (config('fortify.lowercase_usernames')) {
            $request->merge([
                Fortify::username() => Str::lower($request->{Fortify::username()}),
            ]);
        }

        event(new Registered($user = $creator->create($request->all())));

        return app(RegisterResponse::class);
    });
    ```
## 💻 Nuxt Configuration

Add the module to your Nuxt project by installing it and configuring it in `nuxt.config.js`.

```javascript
// nuxt.config.js
export default {
  modules: [
    'nuxt-fortify',
  ],
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
}
```

## 📜 Configs

| Key                                | Data Type  | Default Value                           | Required |
|------------------------------------|------------|-----------------------------------------|----------|
| `baseUrl`                          | `string`    | `http://localhost:3000/api`             | Yes      |
| `authMode`                         | `string`    | `cookie`                                | Yes      |
| `loginRoute`                       | `endpoint`  | `/login`                                | No       |
| `authHome`                         | `endpoint`  | `/home`                                 | No       |
| `cookieKey`                        | `string`    | `XSRF-TOKEN`                            | No       |
| `cookieHeader`                     | `string`    | `X-XSRF-TOKEN`                          | No       |
| `tokenStorageKey`                  | `string`    | `API-TOKEN`                             | No       |
| `endpoints.csrf`                   | `endpoint`  | `/sanctum/csrf-cookie`                  | No       |
| `endpoints.login`                  | `endpoint`  | `/login`                                | No       |
| `endpoints.logout`                 | `endpoint`  | `/logout`                               | No       |
| `endpoints.user`                   | `endpoint`  | `/user`                                 | No       |
| `endpoints.tfa.enable`             | `endpoint`  | `/user/two-factor-authentication`       | No       |
| `endpoints.tfa.disable`            | `endpoint`  | `/user/two-factor-authentication`       | No       |
| `endpoints.tfa.code`               | `endpoint`  | `/user/two-factor-qr-code`              | No       |
| `endpoints.tfa.confirm`            | `endpoint`  | `/user/confirmed-two-factor-authentication` | No       |
| `endpoints.tfa.recoveryCode`       | `endpoint`  | `/user/two-factor-recovery-codes`       | No       |
| `endpoints.tfa.challenge`          | `endpoint`  | `/two-factor-challenge`                 | No       |
| `endpoints.register`               | `endpoint`  | `/register`                             | No       |
| `endpoints.resetPassword`          | `endpoint`  | `/forgot-password`                      | No       |
| `endpoints.updatePassword`         | `endpoint`  | `/reset-password`                       | No       |
| `endpoints.confirmPassword`        | `endpoint`  | `/user/confirm-password`                | No       |
| `endpoints.resendEmailVerificationLink` | `endpoint` | `/email/verification-notification`      | No       |
| `intendedRedirect`                 | `boolean`   | `true`                                  | No       |
| `features.registration`            | `boolean`   | `true`                                  | No       |
| `features.resetPasswords`          | `boolean`   | `true`                                  | No       |
| `features.emailVerification`       | `boolean`   | `true`                                  | No       |
| `features.updateProfileInformation` | `boolean`  | `true`                                  | No       |
| `features.updatePasswords`         | `boolean`   | `true`                                  | No       |
| `features.twoFactorAuthentication` | `boolean`   | `true`                                  | No       |
| `tfaRoute`                         | `endpoint`  | `/two-factor-authentication`            | No       |
| `logLevel`                         | `number`    | `1`                                     | No       |
| `origin`                           | `string`    | `http://localhost:3000`                 | Yes      |

### 🌐 Endpoints Configuration

| Endpoint Key                       | Path                     | Request Method              |
|------------------------------------|--------------------------|-----------------------------|
| `csrf`                   | `/sanctum/csrf-cookie`   | `POST`                      |
| `login`                  | `/login`                 | `POST`                      |
| `logout`                 | `/logout`                | `POST`                      |
| `user`                   | `/user`                  | `POST`                      |
| `tfa.enable`             | `/user/two-factor-authentication`   | `POST`           |
| `tfa.disable`            | `/user/two-factor-authentication`   | `DELETE`         |
| `tfa.code`               | `/user/two-factor-qr-code`   | `GET`                   |
| `tfa.confirm`            | `/user/confirmed-two-factor-authentication` | `POST`   |
| `tfa.recoveryCode`       | `/user/two-factor-recovery-codes`           | `GET`    |
| `tfa.challenge`          | `/two-factor-challenge`  | `POST`               |
| `register`               | `/register`              | `POST`               |
| `resetPassword`          | `/forgot-password`       | `POST`               |
| `updatePassword`         | `/reset-password`        | `POST`               |
| `confirmPassword`        | `/user/confirm-password` | `POST`               |
| `resendEmailVerificationLink` | `/email/verification-notification` | `POST`       |

By following these steps and configurations, you'll have a fully integrated Nuxt application with Laravel Fortify and Sanctum, delivering a robust authentication solution. 🚀

## 🤝 Contributing

We welcome contributions to enhance this module. Here are the steps to contribute:

1. **Fork the Repository**: Create a fork of this repository on GitHub.

2. **Clone Your Fork**: Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/dev-charles15531/nuxt-forify.git
    cd nuxt-fortify
    ```

3. **Create a Branch**: Create a new branch for your feature or bug fix.
    ```bash
    git checkout -b feature-or-bugfix-name
    ```

4. **Make Changes**: Implement your feature or bug fix. Ensure your code follows the project's coding standards and passes all tests.

5. **Commit Changes**: Commit your changes with a clear and concise commit message.
    ```bash
    git add .
    git commit -m "Description of the feature or fix"
    ```

6. **Push to Your Fork**: Push your changes to your forked repository.
    ```bash
    git push origin feature-or-bugfix-name
    ```

7. **Open a Pull Request**: Open a pull request to the main repository. Provide a clear description of your changes and the problem or feature they address.

### 📝 Guidelines

- Follow the coding style used in the project.
- Write clear, concise commit messages.
- Ensure your code passes all tests and does not introduce new issues.
- Update documentation if your changes affect how the module is used or configured.

### 📧 Contact

If you have any questions or need help, feel free to open an issue or contact the maintainer of this repository.

Thank you for contributing! Your efforts are greatly appreciated. 🙌

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-fortify/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-fortify

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-fortify.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-fortify

[license-src]: https://img.shields.io/npm/l/nuxt-fortify.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-fortify

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com