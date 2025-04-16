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
    <Card className="h-full p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-emerald-500">
      <div className="mb-4 bg-blue-50 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center">
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
    <div className="rounded-full bg-blue-100 p-2 sm:p-3 mb-2 sm:mb-4">
      {icon}
    </div>
    <Typography
      variant="h4"
      className="text-blue-700 font-bold mb-1 text-center"
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

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-600 text-white">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 rounded-full bg-emerald-400"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-blue-500"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-emerald-500"></div>
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
                  <span className="text-emerald-400">
                    {" "}
                    Renewable Energy Future
                  </span>
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
                      className={`!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg`}
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
                      className={`!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg`}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-emerald-400 !text-emerald-400 !hover:bg-blue-800/30 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                  >
                    Learn More
                  </Button>
                </div>
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

      {/* Features Section would go here */}

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
            className="bg-gradient-to-br from-blue-800 to-emerald-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-xl relative overflow-hidden"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 sm:top-10 right-5 sm:right-10 w-20 sm:w-40 h-20 sm:h-40 rounded-full bg-blue-300"></div>
              <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 w-30 sm:w-60 h-30 sm:h-60 rounded-full bg-emerald-500"></div>
            </div>

            <Grid container spacing={4} sm={6} className="relative z-10">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
                >
                  Ready to join Zimbabwe's renewable energy revolution?
                </Typography>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-emerald-500 !text-blue-900 !hover:bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                    >
                      Show our Devices
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-emerald-500 !text-blue-900 !hover:bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
                    >
                      Create Account
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-white !text-white !hover:bg-blue-800/30 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full`}
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
                  <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 blur-2xl"></div>
                  <div className="relative rounded-full bg-white/10 p-6 backdrop-blur-sm border border-white/20">
                    <Zap className="text-emerald-400 w-16 h-16 lg:w-20 lg:h-20" />
                  </div>
                </div>
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