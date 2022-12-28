import {StyledEngineProvider} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import {store} from './app/sore';
import './index.css';

const queryClinet = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClinet}>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <ToastContainer />
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </StyledEngineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
