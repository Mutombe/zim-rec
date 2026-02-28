import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { logout, login, register, googleLogin } from "../../redux/slices/authSlice";
import {
  ImageIcon,
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
  Eye,
  EyeOff,
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
  InputAdornment,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export function AuthHeader({ view }) {
  return (
    <div className="text-center">
      <div className="mx-auto w-16 h-16 mb-4">
        <img
          src="/logo.png"
          alt="Zim-REC Logo"
          className="rounded-2xl w-full h-full"
        />
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
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
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
      setShowPassword(false);
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
            message: "Registration successful. You may Sign-In",
            severity: "success",
          });
          onClose();
        })
        .catch((err) => {
          console.error("Registration Failed:", err);
        });
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin({ credential: credentialResponse.credential }))
      .unwrap()
      .then(() => {
        setSnackbar({
          open: true,
          message: "Signed in with Google!",
          severity: "success",
        });
        onClose();
      })
      .catch((err) => {
        console.error("Google Login Failed:", err);
      });
  };

  const handleGoogleError = () => {
    setSnackbar({
      open: true,
      message: "Google sign-in failed. Please try again.",
      severity: "error",
    });
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
      <Dialog
        open={!!openType}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            className: "!rounded-2xl !overflow-hidden",
          },
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Gradient header strip */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

          <div className="p-7 space-y-5">
            <div className="text-center">
              <div className="mx-auto w-14 h-14 mb-4 rounded-xl overflow-hidden shadow-sm ring-2 ring-gray-100">
                <img
                  src="/logo.png"
                  alt="Zim-REC Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {view === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-gray-500">
                {view === "login"
                  ? "Sign in to continue to your dashboard"
                  : "Get started with free REC trading"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-red-700 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {view === "register"
                    ? getRegistrationError()
                    : typeof error === "object"
                    ? error.detail || JSON.stringify(error)
                    : error}
                </span>
              </motion.div>
            )}

            <div className="space-y-5">
              {view === "register" && (
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  size="small"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <AtSign className="text-gray-400 mr-2" size={18} />
                    ),
                  }}
                  className="[&_.MuiOutlinedInput-root]:!rounded-xl"
                />
              )}

              <TextField
                fullWidth
                label="Username"
                size="small"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <User className="text-gray-400 mr-2" size={18} />
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:!rounded-xl"
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                size="small"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <Lock className="text-gray-400 mr-2" size={18} />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <EyeOff className="text-gray-400" size={18} />
                        ) : (
                          <Eye className="text-gray-400" size={18} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:!rounded-xl"
              />
            </div>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !py-3 !text-sm !font-semibold !shadow-sm !normal-case"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : view === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="relative my-5">
              <Divider className="!text-gray-400 !text-xs">or</Divider>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                shape="pill"
                text={view === "login" ? "signin_with" : "signup_with"}
              />
            </div>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setView(view === "login" ? "register" : "login")}
              className="!rounded-xl !py-2.5 !text-gray-600 !border-gray-200 hover:!border-emerald-300 hover:!bg-emerald-50 !normal-case !text-sm !font-medium"
            >
              {view === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
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

export function Logo() {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-emerald-100 group-hover:ring-emerald-200 transition-all">
          <img src="/logo.png" alt="Zim-REC Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          Zim-<span className="text-emerald-600">REC</span>
        </span>
      </Link>
    </div>
  );
}

