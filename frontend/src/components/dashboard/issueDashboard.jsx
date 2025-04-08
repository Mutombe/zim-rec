import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, Edit, Trash2, BarChart, X } from 'lucide-react';
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
  saveRequest,
  deleteIssueRequest,
} from "../../redux/slices/issueSlice";
import { fetchDevices } from "../../redux/slices/deviceSlice";

const IssueRequestDashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.isAdmin;
  
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errors, setErrors] = useState({});

  // Redux selectors
  const requests = useSelector(isAdmin ? selectAllIssueRequestsForAdmin : selectUserIssueRequests);
  const devices = useSelector(isAdmin ? selectAllDevicesForAdmin : selectUserDevices);
  const dashboardStats = useSelector(selectDashboardData);
  const recentSubmissions = useSelector((state) => selectRecentSubmissions(state, 7));

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleCreate = () => {
    setCurrentRequest({
      device: "",
      start_date: "",
      end_date: "",
      production_amount: "",
      recipient_account: "",
      status: "draft",
    });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    const formErrors = validateRequestForm(currentRequest);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    dispatch(saveRequest(currentRequest))
      .unwrap()
      .then(() => setOpenDialog(false))
      .catch((error) => {
        setErrors(error.errors || {});
      });
  };

  const handleDelete = () => {
    dispatch(deleteIssueRequest(currentRequest.id))
      .unwrap()
      .then(() => setDeleteDialog(false));
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

  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    submitted: "bg-blue-200 text-blue-800",
    approved: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800"
  };

  const stats = [
    { title: "Total Devices", value: dashboardStats.totalDevices, icon: <BarChart className="w-6 h-6" /> },
    { title: "Active Requests", value: dashboardStats.pendingRequests, icon: <BarChart className="w-6 h-6" /> },
    { title: "Total Production", value: `${dashboardStats.totalProduction?.toFixed(2)} MW`, icon: <BarChart className="w-6 h-6" /> },
    { title: "Recent Submissions", value: recentSubmissions.length, icon: <BarChart className="w-6 h-6" /> }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issue Request Management</h1>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-start">
              <p className="text-gray-500 font-medium">{stat.title}</p>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.device?.device_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(request.start_date).toLocaleDateString()} -
                    {new Date(request.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{request.production_amount} MW</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setCurrentRequest(request);
                          setOpenDialog(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          setCurrentRequest(request);
                          setDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentRequest?.id ? 'Update Request' : 'Create Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 bg-white rounded-lg p-4">
        <div className="text-sm text-gray-700">
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, requests.length)} of{' '}
          <span className="font-medium">{requests.length}</span> results
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
            disabled={(page + 1) * rowsPerPage >= requests.length}
            className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {deleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
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
        </div>
      )}
    </div>
  );
};

export default IssueRequestDashboard;
