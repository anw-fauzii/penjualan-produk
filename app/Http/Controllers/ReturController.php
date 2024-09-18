<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
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
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function create()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $pesanan = Pesanan::with(['pesanan_detail', 'pesanan_detail.barang_ukuran', 'pesanan_detail.barang_ukuran.barang'])
                ->get();
            return Inertia::render('Retur/Create', [
                'title' => "Retur Barang",
                'pesanan' => $pesanan,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'returnQuantities' => 'required|array',
            'returnQuantities.*' => 'required|integer|min:1'
        ]);

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
                'kuantitas' => $quantityToReturn
            ]);
            $item->kuantitas -= $quantityToReturn;
            $item->save();
        }

        return redirect()->back();
    }
}
