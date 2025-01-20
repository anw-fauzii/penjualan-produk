<?php

namespace App\Http\Controllers;

use App\Models\BarangUkuran;
use App\Models\Pesanan;
use App\Models\PesananDetail;
use App\Models\Retur;
use App\Models\ReturDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReturController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $pesanan = Pesanan::with('pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang')
            ->whereStatus('Retur')->orderBy('id', 'DESC')->get();
            return Inertia::render('Retur/Index', [
                'title' => "Daftar Retur Pesanan",
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
            $pesanan = Pesanan::with(['pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang'])
                ->get();
            return Inertia::render('Retur/Create', [
                'title' => "Retur Barang",
                'pesanan' => $pesanan,
                'barang' => $barang,
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function store(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $pesanan = Pesanan::with('pesanan_detail')->findOrFail($id);
            $pesanan->update([
                'status' => "Retur",
            ]);
            $retur = Retur::create([
                'pesanan_id' => $pesanan->id,
            ]);
            $pesanan_lama = PesananDetail::where('pesanan_id', $id)->get();
            foreach ($request->input('cart') as $barang_baru) {
                foreach ($pesanan_lama as $item) {
                    
                    $item->delete();
                }
                $ukuranLama = BarangUkuran::find($item['barang_ukuran_id']);
                if ($ukuranLama) {
                    $ukuranLama->stok += $barang_baru['kuantitas'];
                    $ukuranLama->save();
                }
                // Menghitung harga dan diskon barang baru
                $harga = $barang_baru['barang_ukuran']['harga_jual'] ?? $barang_baru['harga_jual'];
                $diskon = $barang_baru['barang_ukuran']['diskon'] ?? $barang_baru['diskon'];
                $subtotal = ($harga * $barang_baru['kuantitas']) - (($harga * ($diskon / 100)) * $barang_baru['kuantitas']);
                $pesananDetail = PesananDetail::create([
                    'pesanan_id' => $id,
                    'barang_ukuran_id' => $barang_baru['id'] ?? null,
                    'kuantitas' => $barang_baru['kuantitas'],
                    'harga' => $harga,
                    'diskon' => $diskon,
                    'subtotal' => $subtotal,
                ]);

                $ukuranBaru = BarangUkuran::find($barang_baru['id']);
                if ($ukuranBaru) {
                    $ukuranBaru->stok -= $barang_baru['kuantitas'];
                    $ukuranBaru->save();
                }
            }

            // Commit transaksi jika semua berhasil
            DB::commit();

            // Kembalikan respon yang sesuai, misalnya sukses
            return redirect()->back();

        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Log error dan tangani pengecualian
            return response()->json(['message' => 'Terjadi kesalahan', 'error' => $e->getMessage()], 500);
        }
    }
}
