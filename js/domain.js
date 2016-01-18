/**
 * eHRM-Domain.js
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

/**
 * Home Object
 */
var home = {
	
	nama: 'HOME',

	getContent: function() {

		page.load( $( '#content' ), 'html/home.html' );
		
	},
	
	setData: function() {
		throw new Error( "Not yet implemented" );
	},
	
	load: function() {

		page.setName( home.nama );
		
		message.writeLog( 'loading home page content' ); // LOG

	}
	
};

var user = {

	nama: 'USER',
	
	load: function() {

		page.setName( home.nama );
		
		message.writeLog( 'loading user page content' ); // LOG

	}
};



/**
 *
 */
var aplikasiDomain = {
	
	nama: 'APLIKASI',
	
	currentObject: null,
	
	currentId: 0,
	currentIdOperator: 0,
	
	defaultObject: {},
	
	success: function( result ) {
		message.success( result );
		aplikasiDomain.reload();
	},
	
	reload: function() {

		aplikasiRestAdapter.findAll( function( result ) {
			aplikasiDomain.load( result.list );
			storage.set( result.list, aplikasiDomain.nama );
		});
	},
	
	load: function( list ) {
	
		page.setName( aplikasiDomain.nama );
		page.load( $( '#content' ), 'html/aplikasi.html' );

		aplikasiDomain.content.setData( list );

		storage.set( list, aplikasiDomain.nama );

		var listPegawai = storage.get( pegawaiDomain .nama );
		page.change( $( '#list-nip' ), page.list.option.generateNip( listPegawai ) );
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = aplikasiDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr href="#" onclick="aplikasiDomain.content.loadOperator(' + tmp.id + ')">' +
					'<td>' + tmp.kode + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.url + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="aplikasiDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-aplikasi">Detail</a></li>' +
						'<li><a href="#" onclick="aplikasiDomain.content.tambahAdmin(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-operator">Tambah Admin</a></li>' +
						'<li><a href="#" onclick="aplikasiDomain.content.tambahOperator(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-operator">Tambah Operator</a></li>' +
						'<li><a href="#" onclick="aplikasiDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( id ) {

			aplikasiDomain.currentId = id;
			var aplikasi = storage.getById( aplikasiDomain, id );

			$( '#form-aplikasi-kode' ).val( aplikasi.kode );
			$( '#form-aplikasi-nama' ).val( aplikasi.nama );
			$( '#form-aplikasi-url' ).val( aplikasi.url );
			
		},
		
		loadOperator: function( id ) {

			aplikasiDomain.currentIdOperator = id;
			var aplikasi = storage.getById( aplikasiDomain, id );
			var list = aplikasi.daftarOperator;
			var pageNumber = 0;
			
			if ( !list )
				list = [ ];
	
			activeContainer = aplikasiDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nip + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.role + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="aplikasiDomain.content.hapusOperator(' + tmp.id + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table-operator' ), html );

		},
		
		tambahAdmin: function( id ) {
			
			aplikasiDomain.currentId = id;
			$( '#form-pengikut-nip' ).val( '' );
			$( '#form-pengikut-nama' ).val( '' );
			aplikasiDomain.roleOperator = 'ADMIN';
			
		},
		
		tambahOperator: function( id ) {
			
			aplikasiDomain.currentId = id;
			$( '#form-pengikut-nip' ).val( '' );
			$( '#form-pengikut-nama' ).val( '' );
			aplikasiDomain.roleOperator = 'OPERATOR';
			
		},
		
		hapus: function( id ) {
			aplikasiRestAdapter.delete( id, aplikasiDomain.success );
		},
		
		hapusOperator: function( id ) {
			aplikasiRestAdapter.deleteOperator( id, aplikasiDomain.success );
		}
	}
};

/**
 * Definisi resources untuk data SKPD.
 */
