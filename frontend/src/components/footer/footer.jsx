import React from 'react';
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
  Zap 
} from 'lucide-react';
import { Typography, Grid, TextField, Button } from '@mui/material';


export function SidebarLogo() {
  return (
    <Link to="/" className="flex items-center space-x-2 mb-6">
      <div className="w-10 h-10 mr-2">
        <img 
          src="/api/placeholder/40/40" 
          alt="Zim-REC Logo" 
          className="rounded-full"
        />
      </div>
      <Typography variant="h5" className="!font-bold !text-white">
        Zim-REC
      </Typography>
    </Link>
  );
}

const Footer = () => {
  const socialLinks = [
    { icon: <Twitter size={20} />, url: 'https://twitter.com/zimrec', label: 'Twitter' },
    { icon: <Linkedin size={20} />, url: 'https://linkedin.com/company/zimrec', label: 'LinkedIn' },
    { icon: <Facebook size={20} />, url: 'https://facebook.com/zimrec', label: 'Facebook' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/home', icon: <Leaf size={16} /> },
    { name: 'About', path: '/about', icon: <ChevronRight size={16} /> },
    { name: 'Contact', path: '/contact', icon: <MapPin size={16} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <ChevronRight size={16} /> },
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
    <footer className="bg-gradient-to-b from-blue-600 to-blue-800 text-white mt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
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
                <Link to="/" className="flex items-center space-x-2 mb-6">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 p-2 rounded-full mr-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <Typography variant="h5" className="!font-bold !text-white">
                    Zim-REC
                  </Typography>
                </Link>
                <Typography variant="body2" className="!text-blue-50 !leading-relaxed mb-6">
                  Zimbabwe's premier platform for renewable energy certification and trading, 
                  accelerating the transition to a sustainable energy ecosystem.
                </Typography>
                
                <div className="flex space-x-4 mt-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-full transition-all"
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
                <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
                  <ChevronRight className="text-emerald-300 mr-1" size={20} />
                  Quick Links
                </Typography>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <motion.div key={link.name} whileHover={{ x: 8 }} className="transition-all">
                      <Link 
                        to={link.path} 
                        className="!text-blue-50 hover:!text-emerald-300 !no-underline flex items-center"
                      >
                        <span className="text-emerald-300 mr-2">{link.icon}</span>
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
                <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
                  <MapPin className="text-emerald-300 mr-1" size={20} />
                  Contact Us
                </Typography>
                <div className="space-y-4">
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-full">
                      <Phone className="text-white" size={16} />
                    </div>
                    <Typography variant="body2" className="!text-blue-50">
                      +263 78 004 9196
                    </Typography>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-full">
                      <Mail className="text-white" size={16} />
                    </div>
                    <Typography variant="body2" className="!text-blue-50">
                      admin@zim-rec.co.zw
                    </Typography>
                  </motion.div>
                </div>
              </motion.div>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} md={3}>
              <motion.div variants={itemAnimation}>
                <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
                  <Send className="text-emerald-300 mr-1" size={20} />
                  Stay Updated
                </Typography>
                <div className="space-y-4">
                  <div className="relative">
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Enter your email"
                      className="bg-blue-50 rounded-lg"
                      InputProps={{
                        className: "!text-sm !py-1",
                        startAdornment: <Mail size={16} className="text-blue-700 mr-2" />,
                      }}
                    />
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="mt-3"
                    >
                      <Button
                        variant="contained"
                        className="!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !font-medium !py-2 !normal-case !rounded-lg !shadow-lg !w-full"
                        endIcon={<Send size={16} />}
                      >
                        Subscribe
                      </Button>
                    </motion.div>
                  </div>
                  <Typography variant="caption" className="!text-blue-100 !block !mt-2">
                    Join our newsletter for updates on renewable energy projects and REC trading opportunities.
                  </Typography>
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
          className="border-t border-blue-500 mt-10 pt-6"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-blue-100 !text-center md:!text-left">
                © {new Date().getFullYear()} Zim-REC. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-blue-100 !text-center md:!text-right">
                A partnership between AICTS and Silver Carbon for a sustainable Zimbabwe.
              </Typography>
            </Grid>
          </Grid>

          <div className="mt-4 text-center">
            <Typography variant="body2" className="!text-blue-100">
              Developed by <a href="https://zettabyte.co.zw" className="!text-emerald-300 hover:!text-white !transition-colors" target="_blank" rel="noopener noreferrer">Zettabyte</a>
            </Typography>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;