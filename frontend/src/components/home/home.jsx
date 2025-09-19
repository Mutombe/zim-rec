import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Button,
  Typography,
  Card,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  Sun,
  Wind,
  Droplet,
  Award,
  TrendingUp,
  Shield,
  Users,
  Leaf,
  Globe,
} from "lucide-react";
import { AuthModals } from "../nav/nav";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Custom animation hook for scrolling elements
const useScrollAnimation = () => {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollY > windowHeight * 0.1) {
        controls.start("visible");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  return controls;
};

// Animated feature card component
const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
  >
    <Card className="h-full p-4 sm:p-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-emerald-500">
      <div className="mb-4 bg-gradient-to-br from-emerald-50 to-blue-50 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <Typography variant="h6" className="text-gray-800 font-bold mb-2 sm:mb-3">
        {title}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        {description}
      </Typography>
    </Card>
  </motion.div>
);

// Statistics component
const Statistic = ({ value, label, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/95 backdrop-blur-sm p-3 sm:p-6 rounded-2xl shadow-md flex flex-col items-center"
  >
    <div className="rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 p-2 sm:p-3 mb-2 sm:mb-4">
      {icon}
    </div>
    <Typography
      variant="h4"
      className="text-emerald-700 font-bold mb-1 text-center"
    >
      {value}
    </Typography>
    <Typography
      variant="body2"
      className="text-gray-600 text-center text-xs sm:text-sm"
    >
      {label}
    </Typography>
  </motion.div>
);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLargeMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState(null);
  const navigate = useNavigate();
  const controls = useScrollAnimation();

  const features = [
    {
      icon: <Sun size={isMobile ? 24 : 32} className="text-emerald-500" />,
      title: "Solar Energy Certificates",
      description:
        "Track and trade solar energy production with transparent, blockchain-verified certificates.",
    },
    {
      icon: <Wind size={isMobile ? 24 : 32} className="text-blue-600" />,
      title: "Wind Power RECs",
      description:
        "Connect with wind energy producers and purchase certified renewable energy credits.",
    },
    {
      icon: <Droplet size={isMobile ? 24 : 32} className="text-blue-500" />,
      title: "Hydro Energy Trading",
      description:
        "Access Zimbabwe's growing hydroelectric energy market through verified certificates.",
    },
    {
      icon: <Shield size={isMobile ? 24 : 32} className="text-emerald-600" />,
      title: "Compliance Solutions",
      description:
        "Meet regulatory requirements and sustainability goals with verified RECs.",
    },
    {
      icon: <TrendingUp size={isMobile ? 24 : 32} className="text-blue-600" />,
      title: "Market Analytics",
      description:
        "Access real-time data and insights on renewable energy market trends.",
    },
    {
      icon: <Award size={isMobile ? 24 : 32} className="text-emerald-500" />,
      title: "Sustainability Reporting",
      description:
        "Generate comprehensive reports to showcase your environmental impact.",
    },
  ];

  const statistics = [
    {
      value: "500+",
      label: "Active Users",
      icon: <Users size={isMobile ? 20 : 24} className="text-emerald-600" />,
    },
    {
      value: "50MW",
      label: "Energy Traded",
      icon: <Zap size={isMobile ? 20 : 24} className="text-blue-600" />,
    },
    {
      value: "25%",
      label: "Carbon Reduced",
      icon: <Leaf size={isMobile ? 20 : 24} className="text-emerald-600" />,
    },
    {
      value: "15+",
      label: "Partners",
      icon: <Globe size={isMobile ? 20 : 24} className="text-blue-600" />,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-600">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        
        {/* Floating Solar Panels */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 right-1/4 opacity-10"
          >
            <div className="w-32 h-20 bg-blue-800 rounded-lg transform rotate-12" />
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [0, -20, 0],
              y: [0, 15, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/3 left-1/5 opacity-10"
          >
            <div className="w-24 h-16 bg-emerald-800 rounded-lg transform -rotate-6" />
          </motion.div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-emerald-400"
          />
          <motion.div 
            animate={{ scale: [1, 0.9, 1], rotate: [0, -180, -360] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-blue-500"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 sm:top-40 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-emerald-500"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40 relative z-10">
          <Grid container spacing={isMobile ? 6 : 4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant={isMobile ? "h2" : "h1"}
                  className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-white"
                >
                  Powering Zimbabwe's
                  <span className="text-emerald-400 block mt-2">
                    Renewable Energy Future
                  </span>
                </Typography>

                <Typography
                  variant="h5"
                  className="text-blue-100 text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl leading-relaxed"
                >
                  Join the revolution in clean energy trading. Buy, sell, and track renewable energy certificates.
                </Typography>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      onClick={() => navigate("/dashboard")}
                      to="/dashboard"
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      endIcon={<ArrowRight size={isMobile ? 16 : 24} />}
                      className={`!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg !transform !hover:scale-105 !transition-all !duration-200`}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      endIcon={<ArrowRight size={isMobile ? 16 : 24} />}
                      className={`!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg !transform !hover:scale-105 !transition-all !duration-200`}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-emerald-400 !text-emerald-400 !hover:bg-emerald-400/10 !hover:border-emerald-300 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !backdrop-blur-sm`}
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={5} className="relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Solar panels in Zimbabwe landscape"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
                  
                  {/* Floating Energy Icons */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full"
                  >
                    <Sun size={24} className="text-yellow-300" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm p-3 rounded-full"
                  >
                    <Wind size={24} className="text-blue-300" />
                  </motion.div>
                </div>

                {/* Smaller accent images */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                >
                  <img
                    src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Wind turbines"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute -top-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                >
                  <img
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Hydroelectric dam"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </div>

        {/* Wave SVG Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            fill="#ffffff"
            preserveAspectRatio="none"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Statistics Section 
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <Typography
              variant="h3"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
            >
              Making an Impact
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Join thousands of users contributing to Zimbabwe's renewable energy transformation
            </Typography>
          </motion.div>

          <Grid container spacing={3} sm={4}>
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Statistic {...stat} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>
      </section>*/}

      {/* Features Section 
      <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
  
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <Typography
              variant="h3"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
            >
              Comprehensive Renewable Energy Solutions
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg"
            >
              From solar to hydro, wind to compliance - we provide everything you need 
              to participate in Zimbabwe's clean energy marketplace
            </Typography>
          </motion.div>

          <Grid container spacing={3} sm={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <FeatureCard {...feature} delay={index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </div>
      </section>*/}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(6, 78, 59, 0.95)), url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute top-5 sm:top-10 right-5 sm:right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-blue-300/20 backdrop-blur-sm"
              />
              <motion.div
                animate={{ 
                  rotate: [360, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 25, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-emerald-500/20 backdrop-blur-sm"
              />
            </div>

            <Grid container spacing={4} sm={6} className="relative z-10">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
                >
                  Ready to join Zimbabwe's renewable energy revolution?
                </Typography>
                <Typography
                  variant="body1"
                  className="text-blue-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl"
                >
                  Start trading renewable energy certificates today and contribute to a sustainable future for Zimbabwe.
                </Typography>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-emerald-500 !text-blue-900 !hover:bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !transform !hover:scale-105 !transition-all !duration-200`}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-emerald-500 !text-blue-900 !hover:bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !transform !hover:scale-105 !transition-all !duration-200`}
                    >
                      Create Account
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-white !text-white !hover:bg-white/10 !hover:border-emerald-300 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !backdrop-blur-sm`}
                  >
                    Contact Us
                  </Button>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                className="hidden md:flex justify-center items-center"
              >
                <motion.div 
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-2xl"></div>
                  <div className="relative rounded-full bg-white/10 p-6 lg:p-8 backdrop-blur-sm border border-white/20">
                    <img 
                      src="/logo.png" 
                      alt="Company Logo" 
                      className="w-16 h-16 lg:w-20 lg:h-20"
                    />
                  </div>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </div>
      </section>
      
      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </div>
  );
};

export default Home;