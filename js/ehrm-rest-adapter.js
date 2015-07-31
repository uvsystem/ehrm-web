/**
 * eHRMRestAdapter.js
 *
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0.0
 */

var ehrmRestAdapter = rest( 'http://localhost:8080', 'ehrm' );

var unitKerjaRestAdapter = {

	save: function( id, nama, tipe, singkatan, callback ) {

		var unitKerja = {
			id: id,
			nama: nama,
			tipe: tipe,
			singkatan: singkatan
		};
		
		ehrmRestAdapter.call( '/satker', unitKerja, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan unit kerja: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( kode, callback ) {

		ehrmRestAdapter.call( '/satker/' + kode, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus unit kerja: " + kode ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		ehrmRestAdapter.call( '/satker/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findSubUnit: function( id, callback ) {

		ehrmRestAdapter.call( '/satker/' + id + '/sub', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	addSubUnit: function( kode, id, nama, tipe, singkatan, callback ) {

		var unitKerja = {
			id: id,
			nama: nama,
			tipe: tipe,
			singkatan: singkatan,
		};

		ehrmRestAdapter.call( '/satker/' + kode + '/sub', unitKerja, 'POST',
			function( result ) {
				message.writeLog( "Mengambil unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		ehrmRestAdapter.call( '/satker/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	all: function( callback ) {

		ehrmRestAdapter.call( '/satker', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil semua unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var jabatanRestAdapter = {

	save: function( idUnitKerja, id, eselon, pangkat, nama, callback ) {

		var jabatan = {
			id: id,
			eselon: eselon,
			pangkat: pangkat,
			nama: nama
		};
		
		ehrmRestAdapter.call( '/jabatan/' + idUnitKerja, jabatan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan jabatan: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		ehrmRestAdapter.call( '/jabatan/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus jabatan: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		ehrmRestAdapter.call( '/jabatan/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil jabatan: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( id, callback ) {

		ehrmRestAdapter.call( '/jabatan/satker/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil jabatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		ehrmRestAdapter.call( '/jabatan/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari jabatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var pegawaiRestAdapter = {

	save: function( idSatuanKerja, id, nip, password, nik, nama, tanggalLahir, email, telepon, idPenduduk, callback ) {

		var pegawai = {
			id: id,
			nip: nip,
			passwordStr: password,
			nik: nik,
			nama: nama,
			tanggalLahirStr: tanggalLahir,
			email: email,
			telepon: telepon,
			idPenduduk: idPenduduk
		};
		
		var method = 'POST';
		if ( id != 0 )
			method = 'PUT';
		
		ehrmRestAdapter.call( '/pegawai/' + idSatuanKerja, pegawai, method, function( result ) {
				callback( result );
				message.writeLog( "Menyimpan pegawai: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( nip, callback ) {

		ehrmRestAdapter.call( '/pegawai/' + nip, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus pegawai: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( nip, callback ) {

		ehrmRestAdapter.call( '/pegawai/' + nip, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		ehrmRestAdapter.call( '/pegawai/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByEselon: function( eselon, callback ) {

		ehrmRestAdapter.call( '/pegawai/eselon/' + eselon, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		ehrmRestAdapter.call( '/pegawai/search/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari pegawai: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	mutasi: function( nip, kode, callback ) {

		ehrmRestAdapter.call( '/pegawai/' + nip + '/mutasi/' + kode, null, 'POST',
			function( result ) {
				message.writeLog( "Mutasi pegawai " + nip + " ke Satuan Kerja " + kode ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	promosiPangkat: function( nip, pangkat, nomorSk, tanggalMulai, tanggalSelesai, callback ) {

		var riwayat = {
			nomorSk: nomorSk,
			tanggalMulaiStr: tanggalMulai,
			tanggalSelesaiStr: tanggalSelesai
		};

		ehrmRestAdapter.call( '/pegawai/' + nip + '/pangkat/' + pangkat, riwayat, 'POST',
			function( result ) {
				message.writeLog( "Promosi  pegawai  " + nip + " ke pangkat " + pangkat ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	hapusPangkat: function( nip, pangkat, callback ) {

		ehrmRestAdapter.call( '/pegawai/' + nip + '/pangkat/' + pangkat, null, 'DELETE',
			function( result ) {
				message.writeLog( "Hapus pangkat " + pangkat + " dari pegawai  " + nip ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	promosiJabatan: function( nip, idJabatan, nomorSk, tanggalMulai, tanggalSelesai, callback ) {

		var riwayat = {
			nomorSk: nomorSk,
			tanggalMulaiStr: tanggalMulai,
			tanggalSelesaiStr: tanggalSelesai
		};
	
		ehrmRestAdapter.call( '/pegawai/' + nip + '/jabatan/' + idJabatan, riwayat, 'POST',
			function( result ) {
				message.writeLog( "Promosi  pegawai  " + nip + " ke jabatan " + idJabatan ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	hapusJabatan: function( nip, jabatan, callback ) {

		ehrmRestAdapter.call( '/pegawai/' + nip + '/jabatan/' + jabatan, null, 'DELETE',
			function( result ) {
				message.writeLog( "Hapus jabatan " + jabatan + " dari pegawai  " + nip ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var absenRestAdapter = {

	pagi: function( nip, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/pagi', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen pagi: " + nip ); // LOG
			},
			message.error
		);
	},

	pagiDetail: function( nip, tanggal, jam, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/pagi/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen pagi: " + nip ); // LOG
			},
			message.error
		);
	},

	cek1: function( nip, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/cek1', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek1: " + nip ); // LOG
			},
			message.error
		);
	},

	cek1Detail: function( nip, tanggal, jam, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/cek1/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek1: " + nip ); // LOG
			},
			message.error
		);
	},

	cek2: function( nip, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/cek2', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek2: " + nip ); // LOG
			},
			message.error
		);
	},

	cek2Detail: function( nip, tanggal, jam, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/cek2/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cek2: " + nip ); // LOG
			},
			message.error
		);
	},

	sore: function( nip, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/sore', null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sore: " + nip ); // LOG
			},
			message.error
		);
	},

	soreDetail: function( nip, tanggal, jam, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/sore/' + tanggal + '/' + jam, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sore: " + nip ); // LOG
			},
			message.error
		);
	},

	hadir: function( nip, tanggal, pagi, cek1, cek2, sore, callback ) {

		var hadirObject = { pagi: pagi, cek1: cek1, cek2: cek2, sore: sore };
		
		ehrmRestAdapter.call( '/absen/' + nip + '/hadir/' + tanggal, hadirObject, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen hadir: " + nip + ":" + tanggal + ". " + hadirObject ); // LOG
			},
			message.error
		);
	},

	sakit: function( nip, tanggal, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/sakit/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen sakit: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	},

	izin: function( nip, tanggal, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/izin/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen izin: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	},

	cuti: function( nip, tanggal, callback ) {

		ehrmRestAdapter.call( '/absen/' + nip + '/cuti/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan absen cuti: " + nip + ":" + tanggal ); // LOG
			},
			message.error
		);
	}
};

var kalendarRestAdapter = {

	add: function( tanggal, callback ) {

		ehrmRestAdapter.call( '/kalendar/' + tanggal, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah kalendar: " + tanggal ); // LOG
			},
			message.error
		);
	},

	findOne: function( tanggal, callback ) {

		ehrmRestAdapter.call( '/kalendar/' + tanggal, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},

	"delete": function( tanggal, callback ) {

		tanggal = tanggal.replace( "/", "-" );
		tanggal = tanggal.replace( "/", "-" );
		tanggal = tanggal.replace( "/", "-" );

		ehrmRestAdapter.call( '/kalendar/' + tanggal, null, 'DELETE',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
		
	findRange: function( tanggalAwal, tanggalAkhir, callback ) {

		ehrmRestAdapter.call( '/kalendar/' + tanggalAwal + '/to/' + tanggalAkhir, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kalendar: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var suratTugasRestAdapter = {
	
	request: function( nip, nomor, jumlahHari, tujuan, maksud, daftarPegawai, callback ) {

		var suratTugas = {
			nomor: nomor,
			jumlahHari: jumlahHari,
			tujuan: tujuan,
			maksud: maksud,
			daftarPegawai: daftarPegawai
		};
		
		ehrmRestAdapter.call( '/suratTugas/' + nip, suratTugas, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Berhasil request surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	accept: function( nomor, callback ) {

		ehrmRestAdapter.call( '/suratTugas/' + nomor + '/terima', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menerima surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	ignore: function( nomor, callback ) {

		ehrmRestAdapter.call( '/suratTugas/' + nomor + '/tolak', null, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menolak surat tugas: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findPending: function( callback ) {

		ehrmRestAdapter.call( '/suratTugas/pending', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas pending: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findAccepted: function( callback ) {

		ehrmRestAdapter.call( '/suratTugas/terima', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas accepted: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findIgnored: function( callback ) {

		ehrmRestAdapter.call( '/suratTugas/tolak', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas ignored: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	findByPegawai: function( nip, callback ) {

		ehrmRestAdapter.call( '/suratTugas/' + nip, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil surat tugas: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	}
};

var sppdRestAdapter = {
		
	save: function( nip, nomorSuratTugas, nomor, tanggalBerangkat, transportasi, kodeRekening, nomorDpa, tingkat, daftarPengikut, callback ) {

		var sppd = {
			nomor: nomor,
			tanggalBerangkatStr: tanggalBerangkat,
			modaTransportasi: transportasi,
			kodeRekening: kodeRekening,
			nomorDpa: nomorDpa,
			tingkat: tingkat,
			daftarPengikut: daftarPengikut
		};

		ehrmRestAdapter.call( '/sppd/' + nip + '/suratTugas/' + nomorSuratTugas, sppd, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
		
	addFollower: function( nomor, nama, tanggalLahir, keterangan, callback ) {

		var pengikut = {
			nama: nama,
			tanggalLahirStr: tanggalLahir,
			keterangan: keterangan
		};
			
		ehrmRestAdapter.call( '/sppd/' + nomor + '/pengikut', pengikut, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah pengikut sppd: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findByPegawai: function( nip, callback ) {

		ehrmRestAdapter.call( '/sppd/' + nip, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil sppd: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	}
}

var aplikasiRestAdapter = {
	
	add: function( id, kode, nama, url, callback ) {
		
		var aplikasi = {
			id: id,
			kode: kode,
			nama: nama,
			url: url
		};

		ehrmRestAdapter.call( '/aplikasi', aplikasi, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah aplikasi: " + aplikasi ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus aplikasi: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( kode, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode, null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil aplikasi: " + result.object ); // LOG
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		ehrmRestAdapter.call( '/aplikasi', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil aplikasi: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	addOperator: function( kode, nip, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode +'/operator/' + nip, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah operator: " + nip + ' pada aplikasi: ' + aplikasi ); // LOG
			},
			message.error
		);
	},
	
	findOperator: function( kode, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode + '/operator', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil operator: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	deleteOperator: function( kode, nip, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode +'/operator/' + nip, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus operator: " + nip + ' dari aplikasi: ' + aplikasi ); // LOG
			},
			message.error
		);
	},
	
	addAdmin: function( kode, nip, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode +'/admin/' + nip, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah admin: " + nip + ' pada aplikasi: ' + aplikasi ); // LOG
			},
			message.error
		);
	},
	
	findAdmin: function( kode, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode + '/admin', null, 'GET',
			function( result ) {
				callback( result );
				message.writeLog( "Mengambil admin: " + ( result.list ? result.list.length : 0 ) ); // LOG
			},
			message.error
		);
	},
	
	deleteAdmin: function( kode, nip, callback ) {

		ehrmRestAdapter.call( '/aplikasi/' + kode +'/admin/' + nip, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus admin: " + nip + ' dari aplikasi: ' + aplikasi ); // LOG
			},
			message.error
		);
	}
};
