# Scentique

## Current State
Online perfume store with public storefront, shopping cart, and admin panel at `/admin`. Admin uses Internet Identity. Products stored using a Map with preupgrade/postupgrade hooks. Admin roles stored in non-stable memory (wiped on every code push).

## Requested Changes (Diff)

### Add
- Stable variable for admin principal (`stable var adminPrincipal : ?Principal`) so admin persists through upgrades
- Stable variable for products using a flat stable array as the source of truth

### Modify
- Admin registration: first Internet Identity to call `_initializeAccessControlWithSecret` becomes admin, stored in stable var permanently
- `isCallerAdmin`: check against stable `adminPrincipal` instead of the lost-on-upgrade AccessControl state
- All admin-gated functions: check against stable `adminPrincipal`
- `postupgrade`: restore products from stable entries into the working Map

### Remove
- Dependency on `AccessControl.hasPermission` for the admin check (replaced by direct stable var check)
- Non-stable `accessControlState` userRoles map for admin tracking

## Implementation Plan
1. Replace `accessControlState` admin tracking with `stable var adminPrincipal : ?Principal = null`
2. Update all admin permission checks to use `adminPrincipal`
3. Update `_initializeAccessControlWithSecret` to set `adminPrincipal` if not yet set
4. Keep products preupgrade/postupgrade as-is (already stable)
5. Keep MixinStorage and MixinAuthorization includes for blob storage and role assignment API compatibility
