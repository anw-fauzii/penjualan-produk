<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\BarangUkuran;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BarangUkuranController extends Controller
{
    public function create($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            return Inertia::render('Ukuran/Create', [
                'title' => "Tambah Ukuran",
                'id' => $id,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function store(Request $request)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $validator = $request->validate([
                'ukuran' => 'required',
                'harga_dasar' => 'required',
                'harga_jual' => 'required',
            ], [
                'ukuran.required' => "Nama barang harus diisi",
                'harga_dasar.required' => "Nama barang harus diisi",
                'harga_jual.required' => "Nama barang harus diisi",
            ]);

            $kode = Barang::findOrFail($request->barang_id);
            $barang = new BarangUkuran();
            // Menetapkan ID sesuai dengan format baru
            $datePrefix = Carbon::now()->format('ymd');
            $latestCode = BarangUkuran::where('id', 'like', "%" . $datePrefix . "%")
                ->orderBy('id', 'desc')
                ->with('barang')
                ->first();

            if ($latestCode) {
                $sequence = intval(substr($latestCode->id, -3)) + 1;
            } else {
                $sequence = 1;
            }

            $barang->id = $kode->unit . "-" . $datePrefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);

            $barang->barang_id = $request->barang_id;
            $barang->ukuran = $request->ukuran;
            $barang->harga_dasar = $request->harga_dasar;
            $barang->harga_jual = $request->harga_jual;
            $barang->stok = "0";
            $barang->diskon = $request->diskon;
            $barang->save();
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function edit($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = BarangUkuran::findOrFail($id);
            return Inertia::render('Ukuran/Edit', [
                'title' => "Update Ukuran",
                'barang' => $barang,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $validator = $request->validate([
                'ukuran' => 'required',
                'harga_dasar' => 'required',
                'harga_jual' => 'required',
            ], [
                'ukuran.required' => "Nama barang harus diisi",
                'harga_dasar.required' => "Nama barang harus diisi",
                'harga_jual.required' => "Nama barang harus diisi",
            ]);
            $barang = BarangUkuran::findOrFail($id);
            $barang->barang_id = $request->barang_id;
            $barang->ukuran = $request->ukuran;
            $barang->harga_dasar = $request->harga_dasar;
            $barang->harga_jual = $request->harga_jual;
            $barang->diskon = $request->diskon;
            $barang->update();
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function destroy($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = BarangUkuran::findOrFail($id);
            $barang->delete();
            return redirect()->back()->with('message', 'Data berhasil dihapus');
        } else {
            return Inertia::render('Error/404');
        }
    }
}
