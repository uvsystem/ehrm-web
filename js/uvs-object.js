/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0.0
 */

/*
 * Home Object
 */
var home = {
	
	nama: 'Home',

	getContent: function() {

		page.load( $( '#content' ), 'html/home.html' );
		
	},
	
	setData: function() {

		rest.callAjax(
			{
				path: '/perusahaan/detail.php', 
				
				data:
				{
					bulan: myDate.getBulan(),
					tahun: myDate.getTahun()
				},
				
				method: 'POST', 
				
				success: function( result )
				{ 

					$( '#pemasukan' ).val( number.addCommas( result.object.income ) );
					$( '#pengeluaran' ).val( number.addCommas( result.object.expanse ) );
					$( '#laba' ).val( number.addCommas( result.object.laba ) );
					
				}, 
				
				error: function( result )
				{

					$( '#pemasukan' ).val( 'Data tidak ditemukan' );
					$( '#pengeluaran' ).val( 'Data tidak ditemukan' );
					$( '#laba' ).val( 'Data tidak ditemukan' );
				}
			}
		);
	},
	
	load: function() {

		page.setName( home.nama );

		//home.getContent();
		//home.setData();
		
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

/*
 * Definisi resources untuk operatorAbsen.
 * Sangat tergantung pada variable page (api.js).
 */
var operatorAbsen = {
	
	nama: 'OPERATOR',
	
	searchBy: '',

	list: null,
	
	currentObject: null,
	
	defaultObject: {
		username: '',
		password: '',
		tipe:'',
		lokasi:'',
		deskripsi:''
	},

	success: function ( result ) {

		message.success( result );
		
		operatorAbsen.reload();
		
		operatorAbsen.currentObject = null;

	},

	load: function( list ) {

		page.setName( operatorAbsen.nama );
		
		operatorAbsen.content.getContent();
		
		operatorAbsen.content.setData( list );
		
	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			operatorAbsen.load( result.list );
			
			storage.set( result.list, operatorAbsen.nama );
		
		};
		
		rest.call( '/operator', null, 'GET', onSuccess, message.error );

	},

	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = operatorAbsen;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.username + '</td>' +
					'<td>' + tmp.password + '</td>' +
					'<td>' + tmp.tipe + '</td>' +
					'<td>' + tmp.lokasi + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="operatorAbsen.content.setDetail(' + tmp.username	 + ')" data-toggle="modal" data-target="#modal-form-operator">Detail</button>' +
					'<button type="button" class="btn btn-danger" onclick="">Hapus</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/operator.html' );
			
		},

		getObject: function() {
		
			var object = operatorAbsen.currentObject;
			
			if ( !object )
				object = choose( null, operatorAbsen.defaultObject);

			object.username = $( '#form-operator-username' ).val();
			object.password = $( '#form-operator-password' ).val();
			object.tipe = $( '#form-operator-tipe' ).val();
			object.lokasi = $( '#form-operator-lokasi' ).val();
			object.deskripsi = $( '#form-operator-deskripsi' ).val();
			
				
			return object;
		
		},

		setDetail: function( username ) {

			var obj = storage.getByUsername( operatorAbsen, username );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-operator-username' ).val( obj.username );
			$( '#form-operator-password' ).val( obj.password );
			$( '#form-operator-tipe' ).val( obj.tipe );
			$( '#form-operator-lokasi' ).val( obj.lokasi );
			$( '#form-operator-deskripsi' ).val( obj.deskripsi );
			
			operatorAbsen.currentObject = obj;
		
		},		
	},
	
	loader: {
	
		loadByUsername: function( username ) {
		
			var url = '/operatorAbsen/' + username;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.load( list );
				
			};
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		},
		
		loadByTipe: function( tipe ) {
			
			var url = '/operatorAbsen/tipe/' + tipe;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		},
		
		loadByLokasi: function( lokasi ) {
			
			var url = '/operatorAbsen/lokasi/' + lokasi;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.content.setRekapBarangHabis( list );
				
			};
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		}
	}
};

