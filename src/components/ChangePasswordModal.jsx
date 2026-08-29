import { useState } from 'react';
import api from '../api';
import { useToast } from '../context/ToastContext';
import { C, F } from '../designTokens';

export default function ChangePasswordModal({ onClose }) {
  const { addToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      addToast('Password updated successfully', 'success');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.white,
          maxWidth: 420,
          width: '100%',
          padding: '28px',
          border: `0.5px solid ${C.border}`,
          borderRadius: 8,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ ...F(18, 500, C.ink), marginBottom: 8 }}>Change Password</h2>
        <p style={{ ...F(12, 400, '#888'), marginBottom: 20 }}>Update your account password</p>

        {error && (
          <div style={{ background: '#FFEBEE', color: C.red, padding: '8px 12px', marginBottom: 16, ...F(11, 400) }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ ...F(10, 500, C.tan), letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ ...F(10, 500, C.tan), letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ ...F(10, 500, C.tan), letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#888' : C.brandRed,
                color: C.cream,
                border: 'none',
                ...F(11, 500, C.cream),
                letterSpacing: 2,
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: `0.5px solid ${C.border}`,
                ...F(11, 400, '#888'),
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `0.5px solid ${C.border}`,
  borderRadius: 4,
  ...F(13, 400, C.ink),
  outline: 'none',
  boxSizing: 'border-box',
};