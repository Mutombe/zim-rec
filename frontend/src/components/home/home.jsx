import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  Button,
  Typography,
  Grid,
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
const FeatureCard = ({ icon, title, description, delay, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="group h-full"
  >
    <div className="relative h-full p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200/60 hover:-translate-y-1">
      {/* Accent line */}
      <div className={`absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${accent} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

      <div className={`mb-5 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white">{icon}</div>
      </div>

      <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">
        {description}
      </p>

      <div className="mt-5 flex items-center text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </div>
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
      icon: <Sun size={24} />,
      title: "Solar Energy Certificates",
      description:
        "Track and trade solar energy production with transparent, blockchain-verified certificates.",
      accent: "from-amber-400 to-orange-500",
    },
    {
      icon: <Wind size={24} />,
      title: "Wind Power RECs",
      description:
        "Connect with wind energy producers and purchase certified renewable energy credits.",
      accent: "from-sky-400 to-blue-600",
    },
    {
      icon: <Droplet size={24} />,
      title: "Hydro Energy Trading",
      description:
        "Access Zimbabwe's growing hydroelectric energy market through verified certificates.",
      accent: "from-cyan-400 to-teal-500",
    },
    {
      icon: <Shield size={24} />,
      title: "Compliance Solutions",
      description:
        "Meet regulatory requirements and sustainability goals with verified RECs.",
      accent: "from-emerald-400 to-green-600",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Market Analytics",
      description:
        "Access real-time data and insights on renewable energy market trends.",
      accent: "from-violet-400 to-purple-600",
    },
    {
      icon: <Award size={24} />,
      title: "Sustainability Reporting",
      description:
        "Generate comprehensive reports to showcase your environmental impact.",
      accent: "from-rose-400 to-pink-600",
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

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      endIcon={<ArrowRight size={isMobile ? 16 : 24} />}
                      className={`!bg-emerald-500 hover:!bg-emerald-400 !text-white !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg !transform hover:!scale-105 !transition-all !duration-200`}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      endIcon={<ArrowRight size={isMobile ? 16 : 24} />}
                      className={`!bg-emerald-500 hover:!bg-emerald-400 !text-white !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !shadow-lg !transform hover:!scale-105 !transition-all !duration-200`}
                    >
                      Get Started
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/about"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-emerald-400 !text-emerald-400 hover:!bg-emerald-400/10 hover:!border-emerald-300 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !backdrop-blur-sm`}
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

      {/* What We Offer Section */}
      <section className="py-20 sm:py-24 md:py-28 bg-gray-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-14 sm:mb-16 lg:mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-5">
              <Zap size={14} />
              What We Offer
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Comprehensive Energy{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Solutions
              </span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              From solar to hydro, wind to compliance — everything you need
              to participate in Zimbabwe's clean energy marketplace
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-50">
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
                      className={`!bg-emerald-500 !text-white hover:!bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !transform hover:!scale-105 !transition-all !duration-200`}
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setAuthModal("register")}
                      variant="contained"
                      size={isMobile ? "medium" : "large"}
                      className={`!bg-emerald-500 !text-white hover:!bg-emerald-400 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !transform hover:!scale-105 !transition-all !duration-200`}
                    >
                      Create Account
                    </Button>
                  )}
                  <Button
                    component={Link}
                    to="/contact"
                    variant="outlined"
                    size={isMobile ? "medium" : "large"}
                    className={`!border-white !text-white hover:!bg-white/10 hover:!border-emerald-300 !px-4 sm:!px-8 !py-2 sm:!py-3 !text-sm sm:!text-base !font-medium !rounded-full !backdrop-blur-sm`}
                  >
                    Contact Us
                  </Button>
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