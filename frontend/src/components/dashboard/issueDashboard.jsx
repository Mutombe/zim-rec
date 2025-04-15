import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  BarChart, 
  AlertCircle,
  X, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Calendar,
  Zap,
  RefreshCw,
  FileText
} from 'lucide-react';
import {
  selectUserIssueRequests,
  selectAllIssueRequestsForAdmin,
  selectCurrentUser,
  selectUserDevices,
  selectAllDevicesForAdmin,
  selectDashboardData,
  selectRecentSubmissions,
} from "../../redux/selectors";
import {
  fetchRequests,
  fetchUserRequests,
  saveRequest,
  deleteIssueRequest,
} from "../../redux/slices/issueSlice";
import { fetchDevices } from "../../redux/slices/deviceSlice";
import { fadeIn, staggerChildren } from "./animations";
import { useMediaQuery, useTheme } from "@mui/material";
import { Modal, Box, Backdrop, Snackbar, Alert } from "@mui/material";

const IssueRequestDashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentUser = useSelector(selectCurrentUser);
  console.log("Current User", currentUser)
  const isAdmin = currentUser?.isAdmin;
  
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "info",
    });

  // Redux selectors
  //const requests = useSelector(isAdmin ? selectAllIssueRequestsForAdmin : selectUserIssueRequests);
  //const requests = useSelector(selectUserIssueRequests);
    const { requests } = useSelector(
      (state) => state.issueRequests
    );
  console.log("issue request", requests)
  const devices = useSelector(isAdmin ? selectAllDevicesForAdmin : selectUserDevices);
  const dashboardStats = useSelector(selectDashboardData);
  const recentSubmissions = useSelector((state) => selectRecentSubmissions(state, 7));

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchDevices());
  }, [dispatch]);

    useEffect(() => {
      if (currentUser) {
        dispatch(fetchUserRequests(currentUser.id));
      }
    }, [dispatch, currentUser]);

  const handleCreate = () => {
    setCurrentRequest({
      device: "",
      start_date: "",
      end_date: "",
      production_amount: "",
      period_of_production: "",
      recipient_account: "",
      status: "draft",
      notes: "",
      upload_file: null,
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    const formErrors = validateRequestForm(currentRequest);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  
    // Create FormData for file upload
    const formData = new FormData();
    for (const key in currentRequest) {
      if (key === 'upload_file') {
        if (currentRequest[key]) {
          formData.append(key, currentRequest[key]);
        }
      } else {
        formData.append(key, currentRequest[key]);
      }
    }
  
    dispatch(saveRequest(formData))
      .unwrap()
      .then(() => setOpenDialog(false),
      setSnackbar({
        open: true,
        message: "Issue Request Successful.",
        severity: "success",
      }))
      .catch((error) => {
        setErrors(error.errors || {});
      });
  };

  const handleDelete = () => {
    dispatch(deleteIssueRequest(currentRequest.id))
      .unwrap()
      .then(() => setDeleteDialog(false),
      setSnackbar({
        open: true,
        message: "Deleting successful.",
        severity: "success",
      }));
  };

  const validateRequestForm = (data) => {
    const newErrors = {};
    if (!data.device) newErrors.device = "Device is required";
    if (!data.start_date) newErrors.start_date = "Start date is required";
    if (!data.end_date) newErrors.end_date = "End date is required";
    if (!data.production_amount || parseFloat(data.production_amount) <= 0) {
      newErrors.production_amount = "Valid production amount required";
    }
    return newErrors;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    dispatch(fetchRequests());
  };

  // Filter and sort requests
  const filteredAndSortedRequests = [...(requests || [])]
    .filter((request) => {
      const matchesSearch = 
        request.id?.toString().includes(searchTerm) ||
        request.device?.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.production_amount?.toString().includes(searchTerm);
      
      const matchesStatus = filterStatus ? request.status === filterStatus : true;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let fieldA, fieldB;
      
      if (sortField === "device") {
        fieldA = a.device?.device_name?.toLowerCase() || "";
        fieldB = b.device?.device_name?.toLowerCase() || "";
      } else if (sortField === "production_amount") {
        fieldA = parseFloat(a.production_amount) || 0;
        fieldB = parseFloat(b.production_amount) || 0;
      } else if (sortField === "start_date" || sortField === "end_date") {
        fieldA = new Date(a[sortField] || 0).getTime();
        fieldB = new Date(b[sortField] || 0).getTime();
      } else {
        fieldA = a[sortField];
        fieldB = b[sortField];
      }
      
      if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const paginatedRequests = filteredAndSortedRequests.slice(
    page * rowsPerPage, 
    page * rowsPerPage + rowsPerPage
  );

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const getStatusColor = (status) => {
    return statusColors[status] || statusColors.draft;
  };

  const stats = [
    { 
      title: "Total Devices", 
      value: dashboardStats.totalDevices || 0, 
      icon: <BarChart className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    { 
      title: "Active Requests", 
      value: dashboardStats.pendingRequests || 0, 
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50"
    },
    { 
      title: "Total Production", 
      value: `${(dashboardStats.totalProduction || 0).toFixed(2)} MW`, 
      icon: <Zap className="w-6 h-6 text-green-500" />,
      color: "bg-green-50"
    },
    { 
      title: "Recent Submissions", 
      value: recentSubmissions.length, 
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50"
    }
  ];

  if (requests.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading requests...</span>
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
        <motion.div variants={fadeIn}>
          {/* Header with Stats */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Issue Request Management
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:from-green-500 hover:to-blue-500"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  <span>New Request</span>
                </motion.button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className={`${stat.color} rounded-xl p-4 transition-all duration-300 hover:shadow-md`}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-gray-700 font-medium">{stat.title}</p>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="md:col-span-4">
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <button
                    onClick={handleRefresh}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort("id")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortField === "id" && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("device")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Device
                        {sortField === "device" && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("status")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === "status" && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("start_date")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Dates
                        {sortField === "start_date" && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("production_amount")}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Production
                        {sortField === "production_amount" && (
                          sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
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
                    {paginatedRequests.map((request) => (
                      <motion.tr 
                        key={request.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{request.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {request?.device_name || "Unknown Device"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1) || "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {request.start_date && request.end_date ? (
                            <>
                              {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                            </>
                          ) : (
                            "Not specified"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {request.production_amount} MW
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setCurrentRequest(request);
                                setOpenDialog(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setCurrentRequest(request);
                                setDeleteDialog(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {paginatedRequests.length === 0 && (
              <div className="text-center py-12">
                <h4 className="text-gray-500 text-lg font-medium">
                  No requests found
                </h4>
                <p className="text-gray-400 mt-2 mb-6">
                  {searchTerm || filterStatus
                    ? "No requests match your search criteria. Try adjusting your filters."
                    : "Start by creating a new request using the button above."}
                </p>
                {(searchTerm || filterStatus) && (
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredAndSortedRequests.length)} of{' '}
                <span className="font-medium">{filteredAndSortedRequests.length}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= filteredAndSortedRequests.length}
                  className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      {openDialog && (
        <Modal
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '95%' : 'auto',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: 24,
          }}>
            <div className="bg-white rounded-xl shadow-xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {currentRequest?.id ? 'Edit Request' : 'Create New Request'}
                </h2>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {Object.keys(errors).length > 0 && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  {Object.values(errors).map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">• {error}</p>
                  ))}
                </div>
              )}

              <div className="p-6 space-y-4">
                {/* Device Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device
                  </label>
                  <select
                    value={currentRequest?.device || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      device: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a device</option>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.device_name} ({device.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={currentRequest?.start_date || ""}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        start_date: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={currentRequest?.end_date || ""}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        end_date: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Production Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Amount (MW)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    min="0.000001"
                    value={currentRequest?.production_amount || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      production_amount: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period of Production
                  </label>
                  <input
                    type="text"
                    value={currentRequest?.period_of_production || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      period_of_production: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Recipient Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Account
                  </label>
                  <input
                    type="text"
                    value={currentRequest?.recipient_account || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      recipient_account: e.target.value
                    }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status Selection (for editing) */}
                {currentRequest?.id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={currentRequest?.status || "draft"}
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        status: e.target.value
                      }))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {["draft", "submitted", "approved", "rejected"].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={currentRequest?.notes || ""}
                    onChange={(e) => setCurrentRequest(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* File Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Supporting Document
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={(e) => setCurrentRequest(prev => ({
                        ...prev,
                        upload_file: e.target.files[0]
                      }))}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                    />
                    {currentRequest?.upload_file && (
                      <span className="text-sm text-gray-600 truncate">
                        {currentRequest.upload_file.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: PDF, DOC, XLS, JPG, PNG (Max 25MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg hover:from-green-500 hover:to-blue-500"
                >
                  {currentRequest?.id ? 'Update Request' : 'Create Request'}
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      )}
   
      {deleteDialog && (
        <Modal
          open={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxWidth: '500px',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: 24,
          }}>
            <div className="bg-white rounded-xl shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete this request? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setDeleteDialog(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      )}

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
    </motion.div>
  );
};

export default IssueRequestDashboard;