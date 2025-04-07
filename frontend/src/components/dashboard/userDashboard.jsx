import React from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { selectDashboardData, selectUserDevices, selectUserIssueRequests, selectRecentSubmissions } from '../../redux/selectors';
import { StatsCard, EnergyPieChart, RecentActivityList } from './analytics';
import { DataTable } from './analytics';
import { fadeIn, staggerChildren } from './animations';
import DeviceUploadStepper from './deviceUpload';
import { useState } from 'react';
import { 
  Fab,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
  Box,
    Typography,
  IconButton
} from '@mui/material';
import { X, SquarePlus } from 'lucide-react';
import { createDevice } from '../../redux/slices/deviceSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);

  const dashboardData = useSelector(selectDashboardData);
  const recentDevices = useSelector(state => selectRecentSubmissions(state, 7));

  return (
    <motion.div 
      className="pt-20 min-h-screen bg-gray-50 p-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto">
        {/* Animated Stats Grid */}
        <motion.div variants={fadeIn} className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Devices"
            value={dashboardData.totalDevices}
            trend={recentDevices.length}
            label="New this week"
            icon="device"
          />
          <StatsCard
            title="Active Devices"
            value={dashboardData.activeDevices}
            percentage={(dashboardData.activeDevices / dashboardData.totalDevices) * 100}
            icon="check"
          />
          <StatsCard
            title="Pending Requests"
            value={dashboardData.pendingRequests}
            color="warning"
            icon="alert"
          />
          <StatsCard
            title="Total Production"
            value={Object.values(dashboardData.energyStats).reduce((a, b) => a + b, 0)}
            unit="MWh"
            icon="energy"
          />
        </motion.div>

        {/* Energy Distribution Pie Chart */}
        <motion.div variants={fadeIn} className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Energy Distribution</h2>
            <div className="h-80">
              <EnergyPieChart data={dashboardData.energyStats} />
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeIn} className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Devices</h2>
            <RecentActivityList 
              items={recentDevices}
              type="device"
            />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
            <RecentActivityList 
              items={useSelector(selectUserIssueRequests).slice(-5)}
              type="request"
            />
          </div>
        </motion.div>

        {/* Interactive Data Tables */}
        <AnimatePresence>
          <motion.div variants={fadeIn} className="space-y-8">
            <DataTable 
              title="My Devices"
              data={useSelector(selectUserDevices)}
              type="device"
            />
            <DataTable 
              title="My Issue Requests"
              data={useSelector(selectUserIssueRequests)}
              type="request"
            />
          </motion.div>
        </AnimatePresence>
          </div>
          <motion.div
        className="fixed bottom-8 right-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Fab
          color="primary"
          aria-label="add"
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setOpen(true)}
        >
          <SquarePlus className="text-white" />
        </Fab>
      </motion.div>

      <DeviceUploadStepper 
  open={open} 
  onClose={() => setOpen(false)}
/>
    </motion.div>
  );
};

export default UserDashboard;