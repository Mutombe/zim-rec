import React from "react";
import { motion } from "framer-motion";
import {
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import { AuthModals } from "../nav/nav";
import {
  Zap,
  Check,
  Sun,
  Wind,
  Droplet,
  Leaf,
  Award,
  TrendingUp,
  Users,
  Globe,
  FileText,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const About = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState(null);

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

  const benefitItems = [
    {
      icon: <TrendingUp size={24} />,
      title: "Revenue Generation",
      description:
        "Generate additional revenue by selling renewable energy certificates, making clean energy investments financially viable.",
    },
    {
      icon: <Award size={24} />,
      title: "Sustainability Credentials",
      description:
        "Enhance sustainability reports and demonstrate commitment to reducing carbon footprint.",
    },
    {
      icon: <FileText size={24} />,
      title: "Regulatory Compliance",
      description:
        "Comply with international environmental regulations and achieve carbon neutrality goals.",
    },
    {
      icon: <Globe size={24} />,
      title: "Global Market Access",
      description:
        "Improve competitiveness in international trade by demonstrating use of renewable energy.",
    },
  ];

  const energyTypes = [
    {
      icon: <Sun className="text-yellow-500" size={28} />,
      name: "Solar Energy",
    },
    { icon: <Wind className="text-blue-500" size={28} />, name: "Wind Power" },
    {
      icon: <Droplet className="text-blue-400" size={28} />,
      name: "Hydropower",
    },
    { icon: <Leaf className="text-green-500" size={28} />, name: "Biomass" },
  ];

  const faqItems = [
    {
      question: "How much does it cost to register a project for RECs?",
      answer:
        "AICTS and Silver Carbon absorb all application and registration costs. Project owners don't need to pay upfront as costs will be recovered once the RECs are sold.",
    },
    {
      question: "Can small-scale renewable energy initiatives participate?",
      answer:
        "Yes, both large and small renewable energy projects can qualify, provided they meet the minimum generation capacity and reporting standards.",
    },
    {
      question: "What is the revenue potential of REC-certified projects?",
      answer:
        "Revenue depends on market demand, certificate prices, and trading mechanisms. We facilitate sales to ensure project owners receive maximum financial benefits.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Driving Zimbabwe's
              <br />
              <span className="text-green-600">Renewable Energy Future</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Zimbabwe's premier platform for renewable energy certification and
              trading, accelerating the transition to a sustainable energy
              ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="contained"
                size="large"
                startIcon={<FileText />}
                onClick={() => navigate("/contact")}
                className="!bg-green-600 !hover:bg-green-700 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowRight />}
                onClick={() => navigate("/dashboard")}
                className="!border-green-600 !text-green-600 !hover:bg-green-50 !px-6 !py-3 !rounded-full !font-medium"
              >
                Register Project
              </Button>
            </div>
          </motion.div>

          {/* Energy Types */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
          >
            {energyTypes.map((type, index) => (
              <motion.div
                key={index}
                variants={itemAnimation}
                className="flex flex-col items-center"
              >
                <Paper
                  elevation={0}
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-md bg-white mb-3"
                >
                  {type.icon}
                </Paper>
                <Typography
                  variant="subtitle1"
                  className="font-medium text-gray-800"
                >
                  {type.name}
                </Typography>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* About Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="overline"
                  className="text-green-600 font-medium mb-2 block"
                >
                  ABOUT ZIM-REC
                </Typography>
                <Typography
                  variant="h3"
                  className="font-bold text-gray-900 mb-4"
                >
                  Pioneering Green Energy Certification in Zimbabwe
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-6">
                  Zim-REC is a joint initiative by the Africa Institute for
                  Carbon Trading and Sustainability (AICTS) and Silver Carbon,
                  designed to accelerate Zimbabwe's transition to renewable
                  energy through transparent certification and trading
                  mechanisms.
                </Typography>

                <div className="space-y-4 mb-8">
                  {[
                    "Market Transparency",
                    "Developer Support",
                    "Corporate Sustainability",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Check className="text-green-600 w-4 h-4" />
                      </div>
                      <Typography
                        variant="body1"
                        className="text-gray-700 font-medium"
                      >
                        {item}
                      </Typography>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outlined"
                  endIcon={<ChevronRight />}
                  className="!border-green-600 !text-green-600 !hover:bg-green-50 !px-6 !py-2.5 !rounded-lg !font-medium"
                >
                  Our Mission & Vision
                </Button>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl">
                  <div className="bg-gradient-to-br from-green-200 to-green-100 w-full h-full flex items-center justify-center">
                    <Typography variant="body1" className="text-gray-500">
                      [Image: Renewable Energy Installation]
                    </Typography>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 md:-bottom-10 md:-right-10 p-4 md:p-6 bg-white rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-green-100 p-3">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900"
                      >
                        EST. 2023
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        Pioneering renewable energy solutions
                      </Typography>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Grid>
          </Grid>
        </div>
      </section>

      {/* Understanding RECs Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Typography
              variant="overline"
              className="text-green-600 font-medium block"
            >
              UNDERSTANDING RECs
            </Typography>
            <Typography variant="h3" className="font-bold text-gray-900 mb-4">
              What are Renewable Energy Certificates?
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Renewable Energy Certificates (RECs) are market-based instruments
              that certify renewable energy generation. Each REC represents
              proof that one megawatt-hour (MWh) of electricity has been
              generated from a renewable energy source and injected into the
              grid.
            </Typography>
          </motion.div>

          <Box className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <Grid container>
              <Grid item xs={12} md={5}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <div className="h-full bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 flex flex-col justify-center">
                    <Typography
                      variant="h4"
                      className="text-white font-bold mb-4"
                    >
                      How RECs Work
                    </Typography>
                    <Typography variant="body1" className="text-green-50 mb-6">
                      The REC system facilitates the tracking, trading, and
                      retirement of renewable energy claims, ensuring
                      transparency and credibility in sustainability
                      commitments.
                    </Typography>
                    <div className="space-y-3">
                      {[
                        "Issued for each MWh of renewable energy",
                        "Independently verified and certified",
                        "Tracked in secure registry systems",
                        "Tradable in domestic and international markets",
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <Check
                            className="text-green-300 mr-2 flex-shrink-0"
                            size={18}
                          />
                          <Typography variant="body2" className="text-green-50">
                            {item}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-12"
                >
                  <div className="space-y-8">
                    <div>
                      <Typography
                        variant="h5"
                        className="font-bold text-gray-900 mb-3"
                      >
                        Registration Process
                      </Typography>
                      <div className="space-y-4">
                        {[
                          {
                            number: "01",
                            title: "Project Eligibility Assessment",
                            desc: "Projects must generate electricity from renewable sources and comply with Zim-REC Registry requirements.",
                          },
                          {
                            number: "02",
                            title: "Application Submission",
                            desc: "AICTS and Silver Carbon gather all necessary documentation and submit it to the regulatory board.",
                          },
                          {
                            number: "03",
                            title: "Verification & Certification",
                            desc: "A third-party auditor verifies the project's compliance and renewable energy production.",
                          },
                          {
                            number: "04",
                            title: "RECs Issuance & Trading",
                            desc: "Once verified, RECs are issued and can be traded, sold, or retired to claim renewable energy usage.",
                          },
                        ].map((step, index) => (
                          <div key={index} className="flex">
                            <div className="mr-4 bg-green-100 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
                              <Typography
                                variant="subtitle2"
                                className="font-bold text-green-600"
                              >
                                {step.number}
                              </Typography>
                            </div>
                            <div>
                              <Typography
                                variant="subtitle1"
                                className="font-semibold text-gray-900"
                              >
                                {step.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-gray-600"
                              >
                                {step.desc}
                              </Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Typography
              variant="overline"
              className="text-green-600 font-medium block"
            >
              BENEFITS
            </Typography>
            <Typography variant="h3" className="font-bold text-gray-900 mb-4">
              Why Get REC Certified?
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Renewable Energy Certification provides tangible benefits for
              energy producers, corporations, and the environment, creating
              value while supporting Zimbabwe's transition to clean energy.
            </Typography>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {benefitItems.map((item, index) => (
              <motion.div key={index} variants={itemAnimation}>
                <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <div className="text-green-600">{item.icon}</div>
                    </div>
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900 mb-2"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Typography variant="h3" className="font-bold text-white mb-4">
              Ready to Get Started?
            </Typography>
            <Typography
              variant="body1"
              className="text-green-50 max-w-2xl mx-auto mb-8"
            >
              Join Zimbabwe's renewable energy revolution. Register your project
              today and start benefiting from renewable energy certification.
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/dashboard")}
                  className="!bg-white !text-green-700 !hover:bg-green-50 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
                >
                  See Devices
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setAuthModal("register")}
                  className="!bg-white !text-green-700 !hover:bg-green-50 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
                >
                  Register Now
                </Button>
              )}
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/contact")}
                className="!border-white !text-white !hover:bg-green-600 !px-6 !py-3 !rounded-full !font-medium"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Typography
              variant="overline"
              className="text-green-600 font-medium block"
            >
              FAQ
            </Typography>
            <Typography variant="h3" className="font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-600 max-w-3xl mx-auto"
            >
              Find answers to common questions about renewable energy
              certification and the Zim-REC program.
            </Typography>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={0}
                  className="mb-6 overflow-hidden border border-gray-100 rounded-xl"
                >
                  <div className="p-6">
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900 mb-3"
                    >
                      {item.question}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {item.answer}
                    </Typography>
                  </div>
                </Paper>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Typography variant="body1" className="text-gray-700 mb-4">
                Still have questions? We're here to help.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/contact")}
                className="!border-green-600 !text-green-600 !hover:bg-green-50 !px-6 !py-2.5 !rounded-lg !font-medium"
              >
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section 
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Typography variant="overline" className="text-green-600 font-medium block">
              OUR PARTNERS
            </Typography>
            <Typography variant="h4" className="font-bold text-gray-900 mb-4">
              Backed by Industry Leaders
            </Typography>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center"
          >
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div key={index} variants={itemAnimation} className="flex justify-center">
                <div className="h-12 bg-gray-200 w-full max-w-[180px] rounded-lg flex items-center justify-center">
                  <Typography variant="body2" className="text-gray-500">
                    Partner Logo
                  </Typography>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>*/}

      {/* Footer CTA */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                Join Zimbabwe's Renewable Energy Movement
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Take the first step towards clean energy certification and
                trading.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} className="text-center md:text-right">
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Zap />}
                  onClick={() => navigate("/dashboard")}
                  className="!bg-green-600 !hover:bg-green-700 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
                >
                  Upload Devices
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Zap />}
                  onClick={() => setAuthModal("register")}
                  className="!bg-green-600 !hover:bg-green-700 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
                >
                  Get Started
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      </section>

      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </div>
  );
};

export default About;
