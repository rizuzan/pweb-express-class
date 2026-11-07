# Tugas API Daftar Produk (ExpressJS)

## 1. Struktur Folder Proyek
Pastikan struktur folder dan file kamu sudah sesuai seperti di bawah ini:
```text
tugas-api-produk/
├── controllers/
│   └── productController.js
├── routes/
│   └── productRoutes.js
├── database.js
├── app.js
├── package.json
├── package-lock.json
└── data.db (dibuat otomatis dan tidak di-commit)
```

---

## 2. Petunjuk Menjalankan Proyek

1. **Instalasi Dependensi**
   Buka terminal di dalam folder proyek, lalu jalankan:
   ```bash
   npm install
   ```

2. **Menjalankan Server**
   Jalankan server dengan perintah:
   ```bash
   npm start
   ```
   *Biarkan terminal ini tetap terbuka. Server akan aktif di `http://localhost:3000`.*

Data disimpan secara lokal di file `data.db`. File dan tabel database dibuat otomatis saat server pertama kali dijalankan. Dua produk contoh (`Buku` dan `Pulpen`) ditambahkan hanya ketika tabel masih kosong.

---

## 3. Daftar Endpoint API

| Metode | Endpoint | Deskripsi | Status Sukses | Status Gagal |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | Mengambil seluruh daftar produk | `200 OK` (Array JSON) | - |
| **GET** | `/products/:id` | Mengambil 1 produk berdasarkan ID | `200 OK` (Objek JSON) | `404 Not Found` (Pesan JSON) |
| **POST** | `/products` | Menambahkan produk baru (`name` & `price`) | `201 Created` (Objek JSON baru) | - |
| **PUT** | `/products` | Memperbarui produk berdasarkan `id` pada body | `200 OK` (Objek JSON yang diperbarui) | `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/products/:id` | Menghapus produk berdasarkan ID | `200 OK` (Pesan JSON) | `400 Bad Request` / `404 Not Found` |

`name` harus berupa teks yang tidak kosong, dan `price` harus berupa angka nol atau lebih. Body untuk tambah produk:
```json
{ "name": "Penggaris", "price": 7000 }
```

Body untuk memperbarui produk memerlukan `id`:
```json
{ "id": 1, "name": "Buku Tulis", "price": 18000 }
```

---

## 4. Panduan Pengujian (Untuk Bukti Screenshot)

### Uji 1: Mengambil Seluruh Produk (`GET /products`)
* **Target Hasil:** Status `200 OK` dan array seluruh produk.
* **Perintah Terminal:**
  ```bash
  curl -i http://localhost:3000/products
  ```

### Uji 2: Mengambil Produk Berdasarkan ID yang Ada (`GET /products/1`)
* **Target Hasil:** Status `200 OK` dan objek produk Buku.
* **Perintah Terminal:**
  ```bash
  curl -i http://localhost:3000/products/1
  ```

### Uji 3: Mengambil Produk dengan ID Tidak Ditemukan (`GET /products/999`)
* **Target Hasil:** Status `404 Not Found` dan pesan JSON produk tidak ditemukan.
* **Perintah Terminal:**
  ```bash
  curl -i http://localhost:3000/products/999
  ```

### Uji 4: Menambahkan Produk Baru (`POST /products`)
* **Target Hasil:** Status `201 Created` dan objek produk baru dengan ID otomatis.
* **Perintah Terminal (Mac / Linux / Git Bash):**
  ```bash
  curl -i -X POST http://localhost:3000/products \
    -H "Content-Type: application/json" \
    -d '{"name": "Penggaris", "price": 7000}'
  ```

### Uji 5: Memperbarui Produk (`PUT /products`)
```bash
curl -i -X PUT http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Buku Tulis", "price": 18000}'
```

### Uji 6: Menghapus Produk (`DELETE /products/:id`)
```bash
curl -i -X DELETE http://localhost:3000/products/1
```

### Menjalankan tes
```bash
npm test
```
* **Perintah Terminal (Satu Baris - Aman untuk Command Prompt / PowerShell Windows):**
  ```bash
  curl -i -X POST http://localhost:3000/products -H "Content-Type: application/json" -d "{\"name\": \"Penggaris\", \"price\": 7000}"
  ```

---