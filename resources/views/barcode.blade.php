    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Barcode</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: -0px -43px -43px -43px; 
                padding: 2; /* Menghilangkan padding */
                box-sizing: border-box;
            }
            .container {
                width: 7cm; /* Ukuran kertas */
                height: auto; /* Tinggi otomatis */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 0; /* Menghilangkan margin pada container */
                padding: 0; /* Menghilangkan padding pada container */
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            td {
                text-align: center;
                vertical-align: top;
                padding: 4px 2px; /* Menghilangkan padding */
                width: 3.3cm; /* Lebar barcode */
                height: 1.5cm;/* Tinggi barcode */
            }
            .barcode-item {
                margin: 0.1cm 0; /* Gap antar barcode */
            }
            .barcode-image {
                align-items: center;
            }
            .barcode-text {
                font-size: 12px; /* Ukuran teks */
            }
        </style>
    </head>
    <body>
        <div class="container">
            <table>
                <tr>
                    @for ($i = 0; $i < $jumlah; $i++)
                        @if ($i % 2 == 0 && $i != 0)
                            </tr><tr>
                        @endif
                        <td>
                            <div class="barcode-item">
                                <div class="barcode-image">
                                    @php
                                        echo DNS1D::getBarcodeHTML($code, 'C128', 0.88, 30); // Ukuran barcode
                                    @endphp
                                </div>
                                <div class="barcode-text">{{ $code }}</div>
                            </div>
                        </td>
                    @endfor
                </tr>
            </table>
        </div>
    </body>
    </html>
