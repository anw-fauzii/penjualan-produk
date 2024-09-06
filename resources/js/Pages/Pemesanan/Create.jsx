import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import { HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import { NumericFormat } from 'react-number-format';
import { router } from '@inertiajs/react';
import toastr from 'toastr';
import ModalPemesanan from '@/Components/modal/ModalPemesanan';

export default function Create(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        const totalHarga = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas), 0);
        const subtotal = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas) - ((item.harga_jual * (item.diskon / 100)) * item.kuantitas), 0);
        const diskon = cart.reduce((total, item) => total + ((item.harga_jual * (item.diskon / 100)) * item.kuantitas), 0);
        const total = totalHarga - diskon;
        return { subtotal, total, diskon, totalHarga };
    };

    const { subtotal, total, diskon, totalHarga } = calculateTotals();

    const barang = props.barang || [];

    const filteredBarang = barang.filter(item =>
        item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const placeOrder = (namaPemesan, kelas, namaSiswa) => {
        router.post('/pemesanan', { cart, namaPemesan, kelas, namaSiswa }, {
            onSuccess: (response) => {
                console.log(response)
                const numberFormat = new Intl.NumberFormat('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                });
                const totalHarga = cart.reduce((total, item) => {
                    return total + (item.harga_jual * item.kuantitas);
                }, 0);

                const totalDiskon = cart.reduce((total, item) => {
                    return total + ((item.harga_jual * (item.diskon / 100)) * item.kuantitas);
                }, 0);

                const totalBelanja = totalHarga - totalDiskon;

                console.log("Image path:", "/storage/Untitled.png");

                const totalHargaFormatted = numberFormat.format(totalHarga);
                const totalDiskonFormatted = numberFormat.format(totalDiskon);
                const totalBelanjaFormatted = numberFormat.format(totalBelanja);
                const cartRows = cart.map(item => {
                    // Format harga dan total
                    const hargaJualFormatted = numberFormat.format(item.harga_jual);
                    const totalFormatted = numberFormat.format(item.harga_jual * item.kuantitas);

                    // Generate the main row for the item
                    let itemRow = `
                    <tr>
                        <td>${item.nama_barang}</td>
                        <td>${item.kuantitas}</td>
                        <td style="text-align:right;">${hargaJualFormatted}</td>
                        <td style="text-align:right;">${totalFormatted}</td>
                    </tr>
                `;

                    // Conditionally add a discount row if applicable
                    if (item.diskon !== 0) {
                        const diskonFormatted = numberFormat.format(((item.harga_jual * (item.diskon / 100)) * item.kuantitas));
                        itemRow += `
                        <tr>
                            <td colspan="4">Disc: -${diskonFormatted}</td>
                        </tr>
                    `;
                    }

                    return itemRow;
                }).join('');

                const receiptContent = `
                <html>
                <head>
                    <title>Struk Pembelian</title>
                    <style>
                        body { 
                            font-family: 'Courier New', Courier, monospace; 
                            margin: 0; 
                            padding: 0; 
                        }
                        .receipt { 
                            width: 80mm; 
                            margin: 0; 
                            padding: 2mm; /* Padding 2mm */
                            box-sizing: border-box;
                        }
                        .receipt h1 { 
                            font-size: 14px; 
                            margin-bottom: 5px; 
                        }
                        .receipt p { 
                            margin: 2px 0; 
                            font-size: 12px; 
                        }
                        .receipt .footer { 
                            margin-top: 10px; 
                            text-align: center; 
                            font-size: 10px; 
                            color: #888; 
                        }
                        .receipt table {
                            width: 100%;
                            border-collapse: collapse; 
                            font-size: 10px; 
                        }
                        .receipt th, .receipt td {
                            padding: 1mm; 
                            text-align: left;
                        }
                        .receipt th {
                            background-color: #f4f4f4;
                        }
                        .receipt .line {
                            border: none;
                            border-top: 1px solid #000;
                            height: 1px;
                            margin: 5px 0;
                        }
                        @media print {
                            body { margin: 0; }
                            .receipt { 
                                width: 80mm; 
                                border: none; 
                                box-shadow: none;
                            }
                            @page {
                                size: 80mm auto; 
                                margin: 0; 
                            }
                            .receipt .footer { display: none; }
                            .receipt img {
                                display: block;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                            <img src="/logo.png" style="width: 15%; height: auto; text-align:center" />
                            <h1>Nota Pembelian</h1>
                        <p><strong>Nama Siswa:</strong>${response.props.flash.message.nama_siswa}</p>
                        <p><strong>Kelas:</strong>${response.props.flash.message.kelas}</p>
                        <p><strong>Nama Pengambil:</strong>${response.props.flash.message.nama_pemesan}</p>
                        <div class="line"></div>
                        <p>${response.props.flash.message.id}</p>
                        <div class="line"></div>
                        <table>
                            <thead>
                                <tr>
                                    <th style="text-align:center;">Item</th>
                                    <th style="text-align:center;">Qty</th>
                                    <th style="text-align:center;">Harga</th>
                                    <th style="text-align:center;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${cartRows}
                                <tr>
                                    <td colspan="3" style="text-align:right;">Total Item</td>
                                    <td style="text-align:right;">${totalHargaFormatted}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align:right;">Total Diskon</td>
                                    <td style="text-align:right;">${totalDiskonFormatted}</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align:right;">Total Belanja</td>
                                    <td style="text-align:right;">${totalBelanjaFormatted}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="line"></div>
                        <div class="footer">Terima kasih atas pembelian Anda!</div>
                    </div>
                </body>
                </html>
                `;


                const printWindow = window.open('', '', 'width=800');
                printWindow.document.write(receiptContent);
                printWindow.document.close();
                printWindow.focus();

                printWindow.addEventListener('afterprint', () => {
                    printWindow.close();
                });

                printWindow.print();

                toastr.success('Pesanan berhasil dibuat!');
                setCart([]);
                setSearchTerm('');
                setIsModalOpen(false);
            },
            onError: () => {
                toastr.error('Gagal membuat pesanan, silakan coba lagi.');
            }
        });
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto">
                    <JudulHeader
                        judul={props.title}
                        subJudul="Pemesanan"
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
                                            <li key={item.id} className="grid grid-cols-6 gap-4 mb-2 p-2 border border-gray-300 rounded">
                                                <span className="inline-flex justify-center items-center">
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    >
                                                        <HiOutlineShoppingCart />
                                                    </button>
                                                </span>
                                                <span className="col-span-2">{item.id} - {item.nama_barang}</span>
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

                        {/* Cart Table */}
                        <div className="mb-4 overflow-x-auto">
                            <table className="w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 border">No</th>
                                        <th className="p-2 border">Nama Barang</th>
                                        <th className="p-2 border">Kuantitas</th>
                                        <th className="p-2 border">Harga</th>
                                        <th className="p-2 border">Diskon</th>
                                        <th className="p-2 border">Subtotal</th>
                                        <th className="p-2 border">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="p-2 border">{index + 1}</td>
                                            <td className="p-2 border">{item.id} - {item.nama_barang}</td>
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
                                            <td className="p-2 border">
                                                <NumericFormat
                                                    value={item.harga_jual}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'Rp. '}
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <NumericFormat
                                                    value={((item.harga_jual * (item.diskon / 100)) * item.kuantitas)}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'Rp. '}
                                                />
                                            </td>
                                            <td className="p-2 border">
                                                <NumericFormat
                                                    value={((item.harga_jual - (item.harga_jual * (item.diskon / 100))) * item.kuantitas)}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'Rp. '}
                                                />
                                            </td>
                                            <td className="p-2 border">
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
                        </div>

                        {/* Total Harga */}
                        <div className="mt-4">
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Subtotal:</span>
                                <span><NumericFormat
                                    value={totalHarga}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'Rp. '}
                                /></span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-semibold">Diskon:</span>
                                <span><NumericFormat
                                    value={diskon}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'Rp. '}
                                /></span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span><NumericFormat
                                    value={total}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'Rp. '}
                                /></span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Buat Pesanan
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            <CustomFooter />

            <ModalPemesanan
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={placeOrder}
            />
        </div>
    );
}
