# Admin Token Setup for UserManagement

To test the UserManagement component with backend integration, you need to set up an admin authentication token.

## Option 1: Set Admin Token in Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Run this command to set a mock admin token:

```javascript
localStorage.setItem('admin_auth_token', 'Bearer your-actual-admin-token-here');
```

## Option 2: Login as Admin First

1. Make sure you have an admin user in your backend
2. Login through the normal authentication flow
3. The system should automatically store the admin token

## Testing the API

If you have a valid admin token, the component will:
- Fetch users from `GET /api/admin/users`
- Allow updating user status via `PUT /api/admin/users/{id}/status`
- Allow deleting users via `DELETE /api/admin/users/{id}`

## Fallback Behavior

If the API calls fail (403 Forbidden), the component will:
- Display sample data instead
- Log the error to console
- Continue to work with local functionality

## Current Backend Data Structure

Based on your API response, users have this structure:
```json
{
  "id": "uuid",
  "fullName": "string",
  "email": "string", 
  "phoneNumber": "string",
  "role": "LAWYER|ADMIN|CLIENT|JUNIOR_LAWYER",
  "status": "ACTIVE|INACTIVE",
  "dateJoined": "ISO date string",
  "firmName": "string",
  "clientCount": number,
  "juniorLawyerCount": number,
  "seniorLawyerName": null,
  "associatedLawyerName": null,
  "caseCount": null
}
```
