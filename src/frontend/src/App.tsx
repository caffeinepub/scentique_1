import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import { CartProvider } from "./hooks/useCart";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShopPage from "./pages/ShopPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductFormPage from "./pages/admin/ProductFormPage";

const hashHistory = createHashHistory();

const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Layout>
        <Outlet />
      </Layout>
    </CartProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminProductNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/product/new",
  component: ProductFormPage,
});

const adminProductEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/product/$id/edit",
  component: ProductFormPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  shopRoute,
  productRoute,
  cartRoute,
  aboutRoute,
  adminRoute,
  adminProductNewRoute,
  adminProductEditRoute,
]);

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
