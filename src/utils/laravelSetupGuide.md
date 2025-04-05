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

Use the following routes in your `routes/api.php` file:

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SettingController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes - requires authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/user', function (Request $request) {
        return response()->json([
            'data' => $request->user()->load(['member', 'trainer']),
            'message' => 'User retrieved successfully'
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Members
    Route::get('/members', [MemberController::class, 'index']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::get('/members/{member}', [MemberController::class, 'show']);
    Route::put('/members/{member}', [MemberController::class, 'update']);
    Route::delete('/members/{member}', [MemberController::class, 'destroy']);

    // Trainers Routes
    Route::get('/trainers', [TrainerController::class, 'index']);
    Route::post('/trainers', [TrainerController::class, 'store']);
    Route::get('/trainers/{trainer}', [TrainerController::class, 'show']);
    Route::put('/trainers/{trainer}', [TrainerController::class, 'update']);
    Route::delete('/trainers/{trainer}', [TrainerController::class, 'destroy']);
    
    // Activities
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/{activity}', [ActivityController::class, 'show']);
    Route::post('/activities/{activity}/schedules', [ActivityController::class, 'addSchedule']);
    Route::put('/activities/{activity}/schedules/{schedule}', [ActivityController::class, 'updateSchedule']);
    Route::delete('/activities/{activity}/schedules/{schedule}', [ActivityController::class, 'removeSchedule']);
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
    Route::patch('/bookings/{booking}/complete', [BookingController::class, 'complete']);
    
    // Memberships
    Route::get('/membership-plans', [MembershipController::class, 'index']);
    Route::get('/membership-plans/{plan}', [MembershipController::class, 'show']);
    Route::get('/my-membership', [MembershipController::class, 'getMembership']);
    Route::post('/subscribe', [MembershipController::class, 'subscribe']);
    
    // Attendance
    Route::post('/bookings/{booking}/attendance', [AttendanceController::class, 'store']);
    Route::patch('/bookings/{booking}/attendance', [AttendanceController::class, 'update']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    
    // Equipment (For all authenticated users to view)
    Route::get('/equipment', [EquipmentController::class, 'index']);
    
    // Profile updates
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
    // Trainer routes
    Route::middleware('role:trainer,admin')->group(function () {
        // Trainer availability
        Route::get('/trainer/availability', [UserController::class, 'getAvailability']);
        Route::post('/trainer/availability', [UserController::class, 'updateAvailability']);
        
        // Manage activities (create, update, delete)
        Route::post('/activities', [ActivityController::class, 'store']);
        Route::put('/activities/{activity}', [ActivityController::class, 'update']);
        Route::delete('/activities/{activity}', [ActivityController::class, 'destroy']);
    });
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::patch('/users/{user}/verify', [AuthController::class, 'verifyUser']);
        
        // Membership plans management
        Route::post('/membership-plans', [MembershipController::class, 'store']);
        Route::put('/membership-plans/{plan}', [MembershipController::class, 'update']);
        Route::delete('/membership-plans/{plan}', [MembershipController::class, 'destroy']);
        
        // Equipment management
        Route::post('/equipment', [EquipmentController::class, 'store']);
        Route::put('/equipment/{equipment}', [EquipmentController::class, 'update']);
        Route::delete('/equipment/{equipment}', [EquipmentController::class, 'destroy']);
        
        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings/{key}', [SettingController::class, 'update']);
        
        // Payment management
        Route::get('/payments', [PaymentController::class, 'index']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    });
});
```

## 4. Register Custom Role Middleware

Create the role middleware in `app/Http/Middleware/CheckRole.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'Unauthorized. You need '.implode(' or ', $roles).' role to access this resource.'
            ], 403);
        }
        
        return $next($request);
    }
}
```

Then register it in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ... other middleware
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

## 5. Create API Response Format

For consistency, wrap your API responses in a standard format. Create a trait in `app/Traits/ApiResponses.php`:

```php
<?php

namespace App\Traits;

trait ApiResponses
{
    /**
     * Success Response
     *
     * @param  mixed  $data
     * @param  string  $message
     * @param  int  $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data, $message = null, $code = 200)
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Error Response
     *
     * @param  string  $message
     * @param  int  $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse($message, $code)
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'data' => null
        ], $code);
    }
}
```

Use this trait in your controllers like this:

```php
use App\Traits\ApiResponses;

class YourController extends Controller
{
    use ApiResponses;
    
    public function index()
    {
        return $this->successResponse($data, 'Data retrieved successfully');
    }
}
```

## 6. Running Your Laravel Backend

Make sure to set the right environment variables in your `.env` file:

```
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

Then start your Laravel server:

```bash
php artisan serve
```

Your API will be available at http://localhost:8000/api.

## 7. Integration with Frontend

On your React frontend, set the API URL environment variable:

```
VITE_API_URL=http://localhost:8000/api
```

This will ensure your frontend connects to your Laravel backend properly.
