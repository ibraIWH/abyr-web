import { useEffect, useState } from 'react';
import api from '../api';
import Layout from '../components/Layout';
import { C, F, Ser } from '../designTokens';

const EMPTY = { name: '', line1: '', city: '', phone: '' };

export default function AddressesPage({ standalone = true }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  // Load from the server, and move anything still sitting in this browser's
  // localStorage up to the account once — then clear it, so the server is the
  // only source of truth from here on.
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await api.get('/addresses');
        let list = res.data || [];

        const legacy = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
        if (legacy.length > 0) {
          for (const a of legacy) {
            if (!a.name || !a.line1 || !a.city) continue;
            const saved = await api.post('/addresses', a);
            list = saved.data;
          }
          localStorage.removeItem('savedAddresses');
        }

        if (alive) setAddresses(list);
      } catch (err) {
        if (alive) setError(err?.response?.data?.message || 'Could not load your addresses.');
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => { alive = false; };
  }, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setForm({ name: addr.name, line1: addr.line1, city: addr.city, phone: addr.phone || '' });
    setEditingId(addr._id);
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.line1 || !form.city) {
      setError('Name, address and city are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Both endpoints return the full updated list, so we just swap it in.
      const res = editingId
        ? await api.put(`/addresses/${editingId}`, form)
        : await api.post('/addresses', form);
      setAddresses(res.data);
      setForm(EMPTY);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save that address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const res = await api.delete(`/addresses/${id}`);
      setAddresses(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete that address.');
    }
  };

  const content = (
    <div style={{ padding: standalone ? '28px clamp(16px, 5vw, 64px)' : '0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ ...Ser(28, 300, C.ink) }}>Addresses</div>
        <button
          onClick={openAdd}
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

      {error && !showForm && (
        <div style={{ background: '#FFEBEE', color: C.red, padding: '10px 14px', marginBottom: 16, ...F(11, 400) }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ ...F(13, 400, '#888') }}>Loading…</div>
      ) : addresses.length === 0 ? (
        <div style={{ ...F(13, 400, '#888') }}>No addresses saved yet.</div>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr._id}
            style={{
              border: `0.5px solid ${C.border}`,
              padding: '16px',
              marginBottom: 12,
              background: C.white,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ ...F(12, 500, C.ink) }}>{addr.name}</div>
              {addr.isDefault && (
                <span style={{ ...F(8, 500, C.ink), background: C.gold, padding: '3px 8px', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Default
                </span>
              )}
            </div>
            <div style={{ ...F(11, 400, '#888'), lineHeight: 1.6 }}>
              {addr.line1}, {addr.city}
            </div>
            {addr.phone && <div style={{ ...F(11, 400, '#888') }}>{addr.phone}</div>}
            <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
              <span onClick={() => openEdit(addr)} style={{ ...F(10, 400, C.tan), cursor: 'pointer', letterSpacing: 1 }}>
                EDIT
              </span>
              <span onClick={() => handleDelete(addr._id)} style={{ ...F(10, 400, C.red), cursor: 'pointer', letterSpacing: 1 }}>
                DELETE
              </span>
            </div>
          </div>
        ))
      )}

      {/* Address form */}
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
            padding: 16,
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: C.white,
              padding: '28px',
              maxWidth: 400,
              width: '100%',
              border: `0.5px solid ${C.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ ...Ser(24, 300, C.ink), marginBottom: 16 }}>
              {editingId ? 'Edit Address' : 'Add Address'}
            </div>

            {error && (
              <div style={{ background: '#FFEBEE', color: C.red, padding: '10px 14px', marginBottom: 12, ...F(11, 400) }}>
                {error}
              </div>
            )}

            <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="Address Line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} style={inputStyle} />
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} style={inputStyle} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  background: saving ? '#888' : C.brandRed,
                  color: C.cream,
                  border: 'none',
                  padding: '10px 0',
                  ...F(10, 500, C.cream),
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: saving ? 'default' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : editingId ? 'Update' : 'Save'}
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