var unitKerjaDomain = {
	
	nama: 'SATKER',

	currentId: 0,

	defaultObject: {
		id: 0,
		singkatan: 'DEFAULT',
		nama: '',
		tipe: 'DINAS'
	},

	reload: function() {

		unitKerjaRestAdapter.all( function( result ) {
				unitKerjaDomain.load( result.list );
				storage.set( result.list, unitKerjaDomain.nama );
			}
		);
	},
	
	load: function( list ) {
	
		page.setName( unitKerjaDomain.nama );
		page.load( $( '#content' ), 'html/satuan-kerja.html' );

		unitKerjaDomain.content.setData( list );
		
		page.change( $( '#list-satuan-kerja' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satuan-kerja') );
		
	},

	content: {

		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = unitKerjaDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.singkatan + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.tipe + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="unitKerjaDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-skpd">Detail</a></li>' +
						'<li><a href="#" onclick="unitKerjaDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					// '<div class="btn-group btn-group-xs">' +
					// '<button type="button" class="btn btn-danger" onclick="unitKerjaDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-skpd">Detail</button>' +
					// '</div>' +
					'</td>' +
					'</tr>';
					
			}
			
			page.change( $( '#table' ), html );

		},

		setDetail: function( id ) {

			page.change( $( '#unitkerja-list' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'unitkerja-list' ) );
			var obj = storage.getById( unitKerjaDomain, id );

			if ( obj.parent )
				$( '#form-skpd-parent' ).val( obj.parent.nama );
			$( '#form-skpd-kode' ).val( obj.singkatan );
			$( '#form-skpd-nama' ).val( obj.nama );
			$( '#form-skpd-tipe' ).val( obj.tipe );
			
			unitKerjaDomain.currentId = obj.id;
			
		},
		
		hapus: function ( id ) {
			unitKerjaRestAdapter.delete( id, function ( result ) {
				message.success( result );
				unitKerjaDomain.reload();
			} );
		},
		
		resetForm: function( obj ) {
		
		}
	}

};

/**
 *
 */
