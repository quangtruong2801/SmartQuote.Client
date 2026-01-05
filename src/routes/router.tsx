import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { MainLayout } from '../components/Layout/MainLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { MaterialsPage } from '../features/materials/pages/MaterialsPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { QuotationCreatePage } from '../features/quotations/pages/QuotationCreatePage';
import { QuotationsPage } from '../features/quotations/pages/QuotationsPage';
import { LoginPage } from '../pages/LoginPage';
import { UsersPage } from '../features/users/pages/UsersPage';

// 1. Root Route: Thêm logic kiểm tra đăng nhập (beforeLoad)
const rootRoute = createRootRoute({
  component: MainLayout,
  // Trước khi load bất kỳ trang nào, chạy hàm này:
  beforeLoad: ({ location }) => {
    // Kiểm tra xem có token chưa
    const token = localStorage.getItem('ACCESS_TOKEN');
    
    // Nếu chưa có Token VÀ không phải đang ở trang Login
    if (!token && location.pathname !== '/login') {
      return <LoginPage />;
    }
  },
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

// Route khách hàng (/customers)
const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

// Route danh sách báo giá (/quotations)
const quotationsListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotations',
  component: QuotationsPage,
});

// Route tạo báo giá (/quotations/create)
const quotationsCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quotations/create',
  component: QuotationCreatePage,
});

// Route login (/login)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Route danh sách người dùng (/users)
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
});

// 3. Ghép cây route lại
const routeTree = rootRoute.addChildren([indexRoute, materialsRoute, productsRoute, 
  customersRoute, quotationsListRoute, quotationsCreateRoute, loginRoute, usersRoute]);

// 4. Tạo Router instance
export const router = createRouter({ routeTree });

// 5. Đăng ký kiểu dữ liệu cho TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}