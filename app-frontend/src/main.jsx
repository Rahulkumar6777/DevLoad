import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import ScrollToTop from './components/ScrollToTop.jsx';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <ScrollToTop/>
          <App />
          <Toaster/>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);