import { React, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@mui/material";
import { logout, login, register } from "../../redux/slices/authSlice";
import {
  Dialog,
  Button,
  TextField,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  AlertCircle,
  AtSign,
  Zap,
} from "lucide-react";

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
            message: "Registration successful. Please verify your email !",
            severity: "success",
          });
          onClose();
          navigate("/email-verify");
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
                className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-red-700 text-sm"
              >
                {view === "register"
                  ? getRegistrationError()
                  : typeof error === "object"
                  ? error.detail || JSON.stringify(error)
                  : error}
              </motion.div>
            )}

            <div className="space-y-3.5">
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
                    startAdornment: <AtSign className="text-gray-400 mr-2" size={18} />,
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
                  startAdornment: <User className="text-gray-400 mr-2" size={18} />,
                }}
                className="[&_.MuiOutlinedInput-root]:!rounded-xl"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                size="small"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                InputProps={{
                  startAdornment: <Lock className="text-gray-400 mr-2" size={18} />,
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