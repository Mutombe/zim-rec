import React from 'react';
import { useEffect } from 'react';
import {
  useLocation
 } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import Navbar from './components/nav/nav';
import Footer from './components/footer/footer';
import About from './components/about/about';
import Contact from './components/contact/contact';
import UserDashboard from './components/dashboard/userDashboard';
import AdminDashboard from './components/dashboard/adminDashboard';
import IssueRequestDashboard from './components/dashboard/issueDashboard';
import Settings from './components/settings/settings';
import HelpCenter from './components/helpcenter/helpcenter';
import ProfilePage from './components/profile/profile';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/issue-requests" element={<IssueRequestDashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App
