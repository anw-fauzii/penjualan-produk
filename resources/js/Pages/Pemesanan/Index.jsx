import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [discount, setDiscount] = useState(0);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, kuantitas: cartItem.kuantitas + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, kuantitas: 1 }]);
        }
    };

    const handleQuantityChange = (id, delta) => {
        setCart(cart.map(item =>
            item.id === id
                ? { ...item, kuantitas: Math.max(1, item.kuantitas + delta) }
                : item
        ));
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas), 0);
        const total = subtotal - discount;
        return { subtotal, total };
    };

    const { subtotal, total } = calculateTotals();

    // Pengecekan data barang
    const barang = props.barang || [];

    // Filter barang berdasarkan pencarian
    const filteredBarang = barang.filter(item =>
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <JudulHeader
                        judul={props.title}
                        subJudul="Menu Pemesanan"
                        className="text-lg md:text-2xl mb-4"
                    />

                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Cari produk..."
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>

                        {/* Product List - Only show if searchTerm is not empty */}
                        {searchTerm && (
                            <div className="mb-4">
                                <ul>
                                    {filteredBarang.length > 0 ? (
                                        filteredBarang.map(item => (
                                            <li key={item.id} className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded">
                                                <span>{item.nama_barang}</span>
                                                <span>{item.harga_jual.toFixed(2)}</span>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                >
                                                    Tambah ke Keranjang
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-4 text-center">No items found</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Cart Table */}
                        <div className="mb-4 overflow-x-auto">
                            <table className="w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 border">No</th>
                                        <th className="p-2 border">Nama Barang</th>
                                        <th className="p-2 border">Kuantitas</th>
                                        <th className="p-2 border">Harga</th>
                                        <th className="p-2 border">Subtotal</th>
                                        <th className="p-2 border">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="p-2 border">{index + 1}</td>
                                            <td className="p-2 border">{item.nama_barang}</td>
                                            <td className="p-2 border">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className="p-1 border bg-gray-200"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2">{item.kuantitas}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className="p-1 border bg-gray-200"
                                                >
                                                    +
                                                </button>
                                            </td>
                                            <td className="p-2 border">{item.harga_jual.toFixed(2)}</td>
                                            <td className="p-2 border">{(item.harga_jual * item.kuantitas).toFixed(2)}</td>
                                            <td className="p-2 border">
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total Harga */}
                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Subtotal:</span>
                                <span>{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Diskon:</span>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <CustomFooter />
        </div>
    );
}
