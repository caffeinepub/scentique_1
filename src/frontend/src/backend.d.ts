import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    productId: bigint;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    createdAt: bigint;
    totalAmount: bigint;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    stockQuantity: bigint;
    featured: boolean;
    name: string;
    description: string;
    category: string;
    sizeML: bigint;
    imageId: string;
    priceInCents: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(productData: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listByCategory(category: string): Promise<Array<Product>>;
    listFeatured(): Promise<Array<Product>>;
    listOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(customerName: string, customerEmail: string, items: Array<OrderItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: bigint, updateData: Product): Promise<void>;
}
