# Laravel Backend Setup Guide for GymPro

This guide explains how to set up your Laravel backend to work with the GymPro React frontend.

## 1. Set Up Laravel Sanctum

Laravel Sanctum provides a lightweight authentication system for SPAs (Single Page Applications).

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## 2. Configure CORS in Laravel

Add the following to your `config/cors.php` file:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'https://your-production-domain.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 3. Set Up Authentication Routes in Laravel

In your `routes/api.php` file:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\UserController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Activities
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::post('/activities', [ActivityController::class, 'store']);
    Route::get('/activities/{activity}', [ActivityController::class, 'show']);
    Route::put('/activities/{activity}', [ActivityController::class, 'update']);
    Route::delete('/activities/{activity}', [ActivityController::class, 'destroy']);
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    
    // Memberships
    Route::get('/membership-plans', [MembershipController::class, 'getPlans']);
    Route::get('/my-membership', [MembershipController::class, 'getUserMembership']);
    Route::post('/subscribe', [MembershipController::class, 'subscribe']);
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{user}/verify', [UserController::class, 'verify']);
    });
});
```

## 4. Example Auth Controller

Create `app/Http/Controllers/AuthController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:member,trainer,admin',
        ]);

        $user = User::create([
            'name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_verified' => false, // Requires admin verification
        ]);

        return response()->json([
            'message' => 'User registered successfully. Awaiting account verification.',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Clear previous tokens if you want only one active token per user
        // $user->tokens()->delete();
        
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar,
                'is_verified' => $user->is_verified,
            ]
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
            'avatar' => $request->user()->avatar,
            'is_verified' => $request->user()->is_verified,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'User logged out successfully',
        ]);
    }
}
```

## 5. Admin Middleware

Create `app/Http/Middleware/EnsureUserIsAdmin.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }
        
        return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
    }
}
```

Register it in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ...
    'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
];
```

## 6. Running Your Laravel Backend

```bash
# Start the development server
php artisan serve
```

The server will run on http://localhost:8000 by default.
