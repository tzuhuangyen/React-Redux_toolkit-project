import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/all.scss';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <App />
    </Provider>
  </StrictMode>
);
