import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store"; // ← Changed this line

import { AuthProvider } from "./Contexts/AuthContexts/AuthContextsApi";
import { Routes } from "./routes/Route";
import { SuperAdminProvider } from "./Contexts/superAdminApiClient/superAdminApiClient";
import { ClientsProvider } from "./Contexts/apiClientContext/apiClientContext";
import { WarehouseProvider } from "./Contexts/WarehouseContext/WarehouseContext";
import { SupplierProvider } from "./Contexts/SupplierContext/SupplierContext";
import { ServiceProvider } from "./Contexts/ServiceContext/ServiceContext";
import { ProductsManagerProvider } from "./Contexts/ProductsManagerContext/ProductsManagerContext";
function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <SuperAdminProvider>
            <ClientsProvider>
              <WarehouseProvider>
                <SupplierProvider>
                  <ServiceProvider>
                    <ProductsManagerProvider>
                      <Routes />
                    </ProductsManagerProvider>
                  </ServiceProvider>
                </SupplierProvider>
              </WarehouseProvider>
            </ClientsProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;