var jabatanDomain = {
	
	nama: 'JABATAN',
	
	currentObject: null,
	
	defaultObject: {},

	currentId: 0,
	currentIdPenduduk: 0,
	currentIdUnitKerja: 0,
	
	reload: function() {
		
		jabatanRestAdapter.findBySatker( pegawaiDomain.idSekretariatDaerah(), function( result ) {
			jabatanDomain.load( result.list );	
		});
	},
	
	load: function( list ) {

		page.setName( jabatanDomain.nama );
		
		page.load( $( '#content' ), 'html/jabatan.html' );
		jabatanDomain.content.setData( list );

		storage.set( list, jabatanDomain.nama );
		
		page.change( $( '#list-satker' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satker') );
	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = jabatanDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.unitKerja.nama + '</td>' +
					'<td>' + tmp.eselon + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="jabatanDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-jabatan">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( id ) {
			
			var jabatan = storage.getById( jabatanDomain, id );

			$( '#form-jabatan-satuan-kerja' ).val( jabatan.unitKerja.nama );
			$( '#form-jabatan-eselon' ).val( jabatan.eselon );
			$( '#form-jabatan-pangkat' ).val( jabatan.pangkat );
			$( '#form-jabatan-nama' ).val( jabatan.nama );

			jabatanDomain.currentId = jabatan.id;
			
		}
	}
};

/**
 * Definisi resources untuk pegawaiDomain.
 * Sangat tergantung pada variable page (api.js).
 */
var pegawaiDomain = {

	nama: 'PEGAWAI',
	
	searchBy: '',
	
	defaultObject: {
		id: 0,
		nip: '',
		password: '',
		nik: '',
		nama: '',
		tanggalLahirStr: '',
		email: '',
		telepon: '',
		idPenduduk: 0
	},
	
	currentId: 0,
	currentIdPenduduk: 0,
	currentIdUnitKerja: 0,
	idSekretariatDaerah: function() {
		var setda = storage.getByNama( unitKerjaDomain, 'Sekretariat Daerah');
		return setda.id;
	},
	
	success: function( result ) {
		message.success( result );
		pegawaiDomain.reload();
	},

	load: function( list ) {

		page.setName( pegawaiDomain.nama );
		
		page.load( $( '#content' ), 'html/pegawai.html' );
		pegawaiDomain.content.setData( list );

		storage.set( list, pegawaiDomain.nama );
		
		page.change( $( '#list-satker' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satker') );
	},
	
	reload: function() {

		pegawaiRestAdapter.findBySatker( pegawaiDomain.idSekretariatDaerah(), function( result ) {
			pegawaiDomain.load( result.list );	
		});
	},
	
	getListNip: function() {
		
		var list = storage.get( pegawaiDomain.nama );
		var listNip = [];
		
		for ( var index = 0; index < list.length; index++ ) {
			
			var tmp = list[ index ];
			listNip[ index ] = tmp.nip;
			
		}
		
		return listNip;
	},
	
	getByNip: function( nip ) {

		var listPegawai = storage.get( pegawaiDomain.nama );
		
		for ( var index = 0; index < listPegawai.length; index++ ) {
			
			var tmp = listPegawai[ index ];
			
			message.writeLog( '_' + tmp.nip + '_:_' + nip + '_' ); // LOG
			
			if ( tmp.nip == nip)
				return tmp;
		}
		
		return { nama: 'Tidak terdaftar' };
	},

	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = pegawaiDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nip + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + (tmp.unitKerja.parent ? tmp.unitKerja.nama + ' - ' + tmp.unitKerja.parent.nama : tmp.unitKerja.nama) + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="pegawaiDomain.content.setDetail(' + tmp.nip + ')" data-toggle="modal" data-target="#modal-form-pegawai">Detail</a></li>' +
						'<li><a href="#" onclick="pegawaiDomain.content.openMutasi(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-mutasi">Mutasi</a></li>' +
						'<li><a href="#" onclick="pegawaiDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
						// '<li><a href="#" onclick="pegawaiDomain.content.openPromosiPangkat(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-promosi-pangkat">Promosi Pangkat</a></li>' +
						// '<li><a href="#" onclick="pegawaiDomain.content.openPromosiJabatan(' + tmp.id + ', ' + tmp.unitKerja.id + ')" data-toggle="modal" data-target="#modal-form-promosi-jabatan">Promosi Jabatan</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( nip ) {

			var obj = storage.getByNip( pegawaiDomain, nip );
			
			$( '#form-pegawai-nip' ).val( obj.nip );
			$( '#form-pegawai-nik' ).val( obj.nik );
			$( '#form-pegawai-nama' ).val( obj.nama );
			$( '#form-pegawai-password' ).val( obj.passwordStr );
			$( '#form-pegawai-pangkat' ).val( obj.pangkat );
			$( '#form-pegawai-eselon' ).val( obj.eselon );
			$( '#form-pegawai-jabatan' ).val( obj.namaJabatan );

			var tanggalLahir = myDate.fromFormattedString( obj.tanggalLahirStr );
			$( '#form-pegawai-tanggal-lahir' ).val( tanggalLahir.getDatePickerString() );

			pegawaiDomain.currentId = obj.id;
			pegawaiDomain.currentIdPenduduk = obj.idPenduduk;
			pegawaiDomain.currentIdUnitKerja = obj.unitKerja.id;

			message.writeLog( 'idUnitKerja: ' + pegawaiDomain.currentIdUnitKerja ); // LOG
			message.writeLog( 'id: ' + pegawaiDomain.currentId ); // LOG
			message.writeLog( 'idPenduduk: ' + pegawaiDomain.currentIdPenduduk ); // LOG
		},
		
		openMutasi: function( idPegawai ) {
			pegawaiDomain.currentId = idPegawai;
		},
		
		// belum digunakan
		openPromosiPangkat: function( idPegawai ) {
			pegawaiDomain.currentId = idPegawai;
		},
		
		// belum digunakan
		openPromosiJabatan: function( idPegawai, idSatker ) {
			pegawaiDomain.currentId = idPegawai;

			jabatanRestAdapter.findBySatker( idSatker, function( result ) {
				if ( result.tipe == 'LIST' ) {
					page.change( $( '#list-jabatan' ), page.list.dataList.generateFromList( result.list, 'list-jabatan') );
					storage.set( result.list, jabatanDomain.nama );
				}
			});
		},
		
		hapus: function( id ) {
			pegawaiRestAdapter.delete( id, pegawaiDomain.success );
		}
	},
};


/**
 *
 */
var kalendarDomain = {
	
	nama: 'KALENDAR',
	
	currentObject: null,
	
	defaultObject: {},
	
	reload: function() {
		
		var awal = myDate.getAwal();
		var akhir = myDate.getAkhir();
		
		kalendarRestAdapter.findRange( awal.getFormattedString(), akhir.getFormattedString(), function( result ) {
			kalendarDomain.load( result.list );
		});
	},
	
	load: function( list ) {

		page.setName( kalendarDomain.nama );
		
		page.load( $( '#content' ), 'html/kalendar.html' );
		kalendarDomain.content.setData( list );

		storage.set( list, kalendarDomain.nama );

	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = kalendarDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index += 5 ) {

				var tmp1 = myDate.fromDatePicker( list[ index ].tanggal );
				var tmp2 = list[ index + 1 ] ? myDate.fromDatePicker( list[ index + 1 ].tanggal ) : null;
				var tmp3 = list[ index + 2 ] ? myDate.fromDatePicker( list[ index + 2 ].tanggal ) : null;
				var tmp4 = list[ index + 3 ] ? myDate.fromDatePicker( list[ index + 3 ].tanggal ) : null;
				var tmp5 = list[ index + 4 ] ? myDate.fromDatePicker( list[ index + 4 ].tanggal ) : null;
				
				html += '<tr>' +
					'<td>' + tmp1.getFormattedString() + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="kalendarDomain.content.delete(' + tmp1.day + ', ' + tmp1.month + ', ' + tmp1.year + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'<td>' + ( tmp2 ? tmp2.getFormattedString() : '' ) + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="kalendarDomain.content.delete(' + ( tmp2 ?  tmp2.day + ', ' + tmp2.month + ', ' + tmp2.year  : null) + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'<td>' + ( tmp3 ? tmp3.getFormattedString() : '' ) + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="kalendarDomain.content.delete(' + ( tmp3 ?  tmp3.day + ', ' + tmp3.month + ', ' + tmp3.year  : null) + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'<td>' + ( tmp4 ? tmp4.getFormattedString() : '' ) + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="kalendarDomain.content.delete(' + ( tmp4 ?  tmp4.day + ', ' + tmp4.month + ', ' + tmp4.year  : null) + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'<td>' + ( tmp5 ? tmp5.getFormattedString() : '' ) + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="kalendarDomain.content.delete(' + ( tmp5 ? tmp5.day + ', ' + tmp5.month + ', ' + tmp5.year : null) + ')">Hapus</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		"delete": function( date, month, year ) {
			
			if ( !date || !month || !year )
				throw new Error( 'object is undefined' );

			kalendarRestAdapter.delete( month + '-' + date + '-' + year, function( result ) {
				message.success( result );
				kalendarDomain.reload();
			});
		}
	}
};

/**
 * Definisi resources untuk absenDomain.
 * Sangat tergantung pada variable page (api.js).
 */
var absenDomain = {

	nama: 'ABSEN',
	
	searchBy: '',
	
	defaultObject: { },
	
	currentObject: null,

	success: function ( result ) {

		message.success( result );
		
		absenDomain.load( result.list );
		absenDomain.currentObject = null;

	},

	load: function( list ) {
		
		page.setName( absenDomain.nama );
		page.load( $( '#content' ), 'html/absen.html' );
		
		absenDomain.content.setData( list );

		page.change( $( '#list-satuan-kerja' ), page.list.option.generateFromStorage( unitKerjaDomain.nama ) );

		var listPegawai = storage.get( pegawaiDomain .nama );
		page.change( $( '#list-nip' ), page.list.option.generateNip( listPegawai ) );
		
	},
	
	reload: function() {

		page.setName( absenDomain.nama );
		this.load( [] );
		
	},

	getStatusNumber: function( status ) {
		switch( status ) {
			case 'HADIR': return 1;
				break;
			case 'SAKIT': return 2;
				break;
			case 'IZIN': return 3;
				break;
			case 'CUTI': return 4;
				break;
			case 'TUGAS LUAR': return 5;
				break;
		}
	},
	
	getStatus: function( number ) {
		switch( number ) {
			case 1: return 'HADIR';
				break;
			case 2: return 'SAKIT';
				break;
			case 3: return 'IZIN';
				break;
			case 4: return 'CUTI';
				break;
			case 5: return 'TUGAS LUAR';
				break;
		}
	},
	
	content: {

		getObject: function() {
		
			var object = absenDomain.currentObject;
			
			if ( !object )
				object = choose( null, absenDomain.defaultObject );
			
			return object;
			
		},

		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
			
			storage.set( list, absenDomain.nama );
	
			activeContainer = absenDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];
				
				html += '<tr>' +
					'<td>' + tmp.pegawai.nip + '</td>' +
					'<td>' + tmp.pegawai.nama + '</td>' +
					'<td>' + tmp.tanggal + '</td>' +
					'<td>' + tmp.tipe + '</td>' +
					'<td>' + ( tmp.pagi ? tmp.pagi : '-' )+ '</td>' +
					'<td>' + ( tmp.pengecekanPertama ? tmp.pengecekanPertama : '-' ) + '</td>' +
					'<td>' + ( tmp.pengecekanKedua ? tmp.pengecekanKedua : '-' ) + '</td>' +
					'<td>' + ( tmp.sore ? tmp.sore : '-' ) + '</td>';
				
					if ( operator.getRole() == 'ADMIN' && tmp.tipe == 'HADIR' ) {
						html += '<td>' +
						'<div class="btn-group btn-group-xs">' +
						'<button type="button" class="btn btn-info" onclick="absenDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-absen">Detail</button>' +
						'<button type="button" class="btn btn-danger" onclick="absenDomain.content.delete(' + tmp.id + ', ' + absenDomain.getStatusNumber( tmp.tipe ) + ')">Hapus</button>' +
						'</div>' +
						'</td>';
					} else if ( operator.getRole() == 'ADMIN' ) {
						html += '<td>' +
						'<div class="btn-group btn-group-xs">' +
						'<button type="button" class="btn btn-danger" onclick="absenDomain.content.delete(' + tmp.id + ', ' + absenDomain.getStatusNumber( tmp.tipe ) + ')">Hapus</button>' +
						'</div>' +
						'</td>';
					}
					
					html += '</tr>';
			}
			
			page.change( $( '#table' ), html );
			
		},

		setDetail: function( id ) {

			var obj = storage.getById( absenDomain, id );
			
			$( '#form-absen-nip' ).val( obj.pegawai.nip );
			$( '#form-absen-nama' ).val( obj.pegawai.nama );
			$( '#form-absen-tanggal' ).val( obj.tanggal );
			$( '#form-absen-pagi' ).val( obj.pagi );
			$( '#form-absen-tengah' ).val( obj.pengecekanPertama );
			$( '#form-absen-siang' ).val( obj.pengecekanKedua );
			$( '#form-absen-sore' ).val( obj.sore );

		},

		"delete": function( id, statusNumber ) {
			var status = absenDomain.getStatus( statusNumber );
			
			absenRestAdapter.delete( id, status, function( result ) {
				message.success( result );
				absenDomain.reload();
			});
		}
	}
	
};


