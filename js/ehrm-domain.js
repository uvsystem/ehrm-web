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
	
	defaultObject: {},
	
	success: function( result ) {
		
	},
	
	reload: function() {
		throw new Error( 'reload' );
	},
	
	load: function( list ) {
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {
			
		},
		
		getContent: function( list ) {
			
		},
		
		getObject: function() {
			
		},
		
		setDetail: function( id ) {
			
		},
		
		resetForm: function( obj ) {
			
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
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="unitKerjaDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-skpd">Detail</button>' +
					'</div>' +
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
		
		resetForm: function( obj ) {
		
		},		
	}

};

/**
 *
 */
var jabatanDomain = {
	
	nama: 'JABATAN',
	
	currentObject: null,
	
	defaultObject: {},
	
	success: function( result ) {
		
	},
	
	reload: function() {
		throw new Error( 'reload' );
	},
	
	load: function( list ) {
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {
			
		},
		
		getContent: function( list ) {
			
		},
		
		getObject: function() {
			
		},
		
		setDetail: function( id ) {
			
		},
		
		resetForm: function( obj ) {
			
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

	load: function( list ) {

		page.setName( pegawaiDomain.nama );
		
		page.load( $( '#content' ), 'html/pegawai.html' );
		pegawaiDomain.content.setData( list );
		
		page.change( $( '#list-satker' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'list-satker') );
	},
	
	reload: function() {

		pegawaiRestAdapter.findBySatker( pegawaiDomain.idSekretariatDaerah(), function( result ) {
			pegawaiDomain.load( result.list );	
			storage.set( result.list, pegawaiDomain.nama );
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
			
			message.writeLog( tmp.nip + ': ' + ( tmp.nip == nip ) ); // LOG
			
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
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="pegawaiDomain.content.setDetail(' + tmp.nip + ')" data-toggle="modal" data-target="#modal-form-pegawai">Detail</button>' +
					'<button type="button" class="btn btn-primary" onclick="pegawaiDomain.content.openMutasi(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-mutasi">Mutasi</button>' +
					'<button type="button" class="btn btn-warning" onclick="pegawaiDomain.content.openPromosiPangkat(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-promosi-pangkat">Pangkat</button>' +
					'<button type="button" class="btn btn-success" onclick="pegawaiDomain.content.openPromosiJabatan(' + tmp.id + ', ' + tmp.unitKerja.id + ')" data-toggle="modal" data-target="#modal-form-promosi-jabatan">Jabatan</button>' +
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
			$( '#form-pegawai-password' ).val( 'password' );

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
		
		openPromosiPangkat: function( idPegawai ) {
			pegawaiDomain.currentId = idPegawai;
		},
		
		openPromosiJabatan: function( idPegawai, idSatker ) {
			pegawaiDomain.currentId = idPegawai;
			
			jabatanRestAdapter.findBySatker( idSatker, function( result ) {
				if ( result.tipe == 'LIST' )
					page.change( $( '#list-jabatan' ), page.list.dataList.generateFromList( result.list, 'list-jabatan') );
			});
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
	
	success: function( result ) {
		
	},
	
	reload: function() {
		throw new Error( 'reload' );
	},
	
	load: function( list ) {
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {
			
		},
		
		getContent: function( list ) {
			
		},
		
		getObject: function() {
			
		},
		
		setDetail: function( id ) {
			
		},
		
		resetForm: function( obj ) {
			
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
		
		absenDomain.content.getContent();
		absenDomain.content.setData( list );
		
	},
	
	reload: function() {

		page.setName( absenDomain.nama );
		
		absenDomain.content.getContent();
		
	},

	content: {

		getContent: function() {

			page.load( $( '#content' ), 'html/absen.html' );

			page.change( $( '#list-unitkerja' ), page.list.option.generateFromStorage( unitKerjaDomain.nama ) );
			
		},

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
					'<td>' + tmp.pegawaiDomain.nip + '</td>' +
					'<td>' + tmp.pegawaiDomain.nama + '</td>' +
					'<td>' + tmp.tanggalStr + '</td>' +
					'<td>' + tmp.status + '</td>' +
					'<td>' + tmp.pagiStr + '</td>' +
					'<td>' + tmp.tengahStr + '</td>' +
					'<td>' + tmp.siangStr + '</td>' +
					'<td>' + tmp.soreStr + '</td>' +
					'<td>' + ( !tmp.keterangan ? '' : tmp.keterangan ) + '</td>';
				
					if ( operator.getRole() == 'ADMIN' && tmp.status == 'HADIR' ) {
						html += '<td>' +
						'<div class="btn-group btn-group-xs">' +
						'<button type="button" class="btn btn-danger" onclick="absenDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-absenDomain">Detail</button>' +
						'</div>' +
						'</td>';
					} else {
						html += '<td>&nbsp</td>';
					}
					
					html += '</tr>';
			}
			
			page.change( $( '#table' ), html );
			
		},

		setDetail: function( id ) {

			var obj = storage.getById( absenDomain, id );

			this.resetForm( obj );

		},
	
		resetForm: function( obj ) {
			
			$( '#form-absen-nip' ).val( obj.pegawaiDomain.nip );
			$( '#form-absen-nama' ).val( obj.pegawaiDomain.nama );
			$( '#form-absen-tanggal' ).val( obj.tanggal );
			$( '#form-absen-pagi' ).val( obj.pagiStr );
			$( '#form-absen-tengah' ).val( obj.tengahStr);
			$( '#form-absen-siang' ).val( obj.siangStr );
			$( '#form-absen-sore' ).val( obj.soreStr );
		}
		
	}
	
};


/**
 *
 */
var suratTugasDomain = {
	
	nama: 'SURAT TUGAS',
	
	currentObject: null,
	
	defaultObject: {},
	
	success: function( result ) {
		
	},
	
	reload: function() {
		throw new Error( 'reload' );
	},
	
	load: function( list ) {
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {
			
		},
		
		getContent: function( list ) {
			
		},
		
		getObject: function() {
			
		},
		
		setDetail: function( id ) {
			
		},
		
		resetForm: function( obj ) {
			
		}
	}
};

/**
 *
 */
var sppdDomain = {
	
	nama: 'SPPD',
	
	currentObject: null,
	
	defaultObject: {},
	
	success: function( result ) {
		
	},
	
	reload: function() {
		throw new Error( 'reload' );
	},
	
	load: function( list ) {
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {
			
		},
		
		getContent: function( list ) {
			
		},
		
		getObject: function() {
			
		},
		
		setDetail: function( id ) {
			
		},
		
		resetForm: function( obj ) {
			
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

