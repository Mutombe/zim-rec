import React from 'react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  selectPendingSubmissions,
  selectEnergyTypeStatistics,
  selectAllDevicesForAdmin,
  selectAllIssueRequestsForAdmin
} from '../../redux/selectors';
import { ApprovalQueue, EnergyTypeBarChart, AdminDataTable } from './analytics';
import { fadeIn, slideUp } from './animations';

const AdminDashboard = () => {
  const { pendingDevices, pendingRequests } = useSelector(selectPendingSubmissions);
  const energyStats = useSelector(selectEnergyTypeStatistics);

  return (
    <motion.div 
      className="pt-20 min-h-screen bg-gray-50 p-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto">
        {/* Approval Queue */}
        <motion.div variants={slideUp} className="mb-8">
          <ApprovalQueue 
            devicesCount={pendingDevices}
            requestsCount={pendingRequests}
          />
        </motion.div>

        {/* Energy Type Distribution */}
        <motion.div variants={slideUp} className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Energy Type Distribution</h2>
            <div className="h-96">
              <EnergyTypeBarChart data={energyStats} />
            </div>
          </div>
        </motion.div>

        {/* Interactive Admin Tables */}
        <motion.div variants={slideUp} className="space-y-8">
          <AdminDataTable 
            title="All Registered Devices"
            data={useSelector(selectAllDevicesForAdmin)}
            type="device"
          />
          <AdminDataTable 
            title="All Issue Requests"
            data={useSelector(selectAllIssueRequestsForAdmin)}
            type="request"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;