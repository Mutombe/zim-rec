import React from 'react';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

const RejectDeviceModal = ({ device, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Rejection reason is required');
      return;
    }
    onConfirm(reason);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto">
          <Dialog.Title className="text-lg font-medium mb-4">
            Reject Device: {device.device_name}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                className={`w-full p-2 border rounded-md ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="4"
                placeholder="Provide detailed reason for rejection..."
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RejectDeviceModal;