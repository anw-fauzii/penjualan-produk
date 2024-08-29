<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StokBarangController extends Controller
{
    public function updateStok(Request $request, $id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $request->validate([
                'stok' => 'required',
            ], [
                'stok.required' => "Stok harus diisi",
            ]);
            $barang = Barang::find($id);
            $barang->stok += $request->stok;
            $barang->update();
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }
}
