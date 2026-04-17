# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

# GACHA MENGGUNAKAN SISTEM API #
User dapat melakukan Gacha dengan batasan kuota harian sebanyak 5 kali serta mendapatkan hadiah terbatas.

Sistem Gacha :
- Setiap pengguna dibatasi maksimal 5 kali gacha per hari kalender.
- Jika pengguna melakukan gacha di hari yang berbeda, penghitung (banyakGacha) akan otomatis kembali.
- Sistem mengecek ketersediaan kuota hadiah secara real-time sebelum memberikan kemenangan.
- Setiap ada yang menang, sistem akan mencatat dalam tabel Rewards.

Hadiah Gacha : 
- Emas 10 gram: Stok cuma 1.
- Smartphone X: Stok cuma 5.
- Smartwatch Y: Stok cuma 10.
- Voucher Rp 100.000: Stok ada 100.
- Pulsa Rp 50.000: Stok ada 500.

# Cara Pakai (API Endpoints), bikin route nya di gacha-route.js #
- Bagian User
> Daftar User: POST http://localhost:5000/api/users (Masukin email, password, confirm_password sama full_name).
> Cek Semua User: GET http://localhost:5000/api/users (Buat ngecek siapa aja yang sudah terdaftar.)

- Bagian Gacha
> Main Gacha: PUT http://localhost:5000/api/users/:userId(Id user yang udah didaftarin)/gacha. (Ini endpoint buat nge gacha nya)
> Cek History: GET http://localhost:5000/api/users/:userId(Id user yang udah didaftarin)/gacha/history. (Buat lihat user sudah dapet hadiah apa aja.)
> Cek Sisa Stok Hadiah: GET http://localhost:5000/api/users/gacha/quota.(Buat lihat hadiah apa aja yang masih sisa)
> Daftar Pemenang: GET http://localhost:5000/api/users/gacha/winners. (Lihat semua orang yang menang di sistem ini.)

