import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectAllDevices,
  selectAllIssueRequests,
  selectAllDevicesForAdmin,
  selectAllIssueRequestsForAdmin,
  selectPendingSubmissions,
  selectEnergyTypeStatistics,
} from "../../redux/selectors";

import { fetchDevices, updateDevice, deleteDevice } from "../../redux/slices/deviceSlice";
import { updateIssueRequest, fetchRequests } from "../../redux/slices/issueSlice";
import {
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle,
  Check,
  X,
  Search,
  BarChart2,
  Clock,
  FileText,
  HelpCircle
} from "lucide-react";
import { Tabs, Tab, Box, Typography, Modal, Tooltip, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fadeIn, staggerChildren } from "./animations";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const { user } = useSelector((state) => state.auth);
  const allDevices = useSelector(selectAllDevices);
  const allIssueRequests = useSelector(selectAllIssueRequests) || [];
  const pendingStats = useSelector(selectPendingSubmissions);
  const energyStats = useSelector(selectEnergyTypeStatistics);
  const { loading: devicesLoading, error: devicesError } = useSelector((state) => state.devices);
  const { loading: requestsLoading, error: requestsError } = useSelector((state) => state.issueRequests);
  
  // State for the device detail modal
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  
  // State for the issue request detail modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  
  // Filter and sorting states
  const [deviceFilters, setDeviceFilters] = useState({
    search: "",
    status: "",
    fuelType: "",
    sortField: "created_at",
    sortDirection: "desc"
  });
  
  const [requestFilters, setRequestFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sortField: "created_at",
    sortDirection: "desc"
  });

  useEffect(() => {
    // Check if the user is an admin before fetching
    if (user?.is_superuser) {
      dispatch(fetchDevices());
      dispatch(fetchRequests());
    } else {
      // Redirect non-admin users
      navigate("/dashboard");
    }
  }, [dispatch, user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Device actions
  const handleApproveDevice = (deviceId) => {
    if (window.confirm("Are you sure you want to approve this device?")) {
      dispatch(updateDevice({ id: deviceId, status: "Approved" }));
    }
  };

  const handleRejectDevice = (deviceId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason) {
      dispatch(updateDevice({ 
        id: deviceId, 
        status: "Rejected", 
        rejectionReason: reason 
      }));
    }
  };

  const handleDeleteDevice = (deviceId) => {
    if (window.confirm("Are you sure you want to permanently delete this device?")) {
      dispatch(deleteDevice(deviceId));
    }
  };

  // Issue request actions
  const handleResolveRequest = (requestId) => {
    const resolution = window.prompt("Enter resolution details:");
    if (resolution) {
      dispatch(updateIssueRequest({
        id: requestId,
        status: "Resolved",
        resolution
      }));
    }
  };

  const handleRejectRequest = (requestId) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason) {
      dispatch(updateIssueRequest({
        id: requestId,
        status: "Rejected",
        rejectionReason: reason
      }));
    }
  };

  // Modal handlers
  const openDeviceModal = (device) => {
    setSelectedDevice(device);
    setDeviceModalOpen(true);
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setRequestModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchDevices());
    dispatch(fetchRequests());
  };

  // Sort and filter devices
  const filteredDevices = allDevices
    .filter(device => {
      const matchesSearch = deviceFilters.search === "" || 
        (device.device_name?.toLowerCase().includes(deviceFilters.search.toLowerCase()) ||
         device.device_fuel?.toLowerCase().includes(deviceFilters.search.toLowerCase()) ||
         device.device_technology?.toLowerCase().includes(deviceFilters.search.toLowerCase()) ||
         device.user?.name?.toLowerCase().includes(deviceFilters.search.toLowerCase()));
         
      const matchesStatus = deviceFilters.status === "" || device.status === deviceFilters.status;
      const matchesFuelType = deviceFilters.fuelType === "" || device.device_fuel === deviceFilters.fuelType;
      
      return matchesSearch && matchesStatus && matchesFuelType;
    })
    .sort((a, b) => {
      const field = deviceFilters.sortField;
      if (!a[field] || !b[field]) return 0;
      
      if (deviceFilters.sortDirection === "asc") {
        return a[field] < b[field] ? -1 : 1;
      } else {
        return a[field] > b[field] ? -1 : 1;
      }
    });

  // Sort and filter issue requests
  const filteredRequests = allIssueRequests
    .filter(request => {
      const matchesSearch = requestFilters.search === "" ||
        (request.title?.toLowerCase().includes(requestFilters.search.toLowerCase()) ||
         request.description?.toLowerCase().includes(requestFilters.search.toLowerCase()) ||
         request.user?.name?.toLowerCase().includes(requestFilters.search.toLowerCase()));
         
      const matchesStatus = requestFilters.status === "" || request.status === requestFilters.status;
      const matchesPriority = requestFilters.priority === "" || request.priority === requestFilters.priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const field = requestFilters.sortField;
      if (!a[field] || !b[field]) return 0;
      
      if (requestFilters.sortDirection === "asc") {
        return a[field] < b[field] ? -1 : 1;
      } else {
        return a[field] > b[field] ? -1 : 1;
      }
    });

  // Extract unique fuel types for filtering
  const uniqueFuelTypes = [...new Set(allDevices.map(device => device.device_fuel).filter(Boolean))];
  
  // Extract unique status values for filtering
  const uniqueDeviceStatuses = [...new Set(allDevices.map(device => device.status).filter(Boolean))];
  const uniqueRequestStatuses = [...new Set(allIssueRequests.map(request => request.status).filter(Boolean))];
  
  // Style for status badges
  const getStatusBadgeStyle = (status) => {
    const styles = {
      "Approved": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Rejected": "bg-red-100 text-red-800",
      "Draft": "bg-gray-100 text-gray-800",
      "Submitted": "bg-blue-100 text-blue-800",
      "In Review": "bg-purple-100 text-purple-800",
      "Resolved": "bg-green-100 text-green-800",
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-blue-100 text-blue-800"
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  // Loading state
  if (devicesLoading || requestsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading admin dashboard...</span>
      </div>
    );
  }

  // Error state
  if (devicesError || requestsError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 max-w-4xl mx-auto mt-20">
        <div className="flex">
          <div className="flex-1">
            <h3 className="text-red-800 font-medium">Error Loading Data</h3>
            <p className="text-red-700">{devicesError || requestsError}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeIn} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage devices and issue requests across all users</p>
        </motion.div>
        
        {/* Dashboard Stats Cards */}
        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Devices</p>
              <p className="text-xl font-semibold">{allDevices.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Devices</p>
              <p className="text-xl font-semibold">{pendingStats.pendingDevices}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Issues</p>
              <p className="text-xl font-semibold">{pendingStats.pendingRequests}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Energy Types</p>
              <p className="text-xl font-semibold">{Object.keys(energyStats).length}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Tabs for Devices and Issue Requests */}
        <motion.div variants={fadeIn} className="bg-white rounded-lg shadow mb-6">
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="admin dashboard tabs"
              variant="fullWidth"
            >
              <Tab 
                label={
                  <div className="flex items-center">
                    <span>Devices</span>
                    {pendingStats.pendingDevices > 0 && (
                      <Badge 
                        badgeContent={pendingStats.pendingDevices} 
                        color="warning" 
                        className="ml-2"
                      />
                    )}
                  </div>
                } 
                id="admin-tab-0" 
              />
              <Tab 
                label={
                  <div className="flex items-center">
                    <span>Issue Requests</span>
                    {pendingStats.pendingRequests > 0 && (
                      <Badge 
                        badgeContent={pendingStats.pendingRequests} 
                        color="error" 
                        className="ml-2"
                      />
                    )}
                  </div>
                } 
                id="admin-tab-1" 
              />
            </Tabs>
          </Box>
          
          {/* Devices Tab Panel */}
          <TabPanel value={tabValue} index={0}>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  placeholder="Search devices by name, fuel type, or owner..."
                  value={deviceFilters.search}
                  onChange={(e) => setDeviceFilters({...deviceFilters, search: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={deviceFilters.status}
                  onChange={(e) => setDeviceFilters({...deviceFilters, status: e.target.value})}
                >
                  <option value="">All Statuses</option>
                  {uniqueDeviceStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-3">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={deviceFilters.fuelType}
                  onChange={(e) => setDeviceFilters({...deviceFilters, fuelType: e.target.value})}
                >
                  <option value="">All Fuel Types</option>
                  {uniqueFuelTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <button
                  onClick={handleRefresh}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setDeviceFilters({
                        ...deviceFilters,
                        sortField: "device_name",
                        sortDirection: deviceFilters.sortField === "device_name" && deviceFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Device Name
                        {deviceFilters.sortField === "device_name" && (
                          deviceFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity (MW)
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setDeviceFilters({
                        ...deviceFilters,
                        sortField: "status",
                        sortDirection: deviceFilters.sortField === "status" && deviceFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Status
                        {deviceFilters.sortField === "status" && (
                          deviceFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setDeviceFilters({
                        ...deviceFilters,
                        sortField: "created_at",
                        sortDirection: deviceFilters.sortField === "created_at" && deviceFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Submission Date
                        {deviceFilters.sortField === "created_at" && (
                          deviceFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map((device) => (
                        <motion.tr
                          key={device.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {device.device_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {device.user?.username || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {device.device_fuel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {Number(device.capacity).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(device.status)}`}
                            >
                              {device.status || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(device.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <Tooltip title="View Details">
                                <button
                                  onClick={() => openDeviceModal(device)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </Tooltip>
                              
                              {device.status !== "Approved" && (
                                <Tooltip title="Approve Device">
                                  <button
                                    onClick={() => handleApproveDevice(device.id)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                              )}
                              
                              {device.status !== "Rejected" && (
                                <Tooltip title="Reject Device">
                                  <button
                                    onClick={() => handleRejectDevice(device.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No devices found matching your criteria
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredDevices.length} of {allDevices.length} devices
            </div>
          </TabPanel>
          
          {/* Issue Requests Tab Panel */}
          <TabPanel value={tabValue} index={1}>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  placeholder="Search issue requests..."
                  value={requestFilters.search}
                  onChange={(e) => setRequestFilters({...requestFilters, search: e.target.value})}
                />
              </div>
              
              <div className="md:col-span-2">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={requestFilters.status}
                  onChange={(e) => setRequestFilters({...requestFilters, status: e.target.value})}
                >
                  <option value="">All Statuses</option>
                  {uniqueRequestStatuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-3">
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={requestFilters.priority}
                  onChange={(e) => setRequestFilters({...requestFilters, priority: e.target.value})}
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <button
                  onClick={handleRefresh}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setRequestFilters({
                        ...requestFilters,
                        sortField: "title",
                        sortDirection: requestFilters.sortField === "title" && requestFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Title
                        {requestFilters.sortField === "title" && (
                          requestFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Related Device
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setRequestFilters({
                        ...requestFilters,
                        sortField: "priority",
                        sortDirection: requestFilters.sortField === "priority" && requestFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Priority
                        {requestFilters.sortField === "priority" && (
                          requestFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setRequestFilters({
                        ...requestFilters,
                        sortField: "status",
                        sortDirection: requestFilters.sortField === "status" && requestFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Status
                        {requestFilters.sortField === "status" && (
                          requestFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => setRequestFilters({
                        ...requestFilters,
                        sortField: "created_at",
                        sortDirection: requestFilters.sortField === "created_at" && requestFilters.sortDirection === "asc" ? "desc" : "asc"
                      })}
                    >
                      <div className="flex items-center">
                        Submission Date
                        {requestFilters.sortField === "created_at" && (
                          requestFilters.sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {request.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {request.user?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {request.device?.device_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(request.priority)}`}
                          >
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(request.status)}`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center space-x-2">
                            <Tooltip title="View Details">
                              <button
                                onClick={() => openRequestModal(request)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </Tooltip>
                            
                            {request.status === "Submitted" && (
                              <>
                                <Tooltip title="Resolve Issue">
                                  <button
                                    onClick={() => handleResolveRequest(request.id)}
                                    className="text-green-600 hover:text-green-800"
                                  >
                                    <Check className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                                
                                <Tooltip title="Reject Issue">
                                  <button
                                    onClick={() => handleRejectRequest(request.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No issue requests found matching your criteria
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredRequests.length} of {allIssueRequests.length} issue requests
          </div>
        </TabPanel>
      </motion.div>
      
      {/* Device Detail Modal */}
      <Modal
        open={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
        aria-labelledby="device-details-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '60%' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          {selectedDevice && (
            <div>
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h5" component="h2">
                  Device Details: {selectedDevice.device_name}
                </Typography>
                <button
                  onClick={() => setDeviceModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">General Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Device Name:</span> {selectedDevice.device_name}</p>
                    <p className="mb-2"><span className="font-medium">Owner:</span> {selectedDevice.user?.username || "Unknown"}</p>
                    <p className="mb-2"><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(selectedDevice.status)}`}>
                        {selectedDevice.status}
                      </span>
                    </p>
                    <p className="mb-2"><span className="font-medium">Submission Date:</span> {new Date(selectedDevice.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Technical Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Fuel Type:</span> {selectedDevice.device_fuel}</p>
                    <p className="mb-2"><span className="font-medium">Technology:</span> {selectedDevice.device_technology}</p>
                    <p className="mb-2"><span className="font-medium">Capacity:</span> {Number(selectedDevice.capacity).toLocaleString()} MW</p>
                    <p className="mb-2"><span className="font-medium">Commission Date:</span> {selectedDevice.commission_date ? new Date(selectedDevice.commission_date).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                
                {selectedDevice.address && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2">Location</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="mb-2"><span className="font-medium">Address:</span> {selectedDevice.address}</p>
                      {selectedDevice.latitude && selectedDevice.longitude && (
                        <p className="mb-2">
                          <span className="font-medium">Coordinates:</span> {selectedDevice.latitude}, {selectedDevice.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedDevice.rejectionReason && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2 text-red-600">Rejection Information</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="mb-2"><span className="font-medium">Reason:</span> {selectedDevice.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setDeviceModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedDevice.status === "Pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveDevice(selectedDevice.id);
                        setDeviceModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    
                    <button
                      onClick={() => {
                        handleRejectDevice(selectedDevice.id);
                        setDeviceModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Box>
      </Modal>
      
      {/* Issue Request Detail Modal */}
      <Modal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        aria-labelledby="request-details-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '60%' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          {selectedRequest && (
            <div>
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h5" component="h2">
                  Issue Request: {selectedRequest.title}
                </Typography>
                <button
                  onClick={() => setRequestModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Request Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Title:</span> {selectedRequest.title}</p>
                    <p className="mb-2"><span className="font-medium">Submitted By:</span> {selectedRequest.user?.name || "Unknown"}</p>
                    <p className="mb-2"><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </p>
                    <p className="mb-2"><span className="font-medium">Priority:</span> 
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </p>
                    <p className="mb-2"><span className="font-medium">Submission Date:</span> {new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Related Device</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-medium">Device Name:</span> {selectedRequest.device?.device_name || "N/A"}</p>
                    <p className="mb-2"><span className="font-medium">Fuel Type:</span> {selectedRequest.device?.device_fuel || "N/A"}</p>
                    <p className="mb-2"><span className="font-medium">Capacity:</span> {selectedRequest.device?.capacity ? Number(selectedRequest.device.capacity).toLocaleString() + " MW" : "N/A"}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-2">Issue Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-line">{selectedRequest.description || "No description provided."}</p>
                  </div>
                </div>
                
                {(selectedRequest.resolution || selectedRequest.rejectionReason) && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-2">{selectedRequest.resolution ? "Resolution" : "Rejection Reason"}</h3>
                    <div className={`p-4 rounded-lg ${selectedRequest.resolution ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                      <p className="whitespace-pre-line">{selectedRequest.resolution || selectedRequest.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedRequest.status === "Submitted" && (
                  <>
                    <button
                      onClick={() => {
                        handleResolveRequest(selectedRequest.id);
                        setRequestModalOpen(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Resolve
                    </button>
                    
                    <button
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id);
                        setRequestModalOpen(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </Box>
        </Modal>
        </div>
    </motion.div>
  );
};

export default AdminDashboard;