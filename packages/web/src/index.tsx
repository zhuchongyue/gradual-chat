import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store'

import { router } from './routes/route'
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
import Header from '@/components/Header/Header';
import Nav from '@/components/Nav/Nav';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <Provider store={store}>
        <RouterProvider router={router} ></RouterProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
