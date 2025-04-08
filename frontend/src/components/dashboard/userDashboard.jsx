import React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDashboardData,
  selectUserDevices,
  selectUserIssueRequests,
  selectRecentSubmissions,
} from "../../redux/selectors";
import { StatsCard, EnergyPieChart, RecentActivityList } from "./analytics";
import { DataTable } from "./analytics";
import { fadeIn, staggerChildren } from "./animations";
import DeviceUploadStepper from "./deviceUpload";
import { useState } from "react";
import {
  Fab,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { X, SquarePlus } from "lucide-react";
import { createDevice } from "../../redux/slices/deviceSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  

  const dashboardData = useSelector(selectDashboardData);
  const recentDevices = useSelector((state) =>
    selectRecentSubmissions(state, 7)
  );

  return (
    <motion.div
      className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Stats Grid */}
        <motion.div
          variants={fadeIn}
          className="grid md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          <StatsCard
            title="Total Devices"
            value={dashboardData.totalDevices}
            trend={recentDevices.length}
            label="New this week"
            icon="device"
            compact={isMobile}
          />
          <StatsCard
            title="Active Devices"
            value={dashboardData.activeDevices}
            percentage={
              (dashboardData.activeDevices / dashboardData.totalDevices) * 100
            }
            icon="check"
            compact={isMobile}
          />
          <StatsCard
            title="Pending Requests"
            value={dashboardData.pendingRequests}
            color="warning"
            icon="alert"
            compact={isMobile}
          />
          <StatsCard
            title="Total Production"
            value={Object.values(dashboardData.energyStats).reduce(
              (a, b) => a + b,
              0
            )}
            unit="MWh"
            icon="energy"
            compact={isMobile}
          />
        </motion.div>

        {/* Energy Distribution Pie Chart */}
        <motion.div variants={fadeIn} className="mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Energy Distribution
            </h2>
            <div className="h-60 md:h-80">
              <EnergyPieChart data={dashboardData.energyStats} />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={fadeIn}
          className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Recent Devices
            </h2>
            <RecentActivityList items={recentDevices} type="device" />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
              Recent Requests
            </h2>
            <RecentActivityList
              items={useSelector(selectUserIssueRequests).slice(-5)}
              type="request"
            />
          </div>
        </motion.div>

        {/* Interactive Data Tables */}
        <AnimatePresence>
          <motion.div variants={fadeIn} className="space-y-6 md:space-y-8">
            <DataTable
              title="My Devices"
              data={useSelector(selectUserDevices)}
              type="device"
              compact={isMobile}
            />
            <DataTable
              title="My Issue Requests"
              data={useSelector(selectUserIssueRequests)}
              type="request"
              compact={isMobile}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Floating Action Button */}
      <motion.div
      className="fixed z-50 bottom-6 right-4 md:bottom-8 md:right-8 pr-12 pb-20"
      initial={{ scale: isMobile ? 1 : 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: isMobile ? 1 : 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      key={isMobile ? "mobile-fab" : "desktop-fab"}  // Force re-render on breakpoint change
    >
      <Fab
        color="primary"
        aria-label="add"
        className="bg-green-600 hover:bg-green-700 shadow-xl"
        onClick={() => setOpen(true)}
        size={isMobile ? "medium" : "large"}
        sx={{
          '&.MuiFab-root': {
            width: isMobile ? 56 : 64,
            height: isMobile ? 56 : 64,
          }
        }}
      >
        <SquarePlus
          className="text-white"
          size={isMobile ? 24 : 28}
          strokeWidth={1.5}
        />
      </Fab>
    </motion.div>

    <DeviceUploadStepper
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
    />
    </motion.div>
  );
};

export default UserDashboard;
