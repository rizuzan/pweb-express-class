# Tugas API Daftar Produk (ExpressJS, React, dan Tailwind CSS)

## 1. Struktur Folder Proyek

```text
tugas-api-produk/
├── controllers/
│   └── productController.js
├── routes/
│   └── productRoutes.js
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.mjs
├── database.js
├── app.js
├── package.json
├── package-lock.json
├── dist/ (hasil build, dibuat otomatis dan tidak di-commit)
└── data.db (dibuat otomatis dan tidak di-commit)
```

## 2. Petunjuk Menjalankan Proyek

### Instalasi dependensi

Buka terminal di folder proyek, lalu jalankan:

```bash
npm install
```

### Menjalankan aplikasi saat pengembangan

Jalankan API Express dan Vite secara bersamaan:

```bash
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya `http://localhost:5173`. API tersedia di `http://localhost:3000`.

### Build dan menjalankan aplikasi

```bash
npm start
```

Perintah tersebut membuat build React lalu menjalankan aplikasi di `http://localhost:3000`.

Antarmuka menggunakan React Router untuk halaman daftar (`/`), detail (`/products/:id`), dan halaman 404. Produk dapat ditambah, dilihat, diedit, dan dihapus. Tombol Grid/List mengubah susunan produk dan menyimpan pilihan di browser.

Data disimpan secara lokal di file `data.db`. File dan tabel database dibuat otomatis saat server pertama kali dijalankan. Lima produk contoh ditambahkan hanya ketika tabel produk baru dibuat.

## 3. Daftar Endpoint API

| Metode | Endpoint | Deskripsi | Status Sukses | Status Gagal |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | Mengambil seluruh daftar produk | `200 OK` (Array JSON) | - |
| **GET** | `/products/:id` | Mengambil satu produk berdasarkan ID | `200 OK` (Objek JSON) | `400 Bad Request` / `404 Not Found` |
| **POST** | `/products` | Menambahkan produk baru (`name` dan `price`) | `201 Created` (Objek JSON baru) | `400 Bad Request` |
| **PUT** | `/products` | Memperbarui produk berdasarkan `id` pada body | `200 OK` (Objek JSON yang diperbarui) | `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/products/:id` | Menghapus produk berdasarkan ID | `200 OK` (Pesan JSON) | `400 Bad Request` / `404 Not Found` |

`name` harus berupa teks yang tidak kosong, dan `price` harus berupa angka nol atau lebih.

Body untuk menambah produk:

```json
{ "name": "Penggaris", "price": 7000 }
```

Body untuk memperbarui produk:

```json
{ "id": 1, "name": "Buku Tulis", "price": 18000 }
```

## 4. Panduan Pengujian

### Uji 1: Mengambil seluruh produk (`GET /products`)

Target: status `200 OK` dan array seluruh produk.

```bash
curl -i http://localhost:3000/products
```

### Uji 2: Mengambil produk berdasarkan ID yang ada (`GET /products/1`)

Target: status `200 OK` dan objek produk dengan ID 1.

```bash
curl -i http://localhost:3000/products/1
```

### Uji 3: Mengambil produk dengan ID yang tidak ditemukan (`GET /products/999`)

Target: status `404 Not Found` dan pesan JSON bahwa produk tidak ditemukan.

```bash
curl -i http://localhost:3000/products/999
```

### Uji 4: Menambahkan produk baru (`POST /products`)

Target: status `201 Created` dan objek produk baru dengan ID otomatis.

```bash
curl -i -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Penggaris", "price": 7000}'
```

### Uji 5: Memperbarui produk (`PUT /products`)

```bash
curl -i -X PUT http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Buku Tulis", "price": 18000}'
```

### Uji 6: Menghapus produk (`DELETE /products/:id`)

```bash
curl -i -X DELETE http://localhost:3000/products/1
```

### Menjalankan tes

```bash
npm test
```

Perintah POST satu baris untuk Command Prompt atau PowerShell Windows:

```bash
curl -i -X POST http://localhost:3000/products -H "Content-Type: application/json" -d "{\"name\": \"Penggaris\", \"price\": 7000}"
```