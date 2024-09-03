// resources/js/Components/Modal.js
import React, { useState } from 'react';

export default function ModalPemesanan({ isOpen, onClose, onSubmit }) {
    const [namaPemesan, setNamaPemesan] = useState('');
    const [kelas, setKelas] = useState('');
    const [namaSiswa, setNamaSiswa] = useState('');

    const handleSubmit = () => {
        if (namaPemesan && kelas && namaSiswa) {
            onSubmit(namaPemesan, kelas, namaSiswa);
            setName('');
            setClassName('');
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        isOpen ? (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <h2 className="text-xl font-semibold mb-4">Masukan Detail Pembelian</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nama Siswa</label>
                        <input
                            type="text"
                            value={namaSiswa}
                            onChange={(e) => setNamaSiswa(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Kelas</label>
                        <input
                            type="text"
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nama Pengambil</label>
                        <input
                            type="text"
                            value={namaPemesan}
                            onChange={(e) => setNamaPemesan(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className=" bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        ) : null
    );
}
