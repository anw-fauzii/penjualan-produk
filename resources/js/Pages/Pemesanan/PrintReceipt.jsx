import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';

const PrintReceipt = () => {
    const { props } = usePage();
    const { id, namaPemesan, kelas, namaSiswa, totalHarga, dataCart } = props;

    const numberFormat = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    useEffect(() => {
        // Format data for printing
        const totalHargaFormatted = numberFormat.format(totalHarga);

        const cartRows = dataCart.map(item => {
            const hargaJualFormatted = numberFormat.format(item.harga_jual);
            const totalFormatted = numberFormat.format(item.harga_jual * item.kuantitas);

            let itemRow = `
                <tr>
                    <td>${item.nama_barang}</td>
                    <td>${item.kuantitas}</td>
                    <td style="text-align:right;">${hargaJualFormatted}</td>
                    <td style="text-align:right;">${totalFormatted}</td>
                </tr>
            `;

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
                    body { font-family: 'Courier New', Courier, monospace; margin: 0; padding: 0; }
                    .receipt { width: 80mm; margin: 0; padding: 2mm; box-sizing: border-box; }
                    .receipt h1 { font-size: 14px; margin-bottom: 5px; }
                    .receipt p { margin: 2px 0; font-size: 12px; }
                    .receipt .footer { margin-top: 10px; text-align: center; font-size: 10px; color: #888; }
                    .receipt table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    .receipt th, .receipt td { padding: 1mm; text-align: left; }
                    .receipt th { background-color: #f4f4f4; }
                    .receipt .line { border: none; border-top: 1px solid #000; height: 1px; margin: 5px 0; }
                    @media print { body { margin: 0; } .receipt { width: 80mm; border: none; box-shadow: none; } @page { size: 80mm auto; margin: 0; } .receipt .footer { display: none; } }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <h1>Struk Pembelian</h1>
                    <p><strong>ID Transaksi:</strong> ${id}</p>
                    <p><strong>Nama Siswa:</strong> ${namaSiswa}</p>
                    <p><strong>Kelas:</strong> ${kelas}</p>
                    <p><strong>Nama Pengambil:</strong> ${namaPemesan}</p>
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
                        </tbody>
                    </table>
                    <div class="line"></div>
                    <div class="footer">Terima kasih atas pembelian Anda!</div>
                </div>
            </body>
            </html>
        `;

        // Create a new print window and print
        const printWindow = window.open('', '', 'width=800');
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.focus();

        printWindow.addEventListener('afterprint', () => {
            printWindow.close();
        });

        printWindow.print();
    }, [id, namaPemesan, kelas, namaSiswa, totalHarga, dataCart]);

    return (
        <div>
            <p>Struk sedang diproses...</p>
        </div>
    );
};

export default PrintReceipt;