/**
 *
 */
var sptDomain = {
	
	nama: 'SURAT TUGAS',
	
	currentObject: null,
	
	currentId: 0,
	
	defaultObject: {},
	
	success: function( result ) {
		message.success( result );
		sptDomain.reload();
	},
	
	reload: function() {

		var awal = myDate.getAwal();
		var akhir = myDate.getAkhir();
		
		suratTugasRestAdapter.findByTanggal( awal.getFormattedString(), akhir.getFormattedString(), function( result ) {
				sptDomain.load( result.list );
				storage.set( result.list, sptDomain.nama );
			}
		);
	},
	
	load: function( list ) {
	
		page.setName( sptDomain.nama );
		page.load( $( '#content' ), 'html/spt.html' );

		sptDomain.content.setData( list );

		storage.set( list, sptDomain.nama );
		
		page.change( $( '#list-satuan-kerja' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satuan-kerja') );

		var listPegawai = storage.get( pegawaiDomain .nama );
		page.change( $( '#list-nip' ), page.list.option.generateNip( listPegawai ) );
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = sptDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr href="#" onclick="sptDomain.content.loadPemegangTugas(' + tmp.id + ')">' +
					'<td>' + tmp.nomor + '</td>' +
					'<td>' + tmp.tanggal + '</td>' +
					'<td>' + tmp.status + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="sptDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-spt">Detail</a></li>' +
						'<li><a href="#" onclick="sptDomain.content.tambahPemegangTugas(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-pemegang-tugas">Tambah Pegawai</a></li>' +
						'<li><a href="#" onclick="sptDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( id ) {
			
			var suratTugas = storage.getById( sptDomain, id );
			
			sptDomain.currentId = suratTugas.id;
			$( '#form-spt-nomor' ).val( suratTugas.nomor );
			$( '#form-spt-jumlah-hari' ).val( suratTugas.jumlahHari );
			$( '#form-spt-tujuan' ).val( suratTugas.tujuan );
			$( '#form-spt-maksud' ).val( suratTugas.maksud );
		},
		
		loadPemegangTugas: function( id ) {
			
			var suratTugas = storage.getById( sptDomain, id );
			var list = suratTugas.daftarPemegangTugas;
			var pageNumber = 0;
			
			if ( !list )
				list = [ ];
	
			activeContainer = sptDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.pegawai.nip + '</td>' +
					'<td>' + tmp.pegawai.nama + '</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table-pemegang-tugas' ), html );

		},
		
		tambahPemegangTugas: function( id ) {
			
			sptDomain.currentId = id;
			$( '#form-pemegang-tugas-nip' ).val( '' );
		},
		
		hapus: function( id ) {
			suratTugasRestAdapter.delete( id, sptDomain.success );
		}
	}
};

