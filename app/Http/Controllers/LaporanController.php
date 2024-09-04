<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Pesanan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function labarugi()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $total_hpp = 0;
            $total_penjualan = 0;
            $barang = Barang::All();
            foreach ($barang as $data) {
                $hpp = $data->stok * $data->harga_dasar;
                $penjualan = $data->stok * $data->harga_jual;
                $total_hpp += $hpp;
                $total_penjualan += $penjualan;
            }
            return Inertia::render('Laporan/LabaRugi', [
                'title' => "Laporan Laba Rugi",
                'barang' => $barang,
                'total_hpp' => $total_hpp,
                'total_penjualan' => $total_penjualan,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }
    public function penjualan(Request $request)
    {
        $hariIni = Carbon::today()->toDateString();
        if ($request->mulai && $request->akhir) {
            $mulai = $request->mulai;
            $akhir = $request->akhir;
        } else {
            $mulai = "0000-00-00";
            $akhir = "0000-00-00";
        }
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $total_hpp = 0;
            $total_penjualan = 0;
            $pesanan = Pesanan::with('pesanan_detail', 'pesanan_detail.barang')
                ->whereDate('created_at', '>=', $mulai)
                ->whereDate('created_at', '<=', $akhir)
                ->get();
            foreach ($pesanan as $data) {
                foreach ($data->pesanan_detail as $data2) {
                    $hpp = $data2->kuantitas * $data2->barang->harga_dasar;
                    $penjualan = $data2->subtotal;
                    $total_hpp += $hpp;
                    $total_penjualan += $penjualan;
                }
            }
            return Inertia::render('Laporan/Penjualan', [
                'title' => "Laporan Penjualan",
                'pesanan' => $pesanan,
                'total_hpp' => $total_hpp,
                'total_penjualan' => $total_penjualan,
                'hariIni' => $hariIni,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }
}
