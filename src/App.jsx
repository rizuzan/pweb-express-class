import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

async function request(endpoint, options) {
  const response = await fetch(endpoint, options);
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Server mengirim respons yang tidak dapat dibaca.');
  }

  if (!response.ok) {
    throw new Error(payload.message || `Permintaan gagal (${response.status}).`);
  }

  return payload;
}

function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-r from-cyan-800 to-blue-950 text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link className="flex items-center gap-3 font-semibold" to="/">
            <span className="grid size-11 place-items-center rounded-xl border border-white/40 bg-white/10 text-sm font-extrabold">MP</span>
            <span>Manajemen Produk</span>
          </Link>
          <span className="hidden text-sm text-blue-100 sm:block">Institut Teknologi Sepuluh Nopember</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span><strong className="text-blue-900">ITS</strong> · Institut Teknologi Sepuluh Nopember</span>
          <span>Tugas 4 · Aplikasi Manajemen Produk</span>
        </div>
      </footer>
    </div>
  );
}

function Notice({ children, error = false }) {
  if (!children) return null;
  return (
    <p className={`mb-5 rounded-xl border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`} role={error ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

function ProductForm({ initialProduct, onSave, onCancel }) {
  const [name, setName] = useState(initialProduct?.name ?? '');
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave({ name: name.trim(), price: Number(price), id: initialProduct?.id });
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <label className="block space-y-1.5 text-sm font-semibold text-slate-700">
        Nama produk
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" maxLength="100" required value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="block space-y-1.5 text-sm font-semibold text-slate-700">
        Harga (Rp)
        <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" min="0" required step="1" type="number" value={price} onChange={(event) => setPrice(event.target.value)} />
      </label>
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60" disabled={saving} type="submit">
          {saving ? 'Menyimpan…' : initialProduct ? 'Simpan perubahan' : 'Simpan produk'}
        </button>
        <button className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={onCancel} type="button">Batal</button>
      </div>
    </form>
  );
}

function ProductCard({ product, layout, onEdit, onDelete }) {
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${layout === 'list' ? 'sm:flex sm:items-center sm:justify-between sm:gap-6' : ''}`}>
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">ID: {product.id}</p>
        <Link className="block truncate text-lg font-bold text-blue-950 hover:text-blue-700" to={`/products/${product.id}`}>{product.name}</Link>
        <p className="mt-2 text-base font-semibold text-slate-700">{currency.format(product.price)}</p>
      </div>
      <div className="mt-4 flex gap-2 sm:mt-0">
        <button className="rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" onClick={() => onEdit(product)} type="button">Edit</button>
        <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => onDelete(product)} type="button">Hapus</button>
      </div>
    </article>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [layout, setLayout] = useState(() => localStorage.getItem('product-layout') || 'grid');
  const [formMode, setFormMode] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setError('');
    setLoading(true);
    try {
      setProducts(await request('/products'));
    } catch (loadError) {
      setError(`Gagal memuat produk: ${loadError.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function changeLayout(value) {
    setLayout(value);
    localStorage.setItem('product-layout', value);
  }

  async function saveProduct(product) {
    const editing = product.id !== undefined;
    await request('/products', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    setFormMode(null);
    setNotice(editing ? 'Produk berhasil diperbarui.' : 'Produk berhasil ditambahkan.');
    await loadProducts();
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Hapus produk "${product.name}"?`)) return;
    setNotice('');
    setError('');
    try {
      await request(`/products/${product.id}`, { method: 'DELETE' });
      setNotice('Produk berhasil dihapus.');
      await loadProducts();
    } catch (deleteError) {
      setError(`Gagal menghapus produk: ${deleteError.message}`);
    }
  }

  const visibleProducts = products.filter((product) => product.name.toLocaleLowerCase('id').includes(search.trim().toLocaleLowerCase('id')));

  return (
    <>
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">Inventaris sederhana</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">Manajemen Produk</h1>
          <p className="mt-2 text-slate-600">Kelola daftar produk dan harga dalam satu tempat.</p>
        </div>
        <button className="rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800" onClick={() => setFormMode('create')} type="button">+ Tambah Produk</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6" aria-label="Daftar produk">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:max-w-sm" aria-label="Cari nama produk" placeholder="Cari nama produk..." type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500" aria-live="polite">{loading ? 'Memuat produk…' : `${visibleProducts.length} dari ${products.length} produk`}</p>
            <div className="flex rounded-lg border border-slate-200 p-1" aria-label="Pengaturan tampilan">
              {['grid', 'list'].map((value) => (
                <button aria-pressed={layout === value} className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${layout === value ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:bg-slate-50'}`} key={value} onClick={() => changeLayout(value)} type="button">{value === 'grid' ? 'Grid' : 'List'}</button>
              ))}
            </div>
          </div>
        </div>

        <Notice error>{error}</Notice>
        <Notice>{notice}</Notice>
        {formMode && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold text-blue-950">{formMode === 'create' ? 'Tambah Produk' : 'Edit Produk'}</h2>
            <ProductForm key={formMode === 'create' ? 'create' : formMode.id} initialProduct={formMode !== 'create' ? products.find((product) => product.id === formMode.id) : null} onSave={saveProduct} onCancel={() => setFormMode(null)} />
          </div>
        )}
        {loading ? (
          <p className="py-12 text-center text-sm text-slate-500">Memuat daftar produk…</p>
        ) : visibleProducts.length ? (
          <div className={layout === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} onEdit={(item) => setFormMode({ mode: 'edit', id: item.id })} onDelete={deleteProduct} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
            <h2 className="font-bold text-slate-800">{products.length ? 'Produk tidak ditemukan' : 'Belum ada produk'}</h2>
            <p className="mt-2 text-sm text-slate-500">{products.length ? 'Coba kata kunci lain.' : 'Tambahkan produk pertama untuk mulai mengelola inventaris.'}</p>
          </div>
        )}
      </section>
    </>
  );
}

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    request(`/products/${encodeURIComponent(id)}`)
      .then((data) => {
        if (active) {
          setProduct(data);
          setStatus('success');
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(loadError.message);
          setStatus('error');
        }
      });
    return () => { active = false; };
  }, [id]);

  if (status === 'loading') {
    return <p className="py-12 text-center text-slate-500">Memuat detail produk…</p>;
  }

  if (status === 'error') {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-red-600">Produk tidak ditemukan</p>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Tidak dapat memuat detail produk</h1>
        <p className="mt-3 text-slate-600">{error}</p>
        <Link className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" to="/">Kembali ke daftar produk</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link className="text-sm font-semibold text-blue-700 hover:text-blue-900" to="/">← Kembali ke daftar produk</Link>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Detail produk · ID {product.id}</p>
        <h1 className="mt-3 break-words text-3xl font-extrabold text-blue-950">{product.name}</h1>
        <p className="mt-5 text-sm font-semibold text-slate-500">Harga</p>
        <p className="mt-1 text-2xl font-bold text-slate-800">{currency.format(product.price)}</p>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-slate-600">Alamat yang Anda buka tidak tersedia.</p>
      <Link className="mt-6 inline-flex rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" to="/">Kembali ke halaman utama</Link>
    </section>
  );
}

export default function App() {
  return (
    <PageShell>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </PageShell>
  );
}
