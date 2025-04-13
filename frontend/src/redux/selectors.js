// selectors.js
import { createSelector } from '@reduxjs/toolkit';
import { useState } from 'react';
import { useSelector } from 'react-redux';

// Base selectors
const selectDevicesState = state => state.devices;
const selectIssueRequestsState = state => state.issueRequests;
const selectAuthState = state => state.auth;

// Memoized selectors
export const selectAllDevices = createSelector(
  [selectDevicesState],
  devicesState => devicesState.devices || []
);

export const selectAllIssueRequests1 = createSelector(
  [selectIssueRequestsState],
  requestsState => requestsState.requests || []
);

// selectors.js
export const selectAllIssueRequests = createSelector(
  [selectIssueRequestsState],
  (requestsState) => {
    // Add explicit array validation
    const requests = requestsState?.requests;
    return Array.isArray(requests) ? requests : [];
  }
);



export const selectCurrentUser = createSelector(
  [selectAuthState],
  auth => auth.user
);

export const selectUserDevices = createSelector(
  [selectAllDevices, selectCurrentUser],
  (devices, user) => {
    if (!user || !devices) return [];
    // Handle both numeric and string IDs
    return devices.filter(device => 
      String(device.user.id) === String(user.id) ||
      String(device.user) === String(user.id)
    );
  }
);

export const selectUserIssueRequests = createSelector(
  [selectAllIssueRequests, selectCurrentUser],
  (requests, user) => {
    // 1. Ensure we have an array
    if (!Array.isArray(requests)) return [];
    
    // 2. Check for valid user
    if (!user?.id) return [];
    
    // 3. Safe filtering with null checks
    return requests.filter(req => {
      const requestUserId = req.user?.id;
      return requestUserId && requestUserId === user.id;
    });
  }
);

// Admin selectors
export const selectAllDevicesForAdmin = createSelector(
  [selectAllDevices, selectCurrentUser],
  (devices, user) => {
    return user?.isAdmin ? devices : [];
  }
);

export const selectAllIssueRequestsForAdmin = createSelector(
  [selectAllIssueRequests, selectCurrentUser],
  (requests, user) => {
    return user?.isAdmin ? requests : [];
  }
);

// Filtered device selectors
export const selectDevicesByFuelType = createSelector(
  [selectAllDevicesForAdmin, (_, fuelType) => fuelType],
  (devices, fuelType) => {
    return devices.filter(device => device.fuel_type === fuelType);
  }
);

export const selectDevicesByStatus = createSelector(
  [selectAllDevices, (_, status) => status],
  (devices, status) => {
    return devices.filter(device => device.status === status);
  }
);

// Advanced analytics selectors
export const selectEnergyTypeStatistics = createSelector(
  [selectAllDevicesForAdmin],
  devices => {
    return devices.reduce((acc, device) => {
      const key = device.fuel_type;
      acc[key] = (acc[key] || 0) + parseFloat(device.capacity);
      return acc;
    }, {});
  }
);

export const selectPendingSubmissions = createSelector(
  [selectAllDevicesForAdmin, selectAllIssueRequestsForAdmin],
  (devices, requests) => {
    return {
      pendingDevices: devices.filter(d => d.status === 'submitted').length,
      pendingRequests: requests.filter(r => r.status === 'submitted').length,
    };
  }
);

// Search-optimized selectors
export const makeSelectDeviceById = () => createSelector(
  [selectAllDevices, (_, id) => id],
  (devices, id) => devices.find(device => device.id === id)
);

export const makeSelectRequestsByDevice = () => createSelector(
  [selectAllIssueRequests, (_, deviceId) => deviceId],
  (requests, deviceId) => {
    // Add array safety check
    if (!Array.isArray(requests)) return [];
    return requests.filter(req => req.device?.id === deviceId);
  }
);

export const selectRecentSubmissions = createSelector(
  [selectAllDevices, (_, days = 7) => days],
  (devices, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Add array safety check
    if (!Array.isArray(devices)) return [];
    
    return devices.filter(device => {
      // Add optional chaining for date safety
      const deviceDate = device?.created_at ? new Date(device.created_at) : null;
      return deviceDate > cutoffDate;
    });
  }
);

// Composite selector for dashboard view
export const selectDashboardData = createSelector(
  [selectUserDevices, selectUserIssueRequests, selectEnergyTypeStatistics],
  (devices, requests, stats) => ({
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.status === 'approved').length,
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'submitted').length,
    energyStats: stats,
  })
);

