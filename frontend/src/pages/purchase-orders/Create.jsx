import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function POCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    po_number: '',
    procurement_officer_id: '',
    po_date: '',
    delivery_date: '',
    currency: 'INR',
    notes: '',
    po_details: [{ item_id: '', quantity: 1, unit_price: 0 }],
  });

  function updateDetail(idx, key, val) {
    const copy = [...form.po_details];
    copy[idx] = { ...copy[idx], [key]: val };
    setForm({ ...form, po_details: copy });
  }

  function addDetail() {
    setForm({ ...form, po_details: [...form.po_details, { item_id: '', quantity: 1, unit_price: 0 }] });
  }

  function removeDetail(i) {
    const copy = form.po_details.filter((_, idx) => idx !== i);
    setForm({ ...form, po_details: copy });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        procurement_officer_id: Number(form.procurement_officer_id),
        po_details: form.po_details.map((d) => ({
          ...d,
          item_id: Number(d.item_id),
          quantity: Number(d.quantity),
          unit_price: Number(d.unit_price),
        })),
      };

      const res = await api.post('/purchase-orders', payload);
      alert('PO created');
      const id = res?.data?.data?.id || res?.data?.data?.po_id;
      if (id) navigate(`/purchase-orders/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create PO');
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Create Purchase Order</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
        <input placeholder="PO Number" value={form.po_number} onChange={(e) => setForm({ ...form, po_number: e.target.value })} className="input" required />
        <input placeholder="Procurement Officer ID" value={form.procurement_officer_id} onChange={(e) => setForm({ ...form, procurement_officer_id: e.target.value })} className="input" required />
        <input type="date" value={form.po_date} onChange={(e) => setForm({ ...form, po_date: e.target.value })} className="input" required />
        <input type="date" value={form.delivery_date} onChange={(e) => setForm({ ...form, delivery_date: e.target.value })} className="input" required />
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" />

        <div>
          <h3 className="font-medium">Details</h3>
          {form.po_details.map((d, idx) => (
            <div key={idx} className="border p-2 my-2">
              <input placeholder="Item ID" value={d.item_id} onChange={(e) => updateDetail(idx, 'item_id', e.target.value)} className="input" required />
              <input placeholder="Quantity" type="number" value={d.quantity} onChange={(e) => updateDetail(idx, 'quantity', e.target.value)} className="input" required />
              <input placeholder="Unit Price" type="number" value={d.unit_price} onChange={(e) => updateDetail(idx, 'unit_price', e.target.value)} className="input" required />
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => removeDetail(idx)} className="btn btn-danger">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addDetail} className="btn">Add Detail</button>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">Create</button>
          <button type="button" onClick={() => navigate(-1)} className="btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}
