import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {   selectUserIssueRequests,
    selectAllIssueRequestsForAdmin,
    selectCurrentUser,
    selectUserDevices,
    selectAllDevicesForAdmin,
    selectDashboardData,
    selectRecentSubmissions,
    makeSelectRequestsByDevice
} from '../../redux/selectors';
import { fetchRequests, saveRequest, deleteIssueRequest } from '../../redux/slices/issueSlice';
import { fetchDevices } from '../../redux/slices/deviceSlice';

const IssueRequestDashboard = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = currentUser?.isAdmin;
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Selector-derived data
  const requests = useSelector(isAdmin 
    ? selectAllIssueRequestsForAdmin 
    : selectUserIssueRequests
  );
  const devices = useSelector(isAdmin 
    ? selectAllDevicesForAdmin 
    : selectUserDevices
  );
  const dashboardStats = useSelector(selectDashboardData);
  const recentSubmissions = useSelector(state => 
    selectRecentSubmissions(state, 7)
  );
  const deviceRequests = useSelector(state => 
    makeSelectRequestsByDevice()(state, selectedDeviceId)
  );

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleCreate = () => {
    setCurrentRequest({
      device: '',
      start_date: '',
      end_date: '',
      production_amount: '',
      recipient_account: '',
      status: 'draft'
    });
    setOpenDialog(true);
  };

  const handleEdit = (request) => {
    setCurrentRequest(request);
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    dispatch(saveRequest(currentRequest))
      .unwrap()
      .then(() => setOpenDialog(false));
  };

  const handleDelete = () => {
    dispatch(deleteIssueRequest(currentRequest.id))
      .unwrap()
      .then(() => setDeleteConfirmOpen(false));
  };

  const statusColor = {
    draft: 'default',
    submitted: 'primary',
    approved: 'success',
    rejected: 'error'
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Issue Request Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Request
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Total Devices"
            value={dashboardStats.totalDevices}
            icon={<BarChartIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Active Requests"
            value={dashboardStats.pendingRequests}
            icon={<BarChartIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Total Production"
            value={dashboardStats.totalProduction?.toFixed(2) + ' MW'}
            icon={<BarChartIcon />}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Recent Submissions"
            value={recentSubmissions.length}
            icon={<BarChartIcon />}
          />
        </Grid>
      </Grid>

      {/* Main Requests Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell>Production</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.device?.device_name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      color={statusColor[request.status]}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.start_date).toLocaleDateString()} - 
                    {new Date(request.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.production_amount} MW</TableCell>
                  <TableCell>{request.recipient_account}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(request)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setCurrentRequest(request);
                      setDeleteConfirmOpen(true);
                    }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Request Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentRequest?.id ? 'Edit Request' : 'Create Request'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Device"
                value={currentRequest?.device || ''}
                onChange={(e) => setCurrentRequest(prev => ({
                  ...prev,
                  device: e.target.value
                }))}
              >
                {devices.map((device) => (
                  <MenuItem key={device.id} value={device.id}>
                    {device.device_name} ({device.status})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentRequest?.start_date || ''}
                onChange={(e) => setCurrentRequest(prev => ({
                  ...prev,
                  start_date: e.target.value
                }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentRequest?.end_date || ''}
                onChange={(e) => setCurrentRequest(prev => ({
                  ...prev,
                  end_date: e.target.value
                }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Production (MW)"
                type="number"
                value={currentRequest?.production_amount || ''}
                onChange={(e) => setCurrentRequest(prev => ({
                  ...prev,
                  production_amount: e.target.value
                }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Recipient Account"
                value={currentRequest?.recipient_account || ''}
                onChange={(e) => setCurrentRequest(prev => ({
                  ...prev,
                  recipient_account: e.target.value
                }))}
              />
            </Grid>

            {currentRequest?.id && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={currentRequest?.status || 'draft'}
                  onChange={(e) => setCurrentRequest(prev => ({
                    ...prev,
                    status: e.target.value
                  }))}
                >
                  {['draft', 'submitted', 'approved', 'rejected'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {currentRequest?.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this request?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default IssueRequestDashboard;