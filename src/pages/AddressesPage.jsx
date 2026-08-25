import { useState } from 'react';
import Layout from '../components/Layout';
import { C, F, Ser } from '../designTokens';

export default function AddressesPage({ standalone = true }) {
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem('savedAddresses') || '[]')
  );
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', line1: '', city: '', phone: '' });

  const saveToStorage = (newAddresses) => {
    localStorage.setItem('savedAddresses', JSON.stringify(newAddresses));
    setAddresses(newAddresses);
  };

  const handleAdd = () => {
    if (!form.name || !form.line1 || !form.city) return;
    const newAddresses = [...addresses, form];
    saveToStorage(newAddresses);
    setForm({ name: '', line1: '', city: '', phone: '' });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(addresses[index]);
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!form.name || !form.line1 || !form.city) return;
    const newAddresses = [...addresses];
    newAddresses[editingIndex] = form;
    saveToStorage(newAddresses);
    setForm({ name: '', line1: '', city: '', phone: '' });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDelete = (index) => {
    if (window.confirm('Delete this address?')) {
      const newAddresses = addresses.filter((_, i) => i !== index);
      saveToStorage(newAddresses);
    }
  };

  const content = (
    <div style={{ padding: standalone ? '28px 64px' : '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ ...Ser(28, 300, C.ink) }}>Addresses</div>
        <button
          onClick={() => {
            setForm({ name: '', line1: '', city: '', phone: '' });
            setEditingIndex(null);
            setShowForm(true);
          }}
          style={{
            border: `0.5px solid ${C.brandRed}`,
            padding: '9px 18px',
            ...F(9, 400, C.brandRed),
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: 'pointer',
            background: 'transparent',
          }}
        >
          + ADD ADDRESS
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ ...F(13, 400, '#888') }}>No addresses saved yet.</div>
      ) : (
        addresses.map((addr, index) => (
          <div
            key={index}
            style={{
              border: `0.5px solid ${C.border}`,
              padding: '16px',
              marginBottom: 12,
              background: C.white,
            }}
          >
            <div style={{ ...F(12, 500, C.ink), marginBottom: 6 }}>{addr.name}</div>
            <div style={{ ...F(11, 400, '#888'), lineHeight: 1.6 }}>
              {addr.line1}, {addr.city}
            </div>
            {addr.phone && <div style={{ ...F(11, 400, '#888') }}>{addr.phone}</div>}
            <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
              <span
                onClick={() => handleEdit(index)}
                style={{ ...F(10, 400, C.tan), cursor: 'pointer', letterSpacing: 1 }}
              >
                EDIT
              </span>
              <span
                onClick={() => handleDelete(index)}
                style={{ ...F(10, 400, C.red), cursor: 'pointer', letterSpacing: 1 }}
              >
                DELETE
              </span>
            </div>
          </div>
        ))
      )}

      {/* Address Form Modal */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: C.white,
              padding: '28px',
              maxWidth: 400,
              width: '90%',
              border: `0.5px solid ${C.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ ...Ser(24, 300, C.ink), marginBottom: 16 }}>
              {editingIndex !== null ? 'Edit Address' : 'Add Address'}
            </div>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Address Line"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                style={{
                  flex: 1,
                  background: C.brandRed,
                  color: C.cream,
                  border: 'none',
                  padding: '10px 0',
                  ...F(10, 500, C.cream),
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {editingIndex !== null ? 'Update' : 'Save'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  border: `0.5px solid ${C.border}`,
                  background: 'transparent',
                  padding: '10px 16px',
                  ...F(10, 400, '#888'),
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!standalone) return content;

  return (
    <Layout>
      <div style={{ background: C.sand, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {content}
      </div>
    </Layout>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: `0.5px solid ${C.border}`,
  marginBottom: 12,
  ...F(13, 400, C.ink),
  outline: 'none',
  boxSizing: 'border-box',
};