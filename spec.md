# Scentique

## Current State
Online perfume store with public storefront, shopping cart, and admin panel at `/#/admin`. Uses Internet Identity for admin authentication. Products and orders are stored in stable storage.

## Requested Changes (Diff)

### Add
- Stable storage for admin/user role assignments so they persist across upgrades
- `.ic-assets.json5` for ICP asset canister SPA routing fallback
- `404.html` redirect for direct URL access

### Modify
- `main.mo`: save/restore access control state (adminAssigned + userRoles) in pre/postupgrade hooks

### Remove
- Nothing removed

## Implementation Plan
1. Add `stableAdminAssigned` and `stableUserRolesEntries` stable variables to main.mo
2. In preupgrade: serialize access control state to stable vars
3. In postupgrade: restore access control state from stable vars
4. Add `.ic-assets.json5` to public folder for SPA routing
5. Deploy
