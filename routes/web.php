<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'revalidate'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('supplier', App\Http\Controllers\SupplierController::class)->except('update');
    Route::post('edit-supplier/{id}', [App\Http\Controllers\SupplierController::class, 'update']);
    Route::resource('kategori', App\Http\Controllers\KategoriController::class)->except('update');
    Route::post('edit-kategori/{id}', [App\Http\Controllers\KategoriController::class, 'update']);
    Route::resource('barang', App\Http\Controllers\BarangController::class)->except('update');
    Route::post('edit-barang/{id}', [App\Http\Controllers\BarangController::class, 'update']);
    Route::post('update-stok/{id}', [App\Http\Controllers\StokBarangController::class, 'updateStok']);
    Route::get('stok-barang', [App\Http\Controllers\StokBarangController::class, 'index']);
});

require __DIR__ . '/auth.php';
