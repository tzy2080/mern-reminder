// Packages
import React from 'react';
import axios from 'axios';

import { AuthContextProvider } from './context/AuthContext';
import Routes from './Routes';

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider>
      < Routes />
    </AuthContextProvider>
  );
}

export default App;