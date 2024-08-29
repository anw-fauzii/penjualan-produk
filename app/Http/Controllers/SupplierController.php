<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $supplier = Supplier::All();
            return Inertia::render('Supplier/Index', [
                'title' => "Daftar Supplier",
                'supplier' => $supplier,
            ]);
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function create()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            return Inertia::render('Supplier/Create', [
                'title' => "Tambah Supplier",
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
                'nama_supplier' => 'required',
                'penanggung_jawab' => 'required',
                'alamat' => 'required',
                'telepon' => 'required'
            ], [
                'nama_supplier.required' => "Nama supplier harus diisi",
                'penanggung_jawab.required' => "Kategori harus diisi",
                'alamat.required' => "Nama supplier harus diisi",
                'telepon.required' => "Kategori harus diisi",
            ]);
            $supplier = new Supplier();
            $supplier->nama_supplier = $request->nama_supplier;
            $supplier->penanggung_jawab = $request->penanggung_jawab;
            $supplier->alamat = $request->alamat;
            $supplier->telepon = $request->telepon;
            $supplier->save();
            return to_route('supplier.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function show(Supplier $supplier)
    {
        //
    }


    public function edit($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $supplier = Supplier::findOrFail($id);
            return Inertia::render('Supplier/Edit', [
                'title' => "Edit Data Supplier",
                'supplier' => $supplier,
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
                'nama_supplier' => 'required',
                'penanggung_jawab' => 'required',
                'alamat' => 'required',
                'telepon' => 'required'
            ], [
                'nama_supplier.required' => "Nama supplier harus diisi",
                'penanggung_jawab.required' => "Kategori harus diisi",
                'alamat.required' => "Nama supplier harus diisi",
                'telepon.required' => "Kategori harus diisi",
            ]);
            $supplier = Supplier::findOrFail($id);
            $supplier->nama_supplier = $request->nama_supplier;
            $supplier->penanggung_jawab = $request->penanggung_jawab;
            $supplier->alamat = $request->alamat;
            $supplier->telepon = $request->telepon;
            $supplier->update();
            return to_route('supplier.index');
        } else {
            return Inertia::render('Error/404');
        }
    }

    public function destroy($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();
            return redirect()->back()->with('message', 'Data berhasil dihapus');
        } else {
            return Inertia::render('Error/404');
        }
    }
}
