import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function POView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);

  useEffect(() => {
    fetch();
  }, [id]);

  async function fetch() {
    try {
      const res = await api.get(`/purchase-orders/${id}`);
      setPo(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load PO');
    }
  }

  if (!po) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl">PO: {po.po_number}</h2>
      <p>Vendor ID: {po.vendor_id}</p>
      <p>Status: {po.status}</p>
      <p>PO Date: {new Date(po.po_date).toLocaleDateString()}</p>
      <p>Grand Total: {po.grand_total}</p>

      <h3 className="mt-4">Details</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(po.po_details) && po.po_details.map((d) => (
            <tr key={d.id}>
              <td>{d.item_id}</td>
              <td>{d.quantity}</td>
              <td>{d.unit_price}</td>
              <td>{d.total_price}</td>
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
