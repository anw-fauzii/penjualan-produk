<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $kategori = Kategori::All();
            return Inertia::render('Kategori/Index', [
                'title' => "Daftar Kategori",
                'kategori' => $kategori,
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
            return Inertia::render('Kategori/Create', [
                'title' => "Tambah Kategori",
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function store(Request $request)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $validator = $request->validate([
                'nama_kategori' => 'required',
            ], [
                'nama_kategori.required' => "Nama kategori harus diisi",
            ]);
            $kategori = new Kategori();
            $kategori->nama_kategori = $request->nama_kategori;
            $kategori->save();
            return to_route('kategori.index');
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function show(Kategori $kategori)
    {
        //
    }


    public function edit($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $kategori = Kategori::findOrFail($id);
            return Inertia::render('Kategori/Edit', [
                'title' => "Edit Data Kategori",
                'kategori' => $kategori,
                'roleUser' => $user->getRoleNames()
            ]);
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $validator = $request->validate([
                'nama_kategori' => 'required',
            ], [
                'nama_kategori.required' => "Nama kategori harus diisi",
            ]);
            $kategori = Kategori::findOrFail($id);
            $kategori->nama_kategori = $request->nama_kategori;
            $kategori->update();
            return to_route('kategori.index');
        } else {
            return Inertia::render('Error/403');
        }
    }

    public function destroy($id)
    {
        $user = User::find(Auth::user()->id);
        if ($user->hasRole('admin')) {
            $kategori = Kategori::findOrFail($id);
            $kategori->delete();
            return redirect()->back()->with('message', 'Data berhasil dihapus');
        } else {
            return Inertia::render('Error/403');
        }
    }
}
