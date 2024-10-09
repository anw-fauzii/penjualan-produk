<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Penjualan</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 10px;
        }
        h1 {
            text-align: center;
            margin-bottom: -10px;
            font-size: 16px;
        }
        h3 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 5px;
            text-align: left;
            font-size: 11px;
        }
        th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .total-table {
            width: 30%;
            border: none;
        }
        .total-table td {
            padding: 5px;
            border: none; /* Menghilangkan garis pada tabel */
        }
        .total-label {
            text-align: left;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Laporan Penjualan</h1>
        <h3>{{$mulai}} - {{$akhir}}</h3>

        <!-- Tabel Pesanan -->
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Pesanan</th>
                    <th>Nama Pemesan</th>
                    <th>Nama Siswa</th>
                    <th>Total Harga</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($pesanan as $key => $item)
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->nama_pemesan }}</td>
                    <td>{{ $item->nama_siswa }} <strong>({{ $item->kelas }})</strong></td>
                    <td>Rp. {{ number_format($item->pesanan_detail->sum('subtotal'), 0, ',', '.') }}</td>
                    <td>{{ $item->status }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="total-table">
            <tr>
                <td class="total-label">Total Penjualan:</td>
                <td>Rp. {{ number_format($total_penjualan, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="total-label">Total HPP:</td>
                <td>Rp. {{ number_format($total_hpp, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td class="total-label">Laba - Rugi:</td>
                <td>Rp. {{ number_format($total_penjualan - $total_hpp, 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
