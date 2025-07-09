import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./Contexts/AuthContexts/AuthContextsApi";
import { ClientsProvider } from "./Contexts/apiCLientContext/apiClientContext";
import { SuperDashboardProvider } from "./Contexts/superAdminDashborad/SuperAdminContext";
import { Routes } from "./routes/Route";
import { SuperAdminProvider } from "./Contexts/superAdminApiClient/superAdminApiClient";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SuperAdminProvider>
          <ClientsProvider>
            <SuperDashboardProvider>
              <Routes />
            </SuperDashboardProvider>
          </ClientsProvider>
        </SuperAdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
