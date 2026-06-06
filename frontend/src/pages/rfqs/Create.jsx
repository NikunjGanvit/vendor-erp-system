import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function RFQCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rfq_number: '',
    title: '',
    procurement_officer_id: '',
    deadline: '',
    notes: '',
    currency: 'INR',
    rfq_details: [{ item_description: '', quantity: 1, estimated_price: 0, unit: 'NOS', category: 'Procurement' }],
  });

  function updateDetail(idx, key, val) {
    const copy = [...form.rfq_details];
    copy[idx] = { ...copy[idx], [key]: val };
    setForm({ ...form, rfq_details: copy });
  }

  function addDetail() { setForm({ ...form, rfq_details: [...form.rfq_details, { item_description: '', quantity: 1, estimated_price: 0, unit: 'NOS', category: 'Procurement' }] }); }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        procurement_officer_id: Number(form.procurement_officer_id),
        rfq_details: form.rfq_details.map((d) => ({ ...d, quantity: Number(d.quantity), estimated_price: Number(d.estimated_price) })),
      };

      const res = await api.post('/rfqs', payload);
      alert('RFQ created');
      const id = res?.data?.data?.id || res?.data?.data?.rfq_id;
      if (id) navigate(`/rfqs/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create RFQ');
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Create RFQ</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
        <input placeholder="RFQ Number" value={form.rfq_number} onChange={(e) => setForm({ ...form, rfq_number: e.target.value })} className="input" />
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" required />
        <input placeholder="Procurement Officer ID" value={form.procurement_officer_id} onChange={(e) => setForm({ ...form, procurement_officer_id: e.target.value })} className="input" required />
        <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="input" />
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" />

        <div>
          <h3 className="font-medium">Details</h3>
          {form.rfq_details.map((d, idx) => (
            <div key={idx} className="border p-2 my-2">
              <input placeholder="Item Description" value={d.item_description} onChange={(e) => updateDetail(idx, 'item_description', e.target.value)} className="input" required />
              <input placeholder="Quantity" type="number" value={d.quantity} onChange={(e) => updateDetail(idx, 'quantity', e.target.value)} className="input" required />
              <input placeholder="Estimated Price" type="number" value={d.estimated_price} onChange={(e) => updateDetail(idx, 'estimated_price', e.target.value)} className="input" required />
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
