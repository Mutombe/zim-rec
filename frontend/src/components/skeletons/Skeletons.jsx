import React from 'react';
import { motion } from 'framer-motion';

const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent";

const Bone = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded ${shimmer} ${className}`} />
);

// ─── Stats Card Skeleton ────────────────────────────────
export const StatsCardSkeleton = ({ count = 4 }) => (
  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-start">
          <Bone className="h-4 w-24" />
          <Bone className="h-6 w-6 rounded-md" />
        </div>
        <Bone className="h-8 w-16 mt-3" />
      </div>
    ))}
  </div>
);

// ─── Search / Filter Bar Skeleton ───────────────────────
export const FilterBarSkeleton = ({ columns = 3 }) => (
  <div className="p-6">
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-4`}>
      <div className="md:col-span-4">
        <Bone className="h-10 w-full rounded-md" />
      </div>
      <div className="md:col-span-3">
        <Bone className="h-10 w-full rounded-md" />
      </div>
      {columns >= 3 && (
        <div className="md:col-span-3">
          <Bone className="h-10 w-full rounded-md" />
        </div>
      )}
      <div className="md:col-span-2">
        <Bone className="h-10 w-full rounded-md" />
      </div>
    </div>
  </div>
);

// ─── Table Row Skeleton ─────────────────────────────────
const TableRowSkeleton = ({ cols, widths }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Bone className={`h-4 ${widths?.[i] || 'w-20'}`} />
      </td>
    ))}
  </tr>
);

// ─── Full Table Skeleton ────────────────────────────────
export const TableSkeleton = ({ headers, rows = 5, colWidths }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} cols={headers.length} widths={colWidths} />
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Dashboard Header Skeleton ──────────────────────────
export const DashboardHeaderSkeleton = () => (
  <div className="p-6 border-b">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <Bone className="h-7 w-48" />
      <Bone className="h-10 w-40 rounded-md" />
    </div>
  </div>
);

// ─── User Dashboard Skeleton ────────────────────────────
export const UserDashboardSkeleton = () => (
  <motion.div
    className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow mb-8">
        <DashboardHeaderSkeleton />
        <FilterBarSkeleton columns={3} />
        <TableSkeleton
          headers={['Device Name', 'Fuel Type', 'Technology', 'Capacity (MW)', 'Status', 'Registration Date', 'Actions']}
          rows={5}
          colWidths={['w-32', 'w-16', 'w-24', 'w-14', 'w-20', 'w-24', 'w-16']}
        />
        <div className="px-6 py-4 border-t">
          <Bone className="h-4 w-40" />
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Issue Request Dashboard Skeleton ───────────────────
export const IssueDashboardSkeleton = () => (
  <motion.div
    className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-7xl mx-auto">
      {/* Header + Stats */}
      <div className="bg-white rounded-lg shadow mb-8">
        <DashboardHeaderSkeleton />
        <StatsCardSkeleton count={4} />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow mb-8">
        <FilterBarSkeleton columns={2} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <TableSkeleton
          headers={['ID', 'Device', 'Status', 'Dates', 'Production', 'Actions']}
          rows={5}
          colWidths={['w-10', 'w-28', 'w-20', 'w-32', 'w-16', 'w-16']}
        />
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <Bone className="h-4 w-48" />
          <div className="flex gap-2">
            <Bone className="h-8 w-20 rounded-md" />
            <Bone className="h-8 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Admin Dashboard Skeleton ───────────────────────────
export const AdminDashboardSkeleton = () => (
  <motion.div
    className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <Bone className="h-8 w-56 mb-2" />
        <Bone className="h-4 w-72" />
      </div>

      {/* Stats */}
      <StatsCardSkeleton count={4} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mt-8">
        <div className="border-b px-6 pt-4 flex gap-6">
          <Bone className="h-10 w-28 rounded-t-md" />
          <Bone className="h-10 w-28 rounded-t-md" />
          <Bone className="h-10 w-28 rounded-t-md" />
        </div>
        <div className="p-6">
          <FilterBarSkeleton columns={3} />
          <TableSkeleton
            headers={['Name', 'Owner', 'Type', 'Capacity', 'Status', 'Date', 'Actions']}
            rows={6}
            colWidths={['w-28', 'w-24', 'w-20', 'w-14', 'w-20', 'w-24', 'w-20']}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Profile Page Skeleton ──────────────────────────────
export const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto p-4 md:p-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pt-16">
      <Bone className="h-9 w-40" />
      <Bone className="h-8 w-28 rounded-full" />
    </div>

    {/* Tabs */}
    <div className="flex gap-4 mb-6 border-b pb-2">
      <Bone className="h-10 w-24" />
      <Bone className="h-10 w-20" />
      <Bone className="h-10 w-28" />
    </div>

    {/* Content card */}
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Bone className="h-32 w-32 rounded-full" />
          <Bone className="h-3 w-20" />
        </div>

        {/* Profile info */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between">
            <Bone className="h-7 w-48" />
            <Bone className="h-6 w-20 rounded-full" />
          </div>
          <Bone className="h-px w-full bg-gray-100" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Bone className="h-5 w-5 rounded" />
              <Bone className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Bone className="h-5 w-5 rounded" />
              <Bone className="h-4 w-44" />
            </div>
            <div className="flex items-center gap-3">
              <Bone className="h-5 w-5 rounded" />
              <Bone className="h-4 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="flex justify-end pt-6">
        <Bone className="h-10 w-32 rounded-md" />
      </div>
    </div>
  </div>
);

// ─── Settings Page Skeleton ─────────────────────────────
export const SettingsSkeleton = () => (
  <div className="pt-20 min-h-screen bg-gray-50 p-8">
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Bone className="h-12 w-12 rounded-2xl mb-6" />
        <Bone className="h-10 w-64" />
      </div>

      {/* Form card */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Avatar row */}
        <div className="flex items-center space-x-4 mb-6">
          <Bone className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Bone className="h-5 w-28" />
            <Bone className="h-3 w-44" />
          </div>
        </div>

        {/* Profile fields */}
        <div className="space-y-2">
          <Bone className="h-5 w-40 mb-4" />
          <Bone className="h-14 w-full rounded-md" />
          <Bone className="h-14 w-full rounded-md mt-4" />
          <Bone className="h-14 w-full rounded-md mt-4" />
        </div>

        {/* Security section */}
        <Bone className="h-px w-full bg-gray-100" />
        <div className="space-y-2">
          <Bone className="h-5 w-24 mb-4" />
          <Bone className="h-14 w-full rounded-md" />
          <Bone className="h-10 w-40 rounded-md mt-4" />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Bone className="h-12 w-32 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);
