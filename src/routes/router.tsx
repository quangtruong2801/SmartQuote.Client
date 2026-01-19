import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';

import { MainLayout } from '../components/Layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

import { MaterialsPage } from '../features/materials/pages/MaterialsPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { QuotationsPage } from '../features/quotations/pages/QuotationsPage';
import { QuotationCreatePage } from '../features/quotations/pages/QuotationCreatePage';
import { UsersPage } from '../features/users/pages/UsersPage';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    if (localStorage.getItem('ACCESS_TOKEN')) {
      throw redirect({ to: '/' });
    }
  },
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_layout', 
  component: MainLayout, //Header & Sidebar nằm ở đây
  
  beforeLoad: ({ location }) => {
    if (!localStorage.getItem('ACCESS_TOKEN')) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

// Dashboard (/)
const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: DashboardPage,
});

// Vật tư
const materialsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/materials',
  component: MaterialsPage,
});

// Sản phẩm
const productsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/products',
  component: ProductsPage,
});

// Khách hàng
const customersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/customers',
  component: CustomersPage,
});

// Báo giá (List)
const quotationsListRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/quotations',
  component: QuotationsPage,
});

// Báo giá (Create)
const quotationsCreateRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/quotations/create',
  component: QuotationCreatePage,
});

// Quản lý nhân viên (Admin)
const usersRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/users',
  component: UsersPage,
});


const routeTree = rootRoute.addChildren([
  loginRoute, 
  layoutRoute.addChildren([ 
    indexRoute,
    materialsRoute,
    productsRoute,
    customersRoute,
    quotationsListRoute,
    quotationsCreateRoute,
    usersRoute
  ]),
]);

export const router = createRouter({ routeTree });

// Đăng ký kiểu dữ liệu cho TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}