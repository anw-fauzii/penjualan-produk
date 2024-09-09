<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use App\Models\Supplier;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BarangController extends Controller
{

    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = Barang::with(['kategori', 'supplier'])->get();
            return Inertia::render('Barang/Index', [
                'title' => "Daftar Barang",
                'barang' => $barang,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function create()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $kategori = Kategori::All();
            $supplier = Supplier::All();
            return Inertia::render('Barang/Create', [
                'title' => "Tambah Barang",
                'kategori' => $kategori,
                'supplier' => $supplier
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
                'nama_barang' => 'required',
                'kategori_id' => 'required',
                'harga_dasar' => 'required',
                'harga_jual' => 'required',
                'supplier_id' => 'required',
                'unit' => 'required',
            ], [
                'nama_barang.required' => "Nama barang harus diisi",
                'kategori_id.required' => "Nama barang harus diisi",
                'harga_dasar.required' => "Nama barang harus diisi",
                'harga_jual.required' => "Nama barang harus diisi",
                'supplier_id.required' => "Nama barang harus diisi",
                'unit.required' => "Nama barang harus diisi",
            ]);
            $barang = new Barang();
            if ($request->file('foto')) {
                $file = $request->file('foto')->store('Foto Barang', 'public');
                $barang->foto = $file;
            }
            $barang->kategori_id = $request->kategori_id;
            $barang->supplier_id = $request->supplier_id;
            $barang->nama_barang = $request->nama_barang;
            $barang->harga_dasar = $request->harga_dasar;
            $barang->harga_jual = $request->harga_jual;
            $barang->unit = $request->unit;
            $barang->diskon = $request->diskon;
            $barang->save();
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Barang $barang)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $kategori = Kategori::All();
            $supplier = Supplier::All();
            $barang = Barang::findOrFail($id);
            return Inertia::render('Barang/Edit', [
                'title' => "Tambah Barang",
                'kategori' => $kategori,
                'supplier' => $supplier,
                'barang' => $barang,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $validator = $request->validate([
                'nama_barang' => 'required',
                'kategori_id' => 'required',
                'harga_dasar' => 'required',
                'harga_jual' => 'required',
                'supplier_id' => 'required',
                'unit' => 'required',
            ], [
                'nama_barang.required' => "Nama barang harus diisi",
                'kategori_id.required' => "Nama barang harus diisi",
                'harga_dasar.required' => "Nama barang harus diisi",
                'harga_jual.required' => "Nama barang harus diisi",
                'supplier_id.required' => "Nama barang harus diisi",
                'unit.required' => "Nama barang harus diisi",
            ]);
            $barang = Barang::findOrFail($id);
            if ($request->file('foto')) {
                $file = $request->file('foto')->store('Foto Barang', 'public');
                $barang->foto = $file;
            }
            $barang->kategori_id = $request->kategori_id;
            $barang->supplier_id = $request->supplier_id;
            $barang->nama_barang = $request->nama_barang;
            $barang->harga_dasar = $request->harga_dasar;
            $barang->harga_jual = $request->harga_jual;
            $barang->unit = $request->unit;
            $barang->diskon = $request->diskon;
            $barang->update();
            return to_route('barang.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $barang = Barang::findOrFail($id);
            $barang->delete();
            return redirect()->back()->with('message', 'Data berhasil dihapus');
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function generatePdf($id)
    {
        $pdf = Pdf::loadView('barcode', ['code' => $id]);
        return $pdf->download('barcode.pdf');
    }
}
