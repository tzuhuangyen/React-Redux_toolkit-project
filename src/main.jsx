import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/all.scss';
import 'bootstrap/dist/js/bootstrap.js';

import { RouterProvider } from 'react-router-dom';
import router from './router';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <App />
    </Provider>
  </StrictMode>
);
