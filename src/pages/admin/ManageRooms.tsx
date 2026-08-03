// ManageRooms page (admin): list, create, edit, and delete rooms.

import { useEffect, useState } from 'react';
import { roomApi } from '../../services/api';
import type { Room } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

// An empty form used when creating a new room.
const emptyForm = {
  name: '',
  roomNumber: '',
  roomType: 'Standard',
  description: '',
  price: '',
  capacity: '',
  image: '',
  availability: true,
};

function ManageRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Modal state for create/edit.
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  // Load all rooms.
  const loadRooms = () => {
    setLoading(true);
    roomApi
      .getRooms()
      .then((data: Room[]) => setRooms(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Open the modal to create a new room.
  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Open the modal to edit an existing room.
  const openEdit = (room: Room) => {
    setForm({
      name: room.name,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      description: room.description,
      price: String(room.price),
      capacity: String(room.capacity),
      image: room.image,
      availability: room.availability,
    });
    setEditingId(room._id);
    setShowModal(true);
  };

  // Handle form field changes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkboxes (availability).
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save (create or update) the room.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: required fields.
    if (!form.name || !form.roomNumber || !form.price || !form.capacity) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        capacity: Number(form.capacity),
      };
      if (editingId) {
        await roomApi.updateRoom(editingId, payload);
        showToast('Room updated', 'success');
      } else {
        await roomApi.createRoom(payload);
        showToast('Room created', 'success');
      }
      setShowModal(false);
      loadRooms();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete a room.
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this room? This cannot be undone.')) return;
    try {
      await roomApi.deleteRoom(id);
      showToast('Room deleted', 'success');
      loadRooms();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
        <button
          onClick={openCreate}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Number</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <img src={room.image} alt={room.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium text-gray-900">{room.name}</span>
                  </td>
                  <td className="px-4 py-3">{room.roomNumber}</td>
                  <td className="px-4 py-3">{room.roomType}</td>
                  <td className="px-4 py-3">${room.price}</td>
                  <td className="px-4 py-3">{room.capacity}</td>
                  <td className="px-4 py-3">
                    {room.availability ? (
                      <span className="text-emerald-600">Available</span>
                    ) : (
                      <span className="text-red-500">Booked</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(room)}
                        className="text-sky-600 hover:text-sky-700"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room._id)}
                        className="text-red-500 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                {editingId ? 'Edit Room' : 'Add Room'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input
                    name="roomNumber"
                    value={form.roomNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                  <select
                    name="roomType"
                    value={form.roomType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price / night *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                  <input
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="availability"
                  type="checkbox"
                  checked={form.availability}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700">Available for booking</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRooms;
