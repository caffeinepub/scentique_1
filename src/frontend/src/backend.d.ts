import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    stockQuantity: bigint;
    featured: boolean;
    name: string;
    description: string;
    category: string;
    sizeML: bigint;
    imageId: string;
    priceInCents: bigint;
}
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
export interface backendInterface {
    claimAdmin(): Promise<boolean>;
    isCallerAdminSimple(): Promise<boolean>;
    addProduct(productData: ProductInput): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getProduct(id: bigint): Promise<Product | null>;
    isCallerAdmin(): Promise<boolean>;
    listByCategory(category: string): Promise<Array<Product>>;
    listFeatured(): Promise<Array<Product>>;
    listOrders(): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    placeOrder(customerName: string, customerEmail: string, items: Array<OrderItem>): Promise<bigint>;
    updateProduct(id: bigint, updateData: ProductInput): Promise<void>;
}
