import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Edit,
  LogOut,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Product } from "../../backend";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAddProduct,
  useDeleteProduct,
  useIsAdmin,
  useListOrders,
  useListProducts,
} from "../../hooks/useQueries";

const SAMPLE_PRODUCTS: Omit<Product, "id">[] = [
  {
    name: "Midnight Cedar",
    description:
      "A smoldering blend of cedarwood, black pepper, and vetiver. Opens with sharp spice and settles into an earthy, resinous depth that commands attention.",
    priceInCents: 14800n,
    category: "men",
    sizeML: 100n,
    stockQuantity: 25n,
    featured: true,
    imageId: "/assets/generated/perfume-noir.dim_800x800.jpg",
  },
  {
    name: "Rose Imperiale",
    description:
      "Exquisite Bulgarian rose absolute entwined with warm white musk and a hint of raspberry. Feminine, bold, unforgettable.",
    priceInCents: 18500n,
    category: "women",
    sizeML: 75n,
    stockQuantity: 18n,
    featured: true,
    imageId: "/assets/generated/perfume-rose.dim_800x800.jpg",
  },
  {
    name: "Desert Oud",
    description:
      "Rare oud wood from the Arabian peninsula fused with amber, saffron, and a whisper of smoke. A unisex masterpiece that evolves across the day.",
    priceInCents: 22000n,
    category: "unisex",
    sizeML: 50n,
    stockQuantity: 12n,
    featured: true,
    imageId: "/assets/generated/perfume-oud.dim_800x800.jpg",
  },
  {
    name: "La Fleur de Paris",
    description:
      "A luminous bouquet of jasmine, ylang-ylang, and iris, anchored by warm sandalwood. Timeless, effervescent, and utterly Parisian.",
    priceInCents: 15500n,
    category: "women",
    sizeML: 100n,
    stockQuantity: 30n,
    featured: false,
    imageId: "/assets/generated/perfume-fleur.dim_800x800.jpg",
  },
  {
    name: "Aqua Profonda",
    description:
      "Cool marine notes with bergamot and grapefruit on a base of white cedar and musk. Like standing at the water's edge at dawn.",
    priceInCents: 9800n,
    category: "men",
    sizeML: 100n,
    stockQuantity: 40n,
    featured: false,
    imageId: "/assets/generated/perfume-aqua.dim_800x800.jpg",
  },
  {
    name: "Obsidian Noir",
    description:
      "Dark incense, labdanum, and smoked sandalwood create an intensely meditative aura. For those who move through the world on their own terms.",
    priceInCents: 19500n,
    category: "unisex",
    sizeML: 50n,
    stockQuantity: 15n,
    featured: false,
    imageId: "/assets/generated/perfume-obsidian.dim_800x800.jpg",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: products, isLoading: productsLoading } = useListProducts();
  const { data: orders, isLoading: ordersLoading } = useListOrders();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: addProduct } = useAddProduct();

  // Seed sample data if empty
  useEffect(() => {
    if (!products || products.length > 0 || !isAdmin) return;
    const seed = async () => {
      try {
        await Promise.all(
          SAMPLE_PRODUCTS.map((p) => addProduct({ ...p, id: 0n })),
        );
        toast.success("Sample products added!");
      } catch {
        // silent
      }
    };
    seed();
  }, [products, isAdmin, addProduct]);

  if (!identity) {
    return <LoginPrompt />;
  }

  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Skeleton className="w-48 h-4 mx-auto mb-3" />
          <Skeleton className="w-32 h-3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  const handleDelete = async (id: bigint) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const handleLogout = async () => {
    await clear();
    qc.clear();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <Toaster richColors position="top-right" />
      {/* Admin Header */}
      <header className="bg-foreground text-background px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-display text-xl text-background opacity-70 hover:opacity-100 transition-opacity"
          >
            Scentique
          </Link>
          <span className="text-background opacity-30">/</span>
          <span className="font-sans text-sm font-medium tracking-widest uppercase opacity-80">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs opacity-50 hidden sm:block">
            {identity.getPrincipal().toString().slice(0, 20)}…
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-background hover:bg-white/10 font-sans text-xs tracking-widest uppercase"
          >
            <LogOut className="w-3 h-3 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-card p-6 flex items-center gap-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">
                Products
              </p>
              <p className="font-display text-3xl text-foreground">
                {products?.length ?? 0}
              </p>
            </div>
          </div>
          <div className="bg-card p-6 flex items-center gap-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">
                Orders
              </p>
              <p className="font-display text-3xl text-foreground">
                {orders?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-card mb-8">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h2 className="font-display text-2xl text-foreground">Products</h2>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-xs tracking-widest uppercase"
              data-ocid="admin.add_product.button"
            >
              <Link to="/admin/product/new">
                <Plus className="w-3 h-3 mr-1" /> Add Product
              </Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            {productsLoading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !products || products.length === 0 ? (
              <div
                className="p-12 text-center"
                data-ocid="admin.products.empty_state"
              >
                <p className="font-sans text-muted-foreground">
                  No products yet. Adding sample products…
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                      Featured
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <motion.tr
                      key={product.id.toString()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                      data-ocid={`admin.product.item.${i + 1}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-sans text-sm text-foreground font-medium">
                          {product.name}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {product.sizeML.toString()}ml
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="font-sans text-xs capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-sm text-primary">
                          ${(Number(product.priceInCents) / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-sans text-sm">
                          {product.stockQuantity.toString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        {product.featured ? (
                          <Badge className="bg-primary text-primary-foreground font-sans text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <span className="font-sans text-xs text-muted-foreground">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="font-sans text-xs"
                            data-ocid={`admin.product.edit_button.${i + 1}`}
                          >
                            <Link
                              to="/admin/product/$id/edit"
                              params={{ id: product.id.toString() }}
                            >
                              <Edit className="w-3 h-3 mr-1" /> Edit
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive font-sans text-xs"
                                data-ocid={`admin.product.delete_button.${i + 1}`}
                              >
                                <Trash2 className="w-3 h-3 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="admin.product.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display text-xl">
                                  Delete Product?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  This will permanently delete{" "}
                                  <strong>{product.name}</strong>. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  className="font-sans text-xs tracking-widest uppercase"
                                  data-ocid="admin.product.cancel_button"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-destructive text-destructive-foreground font-sans text-xs tracking-widest uppercase"
                                  data-ocid="admin.product.confirm_button"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Orders */}
        <div className="bg-card">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="font-display text-2xl text-foreground">
              Recent Orders
            </h2>
          </div>
          {ordersLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="admin.orders.empty_state"
            >
              <p className="font-sans text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left px-6 py-3 font-sans text-xs tracking-widest uppercase text-muted-foreground hidden sm:table-cell">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr
                      key={order.id.toString()}
                      className="border-b border-border last:border-0"
                      data-ocid={`admin.orders.item.${i + 1}`}
                    >
                      <td className="px-6 py-4 font-sans text-sm text-muted-foreground">
                        #{order.id.toString()}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-foreground">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-muted-foreground hidden md:table-cell">
                        {order.customerEmail}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-primary">
                        ${(Number(order.totalAmount) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm hidden sm:table-cell">
                        {order.items.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <Toaster richColors position="top-right" />
      <div className="text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-background/50 mb-4">
          Admin Panel
        </p>
        <h1 className="font-display text-5xl text-background mb-4">
          Scentique
        </h1>
        <p className="font-sans text-background/60 mb-8">
          Please sign in to access the admin panel.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === "logging-in"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-8 py-6"
        >
          {loginStatus === "logging-in" ? "Signing In…" : "Sign In"}
        </Button>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen bg-foreground flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-5xl text-background mb-4">
          Access Denied
        </h1>
        <p className="font-sans text-background/60 mb-8">
          You do not have admin privileges.
        </p>
        <Button
          asChild
          variant="outline"
          className="border-white/30 text-background hover:bg-white/10 font-sans text-sm tracking-widest uppercase"
        >
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
