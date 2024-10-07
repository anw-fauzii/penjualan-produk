import CustomFooter from '@/Components/layouts/CustomFooter';
import CustomNavbar from '@/Components/layouts/CustomNavbar';
import CustomSidebar from '@/Components/layouts/CustomSidebar';
import JudulHeader from '@/Components/layouts/JudulHeader';
import ModalDetail from '@/Components/modal/ModalDetail';
import { Head, Link, router } from '@inertiajs/react';
import { Badge, TextInput } from 'flowbite-react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
import toastr from 'toastr';

export default function Index(props) {
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState((props.pesanan || []).map((item, index) => ({
        no: index + 1,
        ...item,
    })));
    const handleInfoClick = (id) => {
        const selectedData = props.pesanan.find(item => item.id === id);

        if (selectedData) {
            setModalData(selectedData);
            setOpenModal(true);
        }
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = (props.pesanan || []).map((item, index) => ({
            no: index + 1,
            ...item,
        })).filter(item =>
            item.id.toLowerCase().includes(searchValue)
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            name: 'No',
            selector: row => row.no,
            sortable: true,
            width: '8%',
        },
        {
            name: 'Kode',
            selector: row => row.id,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Nama Penerima',
            selector: row => row.nama_pemesan,
            sortable: true,
            width: '17%'
        },
        {
            name: 'Nama pesanan',
            selector: row => row.nama_siswa + " (" + row.kelas + ")",
            sortable: true,
            width: '20%',
        },
        {
            name: 'Total Harga',
            selector: row => row.pesanan_detail.reduce((acc, item) => acc + (item.subtotal || 0), 0), // hanya kembalikan angka
            sortable: true,
            cell: row => (
                <NumericFormat
                    value={row.pesanan_detail.reduce((acc, item) => acc + (item.subtotal || 0), 0)}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                />
            ),
            width: '14%'
        },
        {
            name: 'Status',
            selector: row => (
                <Badge color={row.status.toLowerCase() === 'selesai' ? 'info' : row.status.toLowerCase() === 'retur' ? 'warning' : 'secondary'}>
                    {row.status}
                </Badge>
            ),
            sortable: true,
            sortFunction: (rowA, rowB) => rowA.status.localeCompare(rowB.status),
            width: '17%'
        }
    ];

    const ExpandedComponent = ({ data }) => (
        <div className="p-4">
            <div className="flex justify-start">
                <button onClick={() => handleInfoClick(data.id)} type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 py-2.5 text-center m-1">
                    <svg className="w-4 h-4 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </button>
                <button onClick={() => handlePrint(data.id)} type="button" className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm px-3 py-2.5 text-center m-1">
                    <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M16.444 18H19a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2.556M17 11V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6h10ZM7 15h10v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-4Z" />
                    </svg>
                </button>

            </div>
        </div>
    );

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handlePrint = (id) => {
        const printData = props.pesanan.find(item => item.id === id);
        const numberFormat = new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });

        const totalHarga = printData.pesanan_detail.reduce((total, item) => total + (item.harga * item.kuantitas), 0);
        const totalDiskon = printData.pesanan_detail.reduce((total, item) => total + ((item.harga * (item.diskon / 100)) * item.kuantitas), 0);
        const totalBelanja = totalHarga - totalDiskon;

        const totalHargaFormatted = numberFormat.format(totalHarga);
        const totalDiskonFormatted = numberFormat.format(totalDiskon);
        const totalBelanjaFormatted = numberFormat.format(totalBelanja);

        const createdAt = new Date(printData.created_at);

        const day = createdAt.getDate().toString().padStart(2, '0');
        const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
        const year = createdAt.getFullYear();
        const hours = createdAt.getHours().toString().padStart(2, '0');
        const minutes = createdAt.getMinutes().toString().padStart(2, '0');

        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
        console.log(printData.pesanan_detail)
        const cartRows = printData.pesanan_detail.map(item => {
            const hargaJualFormatted = numberFormat.format(item.harga);
            const totalFormatted = numberFormat.format(item.harga * item.kuantitas);

            let itemRow = `
                <tr>
                    <td><strong>${item.barang_ukuran.barang.nama_barang} (${item.barang_ukuran.ukuran})</strong> </td>
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
                    <p><strong>Siswa: ${printData.nama_siswa} (${printData.kelas})</strong></p>
                    <p><strong>Pengambil: ${printData.nama_pemesan}</strong></p>
                    <div class="line"></div>
                    <div class="tanggal">
                        <p><strong>${printData.id}</strong></p>
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
                                <td colspan="3" style="text-align:right;"><strong>Subtotal</strong></td>
                                <td style="text-align:right;"><strong>${totalHargaFormatted}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align:right;"><strong>Total Diskon</strong></td>
                                <td style="text-align:right;"><strong>${totalDiskonFormatted}</strong></td>
                            </tr>
                            <tr>
                                <td colspan="3" style="text-align:right;"><strong>Total Belanja</strong></td>
                                <td style="text-align:right;"><strong>${totalBelanjaFormatted}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="line"></div>
                    <div class="footer"><strong>Terima kasih atas pembelian Anda! Produk dapat diretur dalam waktu 2 hari setelah pembelian. Pastikan kondisi produk baik dan tidak digunakan.</strong></div>
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
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Head title={props.title} />
            <CustomSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : ''}`}>
                <CustomNavbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-4 md:p-6 bg-white border-l border-gray-300 mt-16 overflow-auto mb-16">
                    <JudulHeader
                        judul={props.title}
                        subJudul="Pesanan"
                        className="text-lg md:text-2xl mb-4"
                    />
                    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200 relative">
                        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
                            <Link replace href={route('pemesanan.create')}>
                                <button type="button" className="flex text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    <svg className="w-[14px] h-[14px] md:w-auto text-center mr-2 mt-0.5 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 1v16M1 9h16" />
                                    </svg>
                                    <span className='flex'>Tambah </span>
                                </button>
                            </Link>
                            <div className="flex items-center w-full md:w-auto">
                                <TextInput
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Cari Pesanan..."
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <div className="min-w-full">
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    pagination
                                    fixedHeader
                                    fixedHeaderScrollHeight="500px"
                                    expandableRows
                                    expandableRowsComponent={ExpandedComponent}
                                />
                            </div>
                        </div>
                    </div>
                </main>
                <ModalDetail openModal={openModal} setOpenModal={setOpenModal} modalData={modalData} />
            </div>
            <CustomFooter />
        </div>
    );
}