/*
 * Definisi resources untuk absen.
 * Sangat tergantung pada variable page (api.js).
 */
var absen = {

	nama: 'ABSEN',
	
	searchBy: '',
	
	defaultObject: {
		pegawai: {
			nip: '',
			nama: '',
			golongan: '',
			jabatan: '',
			skpd: '',
			bagian: ''
		},
		status: '',
		tanggalStr: '',
		penginput: {
			username: ''
		},
		pengubah: {
			username: ''
		},
		waktuAbsen: {
			pagiStr: '',
			tengahStr: '',
			siangStr: '',
			soreStr: ''
		}
	},
	
	currentObject: null,

	success: function ( result ) {

		message.writeLog( 'Writing Message' ); // DEBUG
		message.success( result );
		
		message.writeLog( 'Reloading Absen' ); // DEBUG
		absen.reload();

		absen.currentObject = null;

	},

	load: function( list ) {

		page.setName( absen.nama );
		
		absen.content.getContent();
		
		absen.content.setData( list );
		
	},
	
	reload: function() {
		
		var onSuccess = function( result ) {
		
			absen.load( result.list );
			
			storage.set( result.list, absen.nama );
		
		};
		
		rest.call( '/absen/tanggal/' + myDate.nowFormattedString(), null, 'GET', onSuccess, message.error );
		
	},

	loader: {

		loadByNip: function( nip, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {

				var list = page.list.get( result );
				absen.load( list );
				
			};
		
			var url = '/absen/pegawai/' + nip + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, obj, 'GET', onSuccess, message.error );
			
		},

		loadBySkpd: function( skpd, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				absen.load( list );
				
			};
			
			var url = '/absen/skpd/' + skpd + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		},

		loadByBagian: function( skpd, bagian, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				absen.load( list );
				
			};
			
			var url = '/absen/bagian/' + bagian + '/' + skpd + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		}

	},

	content: {

		getContent: function() {

			page.load( $( '#content' ), 'html/absen.html' );
			
		},

		getObject: function() {
		
			var object = absen.currentObject;
			
			if ( !object )
				object = choose( null, absen.defaultObject );
			
			return object;
			
		},

		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = absen;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];
				
				message.writeLog( 'Keterangan :' + tmp.keterangan ); // DEBUG

				html += '<tr>' +
					'<td>' + tmp.pegawai.nip + '</td>' +
					'<td>' + tmp.pegawai.nama + '</td>' +
					'<td>' + tmp.pegawai.skpd + '</td>' +
					'<td>' + tmp.pegawai.bagian + '</td>' +
					'<td>' + tmp.status + '</td>' +
					'<td>' + tmp.pagiStr + '</td>' +
					'<td>' + tmp.tengahStr + '</td>' +
					'<td>' + tmp.siangStr + '</td>' +
					'<td>' + tmp.soreStr + '</td>' +
					'<td>' + ( tmp.keterangan != null ? tmp.keterangan : '' ) + '</td>' +
					'</tr>';
			}
			
			page.change( $( '#table' ), html );
			
		},

		setDetail: function( id ) {

			message.writeLog( 'Tidak didukung' );
			//var obj = storage.getById( absen, id );

			//this.resetForm( obj );

		},
	
		resetForm: function( obj ) {
			message.writeLog( 'Tidak didukung' );
		}
		
	}
	
};

/*
 * Definisi resources untuk otentikasi.
 * Sangat tergantung pada variable page (api.js).
 */
