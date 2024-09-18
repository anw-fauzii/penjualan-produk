import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import toastr from 'toastr';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';

export default function Create(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [filteredPesanan, setFilteredPesanan] = useState(null);
    const [error, setError] = useState('');
    const [returnStatus, setReturnStatus] = useState('');
    const [returnQuantities, setReturnQuantities] = useState({});

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleSearch = () => {
        const trimmedSearchId = searchId.trim();

        if (!trimmedSearchId) {
            toastr.error('Silahkan Periksa Kembali Inputan Anda', 'Error!');
            setFilteredPesanan(null);
            return;
        }

        const result = props.pesanan.find(p => p.id === trimmedSearchId);
        if (result) {
            setFilteredPesanan(result);
            setError('');
        } else {
            setFilteredPesanan(null);
            toastr.error('Pesanan tidak ditemukan', 'Error!');
        }
    };

    const handleSubmit = async () => {
        if (!filteredPesanan) {
            setError('No order to return');
            return;
        }

        try {
            Swal.fire({
                title: 'Konfirmasi',
                text: 'Barang akan di retur',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(`/retur/${filteredPesanan.id}`, {
                        returnQuantities,
                    });
                    toastr.success('Item Berhasil di Retur', 'Sukses!')
                    setError('');
                    setFilteredPesanan(null);
                    setSearchId('');
                    setReturnQuantities({});
                }
            });
        } catch (error) {
            setReturnStatus('');
            setError('Failed to initiate return');
        }
    };

    const handleQuantityChange = (itemId, value) => {
        const item = filteredPesanan.pesanan_detail.find(detail => detail.id === itemId);
        const maxQuantity = item ? item.kuantitas : 0;

        setReturnQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(0, Math.min(value, maxQuantity))
        }));
    };

    return (
        <div className="flex max-h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex flex-1 flex-col mb-11">
                <CustomNavbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-8 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <JudulHeader judul="Retur Barang" subJudul="Retur Barang" />
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                        <div className="mb-6 flex items-center">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Pesanan ID"
                                className="border border-gray-300 rounded-lg p-3 w-full sm:w-80 mr-4"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition duration-150"
                            >
                                Search
                            </button>
                        </div>
                        {returnStatus && (
                            <div className="text-green-600 mb-4 p-4 border border-green-300 rounded-lg bg-green-50">
                                {returnStatus}
                            </div>
                        )}
                        {filteredPesanan && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Pesanan ID: {filteredPesanan.id}</h3>
                                    <p className="text-gray-700"><strong>Customer:</strong> {filteredPesanan.nama_pemesan}</p>
                                    <p className="text-gray-700"><strong>Date:</strong> {new Date(filteredPesanan.created_at).toLocaleDateString()}</p>
                                    <h4 className="font-semibold mt-4 mb-2">Details:</h4>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Return Quantity
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPesanan.pesanan_detail.map(detail => (
                                                <tr key={detail.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {detail.barang_ukuran.barang.nama_barang}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {detail.kuantitas}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <NumericFormat
                                                            value={detail.subtotal}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            prefix={'Rp. '}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            value={returnQuantities[detail.id] || 0} // Set default value to 0
                                                            onChange={(e) => handleQuantityChange(detail.id, parseInt(e.target.value))}
                                                            min="0" // Minimum value set to 0
                                                            max={detail.kuantitas}
                                                            className="border border-gray-300 rounded-lg p-2 w-24"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-600 text-white rounded-lg px-6 py-3 hover:bg-green-700 transition duration-150"
                                        >
                                            Submit Returns
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <CustomFooter />
        </div>
    );
}