/**
 *
 */
var sppdDomain = {
	
	nama: 'SPPD',
	
	currentObject: null,
	
	currentId: 0,
	
	defaultObject: {},
	
	success: function( result ) {
		message.success( result );
		sppdDomain.reload();
	},
	
	reload: function() {

		var awal = myDate.getAwal();
		var akhir = myDate.getAkhir();
		
		sppdRestAdapter.findByTanggal( awal.getFormattedString(), akhir.getFormattedString(), function( result ) {
				sppdDomain.load( result.list );
				storage.set( result.list, sppdDomain.nama );
			}
		);
	},
	
	load: function( list ) {
	
		page.setName( sppdDomain.nama );
		page.load( $( '#content' ), 'html/sppd.html' );

		sppdDomain.content.setData( list );

		storage.set( list, sppdDomain.nama );
		
		page.change( $( '#list-satuan-kerja' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satuan-kerja') );
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = sppdDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr href="#" onclick="sppdDomain.content.loadPengikut(' + tmp.id + ')">' +
					'<td>' + tmp.nomor + '</td>' +
					'<td>' + tmp.nip + '</td>' +
					'<td>' + tmp.berangkat + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="sppdDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-sppd">Detail</a></li>' +
						// '<li><a href="#" onclick="sppdDomain.content.tambahPengikut(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-pengikut">Tambah Pengikut</a></li>' +
						'<li><a href="#" onclick="sppdDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( id ) {
			
			var sppd = storage.getById( sppdDomain, id );
			
			sppdDomain.currentId = sppd.id;
			$( '#form-sppd-nip' ).val( sppd.nip );
			$( '#form-sppd-nomor-spt' ).val( sppd.nomorSuratTugas );
			$( '#form-sppd-nomor' ).val( sppd.nomor );
			var tanggal = myDate.fromFormattedString( sppd.berangkat );
			$( '#form-sppd-tanggal-berangkat' ).val( tanggal.getDatePickerString() );
			$( '#form-sppd-transportasi' ).val( sppd.modaTransportasi );
			$( '#form-sppd-kode-rekening' ).val( sppd.kodeRekening );
			$( '#form-sppd-nomor-dpa' ).val( sppd.nomorDpa );
			$( '#form-sppd-tingkat' ).val( sppd.tingkat );
			
		},
		
		loadPengikut: function( id ) {

			sppdDomain.currentId = id;
		
			var sppd = storage.getById( sppdDomain, id );
			var list = sppd.daftarPengikut;
			var pageNumber = 0;
			
			if ( !list )
				list = [ ];
	
			activeContainer = sppdDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.tanggalLahir + '</td>' +
					'<td>' + tmp.keterangan + '</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table-pengikut' ), html );

		},
		
		tambahPengikut: function( id ) {
			
			var id = sppdDomain.currentId;
			
			$( '#form-pengikut-nama' ).val( '' );
			$( '#form-pengikut-tanggal-lahir' ).val( '' );
			$( '#form-pengikut-keterangan' ).val( '' );
			
		},
		
		hapus: function( id ) {
			sppdRestAdapter.delete( id, sppdDomain.success );
		}
	}
};


var rekap = {

	nama: 'REKAP',
	
	reload: function() {
		
		rekap.content.getContent();
		
	},
	
	content: {
		
		getContent: function() {

			page.load( $( '#content' ), 'html/rekap.html');
			
		}
	}
};

/**
 * Wait modal.
 */
waitModal = {

    shown: false,

	show: function () {
		
		var element = $( '#waitModal' );
		
		if ( element.val() == 'false' || element.val() == false ) {
			
			element.modal( 'show' );
			element.val( true );
			
		}
	},
    
	hide: function () {

		var element = $( '#waitModal' );
		
		if ( element.val() == 'true' || element.val() == true ) {

			element.modal( 'hide' );
			element.val( false );
			
		}
	}

};

