// resources/js/Components/Modal.js
import React, { useState } from 'react';

export default function ModalPemesanan({ isOpen, onClose, onSubmit, dataCart }) {
    const [namaPemesan, setNamaPemesan] = useState('');
    const [kelas, setKelas] = useState('');
    const [namaSiswa, setNamaSiswa] = useState('');

    const numberFormat = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const totalHarga = dataCart.reduce((total, item) => {
        return total + (item.harga_jual * item.kuantitas);
    }, 0);

    const totalDiskon = dataCart.reduce((total, item) => {
        return total + ((item.harga_jual * (item.diskon / 100)) * item.kuantitas);
    }, 0);

    const totalBelanja = totalHarga - totalDiskon;

    // Format total harga
    const totalHargaFormatted = numberFormat.format(totalHarga);
    const totalDiskonFormatted = numberFormat.format(totalDiskon);
    const totalBelanjaFormatted = numberFormat.format(totalBelanja);

    const handleSubmit = () => {
        if (namaPemesan && kelas && namaSiswa) {
            onSubmit(namaPemesan, kelas, namaSiswa);
            const cartRows = dataCart.map(item => {
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
                    }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <h1>Struk Pembelian</h1>
                    <p><strong>Nama Siswa:</strong> ${namaSiswa}</p>
                    <p><strong>Kelas:</strong> ${kelas}</p>
                    <p><strong>Nama Pengambil:</strong> ${namaPemesan}</p>
                    <div class="line"></div> <!-- Garis horizontal -->
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
                    <div class="line"></div> <!-- Garis horizontal -->
                    <div class="footer">Terima kasih atas pembelian Anda!</div>
                </div>
            </body>
            </html>
            `;

            // Create a new print window
            const printWindow = window.open('', '', 'width=800');
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.focus();

            printWindow.addEventListener('afterprint', () => {
                printWindow.close();
            });

            printWindow.print();

            // Reset the form and close the modal
            onClose();
            setNamaPemesan('');
            setKelas('');
            setNamaSiswa('');
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
