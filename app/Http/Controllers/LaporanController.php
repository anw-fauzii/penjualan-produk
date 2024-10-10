<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangUkuran;
use App\Models\Pesanan;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function labarugi()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasAnyRole('admin|bendahara')) {
            $total_hpp = 0;
            $total_penjualan = 0;
            $barang = BarangUkuran::with('barang')->get();
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
                'roleUser' => $user->getRoleNames()

            ]);
        } else {
            return Inertia::render('Error/403');
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
        if ($user->hasAnyRole('admin|bendahara')) {
            $total_hpp = 0;
            $total_penjualan = 0;
            $pesanan = Pesanan::with('pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang')
                ->where('status', 'selesai')
                ->whereDate('created_at', '>=', $mulai)
                ->whereDate('created_at', '<=', $akhir)
                ->get();
            foreach ($pesanan as $data) {
                foreach ($data->pesanan_detail as $data2) {
                    $hpp = $data2->kuantitas * $data2->barang_ukuran->harga_dasar;
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
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function generatePdf(Request $request)
    {
        $total_hpp = 0;
        $total_penjualan = 0;
        $mulai = $request->query('mulai');
        $akhir = $request->query('akhir');
        $pesanan = Pesanan::with('pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang')
            ->where('status', 'selesai')
            ->whereDate('created_at', '>=', $mulai)
            ->whereDate('created_at', '<=', $akhir)
            ->get();
        foreach ($pesanan as $data) {
            foreach ($data->pesanan_detail as $data2) {
                $hpp = $data2->kuantitas * $data2->barang_ukuran->harga_dasar;
                $penjualan = $data2->subtotal;
                $total_hpp += $hpp;
                $total_penjualan += $penjualan;
            }
        }
        $pdf = Pdf::loadView('laporan', compact('pesanan', 'mulai', 'akhir', 'total_hpp', 'total_penjualan'));
        return $pdf->stream('laporan.pdf');
    }
}
