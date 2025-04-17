import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  FileText,
  Download,
  Search,
  Filter,
  BookOpen,
  Eye,
  Star,
  Calendar,
  FileArchive,
  ChevronRight,
  Tag,
  X,
  HelpCircle,
  Bookmark,
} from "lucide-react";

const DocumentationPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState([]);

  // Sample document data
  const documents = [
    {
      id: 1,
      title: "Device Registration Process",
      description: "Step-by-step guide for registering renewable energy devices",
      category: "Procedures",
      dateAdded: "February 18, 2025",
      fileSize: "2.1 MB",
      fileType: "PDF",
      downloads: 87,
      featured: false,
      tags: ["Registration", "Process", "Steps"],
      thumbnailBg: "from-emerald-100 to-blue-100",
    },
  ];

  // Filter and category options
  const categories = ["All", "Guides", "Procedures", "Reports", "Technical"];
  const filterOptions = ["Featured", "Most Downloaded", "Recently Added"];

  // Filter functions
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle filter selection
  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Sort documents based on active filters
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (activeFilters.includes("Featured") && a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    if (activeFilters.includes("Most Downloaded")) {
      return b.downloads - a.downloads;
    }
    if (activeFilters.includes("Recently Added")) {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <div className="inline-block bg-emerald-100 p-2 rounded-full mb-4">
              <FileText size={32} className="text-emerald-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Documentation Resources
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access our comprehensive collection of guides, procedures, 
              technical documents, and reports for the Zim-REC program.
            </p>
          </motion.div>

          {/* Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Paper elevation={0} className="p-6 shadow-md rounded-xl mb-8">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search for documents..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search className="text-gray-400" size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")}>
                            <X size={16} />
                          </IconButton>
                        </InputAdornment>
                      ),
                      className: "bg-gray-50 rounded-lg",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <div className="flex flex-wrap gap-2">
                    <Typography variant="subtitle2" className="flex items-center mr-2">
                      <Filter size={16} className="mr-1" />
                      Filters:
                    </Typography>
                    {filterOptions.map((filter) => (
                      <Chip
                        key={filter}
                        label={filter}
                        onClick={() => toggleFilter(filter)}
                        color={activeFilters.includes(filter) ? "primary" : "default"}
                        size="small"
                        className={activeFilters.includes(filter) ? "!bg-blue-600" : ""}
                      />
                    ))}
                  </div>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex overflow-x-auto pb-4 hide-scrollbar mb-6"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "contained" : "outlined"}
                className={`mr-3 !rounded-full !px-5 !py-1.5 !min-w-[100px] ${
                  selectedCategory === category
                    ? "!bg-blue-600 !text-white"
                    : "!border-gray-300 !text-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {sortedDocuments.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h5" className="font-bold text-gray-900">
                  {selectedCategory === "All" 
                    ? "All Documents" 
                    : `${selectedCategory} Documents`}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Showing {sortedDocuments.length} of {documents.length} documents
                </Typography>
              </div>
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {sortedDocuments.map((doc) => (
                  <motion.div key={doc.id} variants={itemAnimation}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden border border-gray-100">
                      <div className="relative">
                        <div className={`h-36 bg-gradient-to-br ${doc.thumbnailBg} flex items-center justify-center`}>
                          <FileText size={48} className="text-gray-600 opacity-50" />
                        </div>
                        {doc.featured && (
                          <div className="absolute top-3 right-3">
                            <Chip 
                              icon={<Star size={14} />} 
                              label="Featured" 
                              size="small"
                              className="!bg-amber-500 !text-white"
                            />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center mb-2">
                          <Chip
                            label={doc.category}
                            size="small"
                            className="!bg-blue-100 !text-blue-700 !text-xs"
                          />
                          <Typography variant="caption" className="ml-auto text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {doc.dateAdded}
                          </Typography>
                        </div>
                        
                        <Typography variant="h6" className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {doc.title}
                        </Typography>
                        
                        <Typography variant="body2" className="text-gray-600 mb-4 line-clamp-2">
                          {doc.description}
                        </Typography>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {doc.tags.map((tag, idx) => (
                            <Chip
                              key={idx}
                              label={tag}
                              size="small"
                              variant="outlined"
                              className="!text-xs !border-gray-300"
                              icon={<Tag size={12} />}
                            />
                          ))}
                        </div>
                        
                        <Divider className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-500 text-sm">
                            <FileArchive size={16} className="mr-1" />
                            <span>{doc.fileSize} {doc.fileType}</span>
                            <Tooltip title="Download count" arrow>
                              <div className="ml-3 flex items-center">
                                <Download size={14} className="mr-1" />
                                <span>{doc.downloads}</span>
                              </div>
                            </Tooltip>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Eye size={16} />}
                              className="!border-gray-300 !text-gray-700 !rounded-lg"
                            >
                              Preview
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Download size={16} />}
                              className="!bg-blue-600 !hover:bg-blue-700 !rounded-lg"
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <SearchIcon size={28} className="text-gray-400" />
              </div>
              <Typography variant="h6" className="text-gray-700 mb-2">
                No documents found
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setActiveFilters([]);
                }}
                className="!border-blue-600 !text-blue-600"
              >
                Clear all filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Paper elevation={0} className="rounded-2xl overflow-hidden shadow-lg">
            <Grid container>
              <Grid item xs={12} md={4}>
                <div className="h-full bg-gradient-to-br from-blue-700 to-emerald-600 p-8 flex flex-col justify-center">
                  <HelpCircle size={32} className="text-white mb-4" />
                  <Typography variant="h5" className="text-white font-bold mb-3">
                    Need Help?
                  </Typography>
                  <Typography variant="body2" className="text-blue-50 mb-6">
                    Our team is available to assist with any questions about our documentation resources.
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ChevronRight size={16} />}
                    className="!bg-white !text-blue-700 !hover:bg-blue-50 !w-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <div className="p-8">
                  <Typography variant="h5" className="font-bold text-gray-900 mb-4">
                    Popular Resources
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Getting Started Guide",
                        icon: <BookOpen size={20} />,
                        desc: "Introduction to the REC program",
                      },
                      {
                        title: "Financial Benefits",
                        icon: <Tag size={20} />,
                        desc: "How to maximize returns",
                      },
                      {
                        title: "Technical FAQs",
                        icon: <HelpCircle size={20} />,
                        desc: "Answers to common questions",
                      },
                      {
                        title: "Trading Guidelines",
                        icon: <FileText size={20} />,
                        desc: "How to trade certificates",
                      },
                    ].map((item, idx) => (
                      <Paper
                        key={idx}
                        elevation={0}
                        className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <div className="text-blue-600">{item.icon}</div>
                          </div>
                          <div>
                            <Typography variant="subtitle1" className="font-semibold text-gray-900">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              {item.desc}
                            </Typography>
                          </div>
                        </div>
                      </Paper>
                    ))}
                  </div>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" className="font-bold text-gray-900 mb-2">
                Ready to Register Your Project?
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Start the certification process and begin trading your renewable energy certificates.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} className="text-center md:text-right">
              <Button
                variant="contained"
                size="large"
                className="!bg-emerald-500 !hover:bg-emerald-600 !px-6 !py-3 !rounded-full !font-medium !shadow-md"
              >
                Register Your Project
              </Button>
            </Grid>
          </Grid>
        </div>
      </section>
    </div>
  );
};

export default DocumentationPage;