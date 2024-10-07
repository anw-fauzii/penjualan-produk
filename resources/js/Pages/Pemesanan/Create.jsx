import React, { useState, useRef, useEffect } from 'react';
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
    const barcodeInputRef = useRef(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const addToCart = (item) => {
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
    };

    const handleQuantityChange = (id, delta) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id
                    ? { ...item, kuantitas: Math.max(1, item.kuantitas + delta) }
                    : item
            )
        );
    };

    const handleRemoveFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
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
        item.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const placeOrder = (namaPemesan, kelas, namaSiswa) => {
        router.post('/pemesanan', { cart, namaPemesan, kelas, namaSiswa }, {
            onSuccess: (response) => {
                const numberFormat = new Intl.NumberFormat('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                });

                const totalHarga = cart.reduce((total, item) => total + (item.harga_jual * item.kuantitas), 0);
                const totalDiskon = cart.reduce((total, item) => total + ((item.harga_jual * (item.diskon / 100)) * item.kuantitas), 0);
                const totalBelanja = totalHarga - totalDiskon;

                const totalHargaFormatted = numberFormat.format(totalHarga);
                const totalDiskonFormatted = numberFormat.format(totalDiskon);
                const totalBelanjaFormatted = numberFormat.format(totalBelanja);

                const createdAt = new Date(response.props.flash.message.created_at);

                const day = createdAt.getDate().toString().padStart(2, '0');
                const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
                const year = createdAt.getFullYear();
                const hours = createdAt.getHours().toString().padStart(2, '0');
                const minutes = createdAt.getMinutes().toString().padStart(2, '0');

                const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

                const cartRows = cart.map(item => {
                    const hargaJualFormatted = numberFormat.format(item.harga_jual);
                    const totalFormatted = numberFormat.format(item.harga_jual * item.kuantitas);

                    let itemRow = `
                        <tr>
                            <td><strong>${item.barang.nama_barang} (${item.ukuran})</strong> </td>
                            <td><strong>${item.kuantitas}</strong> </td>
                            <td style="text-align:right;"><strong>${hargaJualFormatted}</strong> </td>
                            <td style="text-align:right;"><strong>${totalFormatted}</strong> </td>
                        </tr>
                    `;

                    if (item.diskon > 0) {
                        const diskonFormatted = numberFormat.format(((item.harga * (item.diskon / 100)) * item.kuantitas));
                        itemRow += `
                            <tr>
                                <td colspan="4"><strong>Disc: -${diskonFormatted}</strong></td>
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
                            body { font-family: 'Consolas', 'Courier New', monospace; margin: 0; padding: 0; }
                            .receipt { width: 72mm; margin: 0; padding: 1mm; box-sizing: border-box; }
                            .receipt img { display: block; width: 15%; height: auto; margin: 0 auto; }
                            .receipt h1 { font-size: 14px; margin-bottom: 5px; text-align: center; }
                            .receipt .tanggal { display: flex; justify-content: space-between; align-items: center; }
                            .receipt p { margin: 2px 0; font-size: 13px; }
                            .receipt .footer { margin-top: 10px; text-align: center; font-size: 10px; line-height: 1.5; }
                            .receipt table { width: 100%; border-collapse: collapse; font-size: 10px; }
                            .receipt th, .receipt td { padding: 1mm; text-align: left; }
                            .receipt th { background-color: #f4f4f4; }
                            .receipt .line { border: none; border-top: 1px solid #000; height: 1px; margin: 5px 0; }
                            @media print {
                                body { margin: 0; -webkit-print-color-adjust: exact; }
                                .receipt { width: 72mm; border: none; box-shadow: none; }
                                @page { size: 72mm auto; margin: 0; }
                                .receipt img { justify-content: center; align-items: center; max-width: 100%; height: auto; margin: 0 auto; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="receipt">
                            <img src="/storage/Untitled.png" width="8%" alt="Logo" />
                            <h1>Nota Pembelian</h1>
                            <div class="line"></div>
                            <p><strong>Siswa: ${response.props.flash.message.nama_siswa} (${response.props.flash.message.kelas})</strong></p>
                            <p><strong>Pengambil:${response.props.flash.message.nama_pemesan}</strong> </p>
                            <div class="line"></div>
                            <div class="tanggal">
                                <p><strong>${response.props.flash.message.id}</strong></p>
                                <p><strong>${formattedDateTime}</strong></p>
                            </div>
                            <div class="line"></div>
                            <table>
                                <thead>
                                    <tr>
                                        <th style="text-align:center;">Item</th>
                                        <th style="text-align:center;">Qty</th>
                                        <th style="text-align:center;">Harga</th>
                                        <th style="text-align:center;">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cartRows}
                                </tbody>
                            </table>
                            <div class="line"></div>
                            <table>
                                <tbody>
                                    <tr>
                                        <td colspan="3" style="text-align:right;"><strong>Subtotal</strong> </td>
                                        <td style="text-align:right;"><strong>${totalHargaFormatted}</strong> </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align:right;"><strong>Total Diskon</strong> </td>
                                        <td style="text-align:right;"><strong>${totalDiskonFormatted}</strong> </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" style="text-align:right;"><strong>Total Belanja</strong> </td>
                                        <td style="text-align:right;"><strong>${totalBelanjaFormatted}</strong> </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="line"></div>
                            <div class="footer"><strong>Terima kasih atas pembelian Anda! Produk dapat diretur dalam waktu 2 hari setelah pembelian. Pastikan kondisi produk baik dan tidak digunakan.</strong>     </div>
                            <div class="line"></div>
                        </div>
                    </body>
                    </html>
                `;

                const printWindow = window.open('', '', 'width=800');
                printWindow.document.write(receiptContent);
                printWindow.document.close();

                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };

                printWindow.onafterprint = () => {
                    printWindow.close();
                };

                printWindow.onabort = () => {
                    printWindow.close();
                };

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


    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto mb-16">
                    <JudulHeader
                        judul={props.title}
                        subJudul="Pemesanan"
                        className="text-lg md:text-2xl mb-4"
                    />

                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200">
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
                                onChange={handleSearchChange}
                                placeholder="Cari produk..."
                                className="p-2 border border-gray-300 rounded w-full"
                            />
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
                                                        disabled={item.kuantitas <= 1}
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
                                    <p><strong>Subtotal:</strong> <NumericFormat value={totalHarga} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                    <p><strong>Total Diskon:</strong> <NumericFormat value={diskon} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                    <p><strong>Total Belanja:</strong> <NumericFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></p>
                                </div>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Buat Pemesanan
                                </button>
                            </div>
                        )}
                    </div>

                    {isModalOpen && (
                        <ModalPemesanan
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSubmit={placeOrder}
                        />
                    )}
                </main>

                <CustomFooter />
            </div>
        </div>
    );
}
