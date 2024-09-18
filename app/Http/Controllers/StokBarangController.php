<?php

namespace App\Http\Controllers;

use App\Models\BarangUkuran;
use App\Models\StokBarang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StokBarangController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = StokBarang::with(['barang_ukuran', 'barang_ukuran.barang'])->get();
            return Inertia('StokBarang/Index', [
                'title' => "Pemasukan Stok",
                'barang' => $barang
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function updateStok(Request $request, $id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $request->validate([
                'stok' => 'required',
            ], [
                'stok.required' => "Stok harus diisi",
            ]);
            $barang = BarangUkuran::find($id);
            if ($barang) {
                $barang->stok += $request->stok;
                $barang->save();

                $tanggal = now()->toDateString();
                $stok = StokBarang::where('barang_ukuran_id', $id)
                    ->whereDate('created_at', $tanggal)
                    ->first();

                if ($stok) {
                    $stok->stok += $request->stok;
                    $stok->save();
                } else {
                    StokBarang::create([
                        'barang_ukuran_id' => $id,
                        'stok' => $request->stok,
                        'created_at' => $tanggal,
                        'updated_at' => $tanggal,
                    ]);
                }
            }
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }
}
