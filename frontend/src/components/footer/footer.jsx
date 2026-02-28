import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Leaf,
  MapPin,
  ChevronRight,
  Send,
  Zap,
  Loader2,
} from 'lucide-react';
import { Typography, Grid } from '@mui/material';
import { toast } from 'sonner';
import api from '../../utils/api';


export function SidebarLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 mb-6">
      <div className="w-9 h-9 bg-white rounded-lg p-0.5 overflow-hidden">
        <img
          src="/logo.png"
          alt="Zim-REC Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <Typography variant="h5" className="!font-bold !text-white !tracking-tight">
        Zim-REC
      </Typography>
    </Link>
  );
}

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setSubscribing(true);
    try {
      const response = await api.post('newsletter/subscribe/', { email: newsletterEmail });
      toast.success(response.data.detail);
      setNewsletterEmail('');
    } catch (err) {
      const message = err.response?.data?.detail
        || err.response?.data?.email?.[0]
        || 'Subscription failed. Please try again.';
      toast.error(message);
    } finally {
      setSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, url: 'https://twitter.com/zimrec', label: 'Twitter' },
    { icon: <Linkedin size={20} />, url: 'https://linkedin.com/company/zimrec', label: 'LinkedIn' },
    { icon: <Facebook size={20} />, url: 'https://facebook.com/zimrec', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/', icon: <ChevronRight size={16} /> },
    { name: 'About', path: '/about', icon: <ChevronRight size={16} /> },
    { name: 'Contact', path: '/contact', icon: <ChevronRight size={16} /> },
    { name: 'Gallery', path: '/gallery', icon: <ChevronRight size={16} /> },
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full opacity-[0.04] blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full opacity-[0.04] blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={{ xs: 6, md: 6 }}>
            {/* About Section */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemAnimation}>
                <Link to="/" className="flex items-center gap-2.5 mb-5">
                  <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-lg border border-white/10">
                    <img
                      src="/logo.png"
                      alt="Zim-REC Logo"
                      className="h-7 w-7"
                    />
                  </div>
                  <Typography variant="h6" className="!font-bold !text-white !tracking-tight">
                    Zim-REC
                  </Typography>
                </Link>
                <Typography variant="body2" className="!text-gray-400 !leading-relaxed mb-6 max-w-xs">
                  Zimbabwe's premier platform for renewable energy certification and trading,
                  accelerating the transition to a sustainable energy ecosystem.
                </Typography>

                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white/10 hover:bg-emerald-500 text-gray-400 hover:text-white p-2.5 rounded-lg transition-all duration-200 border border-white/5"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={2}>
              <motion.div variants={itemAnimation}>
                <Typography variant="subtitle2" className="!font-semibold !mb-5 !text-gray-300 !uppercase !text-xs !tracking-wider">
                  Quick Links
                </Typography>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <motion.div key={link.name} whileHover={{ x: 4 }} className="transition-all">
                      <Link
                        to={link.path}
                        className="!text-gray-400 hover:!text-emerald-400 !no-underline flex items-center text-sm transition-colors"
                      >
                        <span className="text-emerald-500/60 mr-2">{link.icon}</span>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={6} md={3}>
              <motion.div variants={itemAnimation}>
                <Typography variant="subtitle2" className="!font-semibold !mb-5 !text-gray-300 !uppercase !text-xs !tracking-wider">
                  Contact Us
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-white/10 p-2 rounded-lg border border-white/5 mt-0.5">
                      <Phone className="text-emerald-400" size={14} />
                    </div>
                    <Typography variant="body2" className="!text-gray-400 !text-sm !leading-relaxed">
                      +263 71 678 0112<br />
                      +263 77 770 0465<br />
                      +263 78 004 9196
                    </Typography>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/10 p-2 rounded-lg border border-white/5">
                      <Mail className="text-emerald-400" size={14} />
                    </div>
                    <Typography variant="body2" className="!text-gray-400 !text-sm">
                      admin@zim-rec.co.zw
                    </Typography>
                  </div>
                </div>
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={3}>
              <motion.div variants={itemAnimation}>
                <Typography variant="subtitle2" className="!font-semibold !mb-5 !text-gray-300 !uppercase !text-xs !tracking-wider">
                  Stay Updated
                </Typography>
                <div className="space-y-3">
                  <Typography variant="body2" className="!text-gray-400 !text-sm !leading-relaxed !mb-4">
                    Get updates on renewable energy projects and REC trading opportunities.
                  </Typography>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      disabled={subscribing}
                      className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all disabled:opacity-50"
                    />
                    <motion.button
                      type="submit"
                      disabled={subscribing}
                      whileHover={{ scale: subscribing ? 1 : 1.05 }}
                      whileTap={{ scale: subscribing ? 1 : 0.95 }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium whitespace-nowrap disabled:opacity-50"
                    >
                      {subscribing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-12 pt-6"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-gray-500 !text-center md:!text-left !text-xs">
                &copy; {new Date().getFullYear()} Zim-REC. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-gray-500 !text-center md:!text-right !text-xs">
                A partnership between AICTS and Silver Carbon &middot; Developed by{" "}
                <a href="https://zettabyte.co.zw" className="!text-emerald-400 hover:!text-emerald-300 !transition-colors" target="_blank" rel="noopener noreferrer">Zettabyte</a>
              </Typography>
            </Grid>
          </Grid>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;