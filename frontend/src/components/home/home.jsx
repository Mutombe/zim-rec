import React, { useEffect } from "react";
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
} from "lucide-react";
import { useState } from "react";
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
    <Card className="h-full p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-green-500">
      <div className="mb-4 bg-green-50 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center">
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
    className="bg-white p-3 sm:p-6 rounded-2xl shadow-md flex flex-col items-center"
  >
    <div className="rounded-full bg-green-100 p-2 sm:p-3 mb-2 sm:mb-4">
      {icon}
    </div>
    <Typography
      variant="h4"
      className="text-green-700 font-bold mb-1 text-center"
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
      icon: <Sun size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Solar Energy Certificates",
      description:
        "Track and trade solar energy production with transparent, blockchain-verified certificates.",
    },
    {
      icon: <Wind size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Wind Power RECs",
      description:
        "Connect with wind energy producers and purchase certified renewable energy credits.",
    },
    {
      icon: <Droplet size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Hydro Energy Trading",
      description:
        "Access Zimbabwe's growing hydroelectric energy market through verified certificates.",
    },
    {
      icon: <Shield size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Compliance Solutions",
      description:
        "Meet regulatory requirements and sustainability goals with verified RECs.",
    },
    {
      icon: <TrendingUp size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Market Analytics",
      description:
        "Access real-time data and insights on renewable energy market trends.",
    },
    {
      icon: <Award size={isMobile ? 24 : 32} className="text-green-600" />,
      title: "Sustainability Reporting",
      description:
        "Generate comprehensive reports to showcase your environmental impact.",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-green-300"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-green-500"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-green-400"></div>
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
                  className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6"
                >
                  Powering Zimbabwe's
                  <span className="text-green-300">
                    {" "}
                    Renewable Energy Future
                  </span>
                </Typography>

                {/*<Typography 
                  variant={isMobile ? "body1" : "h2"} 
                  className="text-base xs:text-lg sm:text-xl md:text-2xl text-green-50 opacity-90 mb-6 sm:mb-8 max-w-xl"
                >
                  Connect, trade, and verify Renewable Energy Certificates to accelerate sustainability across Zimbabwe.
                </Typography>*/}

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      onClick={() => navigate("/dashboard")}
                      to="/dashboard"
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      endIcon={<ArrowRight size={isMobile ? 16 : 24} />}
                      className={`!bg-green-400 !hover:bg-green-300 !text-green-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg`}
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
                      className={`!bg-green-400 !hover:bg-green-300 !text-green-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg`}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-green-300 !text-green-300 !hover:bg-green-800/30 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                  >
                    Learn More
                  </Button>
                </div>

                {/*<div className="mt-6 sm:mt-10 flex gap-4 sm:gap-6 flex-wrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-green-600">
                      <Zap className="text-white" size={isMobile ? 16 : 20} />
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <Typography variant="body2" className="text-green-200 text-xs sm:text-sm">Verified by</Typography>
                      <Typography variant="body1" className="font-medium text-sm sm:text-base">AICTS</Typography>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-green-600">
                      <Shield className="text-white" size={isMobile ? 16 : 20} />
                    </div>
                   } <div className="ml-2 sm:ml-3">
                      <Typography variant="body2" className="text-green-200 text-xs sm:text-sm">Blockchain Secured</Typography>
                      <Typography variant="body1" className="font-medium text-sm sm:text-base">Transparent & Immutable</Typography>
                    </div>
                  </div>
                </div>*/}
              </motion.div>
            </Grid>

            {/*<Grid
              item
              xs={12}
              md={5}
              className={isTablet ? "flex justify-center" : "hidden md:block"}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative max-w-sm w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 blur-3xl transform -translate-x-10"></div>
                <div className="relative bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 rounded-3xl shadow-2xl">
                  {/*<div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="aspect-square bg-green-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                      <Sun className="text-green-600" size={isMobile ? 24 : 32} />
                      <div>
                        <Typography className="text-xs text-green-700">Solar</Typography>
                        <Typography className="text-base sm:text-lg font-bold text-green-900">48.2%</Typography>
                      </div>
                    </div>
                    <div className="aspect-square bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                      <Wind className="text-blue-600" size={isMobile ? 24 : 32} />
                      <div>
                        <Typography className="text-xs text-blue-700">Wind</Typography>
                        <Typography className="text-base sm:text-lg font-bold text-blue-900">27.5%</Typography>
                      </div>
                    </div>
                    <div className="aspect-square bg-cyan-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                      <Droplet className="text-cyan-600" size={isMobile ? 24 : 32} />
                      <div>
                        <Typography className="text-xs text-cyan-700">Hydro</Typography>
                        <Typography className="text-base sm:text-lg font-bold text-cyan-900">18.9%</Typography>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
                      <Zap className="text-yellow-600" size={isMobile ? 24 : 32} />
                      <div>
                        <Typography className="text-xs text-gray-700">Other</Typography>
                        <Typography className="text-base sm:text-lg font-bold text-gray-900">5.4%</Typography>
                      </div>
                    </div>
                  </div>*/}
            {/*
                  <Typography className="mt-2 sm:mt-4 text-center text-gray-500 text-xs sm:text-sm">
                    Zimbabwe REC Distribution 2025
                  </Typography>
        </div>
      </motion.div>
    </Grid>*/}
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

      {/* Features Section *
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          >
            <Typography variant="overline" className="text-green-600 font-medium tracking-widest">
              OUR SOLUTIONS
            </Typography>
            <Typography variant="h3" className="text-2xl xs:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Comprehensive Renewable Energy Services
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-sm sm:text-base">
              Our platform provides end-to-end solutions for renewable energy certification, 
              trading, and verification across Zimbabwe's growing sustainable energy sector.
            </Typography>
          </motion.div>
          
          <Grid container spacing={2} sm={3} md={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={0.2 + index * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </section>
      
      <section className="py-12 sm:py-16 md:py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              hidden: { opacity: 0, y: 50 }
            }}
            className="text-center mb-10 sm:mb-16"
          >
            <Typography variant="overline" className="text-green-600 font-medium tracking-widest text-xs sm:text-sm">
              OUR IMPACT
            </Typography>
            <Typography variant="h3" className="text-2xl xs:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Zimbabwe's Green Transition in Numbers
            </Typography>
            <Typography variant="body1" className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
              Since our launch, we've helped accelerate Zimbabwe's renewable energy sector 
              through transparent certification and efficient market mechanisms.
            </Typography>
          </motion.div>/}
          
          {/*<Grid container spacing={2} sm={3} md={4}>
            <Grid item xs={6} md={3}>
              <Statistic 
                value="350+" 
                label="Projects Registered" 
                icon={<Zap size={isMobile ? 18 : 24} className="text-green-600" />} 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Statistic 
                value="12.4K" 
                label="RECs Issued" 
                icon={<Award size={isMobile ? 18 : 24} className="text-green-600" />} 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Statistic 
                value="874" 
                label="Market Participants" 
                icon={<Users size={isMobile ? 18 : 24} className="text-green-600" />} 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Statistic 
                value="45%" 
                label="Carbon Reduction" 
                icon={<TrendingUp size={isMobile ? 18 : 24} className="text-green-600" />} 
              />
            </Grid>
          </Grid>
        </div>
      </section>*/}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, transition: { duration: 0.8 } },
              hidden: { opacity: 0 },
            }}
            className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl relative overflow-hidden"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-green-300"></div>
              <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-green-500"></div>
            </div>

            <Grid container spacing={4} sm={6} className="relative z-10">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
                >
                  Ready to join Zimbabwe's renewable energy revolution?
                </Typography>
                {/*<Typography variant="body1" className="text-green-100 mb-6 sm:mb-8 text-sm sm:text-base">
                  Whether you're a project developer, corporate buyer, or investor, our platform 
                  provides the tools you need to participate in Zimbabwe's sustainable future.
                </Typography>*/}
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-white !text-green-800 !hover:bg-green-50 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                    >Show our Devices
                      
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-white !text-green-800 !hover:bg-green-50 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                    >
                      Create Account
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-white !text-white !hover:bg-green-800/30 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
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
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 blur-2xl"></div>
                  <div className="relative rounded-full bg-white/10 p-6 backdrop-blur-sm border border-white/20">
                    <Zap className="text-white w-16 h-16 lg:w-20 lg:h-20" />
                  </div>
                </div>
              </Grid>
            </Grid>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section 
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Typography variant="h6" className="text-center text-gray-600 mb-6 sm:mb-10 text-sm sm:text-base">
            TRUSTED BY LEADING ORGANIZATIONS
          </Typography>
          <br></br>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-10 md:gap-16 opacity-70">
            {['AICTS', 'Silver Carbon', 'Zimbabwe Energy', 'Green Africa', 'EcoSolutions', 'Sustainable ZW'].map((partner) => (
              <Typography 
                key={partner}
                variant="h6" 
                className="text-gray-500 font-bold tracking-wide text-xs sm:text-sm md:text-base"
              >
                {partner}
              </Typography>
            ))}
          </div>
        </div>
      </section>*/}
      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </div>
  );
};

export default Home;

// Missing component import added for Statistics section
const Users = ({ size, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
};
