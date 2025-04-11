import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Button, 
  TextField, 
  Snackbar, 
  Alert, 
  Paper, 
  Grid,
  Typography,
  Box,
  Divider,
  CircularProgress
} from "@mui/material";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Check,
  Zap,
  Globe,
  Calendar,
  Sun
} from "lucide-react";

const Contact = () => {
  const [formData, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "Email is not valid";
    tempErrors.message = formData.message ? "" : "Message is required";
    
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Your message has been sent successfully!",
          severity: "success"
        });
        setState({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }, 1500);
    }
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex justify-center mb-4">
            <motion.div 
              className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about renewable energy certificates or want to learn more about our platform? Our team is here to help.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper elevation={0} className="overflow-hidden rounded-2xl shadow-lg">
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                <Typography variant="h5" className="text-white font-bold flex items-center">
                  <Mail className="mr-2" /> Send Us a Message
                </Typography>
                <Typography variant="body2" className="text-green-50">
                  We'll get back to you within 24 hours
                </Typography>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      className="bg-white"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      className="bg-white"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      className="bg-white"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={5}
                      error={Boolean(errors.message)}
                      helperText={errors.message}
                      className="bg-white"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      className="!bg-green-600 !hover:bg-green-700 !py-3 !px-8 !rounded-full !shadow-md !transition-all !duration-300 !font-medium"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Contact Info Card */}
            <Paper elevation={0} className="p-6 rounded-2xl shadow-lg bg-white">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800">
                Contact Information
              </Typography>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <MapPin className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="font-medium text-gray-700">
                      Office Location
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                    7 KingsRow Northgate , Borrowdale<br />
                      Harare, Zimbabwe
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Phone className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="font-medium text-gray-700">
                      Phone Numbers
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                    +263 78 004 9196<br />
                      +263 78 004 9196
                    </Typography>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Mail className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="font-medium text-gray-700">
                      Email Addresses
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      admin@zimrec.co.zw<br />
                    </Typography>
                  </div>
                </div>
              </div>
            </Paper>
            
            {/* Business Hours Card */}
            <Paper elevation={0} className="p-6 rounded-2xl shadow-lg bg-white">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800">
                Business Hours
              </Typography>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Clock className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <Typography variant="body2" className="font-medium text-gray-700">
                      Monday - Friday
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      8:00 AM - 5:00 PM
                    </Typography>
                  </div>
                </div>
                <Divider />
                
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Calendar className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <Typography variant="body2" className="font-medium text-gray-700">
                      Saturday
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      9:00 AM - 1:00 PM
                    </Typography>
                  </div>
                </div>
                <Divider />
                
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Sun className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <Typography variant="body2" className="font-medium text-gray-700">
                      Sunday
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Closed
                    </Typography>
                  </div>
                </div>
              </div>
            </Paper>
            
            {/* Quick Links */}
            <Paper elevation={0} className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white">
              <Typography variant="h6" className="font-bold mb-4">
                Quick Links
              </Typography>
              <div className="space-y-2">
                <Button 
                  variant="text" 
                  fullWidth 
                  className="!bg-green-500/20 !text-white !justify-start !rounded-lg !py-2 !hover:bg-green-500/30"
                  startIcon={<Globe size={18} />}
                >
                  Visit Our FAQ
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  className="!bg-green-500/20 !text-white !justify-start !rounded-lg !py-2 !hover:bg-green-500/30"
                  startIcon={<Check size={18} />}
                >
                  Project Registration
                </Button>
                <Button 
                  variant="text" 
                  fullWidth 
                  className="!bg-green-500/20 !text-white !justify-start !rounded-lg !py-2 !hover:bg-green-500/30"
                  startIcon={<Zap size={18} />}
                >
                  Learn About RECs
                </Button>
              </div>
            </Paper>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          className="mt-12 rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 bg-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box className="relative w-full h-full bg-green-200 flex items-center justify-center">
            <Typography variant="body1" className="text-gray-600">
              Map placeholder - Integration with Google Maps or similar service
            </Typography>
            <Box className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
          </Box>
        </motion.div>
      </div>

      {/* Snackbar for form submission */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity} 
          className="!flex !items-center !shadow-lg"
          icon={snackbar.severity === "success" ? <Check className="w-5 h-5" /> : undefined}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Contact;