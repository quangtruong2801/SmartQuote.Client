import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { MainLayout } from '../components/Layout/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { MaterialsPage } from '../features/materials/pages/MaterialsPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';

// 1. Tạo Root Route (Layout chính bao trùm tất cả)
const rootRoute = createRootRoute({
  component: MainLayout,
});

// 2. Định nghĩa các Route con
// Route trang chủ (/)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// Route vật tư (/materials)
const materialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/materials',
  component: MaterialsPage,
});

// Route sản phẩm (/products)
const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

// 3. Ghép cây route lại
const routeTree = rootRoute.addChildren([indexRoute, materialsRoute, productsRoute]);

// 4. Tạo Router instance
export const router = createRouter({ routeTree });

// 5. Đăng ký kiểu dữ liệu cho TypeScript (Cực quan trọng để có gợi ý code)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}