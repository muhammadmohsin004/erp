import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store'; // ← Changed this line

import { AuthProvider } from './Contexts/AuthContexts/AuthContextsApi';
import { Routes } from './routes/Route';
import { SuperAdminProvider } from './Contexts/superAdminApiClient/superAdminApiClient';
import { ClientsProvider } from './Contexts/apiClientContext/apiClientContext';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <SuperAdminProvider>
            <ClientsProvider>
              <Routes />
            </ClientsProvider>
          </SuperAdminProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;