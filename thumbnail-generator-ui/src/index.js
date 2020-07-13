import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Box minHeight="100vh" bgcolor="grey.200" p={2}>
      <App />
    </Box>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
