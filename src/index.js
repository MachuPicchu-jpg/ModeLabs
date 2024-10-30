import React from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import './index.css';
import App from './App';
import WelcomePage from './WelcomePage';
import reportWebVitals from './reportWebVitals';
import Requirement_Dialog from './Requirement_Dialog'
import Recommendation from './Recommendation'
import Home from './Home'
import { Table } from 'lucide-react';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <I18nextProvider i18n={i18n}>
      {/* <WelcomePage /> */}
      {/* {<Requirement_Dialog/>} */}
      {/* {<Recommendation/>} */}
      {<Home></Home>}
      </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




