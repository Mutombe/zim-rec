import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { logout, login, register } from "../../redux/slices/authSlice";
import {
  Zap,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Search,
  Menu,
  X,
  Home,
  Bell,
  AlertCircle,
  MapPin,
  AtSign,
  LayoutDashboard,
  Lock,
  Info,
  Phone,
  FileText,
  ChevronDown,
  Settings,
  Shield,
  HelpCircle,
  Book,
} from "lucide-react";
import {
  Dialog,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Badge,
  Box,
  Tooltip,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const AuthModals = ({ openType, onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [view, setView] = useState(openType);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const navigate = useNavigate();

  // Update view when openType changes
  useEffect(() => {
    setView(openType);
  }, [openType]);

  useEffect(() => {
    if (openType) {
      setFormData({
        email: "",
        password: "",
        username: "",
      });
    }
  }, [openType]);

  const handleSubmit = () => {
    if (view === "login") {
      dispatch(
        login({ username: formData.username, password: formData.password })
      )
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "You are logged in!",
            severity: "success",
          });
          onClose();
        })
        .catch((err) => {
          console.error("Login Failed:", err);
        });
    } else {
      dispatch(register(formData))
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: "Registration successful.",
            severity: "success",
          });
          onClose();
        })
        .catch((err) => {
          console.error("Registration Failed:", err);
        });
    }
  };

  const getRegistrationError = () => {
    if (!error) return null;

    // Check for specific error messages
    if (typeof error === "object") {
      if (error.username) return error.username[0];
      if (error.email) return error.email[0];
      if (error.detail) return error.detail;
    }

    // Fallback to generic error message
    return error.toString();
  };

  return (
    <>
      <Dialog open={!!openType} onClose={onClose} maxWidth="xs" fullWidth>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-6 space-y-6"
        >
          <div className="text-center">
            <div className="mx-auto w-fit p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mb-4">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {view === "login" ? "Welcome Back!" : "Join Zim-Rec"}
            </h2>
            <p className="text-gray-600">
              {view === "login"
                ? "Sign in to continue to your account"
                : "Create your free REC trading account"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 p-3 rounded-lg text-red-700 text-sm"
            >
              {view === "register"
                ? getRegistrationError()
                : typeof error === "object"
                ? error.detail || JSON.stringify(error)
                : error}
            </motion.div>
          )}

          <div className="space-y-4">
            {view === "register" && (
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <AtSign className="text-gray-400 mr-2" size={18} />
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <User className="text-gray-400 mr-2" size={18} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <Lock className="text-gray-400 mr-2" size={18} />
                ),
              }}
            />
          </div>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="!bg-green-600 !hover:bg-green-700 !rounded-xl !py-3 !text-base !font-semibold !shadow-lg"
          >
            {status === "loading" ? (
              <span className="animate-pulse">Processing...</span>
            ) : view === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <Divider className="!my-6">or</Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => setView(view === "login" ? "register" : "login")}
            className="!rounded-xl !py-2.5 !text-gray-700 !border-green-600 !text-green-700"
          >
            {view === "login"
              ? "Create New Account"
              : "Already have an account? Sign In"}
          </Button>
        </motion.div>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          className="!items-center"
          iconMapping={{
            error: <AlertCircle className="w-5 h-5" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full mr-2">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="ml-1 text-xl font-bold text-gray-900">
                Zim-
                <span className="text-green-600">REC</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-green-600 flex items-center px-3 py-2 rounded-md hover:bg-green-50 transition-colors group"
              >
                <span className="text-green-600 mr-2 group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  to="/issue-requests"
                  className="text-gray-700 hover:text-green-600 flex items-center px-3 py-2 rounded-md hover:bg-green-50 transition-colors group"
                >
                  <span className="text-green-600 mr-2 group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={18} />
                  </span>
                  Issue Requests
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-green-600 flex items-center px-3 py-2 rounded-md hover:bg-green-50 transition-colors group"
                >
                  <span className="text-green-600 mr-2 group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={18} />
                  </span>
                  Dashboard
                </Link>

              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Button */}
            <IconButton
              className="md:hidden text-green-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </IconButton>

            {/* Search Button */}
            <Tooltip title="Search">
              <IconButton className="!text-gray-600 hover:!text-green-600 !hidden md:!flex">
                <Search size={20} />
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton onClick={handleNotificationClick}>
                    <Badge badgeContent={3} color="error">
                      <Bell
                        className="text-gray-600 hover:text-green-600"
                        size={20}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Menu */}
                <div className="flex items-center gap-1">
                  <Button
                    onClick={handleUserMenuClick}
                    className="!flex !items-center !space-x-2 !px-2 !text-gray-700 !hover:bg-green-50"
                    endIcon={<ChevronDown size={16} />}
                  >
                    <Avatar className="!h-8 !w-8 !bg-green-600">
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <span className="hidden lg:block">{user?.username}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<LogIn size={18} />}
                  onClick={() => setAuthModal("login")}
                  className="!border-green-600 !text-green-600 !hover:bg-green-50"
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={18} />}
                  onClick={() => setAuthModal("register")}
                  className="!bg-green-600 !hover:bg-green-700"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <Link
                  to="/"
                  className="flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-full mr-2">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    Zim-<span className="text-green-600">REC</span>
                  </span>
                </Link>
                <IconButton onClick={() => setMobileMenuOpen(false)}>
                  <X className="text-gray-600" />
                </IconButton>
              </div>

              <div className="mt-6 space-y-1 flex-1">
                {/* Search bar for mobile */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Search"
                  />
                </div>

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center p-3 rounded-lg hover:bg-green-50 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="bg-green-100 p-2 rounded-lg mr-4 text-green-600">
                      {link.icon}
                    </span>
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}

                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center p-3 rounded-lg hover:bg-green-50 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="bg-green-100 p-2 rounded-lg mr-4 text-green-600">
                        <LayoutDashboard size={18} />
                      </span>
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/issue-requests"
                      className="flex items-center p-3 rounded-lg hover:bg-green-50 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="bg-green-100 p-2 rounded-lg mr-4 text-green-600">
                        <FileText size={18} />
                      </span>
                      <span className="font-medium">Issue Request</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center p-3 rounded-lg hover:bg-green-50 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="bg-green-100 p-2 rounded-lg mr-4 text-green-600">
                        <User size={18} />
                      </span>
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/notifications"
                      className="flex items-center p-3 rounded-lg hover:bg-green-50 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="bg-green-100 p-2 rounded-lg mr-4 text-green-600 relative">
                        <Bell size={18} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          3
                        </span>
                      </span>
                      <span className="font-medium">Notifications</span>
                    </Link>
                  </>
                )}

                <div className="mt-auto border-t border-gray-100 pt-4">
                  {isAuthenticated ? (
                    <Button
                      fullWidth
                      variant="outlined"
                      className="!border-red-500 !text-red-500 !mt-4"
                      startIcon={<LogOut size={18} />}
                      onClick={() => {
                        dispatch(logout());
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<LogIn size={18} />}
                        onClick={() => {
                          setAuthModal("login");
                          setMobileMenuOpen(false);
                        }}
                        className="!border-green-600 !text-green-600"
                      >
                        Sign In
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<UserPlus size={18} />}
                        onClick={() => {
                          setAuthModal("register");
                          setMobileMenuOpen(false);
                        }}
                        className="!bg-green-600 !hover:bg-green-700"
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Dropdown Menu */}
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/profile">
          <ListItemIcon>
            <User size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleUserMenuClose}
          component={Link}
          to="/dashboard"
        >
          <ListItemIcon>
            <LayoutDashboard size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/admin">
          <ListItemIcon>
            <LayoutDashboard size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Admin Dashboard</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/settings">
          <ListItemIcon>
            <Settings size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/help">
          <ListItemIcon>
            <HelpCircle size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Help Center</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            dispatch(logout());
            handleUserMenuClose();
          }}
          className="text-red-500"
        >
          <ListItemIcon>
            <LogOut size={18} className="text-red-500" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MuiMenu>

      {/* Notifications Dropdown */}
      <MuiMenu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        className="!mt-2"
      >
        <div className="px-4 py-2 border-b border-gray-100">
          <Typography variant="subtitle2" className="font-bold">
            Notifications
          </Typography>
        </div>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemIcon>
            <Shield size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText
            primary="REC Verification Complete"
            secondary="Your project has been verified successfully"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemIcon>
            <Book size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText
            primary="New REC Policy Update"
            secondary="Check the latest policy changes"
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <ListItemIcon>
            <AlertCircle size={18} className="text-amber-500" />
          </ListItemIcon>
          <ListItemText
            primary="Action Required"
            secondary="Please complete your profile"
          />
        </MenuItem>
        <Divider />
        <MenuItem className="justify-center">
          <Typography variant="body2" className="text-green-600 font-medium">
            View All Notifications
          </Typography>
        </MenuItem>
      </MuiMenu>

      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </nav>
  );
};

export default Navbar;
