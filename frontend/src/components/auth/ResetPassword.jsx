import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { confirmPasswordReset } from "../../redux/slices/authSlice";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordResetLoading } = useSelector((state) => state.auth);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [linkExpired, setLinkExpired] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    dispatch(confirmPasswordReset({ uid, token, new_password: newPassword }))
      .unwrap()
      .then(() => {
        toast.success("Password has been reset successfully!");
        navigate("/?login=true");
      })
      .catch((err) => {
        const detail = err?.detail || "Password reset failed.";
        if (detail.toLowerCase().includes("expired") || detail.toLowerCase().includes("invalid")) {
          setLinkExpired(true);
        }
        setError(detail);
      });
  };

  const inputClass =
    "w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500" />

          <div className="p-7 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto w-14 h-14 mb-4 overflow-hidden">
                <img src="/logo.png" alt="Zim-REC Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Set new password</h2>
              <p className="text-sm text-gray-500">
                Enter your new password below
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <span>{error}</span>
                  {linkExpired && (
                    <Link
                      to="/"
                      className="block mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                      onClick={() => {
                        // Will navigate to home, user can click "Forgot password?" from login modal
                      }}
                    >
                      Request a new reset link
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="text-gray-400 hover:text-gray-600 transition-colors" size={18} />
                    ) : (
                      <Eye className="text-gray-400 hover:text-gray-600 transition-colors" size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-gray-400 hover:text-gray-600 transition-colors" size={18} />
                    ) : (
                      <Eye className="text-gray-400 hover:text-gray-600 transition-colors" size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordResetLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl py-3 text-sm font-semibold shadow-sm transition-colors"
              >
                {passwordResetLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
