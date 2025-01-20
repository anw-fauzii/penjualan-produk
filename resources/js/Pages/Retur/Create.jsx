import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import toastr from 'toastr';
import { NumericFormat } from 'react-number-format';
import { HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import Swal from 'sweetalert2';

export default function Create(props) {
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchId, setSearchId] = useState('');
    const [filteredPesanan, setFilteredPesanan] = useState(null);
    const [error, setError] = useState('');
    const barcodeInputRef = useRef(null);
    const [totals, setTotals] = useState({ subtotal: 0, total: 0, diskon: 0, totalHarga: 0 });
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Handle search
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

    const calculateTotals = () => {
        const totalHarga = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas), 0);
        const subtotal = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas) - ((item.harga_jual * (item.diskon / 100)) * item.kuantitas), 0);
        const diskon = cart.reduce((total, item) => total + ((item.harga_jual * (item.diskon / 100)) * item.kuantitas), 0);
        const total = subtotal;
    
        return { subtotal, total, diskon, totalHarga };
    };
    
    
    useEffect(() => {
        const { subtotal, total, diskon, totalHarga } = calculateTotals();
        setTotals({ subtotal, total, diskon, totalHarga });
    }, [cart]); // Perhitungan ulang jika cart berubah
    

    const handleQuantityChange = (id, delta) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id // cek apakah ID barang sesuai
                    ? {
                        ...item,
                        kuantitas: delta > 0
                            ? Math.min(item.kuantitas + delta, item.stok) // Cek batasan stok
                            : Math.max(0, item.kuantitas + delta) // Minimum 1 untuk kuantitas
                    }
                    : item
            )
        );
    };
    
    const handleSubmit = async () => {
        if (!filteredPesanan) {
            setError('No order to return');
            return;
        }

        try {
            Swal.fire({
                title: 'Konfirmasi',
                text: 'Barang akan di retur dengan ukuran baru',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya!',
                cancelButtonText: 'Batal',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.post(`/retur/${filteredPesanan.id}`, {
                        cart, 
                    });
                    toastr.success('Item Berhasil di Retur', 'Sukses!')
                    setError('');
                    setFilteredPesanan(null);
                    setSearchId('');
                    setReturnQuantities({});
                    setReturnSizes({}); // Reset ukuran
                }
            });
        } catch (error) {
            setReturnStatus('');
            setError('Failed to initiate return');
        }
    };

    // Handle removing item from cart
    const handleRemoveFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Add item to cart (with barcode scan functionality)
    const addToCart = (item) => {
        if (item.stok > 0) {
            setCart(prevCart => {
                const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
                
                if (existingItem) {
                    setSearchTerm('');
                    return prevCart.map(cartItem =>
                        cartItem.id === item.id
                            ? { ...cartItem, kuantitas: cartItem.kuantitas + 1 }
                            : cartItem
                    );
                } else {
                    setSearchTerm('');
                    return [...prevCart, { ...item, kuantitas: 1 }];
                }
            });
        } else {
            setSearchTerm('');
            toastr.warning('Stok barang ini habis.');
        }
    };
    

    // Fetch items that match the search term
    const filteredBarang = props.barang.filter(item =>
        item.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Effect to handle barcode scanning
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const barcode = barcodeInputRef.current.value.trim();
                if (barcode) {
                    const item = props.barang.find(b => b.id === barcode);
                    if (item) {
                        addToCart(item);
                        barcodeInputRef.current.value = '';
                    } else {
                        toastr.warning('Item tidak ditemukan.');
                        barcodeInputRef.current.value = '';
                    }
                }
            }
        };

        const inputElement = barcodeInputRef.current;
        if (inputElement) {
            inputElement.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (inputElement) {
                inputElement.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [props.barang]);

    useEffect(() => {
        if (props.pesanan) {
            // Filter pesanan berdasarkan searchId
            const filteredData = searchId
                ? props.pesanan.filter(item => item.id.includes(searchId))
                : props.pesanan;
    
            // Map pesanan_detail ke dalam cart
            const previousCart = filteredData.reduce((acc, item) => {
                const pesananDetails = item.pesanan_detail.map(detail => ({
                    ...detail,
                    kuantitas: detail.kuantitas, // Pastikan kuantitas adalah angka yang valid
                    harga_jual: detail.barang_ukuran.harga_jual || 0, // Pastikan harga adalah angka yang valid
                    diskon: detail.barang_ukuran.diskon || 0, // Pastikan diskon adalah angka yang valid
                    id: detail.barang_ukuran_id, // ID barang ukuran
                    stok: detail.barang_ukuran.stok,
                    barang: {
                        nama_barang: detail.barang_ukuran.barang.nama_barang, // Nama barang
                    },
                    ukuran: detail.barang_ukuran.ukuran, // Ukuran barang
                }));
    
                return [...acc, ...pesananDetails]; // Gabungkan semua pesanan detail ke dalam array cart
            }, []);
            setCart(previousCart); // Set cart dengan hasil yang sudah dimasukkan pesanan_detail
        }
    }, [props.pesanan, searchId]);

    return (
        <div className="flex max-h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} roleUser={props.roleUser}/>
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
                                Cari
                            </button>
                        </div>

                        {filteredPesanan && (
                            <>

                                {/* Barcode Input Field */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        ref={barcodeInputRef}
                                        placeholder="Scan barcode..."
                                        className="p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari produk..."
                                        className="p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <p className="text-gray-700"><strong>Pemesan:</strong> {filteredPesanan.nama_pemesan} - {filteredPesanan.nama_siswa} ({filteredPesanan.kelas})  </p>
                                    <p className="text-gray-700"><strong>Tanggal:</strong> {new Date(filteredPesanan.created_at).toLocaleDateString()}</p>
                                </div>
                                {searchTerm && (
                                    <div className="mb-4">
                                        <ul>
                                            {filteredBarang.length > 0 ? (
                                                filteredBarang.map(item => (
                                                    <li key={item.id} className="grid grid-cols-6 gap-4 mb-2 p-2 border border-gray-300 rounded">
                                                        <span className="inline-flex justify-center items-center">
                                                            <button
                                                                onClick={() => addToCart(item)}
                                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                            >
                                                                <HiOutlineShoppingCart />
                                                            </button>
                                                        </span>
                                                        <span className="col-span-2">{item.id} - {item.barang.nama_barang} ({item.ukuran})</span>
                                                        <span><NumericFormat
                                                            value={item.harga_jual}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            prefix={'Rp. '}
                                                        /></span>
                                                        <span>Disc. {item.diskon}%</span>
                                                        <span>{item.stok} Tersedia</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="p-4 text-center">No items found</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Cart Items */}
                                {cart.length > 0 && (
                                    <div className="p-4 mt-4 rounded-lg shadow-md border border-gray-200">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="border-b px-4 py-2">Item</th>
                                                    <th className="border-b px-4 py-2">Qty</th>
                                                    <th className="border-b px-4 py-2">Harga</th>
                                                    <th className="border-b px-4 py-2">Diskon</th>
                                                    <th className="border-b px-4 py-2">Total</th>
                                                    <th className="border-b px-4 py-2">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map(item => (
                                                    <tr key={item.id}>
                                                        <td className="border-b px-4 py-2">{item.id} - {item.barang.nama_barang} ({item.ukuran})</td>
                                                        <td className="border-b px-4 py-2">
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, -1)}
                                                                disabled={item.kuantitas < 1}
                                                                className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                                                            >
                                                                -
                                                            </button>
                                                            {item.kuantitas}
                                                            <button
                                                                onClick={() => handleQuantityChange(item.id, 1)}
                                                                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                                            >
                                                                +
                                                            </button>
                                                        </td>
                                                        <td className="border-b px-4 py-2">
                                                            <NumericFormat
                                                                value={item.harga_jual}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                prefix={'Rp. '}
                                                            />
                                                        </td>
                                                        <td className="border-b px-4 py-2">
                                                            <NumericFormat
                                                                value={(item.harga_jual * (item.diskon / 100)) * item.kuantitas}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                prefix={'Rp. '}
                                                            />
                                                        </td>
                                                        <td className="border-b px-4 py-2">
                                                            <NumericFormat
                                                                value={item.harga_jual * item.kuantitas}
                                                                displayType={'text'}
                                                                thousandSeparator={true}
                                                                prefix={'Rp. '}
                                                            />
                                                        </td>
                                                        <td className="border-b px-4 py-2">
                                                            <button
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                            >
                                                                <HiOutlineTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="mt-4">
                                            <p><strong>Subtotal:</strong> <NumericFormat value={totals.totalHarga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                            <p><strong>Total Diskon:</strong> <NumericFormat value={totals.diskon} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                            <p><strong>Total Belanja:</strong> <NumericFormat value={totals.total} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                            <p><strong>Pembelian Sebelumnya:</strong> <NumericFormat value={filteredPesanan.total_harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                            <p><strong>Tambahan:</strong> <NumericFormat value={totals.total - filteredPesanan.total_harga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Submit Returns
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <CustomFooter />
        </div>
    );
}
