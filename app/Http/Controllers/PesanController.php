<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesanController extends Controller
{
    public function index()
    {
        $barang = Barang::select('id', 'nama_barang', 'harga_jual')->get();
        return Inertia('Pemesanan/Index', [
            'title' => "Pemesanan",
            'barang' => $barang
        ]);
    }
}
