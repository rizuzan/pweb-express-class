# Tugas API Daftar Produk (ExpressJS)

## 1. Struktur Folder Proyek
Pastikan struktur folder dan file kamu sudah sesuai seperti di bawah ini:
```text
tugas-api-produk/
├── controllers/
│   └── productController.js
├── routes/
│   └── productRoutes.js
├── app.js
├── package.json
└── README.md
```

---

## 2. Petunjuk Menjalankan Proyek

1. **Instalasi Dependensi**  
   Buka terminal di dalam folder proyek, lalu jalankan perintah berikut untuk menginstal ExpressJS (jika belum):
   ```bash
   npm install express
   ```

2. **Menjalankan Server**  
   Jalankan server dengan perintah:
   ```bash
   node app.js
   ```
   *Biarkan terminal ini tetap terbuka. Server akan aktif di `http://localhost:3000`.*

---

## 3. Daftar Endpoint API

| Metode | Endpoint | Deskripsi | Status Sukses | Status Gagal |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/products` | Mengambil seluruh daftar produk | `200 OK` (Array JSON) | - |
| **GET** | `/products/:id` | Mengambil 1 produk berdasarkan ID | `200 OK` (Objek JSON) | `404 Not Found` (Pesan JSON) |
| **POST** | `/products` | Menambahkan produk baru (`name` & `price`) | `201 Created` (Objek JSON baru) | - |

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
* **Target Hasil:** Status `201 Created` dan objek produk baru dengan ID otomatis (`id: 3`).
* **Perintah Terminal (Mac / Linux / Git Bash):**
  ```bash
  curl -i -X POST http://localhost:3000/products \
    -H "Content-Type: application/json" \
    -d '{"name": "Penggaris", "price": 7000}'
  ```
* **Perintah Terminal (Satu Baris - Aman untuk Command Prompt / PowerShell Windows):**
  ```bash
  curl -i -X POST http://localhost:3000/products -H "Content-Type: application/json" -d "{\"name\": \"Penggaris\", \"price\": 7000}"
  ```

---