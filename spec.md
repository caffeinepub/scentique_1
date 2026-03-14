# Scentique - Online Perfume Store

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public storefront: hero section, product catalog with filtering, product detail view, shopping cart
- Admin panel: login-protected dashboard to manage products (add, edit, delete) and upload product images
- Product model: name, description, price, category (men/women/unisex), size (ml), stock quantity, image
- Cart functionality: add/remove items, view cart, checkout summary (no payment)
- Contact/about page

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: products CRUD (admin only), categories, cart management (session-based in frontend)
2. Authorization component for admin access
3. Blob-storage component for product images
4. Frontend: public storefront pages (home, shop, product detail, cart), admin panel (product list, add/edit product form with image upload)
