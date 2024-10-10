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
            $retur = Retur::with('retur_detail', 'pesanan', 'retur_detail.pesanan_detail.barang_ukuran.barang', 'retur_detail.pesanan_detail')
                ->get();
            return Inertia::render('Retur/Index', [
                'title' => "Retur Barang",
                'retur' => $retur,
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
            $ukuran = BarangUkuran::where('stok', '!=', 0)->get();
            $pesanan = Pesanan::with(['pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang'])
                ->get();
            return Inertia::render('Retur/Create', [
                'title' => "Retur Barang",
                'pesanan' => $pesanan,
                'ukuran' => $ukuran,
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function store(Request $request, $id)
    {
        $pesanan = Pesanan::with('pesanan_detail')->findOrFail($id);
        $pesanan->update([
            'status' => "Retur",
        ]);
        $retur = Retur::create([
            'pesanan_id' => $pesanan->id,
        ]);

        foreach ($request->input('returnQuantities') as $itemId => $quantityToReturn) {

            $item = $pesanan->pesanan_detail()->findOrFail($itemId);
            ReturDetail::create([
                'retur_id' => $retur->id,
                'pesanan_detail_id' => $itemId,
                'kuantitas' => $quantityToReturn,
                'barang_ukuran_id' => $request->input('returnSizes')[$itemId] ?? null,
            ]);
            $item->kuantitas -= $quantityToReturn;
            $item->subtotal = $item->kuantitas * $item->harga;
            $item->update();

            $pesananDetail = PesananDetail::create([
                'pesanan_id' => $item->pesanan_id,
                'barang_ukuran_id' => $request->input('returnSizes')[$itemId] ?? null,
                'kuantitas' => $quantityToReturn,
                'harga' => $item->barang_ukuran->harga_jual,
                'diskon' => $item->barang_ukuran->diskon,
                'subtotal' => ($item->barang_ukuran->harga_jual * $quantityToReturn) - (($item->barang_ukuran->harga_jual * ($item->barang_ukuran->diskon / 100)) * $quantityToReturn),
            ]);

            $ukuranLama = BarangUkuran::find($item->barang_ukuran_id);
            $ukuranLama->stok += $quantityToReturn;
            $ukuranLama->save();

            $ukuranBaru = BarangUkuran::find($request->input('returnSizes')[$itemId]);
            $ukuranBaru->stok -= $quantityToReturn;
            $ukuranBaru->save();
        }

        return redirect()->back();
    }
}
