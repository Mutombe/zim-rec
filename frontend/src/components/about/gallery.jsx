import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Typography,
  Button,
  Box,
  Chip,
  Card,
  Grid,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { 
  Grid as GridIcon, 
  Maximize, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Calendar, 
  MapPin, 
  Image as ImageIcon,
  Download,
  Play,
  Volume2,
  VolumeX
} from "lucide-react";

const GalleryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [layout, setLayout] = useState("masonry");
  const [animateImages, setAnimateImages] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const scrollRef = useRef(null);
  const controls = useAnimation();

  // Sample gallery data
  const galleryItems = [
    {
      id: 1,
      title: "REC Launch",
      type: "event",
      date: "January 2025",
      location: "Harare",
      tags: ["launch", "education"],
      description: "Workshop providing training on REC certification process and benefits for local energy producers.",
      imageUrl: "/zimrec3.jpeg",
      mediaType: "image"
    },
    {
      id: 2,
      title: "Zim-Rec Launch",
      type: "News",
      date: "February 2025",
      location: "Harare",
      tags: ["news", "launch", "event"],
      description: "Official launch of Zimbabwe's newest RECs platform.",
      imageUrl: "/zimrec-news.mp4",
      mediaType: "video"
    },
    {
      id: 3,
      title: "REC Launch",
      type: "event",
      date: "January 2025",
      location: "Harare",
      tags: ["launch", "education"],
      description: "Workshop providing training on REC certification process and benefits for local energy producers.",
      imageUrl: "/zimrec1.jpeg",
      mediaType: "image"
    },
    {
      id: 4,
      title: "REC Launch",
      type: "event",
      date: "January 2025",
      location: "Harare",
      tags: ["launch", "education"],
      description: "Workshop providing training on REC certification process and benefits for local energy producers.",
      imageUrl: "/zimrec2.jpeg",
      mediaType: "image"
    },
    {
      id: 5,
      title: "REC Training Workshop",
      type: "event",
      date: "January 2025",
      location: "Mutare",
      tags: ["training", "education"],
      description: "Workshop providing training on REC certification process and benefits for local energy producers.",
      imageUrl: "/zimrec4.jpeg",
      mediaType: "image"
    },
    {
      id: 6,
      title: "Community Hydro Project",
      type: "project",
      date: "December 2024",
      location: "Victoria Falls",
      tags: ["hydro", "community"],
      description: "Small-scale hydro project developed in partnership with local communities near Victoria Falls.",
      imageUrl: "/api/placeholder/600/400",
      mediaType: "image"
    },
    {
      id: 7,
      title: "Corporate Partnership Signing",
      type: "event",
      date: "November 2024",
      location: "Harare",
      tags: ["corporate", "partnership"],
      description: "Signing ceremony marking a major corporate partnership to support renewable energy initiatives.",
      imageUrl: "/api/placeholder/600/350",
      mediaType: "image"
    },
    {
      id: 8,
      title: "Solar Farm Inspection",
      type: "project",
      date: "October 2024",
      location: "Gweru",
      tags: ["solar", "audit"],
      description: "Third-party auditors performing verification for REC certification of a major solar farm.",
      imageUrl: "/api/placeholder/600/450",
      mediaType: "image"
    },
    {
      id: 9,
      title: "Green Energy Conference",
      type: "event",
      date: "September 2024",
      location: "Victoria Falls",
      tags: ["conference", "education"],
      description: "Annual conference bringing together stakeholders in Zimbabwe's renewable energy sector.",
      imageUrl: "/api/placeholder/600/500",
      mediaType: "image"
    },
  ];

  // Filter gallery items based on active filter
  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => 
        item.type === activeFilter || 
        item.tags.includes(activeFilter));

  // Randomize layout on load and periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateImages(true);
      setTimeout(() => setAnimateImages(false), 800);
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle lightbox navigation
  const navigateLightbox = (direction) => {
    const currentIndex = galleryItems.findIndex(item => item.id === currentImage.id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % galleryItems.length;
    } else {
      newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    }
    
    setCurrentImage(galleryItems[newIndex]);
  };

  // Pause video when lightbox closes
  useEffect(() => {
    if (!lightboxOpen && lightboxVideoRef.current) {
      lightboxVideoRef.current.pause();
    }
  }, [lightboxOpen]);

  // Scroll animation for the gallery header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        controls.start({ opacity: 0.8, scale: 0.95 });
      } else {
        controls.start({ opacity: 1, scale: 1 });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Random rotation for masonry layout
  const getRandomRotation = () => {
    return animateImages ? Math.random() * 4 - 2 : 0;
  };
  
  // Generate tag filters from all available tags
  const allTags = [...new Set(galleryItems.flatMap(item => item.tags))];

  // Handle toggle mute
  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    
    if (lightboxVideoRef.current) {
      lightboxVideoRef.current.muted = !isMuted;
    }
  };

  // Render media item based on type
  const renderMedia = (item, isLightbox = false) => {
    if (item.mediaType === "video") {
      return (
        <div className="relative w-full h-full">
          <video 
            ref={isLightbox ? lightboxVideoRef : videoRef}
            src={item.imageUrl} 
            className={`w-full h-full ${isLightbox ? 'object-contain' : 'object-cover'}`}
            muted={isMuted}
            controls={isLightbox}
            autoPlay={isLightbox}
            loop={isLightbox}
          />
          {!isLightbox && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/30 rounded-full p-3">
                <Play size={24} color="white" />
              </div>
            </div>
          )}
          {isLightbox && (
            <IconButton 
              className="!absolute !bottom-4 !right-4 !bg-black/30 !text-white"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
          )}
        </div>
      );
    } else {
      return (
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className={`w-full h-full ${isLightbox ? 'object-contain' : 'object-cover'} transition-transform duration-500 group-hover:scale-105`}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-12 md:py-16"
        animate={controls}
        initial={{ opacity: 1, scale: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                className="w-16 h-16 rounded-full overflow-hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                  <ImageIcon size={32} color="white" />
                </div>
              </motion.div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Zim-REC <span className="text-emerald-500">Gallery</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our collection of renewable energy projects, events, and initiatives across Zimbabwe.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Chip 
              label="All" 
              onClick={() => setActiveFilter("all")}
              className={`!font-medium !px-3 !py-3 !rounded-full ${activeFilter === 'all' ? '!bg-blue-600 !text-white' : '!bg-white !text-gray-700'}`}
            />
            <Chip 
              label="Projects" 
              onClick={() => setActiveFilter("project")}
              className={`!font-medium !px-3 !py-3 !rounded-full ${activeFilter === 'project' ? '!bg-emerald-500 !text-white' : '!bg-white !text-gray-700'}`}
            />
            <Chip 
              label="Events" 
              onClick={() => setActiveFilter("event")}
              className={`!font-medium !px-3 !py-3 !rounded-full ${activeFilter === 'event' ? '!bg-emerald-500 !text-white' : '!bg-white !text-gray-700'}`}
            />
            {allTags.map(tag => (
              <Chip 
                key={tag}
                label={tag} 
                icon={<Tag size={14} />}
                onClick={() => setActiveFilter(tag)}
                className={`!font-medium !px-2 !py-3 !rounded-full ${activeFilter === tag ? '!bg-emerald-500 !text-white' : '!bg-white !text-gray-700'}`}
              />
            ))}
          </motion.div>

          {/* Layout Controls */}
          <motion.div 
            className="flex justify-center mb-8 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant={layout === "grid" ? "contained" : "outlined"}
              onClick={() => setLayout("grid")}
              startIcon={<GridIcon size={18} />}
              className={layout === "grid" ? "!bg-blue-600" : "!border-blue-600 !text-blue-600"}
            >
              Grid
            </Button>
            <Button 
              variant={layout === "masonry" ? "contained" : "outlined"}
              onClick={() => setLayout("masonry")}
              startIcon={<ImageIcon size={18} />}
              className={layout === "masonry" ? "!bg-emerald-500" : "!border-emerald-500 !text-emerald-500"}
            >
              Masonry
            </Button>
          </motion.div>

          {/* Gallery */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={`${layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "columns-1 sm:columns-2 lg:columns-3 gap-6"}`}
            ref={scrollRef}
          >
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  className={`${layout === "masonry" ? "mb-6 inline-block w-full" : ""}`}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  style={{ 
                    rotate: layout === "masonry" ? getRandomRotation() : 0,
                    transformOrigin: "center"
                  }}
                >
                  <Card className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <div 
                        className="aspect-w-16 aspect-h-9 bg-blue-50 cursor-pointer"
                        onClick={() => {
                          setCurrentImage(item);
                          setLightboxOpen(true);
                        }}
                      >
                        {renderMedia(item)}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <Typography className="text-white font-bold">{item.title}</Typography>
                            <div className="flex items-center text-white/80 text-sm mt-1">
                              <Calendar size={14} className="mr-1" /> {item.date}
                              <span className="mx-2">•</span>
                              <MapPin size={14} className="mr-1" /> {item.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      <IconButton 
                        className="!absolute !top-2 !right-2 !bg-white/70 !opacity-0 !group-hover:opacity-100 !transition-opacity !duration-300"
                        size="small"
                        onClick={() => {
                          setCurrentImage(item);
                          setLightboxOpen(true);
                        }}
                      >
                        <Maximize size={16} />
                      </IconButton>
                      
                      {item.mediaType === "video" && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs py-1 px-2 rounded-full font-medium">
                          Video
                        </div>
                      )}
                    </div>
                    <Box className="p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Chip 
                          label={item.type === "project" ? "Project" : "Event"} 
                          size="small"
                          className={`!text-xs ${item.type === "project" ? "!bg-blue-100 !text-blue-600" : "!bg-emerald-100 !text-emerald-600"}`}
                        />
                        {item.tags.slice(0, 2).map(tag => (
                          <Chip 
                            key={tag}
                            label={tag}
                            size="small"
                            className="!bg-gray-100 !text-gray-600 !text-xs"
                          />
                        ))}
                      </div>
                      <Typography variant="subtitle1" className="font-bold text-gray-800 mb-1">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 line-clamp-2">
                        {item.description}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <IconButton 
                className="!absolute !top-2 !right-2 !bg-black/30 !text-white !z-10"
                onClick={() => setLightboxOpen(false)}
              >
                <X />
              </IconButton>
              
              <div className="bg-black rounded-t-lg overflow-hidden flex items-center justify-center" style={{ maxHeight: '70vh' }}>
                {renderMedia(currentImage, true)}
              </div>
              
              <div className="bg-white p-4 rounded-b-lg">
                <Typography variant="h5" className="font-bold mb-2">
                  {currentImage.title}
                </Typography>
                
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" /> {currentImage.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" /> {currentImage.location}
                  </div>
                  {currentImage.mediaType === "video" && (
                    <div className="flex items-center">
                      <Play size={16} className="mr-1" /> Video
                    </div>
                  )}
                </div>
                
                <Typography variant="body1" className="text-gray-600 mb-4">
                  {currentImage.description}
                </Typography>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Chip 
                    label={currentImage.type === "project" ? "Project" : "Event"} 
                    className={currentImage.type === "project" ? "!bg-blue-100 !text-blue-600" : "!bg-emerald-100 !text-emerald-600"}
                  />
                  {currentImage.tags.map(tag => (
                    <Chip 
                      key={tag}
                      label={tag}
                      className="!bg-gray-100 !text-gray-600"
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    className="!border-blue-600 !text-blue-600"
                  >
                    Download
                  </Button>
                  
                  <div className="flex gap-2">
                    <IconButton 
                      className="!bg-gray-100"
                      onClick={() => navigateLightbox("prev")}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton 
                      className="!bg-gray-100"
                      onClick={() => navigateLightbox("next")}
                    >
                      <ChevronRight />
                    </IconButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-700 to-emerald-600 rounded-2xl p-6 md:p-12 shadow-xl text-center"
          >
            <Typography variant="h4" className="font-bold text-white mb-4">
              Become Part of Our Renewable Energy Journey
            </Typography>
            <Typography variant="body1" className="text-blue-50 max-w-2xl mx-auto mb-8">
              Join Zimbabwe's renewable energy movement. Register your project today for REC certification or contact us to learn more about our initiatives.
            </Typography>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="contained"
                className="!bg-emerald-500 !hover:bg-emerald-400 !text-blue-900 !px-6 !py-2.5 !rounded-full !font-medium !shadow-md"
              >
                Register Your Project
              </Button>
              <Button
                variant="outlined"
                className="!border-white !text-white !hover:bg-white/10 !px-6 !py-2.5 !rounded-full !font-medium"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;