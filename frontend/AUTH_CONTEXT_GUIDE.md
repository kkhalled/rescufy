# Authentication Context API - Usage Guide

This document explains how to use the new Context API-based authentication system instead of Redux.

## Overview

The authentication system now uses React Context API to manage user data, replacing the previous Redux-based approach. This provides:

- Simpler state management
- Direct access to user data from the JWT response
- Built-in persistence to localStorage
- Type-safe authentication hooks

---

## Core Components

### 1. **AuthContext** (`src/app/provider/AuthContext.tsx`)

The main context provider that wraps your entire application.

**Features:**
- Stores complete user data from JWT payload
- Manages authentication state
- Auto-restores user from localStorage on app load
- Provides logout functionality

---

## Usage Examples

### Using the `useAuth` Hook

The most basic way to access auth state:

```tsx
import { useAuth } from "@/app/provider/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.FullName}</p>
      <p>Email: {user?.Email}</p>
      <p>Role: {user?.Role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using the `useAuthUser` Hook

For quick access to specific user fields:

```tsx
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export function UserProfile() {
  const {
    getUserFullName,
    getUserEmail,
    getUserRole,
    isAdmin,
    isHospitalUser,
  } = useAuthUser();

  return (
    <div>
      <h1>{getUserFullName()}</h1>
      <p>{getUserEmail()}</p>
      {isAdmin() && <p>You are an admin</p>}
      {isHospitalUser() && <p>You are a hospital user</p>}
    </div>
  );
}
```

### Using Auth Utilities

For token management and validation:

```tsx
import {
  getAuthToken,
  isAuthenticated,
  isTokenExpired,
  clearAuthData,
} from "@/features/auth/utils/auth.utils";

// Check if user is authenticated
if (isAuthenticated()) {
  console.log("User is logged in");
}

// Get the auth token
const token = getAuthToken();

// Check if token is expired
if (isTokenExpired()) {
  console.log("Token has expired");
}

// Clear all auth data
clearAuthData();
```

---

## Data Structure

The user object contains all JWT claim data:

```typescript
interface AuthUser {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; // User ID
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string; // Email
  FullName: string;
  PicUrl: string;
  Email: string;
  UserName: string;
  Role: "admin" | "hospital" | "ambulance";
  SecurityStamp?: string;
  aud?: string; // Audience
  exp?: number; // Expiration time
  iss?: string; // Issuer
  jti?: string; // JWT ID
}
```

---

## Setting User Data

After login, the `SignInForm` automatically stores the user data:

```tsx
const { setUser } = useAuth();

const decoded = jwtDecode<JwtPayload>(data.token);

setUser({
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
  // ... other fields
  Role: decoded.Role.toLowerCase() as "admin" | "hospital" | "ambulance",
  // ... rest of fields
});
```

---

## Protected Routes

The `ProtectedRoute` component now uses Context API:

```tsx
import { useAuth } from "@/app/provider/AuthContext";
import type { Role } from "@/features/auth/types/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && user.Role.toLowerCase() !== requiredRole) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
```

---

## Integration with App

The `AuthProvider` is already wrapped in your `App.tsx`:

```tsx
import { AuthProvider } from "./app/provider/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </Provider>
  );
}
```

---

## Common Patterns

### 1. Show Different Content Based on Role

```tsx
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export function Dashboard() {
  const { isAdmin, isHospitalUser } = useAuthUser();

  return (
    <div>
      {isAdmin() && <AdminDashboard />}
      {isHospitalUser() && <HospitalDashboard />}
    </div>
  );
}
```

### 2. Display User Information

```tsx
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export function UserCard() {
  const { getUserFullName, getUserPicUrl, getUserRole } = useAuthUser();

  return (
    <div className="user-card">
      <img src={getUserPicUrl()} alt="User" />
      <h3>{getUserFullName()}</h3>
      <p>{getUserRole()}</p>
    </div>
  );
}
```

### 3. Logout User

```tsx
import { useAuth } from "@/app/provider/AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="btn btn-danger">
      Logout
    </button>
  );
}
```

### 4. Check Authentication Before Navigating

```tsx
import { useAuth } from "@/app/provider/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProtectedAction() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAction = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    // Perform protected action
  };

  return <button onClick={handleAction}>Protected Action</button>;
}
```

---

## Token Storage

Tokens are stored in `localStorage`:

- **auth_token**: The JWT token
- **auth_user**: The decoded user data (JSON stringified)

To access the token in API calls:

```tsx
import { getAuthToken } from "@/features/auth/utils/auth.utils";

const token = getAuthToken();

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## Migration from Redux

If you still have Redux code, you can safely remove:

- `src/features/auth/store/auth.slice.ts` - No longer needed
- Redux `setRole` and `clearRole` actions
- `useSelector` calls in components

Replace with:

- `useAuth()` hook for general auth state
- `useAuthUser()` hook for specific user fields
- `useAuth().logout()` for logout functionality

---

## Troubleshooting

### "useAuth must be used within an AuthProvider"

Make sure `AuthProvider` wraps your entire app in `App.tsx`.

### User data not persisting after refresh

The data is auto-restored from localStorage. If it's not working:

1. Check if the token is valid in browser DevTools
2. Clear localStorage and login again
3. Check browser console for errors

### Role-based access not working

Ensure the role comparison is case-insensitive:

```tsx
// ✅ Correct
user?.Role.toLowerCase() === "admin"

// ❌ Avoid direct comparison
user?.Role === "Admin"
```

---

## Best Practices

1. **Always check `isLoading`** before rendering protected content
2. **Use `useAuthUser()`** for quick field access
3. **Use `isAuthenticated`** for conditional rendering
4. **Store token in localStorage** with `"auth_token"` key
5. **Use Context API** instead of Redux for auth state
6. **Call `logout()`** to clear all auth data

---

## Files Modified

- `src/app/provider/AuthContext.tsx` - New Context implementation
- `src/app/provider/AuthProvider.ts` - Empty (can be removed)
- `src/App.tsx` - Added AuthProvider wrapper
- `src/app/routes/ProtectedRoute.tsx` - Updated to use Context
- `src/features/auth/components/AuthForm/SignInForm.tsx` - Updated to use useAuth
- `src/features/auth/types/auth.types.ts` - Enhanced JwtPayload type
- `src/features/auth/hooks/useAuthUser.ts` - New utility hook
- `src/features/auth/utils/auth.utils.ts` - New utility functions

---
