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
  Car,
  AlertCircle,
  AtSign,
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
      <Dialog open={!!openType} onClose={onClose} maxWidth="xs" fullWidth>
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="p-6 space-y-6"
        >
          <div className="text-center">
            <div className="animate-bounce mx-auto w-fit p-3 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl mb-4">
              <Car className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {view === "login" ? "Welcome Back!" : "Join Auto Eden"}
            </h2>
            <p className="text-gray-600">
              {view === "login"
                ? "Sign in to continue"
                : "Create your free account"}
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
                  startAdornment: <AtSign className="text-gray-400 mr-2" />,
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
                startAdornment: <User className="text-gray-400 mr-2" />,
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
                startAdornment: <Lock className="text-gray-400 mr-2" />,
              }}
            />
          </div>

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="!rounded-xl !py-3 !text-base !font-semibold !shadow-lg"
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
            className="!rounded-xl !py-2.5 !text-gray-700"
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