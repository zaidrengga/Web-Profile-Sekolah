// Interface untuk Tabel 'users'
export interface User {
  id: string; // UUID di PostgreSQL akan diwakili sebagai string di TypeScript
  username: string;
  image: string | null;
  password: string;
  role: 'admin' | 'guru' | 'siswa';
  email: string | null;
  created_at: string; // Tipe data TIMESTAMP WITH TIME ZONE
}

// Interface untuk Tabel 'gurus'
export interface Guru {
  id: string;
  user_id: string;
  nama: string;
  nip: string | null;
  alamat: string | null;
  telepon: string | null;
  jabatan: string | null;
}

// Interface untuk Tabel 'kelas'
export interface Kelas {
  id: string;
  nama_kelas: string;
  wali_kelas_id: string | null;
  tahun_ajaran: string;
}

// Interface untuk Tabel 'siswas'
export interface Siswa {
  id: string;
  user_id: string;
  nama: string;
  nisn: string;
  kelas_id: string | null;
  alamat: string | null;
  telepon_wali: string | null;
}

// Interface untuk Tabel 'mapels'
export interface Mapel {
  id: string;
  nama_mapel: string;
  kode_mapel: string;
}

// Interface untuk Tabel 'jadwal_kelas_mapel'
export interface JadwalKelasMapel {
  id: string;
  kelas_id: string;
  mapel_id: string;
  guru_id: string;
  hari: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat";
  jam: string;
}

// Interface untuk Tabel 'absensis'
export interface Absensi {
  id: string;
  siswa_id: string;
  tanggal: string; // Tipe data DATE akan diwakili sebagai string
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  keterangan: string | null;
  jadwal_kelas_mapel_id: string | null;
}

// Interface untuk Tabel 'gallerie
export interface Gallery {
  id: string;              // UUID
  uploader: string;        // Nama pengunggah
  title: string;           // Judul galeri
  description?: string;    // Deskripsi (boleh null)
  image_url: string;       // URL gambar
  created_at: Date;      // Timestamp ISO string
}

export interface Blog {
  id: string;
  author: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  created_at: Date;
  updated_at: Date;
}