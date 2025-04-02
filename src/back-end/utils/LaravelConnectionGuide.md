# Connecting Your GymPro Frontend to Laravel Backend

This guide will help you successfully connect this React application to your Laravel backend.

## 1. Laravel Backend Setup

### CORS Configuration

First, ensure CORS is properly configured in your Laravel backend to allow requests from your frontend:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'https://your-frontend-domain.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### API Routes

Ensure your Laravel routes match the endpoints expected by the frontend:

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Activities
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::post('/activities', [ActivityController::class, 'store']);
    // ... more activity routes
    
    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    // ... more booking routes
    
    // Memberships
    Route::get('/membership-plans', [MembershipController::class, 'getPlans']);
    // ... more membership routes
});
```

### Controllers

Implement the necessary controllers in your Laravel application. For example:

```php
// app/Http/Controllers/AuthController.php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'Invalid login details'
        ], 401);
    }

    $user = User::where('email', $request->email)->firstOrFail();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_verified' => $user->is_verified
        ]
    ]);
}
```

## 2. Frontend Configuration

### Set Environment Variables

In your frontend project:

1. Update `.env` with your local backend URL
2. Update `.env.production` with your production backend URL

### Disable Mock Data

When ready to use your real backend:

1. Open `src/config/api.ts`
2. Set `USE_MOCK_DATA` to `false`

```javascript
// src/config/api.ts
export const USE_MOCK_DATA = false;
```

## 3. Testing the Connection

1. Start your Laravel backend (`php artisan serve`)
2. Start your React frontend (`npm run dev`)
3. Try to login with a user that exists in your Laravel database
4. Check the browser console for any CORS or API errors

## 4. Troubleshooting

### CORS Issues

If you see CORS errors:
- Verify your CORS configuration in Laravel
- Check that your frontend origin is in the allowed origins list
- Make sure `axios` is sending the right headers

### Authentication Issues

If authentication fails:
- Confirm Sanctum is properly configured in Laravel
- Check that you're storing and passing tokens correctly
- Verify user credentials exist in your database

### API Response Format Mismatch

If you see errors about undefined properties:
- Compare your Laravel API responses with what the frontend expects
- Adjust your Laravel controllers to match the expected response format