var otentikasi = {

	nama: 'OTENTIKASI',
	
	searchBy: '',

	currentObject: null,
	
	defaultObject: {
		id: 0,
	},

	success: function ( result ) {

		message.success( result );

		otentikasi.reload();
		
		otentikasi.currentObject = null;

	},

	load: function( list ) {

		page.setName( otentikasi.nama );
		
		otentikasi.content.getContent();
		
		otentikasi.content.setData( list );
		
	},
	
	reload: function() {
		
		var onSuccess = function( result ) {
		
			otentikasi.load( result.list );
			
			storage.set( result.list, otentikasi.nama );

			page.change( $( '#list-otentikasi' ), page.list.option.generateFromStorage( otentikasi.nama ) );
		
		};
		
		var url = '/otentikasi/perusahaan.php';

		rest.call( url, '', 'POST', onSuccess, message.error );

	},
	
	content: {
		 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = otentikasi;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + ( ( tmp.parent != null && tmp.parent != undefined ) ? tmp.parent.nama : '' )+ '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="otentikasi.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-otentikasi">Detail</button>' +
					'<button type="button" class="btn btn-danger" onclick="">Hapus</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );
				
		},

		getContent: function( ) {

			page.load( $( '#content' ), 'html/otentikasi.html' );
			
		},

		getObject: function() {
		
			var object = otentikasi.currentObject;
			
			if ( !object )
				object = choose( null, otentikasi.defaultObject);
				
			object.parent = storage.getByNama( otentikasi, $( '#form-otentikasi-parent' ).val() );
			object.nama = $( '#form-otentikasi-nama' ).val();
			
			return object;
			
		},

		setDetail: function( id ) {

			var obj = storage.getById( otentikasi, id );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-otentikasi-parent' ).val( ( ( obj.parent != null && obj.parent != undefined ) ? obj.parent.nama : '' ) );
			$( '#form-otentikasi-nama' ).val( obj.nama );

			otentikasi.currentObject = obj;
		
		}
			
	},
	
	loader: {
		
		loadByIdParent: function( id ) {
		
			var _parent = storage.getById( otentikasi, id );

			this.loadByParent( _parent );
			
		},
		
		loadByParent: function( _parent ) {
		
			var url = '/otentikasi/parent.php';

			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				otentikasi.load( list );
				
			};
			
			rest.call( url, _parent, 'POST', onSuccess, message.error );
			
		},

		loadByNama: function( nama ) {
			
			var url = '/otentikasi/nama.php';
			var obj = { nama: nama };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				otentikasi.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		}
	}

};

/*
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
		skpd: '',
		bagian: ''
	},
	
	currentObject: null,

	listRole: [ { nama: 'OWNER'}, { nama: 'MANAGER'}, { nama: 'operatorAbsen'} ],
	
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
					'<td>' + tmp.skpd + '</td>' +
					'<td>' + tmp.bagian + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="pegawai.content.setDetail(' + tmp.nip + ')" data-toggle="modal" data-target="#modal-form-pegawai">Detail</button>' +
					'<button type="button" class="btn btn-danger" onclick="">Hapus</button>' +
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
			object.skpd = $( '#form-pegawai-skpd' ).val();
			object.bagian = $( '#form-pegawai-bagian' ).val();
			
			return object;
		},
		
		setDetail: function( nip ) {

			var obj = storage.getByNip( pegawai, nip );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-pegawai-nip' ).val( obj.nip );
			$( '#form-pegawai-nama' ).val( obj.nama );
			$( '#form-pegawai-golongan' ).val( obj.golongan );
			$( '#form-pegawai-jabatan' ).val( obj.jabatan );
			$( '#form-pegawai-skpd' ).val( obj.skpd );
			$( '#form-pegawai-bagian' ).val( obj.bagian );

			pegawai.currentObject = obj;
		
		}

	},
	
	loader: {

		loadByIdabsen: function( id ) {
		
			var _absen = storage.getById( absen, id );
			
			this.loadByabsen( _absen );
		},
		
		loadByabsen: function( _absen ) {
		
			var url = '/pegawai/absen.php';
			
			var onSuccess = function( result ) {

				var list = page.list.get( result );
				pegawai.load( list );
					
			};

			rest.call( url, _absen, 'POST', onSuccess, message.error );
			
		},
		
		loadByKode: function( kode ) {
		
			var url = '/pegawai/kode.php';
			var obj = { kode: kode };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				pegawai.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		},
		
		loadByNama: function( nama ) {
			
			var url = '/pegawai/nama.php';
			var obj = { nama: nama };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				pegawai.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		}
	
	}
	
};

/*
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

