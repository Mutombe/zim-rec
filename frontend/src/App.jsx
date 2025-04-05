import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import Navbar from './components/nav/nav';
import Footer from './components/footer/footer';
import About from './components/about/about';
import Contact from './components/contact/contact';
import UserDashboard from './components/dashboard/userDashboard';
import AdminDashboard from './components/dashboard/adminDashboard';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
export default App
