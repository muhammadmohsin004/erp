import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from './Contexts/AuthContexts/AuthContextsApi';
import { Routes } from './routes/Route';
import { SuperAdminProvider } from './Contexts/superAdminApiClient/superAdminApiClient';
// import { SuperAdminProvider } from './Contexts/superAdminApiClient/superAdminApiClient';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SuperAdminProvider> <Routes /></SuperAdminProvider>
       
      

      </AuthProvider>
    </Router>
  );
}

export default App;