<!DOCTYPE html>
<html>
<head>
    <title>Barcode</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            padding: 0;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 0;
        }
        td {
            text-align: center;
            vertical-align: top;
            padding: 5px; /* Reduce padding if necessary */
        }
        .barcode-item {
            width: 100%;
            text-align: center;
        }
        .barcode-image {
            margin-bottom: 5px;
            height: 60px; /* Adjust as needed */
        }
        .barcode-text {
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <table>
            @for ($i = 0; $i < 44; $i++)
                @if ($i % 4 == 0 && $i != 0)
                    </tr><tr>
                @endif
                <td>
                    <div class="barcode-item">
                        <div class="barcode-image">
                            @php
                                echo DNS1D::getBarcodeHTML($code, 'C128', 1, 60);
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
