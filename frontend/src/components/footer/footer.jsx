import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Mail, Phone, Leaf, MapPin, ChevronRight, Send, Zap } from 'lucide-react';
import { Typography, Grid, TextField, Button } from '@mui/material';

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

  return (
    <footer className="bg-gradient-to-b from-green-600 to-green-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <motion.div whileHover={{ scale: 1.02 }} className="mb-6">
              <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full mr-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                <Typography variant="h6" className="!font-bold !text-white">
                  Zim-REC
                </Typography>
              </Link>
              {/*<Typography variant="body2" className="!text-green-50 !leading-relaxed">
                Catalyzing sustainable energy markets through transparent REC trading.
                Partnered with Silver Carbon and AICTS for a greener Zimbabwe.
              </Typography>*/}
              
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-full transition-all"
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
            <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
              <ChevronRight className="text-green-300 mr-1" size={20} />
              Quick Links
            </Typography>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <motion.div key={link.name} whileHover={{ x: 8 }} className="transition-all">
                  <Link 
                    to={link.path} 
                    className="!text-green-50 hover:!text-white !no-underline flex items-center"
                  >
                    <span className="text-green-300 mr-2">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
              <MapPin className="text-green-300 mr-1" size={20} />
              Contact Us
            </Typography>
            <div className="space-y-4">
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <Phone className="text-white" size={16} />
                </div>
                <Typography variant="body2" className="!text-green-50">
                +263 78 004 9196
                </Typography>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <Mail className="text-white" size={16} />
                </div>
                <Typography variant="body2" className="!text-green-50">
                  admin@zim-rec.co.zw
                </Typography>
              </motion.div>
            </div>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" className="!font-bold !mb-5 !text-white !flex !items-center">
              <Send className="text-green-300 mr-1" size={20} />
              Stay Updated
            </Typography>
            <div className="space-y-4">
              <div className="relative">
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Enter your email"
                  className="bg-green-50 rounded-lg"
                  InputProps={{
                    className: "!text-sm !py-1",
                    startAdornment: <Mail size={16} className="text-green-700 mr-2" />,
                  }}
                />
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="mt-3"
                >
                  <Button
                    variant="contained"
                    className="!bg-green-400 !hover:bg-green-300 !text-green-900 !font-medium !py-2 !normal-case !rounded-lg !shadow-lg !w-full"
                    endIcon={<Send size={16} />}
                  >
                    Subscribe
                  </Button>
                </motion.div>
              </div>
              <Typography variant="caption" className="!text-green-100 !block !mt-2">
                Join our newsletter for updates on renewable energy projects and REC trading opportunities.
              </Typography>
            </div>
          </Grid>
        </Grid>

        {/* Copyright */}
        <div className="border-t border-green-500 mt-10 pt-6">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-green-100 !text-center md:!text-left">
                © {new Date().getFullYear()} Zim-REC. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" className="!text-green-100 !text-center md:!text-right">
                A partnership between AICTS and Silver Carbon for a sustainable Zimbabwe.
              </Typography>
            </Grid>
          </Grid>

          <div className="mt-4 text-center">
            <Typography variant="body2" className="!text-green-100">
              Developed by <a href="https://zettabyte.com" className="!text-green-300 hover:!text-white !transition-colors" target="_blank" rel="noopener noreferrer">Zettabyte</a>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;