export const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [authModal, setAuthModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const location = useLocation();
  const isAdmin = user?.is_superuser;

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
    { name: "Gallery", path: "/gallery", icon: <ImageIcon size={18} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50/80"
                      : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                  }`}
                >
                  <span className={`mr-2 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"
                  }`}>
                    {link.icon}
                  </span>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                {[
                  { to: "/documentation", icon: <FileText size={18} />, label: "Documentation" },
                  { to: "/issue-requests", icon: <LayoutDashboard size={18} />, label: "Issue Requests" },
                  { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Devices" },
                ].map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        isActive
                          ? "text-emerald-700 bg-emerald-50/80"
                          : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`mr-2 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"
                      }`}>
                        {item.icon}
                      </span>
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Button */}
            {/* Right Section - Mobile Menu Button */}
            <button
              className="block md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </button>

            {/* Search Button 
            <Tooltip title="Search">
              <IconButton className="!text-gray-600 hover:!text-green-600 !hidden md:!flex">
                <Search size={20} />
              </IconButton>
            </Tooltip>*/}

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {/* User Menu */}
                <div className="flex items-center">
                  <Button
                    onClick={handleUserMenuClick}
                    className="!flex !items-center !gap-2 !px-2 !py-1.5 !text-gray-700 hover:!bg-gray-50 !rounded-xl !normal-case !min-w-0"
                    endIcon={<ChevronDown size={14} className="text-gray-400" />}
                  >
                    <Avatar className="!h-8 !w-8 !bg-gradient-to-br !from-emerald-500 !to-blue-600 !text-sm !font-semibold">
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium">{user?.username}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<LogIn size={16} />}
                  onClick={() => setAuthModal("login")}
                  className="!border-gray-300 !text-gray-700 hover:!border-emerald-500 hover:!text-emerald-700 hover:!bg-emerald-50 !rounded-lg !text-sm !normal-case !font-medium !px-4"
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={16} />}
                  onClick={() => setAuthModal("register")}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-lg !text-sm !normal-case !font-medium !shadow-sm !px-4"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop + Slide Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Slide Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl"
            >
              <div className="p-5 h-full flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                  <Link
                    to="/"
                    className="flex items-center gap-2.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden">
                      <img src="/logo.png" alt="Zim-REC Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Zim-<span className="text-emerald-600">REC</span>
                    </span>
                  </Link>
                  <IconButton
                    onClick={() => setMobileMenuOpen(false)}
                    className="!bg-gray-100 !rounded-lg"
                    size="small"
                  >
                    <X className="text-gray-600" size={20} />
                  </IconButton>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-3 py-5 border-b border-gray-100">
                    <Avatar className="!h-10 !w-10 !bg-gradient-to-br !from-emerald-500 !to-blue-600 !text-sm !font-semibold">
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email || "Member"}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-1 flex-1 flex flex-col">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center p-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`p-2 rounded-lg mr-3 ${
                          isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                        }`}>
                          {link.icon}
                        </span>
                        <span className="font-medium text-sm">{link.name}</span>
                      </Link>
                    );
                  })}

                  {isAuthenticated && (
                    <>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 mt-5">Manage</p>
                      {[
                        { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Devices" },
                        { to: "/issue-requests", icon: <FileText size={18} />, label: "Issue Requests" },
                        ...(isAdmin ? [{ to: "/admin", icon: <Shield size={18} />, label: "Admin Dashboard" }] : []),
                        { to: "/settings", icon: <User size={18} />, label: "My Profile" },
                      ].map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center p-3 rounded-xl transition-colors ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className={`p-2 rounded-lg mr-3 ${
                              isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                            }`}>
                              {item.icon}
                            </span>
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </>
                  )}

                  <div className="mt-auto border-t border-gray-100 pt-5">
                    {isAuthenticated ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        className="!border-red-200 !text-red-600 hover:!bg-red-50 !rounded-xl !py-2.5 !normal-case !font-medium"
                        startIcon={<LogOut size={18} />}
                        onClick={() => {
                          dispatch(logout());
                          setMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<UserPlus size={16} />}
                          onClick={() => {
                            setAuthModal("register");
                            setMobileMenuOpen(false);
                          }}
                          className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !py-2.5 !normal-case !font-medium !shadow-sm"
                        >
                          Create Account
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<LogIn size={16} />}
                          onClick={() => {
                            setAuthModal("login");
                            setMobileMenuOpen(false);
                          }}
                          className="!border-gray-300 !text-gray-700 hover:!border-emerald-500 !rounded-xl !py-2.5 !normal-case !font-medium"
                        >
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* User Dropdown Menu */}
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            className: "!mt-2 !rounded-xl !shadow-lg !border !border-gray-100 !min-w-[220px]",
          },
        }}
      >
        <MenuItem onClick={handleUserMenuClose} component={Link} to="/settings">
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
          <ListItemText>Device Registration</ListItemText>
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={handleUserMenuClose} component={Link} to="/admin">
            <ListItemIcon>
              <Shield size={18} className="text-green-600" />
            </ListItemIcon>
            <ListItemText>Admin Dashboard</ListItemText>
          </MenuItem>
        )}
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

      {/* Notifications Dropdown 
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
      </MuiMenu>*/}

      <AuthModals openType={authModal} onClose={() => setAuthModal(null)} />
    </nav>
  );
};

export default Navbar;
