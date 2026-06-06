import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function RFQList() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    try {
      const res = await api.get('/rfqs');
      setRows(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load RFQs');
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">RFQs</h2>
        <button onClick={() => navigate('create')} className="btn btn-primary">Create RFQ</button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>RFQ Number</th>
            <th>Title</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.rfq_number}</td>
              <td>{r.title}</td>
              <td>{r.status}</td>
              <td>{r.deadline ? new Date(r.deadline).toLocaleDateString() : ''}</td>
              <td><button onClick={() => navigate(String(r.id))} className="btn btn-sm">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
