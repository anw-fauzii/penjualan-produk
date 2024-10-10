<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangUkuran;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PesanController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $pesanan = Pesanan::with('pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang')->orderBy('id', 'DESC')->get();
            return Inertia::render('Pemesanan/Index', [
                'title' => "Daftar Pesanan",
                'pesanan' => $pesanan,
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function create()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = BarangUkuran::with('barang')->get();
            return Inertia('Pemesanan/Create', [
                'title' => "Pemesanan",
                'barang' => $barang,
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function store(Request $request)
    {
        $cart = $request->input('cart');
        $pesanan = Pesanan::create([
            'status' => "Selesai",
            'user_id' => Auth::user()->id,
            'nama_pemesan' => $request->namaPemesan,
            'kelas' => $request->kelas,
            'nama_siswa' => $request->namaSiswa,
            'total_harga' => array_sum(array_map(function ($item) {
                return $item['harga_jual'] * $item['kuantitas'] - ($item['harga_jual'] * ($item['diskon'] / 100)) * $item['kuantitas'];
            }, $cart)),
        ]);

        foreach ($cart as $data) {
            $pesananDetail = PesananDetail::create([
                'pesanan_id' => $pesanan->id,
                'barang_ukuran_id' => $data['id'],
                'kuantitas' => $data['kuantitas'],
                'harga' => $data['harga_jual'],
                'diskon' => $data['diskon'],
                'subtotal' => ($data['harga_jual'] * $data['kuantitas']) - (($data['harga_jual'] * ($data['diskon'] / 100)) * $data['kuantitas']),
            ]);
            $barang = BarangUkuran::find($data['id']);
            $barang->update([
                'stok' => $barang->stok - $data['kuantitas'],
            ]);
        }
        return to_route('pemesanan.index')->with('message', $pesanan);
    }

    public function printPesanan(Request $request)
    {
        $data = $request->all();
        $html = view('pesanan-print', ['data' => $data])->render();
        return response()->json(['html' => $html]);
    }
}
