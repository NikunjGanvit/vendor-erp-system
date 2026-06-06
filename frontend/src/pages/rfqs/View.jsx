import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function RFQView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfq, setRfq] = useState(null);

  useEffect(() => { fetch(); }, [id]);

  async function fetch() {
    try {
      const res = await api.get(`/rfqs/${id}`);
      setRfq(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load RFQ');
    }
  }

  if (!rfq) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl">RFQ: {rfq.rfq_number}</h2>
      <p>Title: {rfq.title}</p>
      <p>Status: {rfq.status}</p>
      <p>Deadline: {rfq.deadline ? new Date(rfq.deadline).toLocaleDateString() : ''}</p>

      <h3 className="mt-4">Details</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Estimated Price</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rfq.rfq_details) && rfq.rfq_details.map((d) => (
            <tr key={d.id}>
              <td>{d.item_description}</td>
              <td>{d.quantity}</td>
              <td>{d.estimated_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <button onClick={() => navigate(-1)} className="btn">Back</button>
      </div>
    </div>
  );
}
