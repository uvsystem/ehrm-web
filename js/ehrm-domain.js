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
	
};


/**
 * Definisi resources untuk data SKPD.
 */
var unitKerjaDomain = {
	
	nama: 'UNIT KERJA',
	
	currentObject: null,

	defaultObject: {
		id: 0,
		kode: 'DEFAULT',
		nama: ''
	},

	success: function ( result ) {

		message.success( result );
		
		unitKerjaDomain.reload();
		unitKerjaDomain.currentObject = null;

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
		unitKerjaDomain.content.getContent();
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
					'<td>' + tmp.kode + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="unitKerjaDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-unitKerjaDomain">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/satuan-kerja.html' );
			
		},

		getObject: function() {
		
			var object = unitKerjaDomain.currentObject;
			
			if ( !object )
				object = choose( null, unitKerjaDomain.defaultObject);

			object.kode = $( '#form-skpd-kode' ).val();
			object.nama = $( '#form-skpd-nama' ).val();
							
			return object;
		
		},

		setDetail: function( id ) {

			var obj = storage.getById( unitKerjaDomain, id );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-skpd-kode' ).val( obj.kode );
			$( '#form-skpd-nama' ).val( obj.nama );
			
			unitKerjaDomain.currentObject = obj;
		
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
 * Definisi resources untuk pegawai.
 * Sangat tergantung pada variable page (api.js).
 */
var pegawai = {

	nama: 'PEGAWAI',
	
	searchBy: '',
	
	defaultObject: {
		nip: '',
		nama: '',
		golongan: '',
		jabatan: '',
		bagian: {
			nama: '',
			unitKerjaDomain: {
				nama: ''
			}
		}
	},
	
	currentObject: null,
	
	success: function ( result ) {

		message.success( result );

		pegawai.reload( );
		pegawai.currentObject = null;
		
	},

	load: function( list ) {

		page.setName( pegawai.nama );
		
		pegawai.content.getContent();
		pegawai.content.setData( list );
		
	},
	
	reload: function() {
		
		var onSuccess = function( result ) {
		
			pegawai.load( result.list );
			
			storage.set( result.list, pegawai.nama );
		
		};
		
		var url = '/pegawai';

		rest.call( url, null, 'GET', onSuccess, message.error );
		
	},
	
	getListNip: function() {
		
		var list = storage.get( pegawai.nama );
		var listNip = [];
		
		for ( var index = 0; index < list.length; index++ ) {
			
			var tmp = list[ index ];
			listNip[ index ] = tmp.nip;
			
		}
		
		return listNip;
	},
	
	getByNip: function( nip ) {

		var listPegawai = storage.get( pegawai.nama );
		
		for ( var index = 0; index < listPegawai.length; index++ ) {
			
			var tmp = listPegawai[ index ];
			
			message.writeLog( tmp.nip + ': ' + ( tmp.nip == nip ) ); // LOG
			
			if ( tmp.nip == nip)
				return tmp;
		}
		
		return { nama: 'Tidak terdaftar' };
	},

	content: {

		getContent: function() {

			page.load( $( '#content' ), 'html/pegawai.html' );
			
		},
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = pegawai;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nip + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.golongan + '</td>' +
					'<td>' + tmp.jabatan + '</td>' +
					'<td>' + ( !tmp.bagian.unitKerjaDomain ? '' : tmp.bagian.unitKerjaDomain.nama ) + '</td>' +
					'<td>' + tmp.bagian.nama + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="pegawai.content.setDetail(' + tmp.nip + ')" data-toggle="modal" data-target="#modal-form-pegawai">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},

		getObject: function() {
		
			var object = pegawai.currentObject;
			
			if ( !object )
				object = choose( null, pegawai.defaultObject );
			
			object.nip = $( '#form-pegawai-nip' ).val();
			object.nama = $( '#form-pegawai-nama' ).val();
			object.golongan = $( '#form-pegawai-golongan' ).val();
			object.jabatan = $( '#form-pegawai-jabatan' ).val();
			object.bagian = storage.getByNama( bagian, $( '#form-pegawai-bagian' ).val() );
			
			return object;
		},
		
		setDetail: function( nip ) {

			var obj = storage.getByNip( pegawai, nip );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {
		
			page.change( $( '#list-unitKerjaDomain' ), page.list.option.generateFromStorage( unitKerjaDomain.nama ) );
			page.change( $( '#list-bagian' ), page.list.option.generateFromStorage( bagian.nama ) );

			$( '#form-pegawai-nip' ).val( obj.nip );
			$( '#form-pegawai-nama' ).val( obj.nama );
			$( '#form-pegawai-golongan' ).val( obj.golongan );
			$( '#form-pegawai-jabatan' ).val( obj.jabatan );
			$( '#form-pegawai-unitKerjaDomain' ).val( obj.bagian.unitKerjaDomain.nama );
			$( '#form-pegawai-bagian' ).val( obj.bagian.nama );

			pegawai.currentObject = obj;
		
		}

	},
	
};


/**
 *
 */
var kalendarDomain = {
	
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
			page.change( $( '#list-bagian' ), page.list.option.generateFromStorage( bagian.nama ) );
			
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
					'<td>' + tmp.pegawai.nip + '</td>' +
					'<td>' + tmp.pegawai.nama + '</td>' +
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
			
			$( '#form-absen-nip' ).val( obj.pegawai.nip );
			$( '#form-absen-nama' ).val( obj.pegawai.nama );
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
	
};

/**
 *
 */
var sppdDomain = {
	
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

