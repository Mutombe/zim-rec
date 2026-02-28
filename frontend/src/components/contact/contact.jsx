import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Zap,
  Calendar,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../utils/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      mapInstanceRef.current = L.map(mapRef.current).setView(
        [-17.824858, 31.053028],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      const locations = [
        {
          name: "Jackson Road Office",
          coords: [-17.8419276, 31.073675],
          address: "8 Jackson Road, Hillside, Harare",
        },
        {
          name: "NRZ Complex Office",
          coords: [-17.8394377, 31.0475358],
          address: "NRZ Complex, Seke Road, Harare",
        },
      ];

      locations.forEach((location) => {
        const marker = L.marker(location.coords).addTo(mapInstanceRef.current);
        marker.bindPopup(
          `<b>${location.name}</b><br>${location.address}`
        );
      });

      const bounds = L.latLngBounds(locations.map((loc) => loc.coords));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-2xl" />;
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      tempErrors.email = "Email is not valid";
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("contact/", formData);
      toast.success("Your message has been sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Failed to send message. Please try again.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-20 pb-16 relative">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-32 -left-32 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 p-3 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about renewable energy certificates or want to learn
            more about our platform? Our team is here to help.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-5 gap-8"
        >
          {/* Contact Form */}
          <motion.div className="lg:col-span-3" variants={itemAnimation}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Send Us a Message
                </h2>
                <p className="text-blue-50 text-sm mt-0.5">
                  We'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.name ? "!border-red-400 !ring-red-200" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.email ? "!border-red-400 !ring-red-200" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none ${errors.message ? "!border-red-400 !ring-red-200" : ""}`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-semibold shadow-sm transition-colors"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={itemAnimation}
          >
            {/* Contact Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <MapPin className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Office Locations
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      8 Jackson Road, Hillside
                      <br />
                      Harare, Zimbabwe
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      NRZ Complex, Seke Road
                      <br />
                      Harare, Zimbabwe
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Phone className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Phone Numbers
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      +263 71 678 0112
                      <br />
                      +263 77 770 0465
                      <br />
                      +263 78 004 9196
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Mail className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">
                      Email Address
                    </p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      admin@zim-rec.co.zw
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">
                Business Hours
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Clock className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-gray-700 text-sm">
                      Monday - Friday
                    </span>
                    <span className="text-gray-600 text-sm">
                      8:00 AM - 5:00 PM
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100" />

                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Calendar className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-gray-700 text-sm">
                      Saturday
                    </span>
                    <span className="text-gray-600 text-sm">
                      9:00 AM - 1:00 PM
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100" />

                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
                    <Sun className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="flex justify-between w-full">
                    <span className="font-medium text-gray-700 text-sm">
                      Sunday
                    </span>
                    <span className="text-gray-600 text-sm">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          className="mt-12 rounded-2xl overflow-hidden shadow-lg h-72 md:h-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-full h-full bg-white">
            <MapComponent />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
