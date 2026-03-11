# Hospital Data Filtering Guide

This document explains how hospital users see only their own hospital's data.

## Authentication

When a hospital user logs in, their JWT token contains a `HospitalId` claim that identifies which hospital they manage.

### User Object Structure

```typescript
{
  id: string;
  FullName: string;
  Email: string;
  Role: "hospitaladmin";
  HospitalId: string;  // ← This identifies the hospital
  // ... other fields
}
```

## Implementation Checklist

### ✅ Already Implemented

1. **Auth Context** - `HospitalId` is extracted from JWT and stored in `AuthContext`
2. **Route Protection** - Only `hospitaladmin` role can access `/hospital_user/*` routes
3. **UI Components** - All hospital components import `useAuth()` hook
4. **Centralized API Config** - All API calls use `src/config/api.config.ts` with base URL

### 🔄 When Connecting to Backend API

Replace mock data with API calls filtered by `user.HospitalId`:

#### 1. Dashboard Stats

**File:** `src/features/dashboard/components/HospitalDashboardContent.tsx`

```typescript
import { useAuth } from "@/app/provider/AuthContext";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

const { user } = useAuth();

// Fetch stats for THIS hospital only
const { data } = useQuery(['hospitalStats', user?.HospitalId], 
  () => fetch(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_STATS(user?.HospitalId!)))
    .then(res => res.json())
);
```

**API Endpoint Example:**
```
GET /api/hospitals/{hospitalId}/stats
```

**Base URL:** Configured in `src/config/api.config.ts`
```typescript
export const API_CONFIG = {
  BASE_URL: "https://localhost:7225",
  ENDPOINTS: {
    HOSPITALS: {
      GET_STATS: (id: string) => `/api/hospitals/${id}/stats`,
      // ...
    }
  }
};
```

**Response:**
```json
{
  "assignedRequests": 14,
  "criticalCases": 4,
  "totalBeds": 120,
  "availableBeds": 28,
  "activeCases": 8
}
```

---

#### 2. Assigned Requests

**File:** `src/features/requests/components/HospitalAllRequests.tsx`

```typescript
import { useAuth } from "@/app/provider/AuthContext";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

const { user } = useAuth();

// Fetch only requests assigned to THIS hospital
const { data } = useQuery(['hospitalRequests', user?.HospitalId],
  () => fetch(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_REQUESTS(user?.HospitalId!)))
    .then(res => res.json())
);
```

**API Endpoint Example:**
```
GET /api/hospitals/{hospitalId}/requests
```

**Backend Filtering (Server-Side):**
```sql
SELECT * FROM Requests 
WHERE AssignedHospitalId = @HospitalId
ORDER BY CreatedAt DESC
```

---

#### 3. Hospital Profile

**File:** `src/features/hospitals_management/pages/HospitalProfile.tsx`

```typescript
import { useAuth } from "@/app/provider/AuthContext";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

const { user } = useAuth();

// Load THIS hospital's profile
useEffect(() => {
  if (user?.HospitalId) {
    fetch(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_BY_ID(user.HospitalId)))
      .then(res => res.json())
      .then(data => setForm(data));
  }
}, [user?.HospitalId]);

// Update THIS hospital's profile
const handleSubmit = async (e) => {
  e.preventDefault();
  await fetch(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.UPDATE(user.HospitalId!)), {
    method: 'PUT',
    body: JSON.stringify(form)
  });
};
```

**API Endpoints:**
```
GET /api/hospitals/{hospitalId}
PUT /api/hospitals/{hospitalId}
```

---

#### 4. Request Details

**File:** `src/features/request-details/pages/HospitalRequestDetails.tsx`

```typescript
import { useAuth } from "@/app/provider/AuthContext";
import { getApiUrl, API_CONFIG } from "@/config/api.config";

const { user } = useAuth();
const { id } = useParams();

// Fetch request details - backend should verify it belongs to this hospital
const { data } = useQuery(['requestDetails', id, user?.HospitalId],
  () => fetch(getApiUrl(API_CONFIG.ENDPOINTS.HOSPITALS.GET_REQUESTS(user?.HospitalId!) + `/${id}`))
    .then(res => res.json())
);
```

**Backend Security Check:**
```csharp
var request = await _context.Requests
    .Where(r => r.Id == requestId && r.AssignedHospitalId == hospitalId)
    .FirstOrDefaultAsync();

if (request == null)
    return NotFound(); // Hospital cannot access requests not assigned to them
```

---

## Security Best Practices

### ✅ DO

1. **Always filter on backend** - Never trust frontend filtering
2. **Verify HospitalId** - Backend should check that the authenticated user's `HospitalId` matches the requested resource
3. **Use JWT claims** - Backend extracts `HospitalId` from the JWT token
4. **Return 404** - For requests not belonging to the hospital (don't reveal they exist)

### ❌ DON'T

1. **Don't filter only on frontend** - Hospital users could manipulate requests
2. **Don't expose other hospitals' data** - Backend must enforce restrictions
3. **Don't allow hospitalId in request body** - Use JWT claim, not user input

---

## API Backend Example (C# / ASP.NET)

```csharp
[Authorize(Roles = "HospitalAdmin")]
[HttpGet("api/hospitals/{hospitalId}/requests")]
public async Task<IActionResult> GetHospitalRequests(string hospitalId)
{
    // Extract hospital ID from JWT token
    var userHospitalId = User.FindFirst("HospitalId")?.Value;
    
    // Security: Verify user can only access their own hospital
    if (userHospitalId != hospitalId)
        return Forbid();
    
    // Return only requests for this hospital
    var requests = await _context.Requests
        .Where(r => r.AssignedHospitalId == hospitalId)
        .ToListAsync();
    
    return Ok(requests);
}
```

---

## Testing

When testing hospital user access:

1. **Sign in** as a hospital user
2. **Check `localStorage`** - `auth_user` should contain `HospitalId`
3. **Verify API calls** - Network tab should show `hospitalId` in URLs
4. **Test unauthorized access** - Try accessing another hospital's data (should fail)

---

## Summary

- ✅ Hospital users have `HospitalId` in their auth context
- ✅ All hospital components are ready to use `user.HospitalId`
- 🔄 **Next step:** Replace mock data with API calls that filter by `user.HospitalId`
- 🔒 **Security:** Backend must verify `HospitalId` from JWT matches requested resources
