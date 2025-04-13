import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectDashboardData,
  selectUserDevices,
  selectUserIssueRequests,
  selectRecentSubmissions,
} from "../../redux/selectors";
import { fetchDevices, fetchUserDevices, deleteDevice } from "../../redux/slices/deviceSlice";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  SquarePlus,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fadeIn, staggerChildren } from "./animations";
import DeviceUploadStepper from "./deviceUpload";
import { Fab, useMediaQuery, useTheme } from "@mui/material";
import { fetchDeviceById } from "../../redux/slices/deviceSlice";
import { 
  Modal, // Add this
  Box, // Optional for styling
  Backdrop // Optional for animation
} from "@mui/material";

const DeviceEditModal = ({ device, open, onClose, onSave }) => {
  const [editedDevice, setEditedDevice] = useState(device);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedDevice(device);
  }, [device]);

  const handleSubmit = () => {
    const validationErrors = validateDevice(editedDevice);
    if (Object.keys(validationErrors).length === 0) {
      onSave(editedDevice);
      onClose();
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Device</h2>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Add your edit form fields here */}
        <div className="space-y-4">
          <div>
            <label>Device Name</label>
            <input
              value={editedDevice?.device_name || ""}
              onChange={(e) =>
                setEditedDevice((prev) => ({
                  ...prev,
                  device_name: e.target.value,
                }))
              }
              className="w-full border rounded p-2"
            />
            {errors.device_name && (
              <p className="text-red-500">{errors.device_name}</p>
            )}
          </div>

          {/* Add other fields similarly */}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.devices);
  const devices = useSelector(selectUserDevices);
  console.log(devices)
  const dashboardData = useSelector(selectDashboardData);

  // Device list state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("device_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFuel, setFilterFuel] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserDevices(user.id));
    }
  }, [dispatch, user]);

  const handleDelete = (deviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this device? This action cannot be undone."
      )
    ) {
      dispatch(deleteDevice(deviceId));
    }
  };

  const handleRefresh = () => {
    if (user) {
      dispatch(fetchDevices(user.id));
    }
  };

  // Sort and filter logic
  const sortedAndFilteredDevices = [...(devices || [])]
    .filter((device) => {
      const matchesSearch =
        device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.device_fuel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.device_technology
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus
        ? device.status === filterStatus
        : true;
      const matchesFuel = filterFuel ? device.device_fuel === filterFuel : true;

      return matchesSearch && matchesStatus && matchesFuel;
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const uniqueFuelTypes = [
    ...new Set(devices?.map((device) => device.device_fuel) || []),
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Approved: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Rejected: "bg-red-100 text-red-800",
      Draft: "bg-gray-100 text-gray-800",
    };
    return colors[status] || colors.Draft;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading devices...</span>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-1">
            <h3 className="text-red-800 font-medium">Error Loading Devices</h3>
            <p className="text-red-700">{error}</p>
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

  return (
    <motion.div
      className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeIn}>
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Device Management
                </h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Device
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                    placeholder="Search devices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={filterFuel}
                    onChange={(e) => setFilterFuel(e.target.value)}
                  >
                    <option value="">All Fuel Types</option>
                    {uniqueFuelTypes.map((fuel) => (
                      <option key={fuel} value={fuel}>
                        {fuel}
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
                      {[
                        "Device Name",
                        "Fuel Type",
                        "Technology",
                        "Capacity (MW)",
                        "Status",
                        "Registration Date",
                      ].map((header, index) => (
                        <th
                          key={index}
                          onClick={() =>
                            handleSort(header.toLowerCase().replace(/ /g, "_"))
                          }
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            {header}
                            {sortField ===
                              header.toLowerCase().replace(/ /g, "_") &&
                              (sortDirection === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {sortedAndFilteredDevices.map((device) => (
                        <motion.tr
                          key={device.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.device_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.fuel_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.technology_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Number(device.capacity).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                device.status
                              )}`}
                            >
                              {device.status || "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {device.effective_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={async () => {
                                  try {
                                    const result = await dispatch(
                                      fetchDeviceById(device.id)
                                    );
                                    if (result.payload) {
                                      setSelectedDevice(result.payload);
                                      setEditModalOpen(true);
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error fetching device:",
                                      error
                                    );
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(device.id)}
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

              {sortedAndFilteredDevices.length === 0 && (
                <div className="text-center py-12">
                  <h4 className="text-gray-500 text-lg font-medium">
                    No devices found
                  </h4>
                  <p className="text-gray-400 mt-2 mb-6">
                    {searchTerm || filterStatus || filterFuel
                      ? "No devices match your search criteria. Try adjusting your filters."
                      : "Start by registering a new device using the button above."}
                  </p>
                  {(searchTerm || filterStatus || filterFuel) && (
                    <button
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("");
                        setFilterFuel("");
                      }}
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t">
              <p className="text-sm text-gray-500">
                Showing {sortedAndFilteredDevices.length} of{" "}
                {devices?.length || 0} devices
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keep the floating action button exactly as before */}
      <motion.div
        className="fixed z-50 bottom-6 right-4 md:bottom-8 md:right-8 pr-12 pb-20"
        initial={{ scale: isMobile ? 1 : 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: isMobile ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        key={isMobile ? "mobile-fab" : "desktop-fab"} // Force re-render on breakpoint change
      >
        <Fab
          color="primary"
          aria-label="add"
          className="bg-green-600 hover:bg-green-700 shadow-xl"
          onClick={() => setOpen(true)}
          size={isMobile ? "medium" : "large"}
          sx={{
            "&.MuiFab-root": {
              width: isMobile ? 56 : 64,
              height: isMobile ? 56 : 64,
            },
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

      {/* Add this near other modals */}
      <DeviceEditModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
        onSave={(updatedDevice) => {
          dispatch(
            updateDevice({
              id: selectedDevice.id,
              data: updatedDevice,
            })
          );
        }}
      />
    </motion.div>
  );
};

export default UserDashboard;
