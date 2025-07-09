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
import { SuperDashboardProvider } from "./Contexts/superAdminDashborad/SuperAdminContext";

function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <SuperAdminProvider>
            <SuperDashboardProvider>
              <ClientsProvider>
                <WarehouseProvider>
                  <SupplierProvider>
                    <Routes />
                  </SupplierProvider>
                </WarehouseProvider>
              </ClientsProvider>
            </SuperDashboardProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;
