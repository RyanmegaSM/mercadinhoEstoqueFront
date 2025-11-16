import { Route, Routes } from "react-router";
import { Layout } from "@/components/layout";
import { DashboardPage } from "@/pages/private/home";
import { ProductsPage } from "@/pages/private/products/list";
import { BatchesPage } from "@/pages/private/batchs/list";
import { AddBatchPage } from "@/pages/private/batchs/add";
import { AddProductPage } from "@/pages/private/products/add";
import { EditProductPage } from "@/pages/private/products/edit";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { LoginPage } from "@/pages/public/login";
import { DetailsBatchPage } from "@/pages/private/batchs/details";
import { SuppliersPage } from "@/pages/private/suppliers/list";
import { AddSupplierPage } from "@/pages/private/suppliers/add";
import { StockMovimentationPage } from "@/pages/private/stockMovimentation/list";
import { AddStockMovimentationPage } from "@/pages/private/stockMovimentation/add";
import { EditSupplierPage } from "@/pages/private/suppliers/edit";
import { AddUserPage } from "@/pages/private/users/add";
import { UsersPage } from "@/pages/private/users/list";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <Layout />
          </ProtectedRoutes>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="batches" element={<BatchesPage />} />
        <Route path="batches/details/:id" element={<DetailsBatchPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="suppliers/add" element={<AddSupplierPage />} />
        <Route path="suppliers/edit/:id" element={<EditSupplierPage />} />
        <Route path="stockMovimentation" element={<StockMovimentationPage />} />
        <Route
          path="stockMovimentation/add"
          element={<AddStockMovimentationPage />}
        />

        <Route
          path="suppliers/add-batch/:supplierId"
          element={<AddBatchPage />}
        />
        <Route path="users/add" element={<AddUserPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}
