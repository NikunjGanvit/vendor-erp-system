import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function POList() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, [offset]);

  async function fetchList() {
    try {
      const res = await api.get('/purchase-orders', { params: { limit, offset } });
      setRows(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      alert('Failed to load purchase orders');
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Purchase Orders</h2>
        <div>
          <button onClick={() => navigate('create')} className="btn btn-primary">
            Create PO
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Vendor</th>
            <th>Status</th>
            <th>PO Date</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.po_number}</td>
              <td>{r.vendor_id}</td>
              <td>{r.status}</td>
              <td>{new Date(r.po_date).toLocaleDateString()}</td>
              <td>{r.grand_total}</td>
              <td>
                <button onClick={() => navigate(String(r.id))} className="btn btn-sm">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))} className="btn">
          Prev
        </button>
        <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}
