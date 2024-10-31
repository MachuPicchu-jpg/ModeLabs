import React from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import Ranking from './Ranking'
import Navbar from './Navbar'
import { Table } from 'lucide-react';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/requirement" element={<Requirement_Dialog />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/navbar" element={<Navbar />} />
          
          {/* 未来的路由 */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </I18nextProvider>
    </BrowserRouter>
  </React.StrictMode>
 );
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();





