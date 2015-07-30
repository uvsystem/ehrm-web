/**
 * eHRM-Controller.js
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

 $( document ).ready( function () {

	if ( operator.isLogin() == false ) {
		
		window.location.href = 'login.html';
		return;
		
	}
	
	if ( operator.getTokenString == '********' && operator.getPegawai() ) {
		
		if ( ( operator.getRole() != 'ADMIN' && operator.getRole() != 'PEGAWAI' ) ) {
			
			message.write( 'Maaf, anda tidak bisa mengakses halaman ini' );
			message.writeLog( 'Maaf, anda tidak bisa mengakses halaman ini' ); // LOG
			
			//window.location.href = 'login.html';
			return;
			
		}
		
	}
	
	storage.reset();

	page.change( $( '#operator-nama' ), operator.getUsername() );
	page.setName( 'HOME' );
	
	navigation( operator.getUsername() == 'ADMIN' ? 'ADMIN' : operator.getRole() );
	menu( operator.getUsername() == 'ADMIN' ? 'ADMIN' : operator.getRole() );

	$( function () {
	
		$( '[ data-toggle = "tooltip" ]' ).tooltip();
	  
	} );

	
	
	// Menu Handlers
	$( document ).on( 'click', '#menu-skpd', function() {

		page.change( $( '#message' ), '');
		unitKerjaDomain.reload();

	} );

	$( document ).on( 'click', '#menu-pegawai', function() {
		
		page.change( $( '#message' ), '');
		pegawai.reload();

	} );

	$( document ).on( 'click', '#menu-rekap', function() {
		
		page.change( $( '#message' ), '');
		rekap.reload();
		
	} );

	$( document ).on( 'click', '#menu-absensi', function() {
		
		page.change( $( '#message' ), '');
		absenDomain.reload();

	} );

	$( document ).on( 'click', '#menu-sppd', function() {
		
		page.change( $( '#message' ), '');
		sppdDomain.reload();

	} );


	
	// Navigation Handlers
	$( document ).on( 'click', '#nav-user', function() {

		user.load();

	} );

	$( document ).on( 'click', '#nav-home', function() {
		
		var todo;
		
		if ( operator.getRole() == 'ADMIN' ) {

			todo = home.load;
		
		} else if ( operator.getRole() == 'PEGAWAI' ) {
			
			todo = absenDomain.reload;
			
		}
		
		todo();

	} );

	$( document ).on( 'click', '#nav-logout', function() {
		
		rest.logout();

	} );

	$( document ).on( 'click', '#nav-operator', function() {

		operatorAbsen.reload();

	} );

	$( document ).on( 'click', '#nav-pegawai', function() {
		
		pegawai.reload();

	} );

	$( document ).on( 'click', '#nav-otentikasi', function() {
		
		message.write("Maaf, belum tersedia");
		//otentikasi.reload();
		
	} );

	$( document ).on( 'click', '#nav-absensi', function() {
		
		absenDomain.reload();

	} );

	
	
	// Table Handler
	$( document ).on( 'click', '#prev', function() {
	
		var pageNumber = $( '#pageNumber' ).text();
		var previousPage = parseInt( pageNumber  ) - 1;
		
		if ( previousPage < 1 )
			previousPage = 1;
		
		activeContainer.content.setData( activeContainer.list, previousPage );
	
		page.change( $( '#pageNumber' ), previousPage );
		
	} );
	
	$( document ).on( 'click', '#next', function() {
	
		var pageNumber = $( '#pageNumber' ).text();
		var nextPage = parseInt( pageNumber ) + 1;

		var lastPage = activeContainer.list.length / set;
		if ( nextPage > lastPage ) {
			nextPage = Math.floor( lastPage );
			
			if ( ( nextPage * set ) < activeContainer.list.length )
				nextPage = nextPage + 1;
			
		}

		activeContainer.content.setData( activeContainer.list, nextPage );
	
		page.change( $( '#pageNumber' ), nextPage );
		
	} );

	
	
	// SKPD Handler
	$( document ).on( 'click', '#btn-unitKerjaDomain-tambah', function() {
	
		$( '#form-unitKerjaDomain-kode' ).val( '' );
		$( '#form-unitKerjaDomain-nama' ).val( '' );

	} );
	
	$( document ).on( 'click', '#btn-simpan-unitKerjaDomain', function() {

		var object = unitKerjaDomain.content.getObject();

		rest.call( '/unitKerjaDomain', object, 'POST', unitKerjaDomain.success, message.error );
		
		unitKerjaDomain.currentObject = null;

	} );
	
	// Bagian Handler
	$( document ).on( 'click', '#btn-bagian-tambah', function() {
	
		$( '#form-bagian-kode' ).val( '' );
		$( '#form-bagian-nama' ).val( '' );
		$( '#form-bagian-unitKerjaDomain' ).val( '' );

		page.change( $( '#list-unitKerjaDomain' ), page.list.option.generateFromStorage( unitKerjaDomain.nama ) );
		
	} );
	
	$( document ).on( 'click', '#btn-simpan-bagian', function() {

		var object = bagian.content.getObject();

		rest.call( '/bagian', object, 'POST', bagian.success, message.error );
		
		bagian.currentObject = null;

	} );



	// Absen handler.
	$( document ).on( 'click', '#btn-absenDomain-tambah', function() {
		
		$( '#form-absenDomain-nip' ).val( '' );
		$( '#form-absenDomain-tanggal' ).val( '' );
		$( '#form-absenDomain-pagi' ).val( '7:30' );
		$( '#form-absenDomain-tengah' ).val( '11:30' );
		$( '#form-absenDomain-siang' ).val( '13:00' );
		$( '#form-absenDomain-sore' ).val( '16:00' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );
	
	$( document ).on( 'click', '#btn-absenDomain-simpan', function() {
		
		var nip = $( '#form-absenDomain-nip' ).val();
		
		var loadPegawai = function( result ) {
			
			if ( result.tipe == 'ENTITY' ) {

				var _pegawai = result.object;
			
				var tanggal = myDate.fromDatePicker( $( '#form-absenDomain-tanggal' ).val() );
				var pagi = $( '#form-absenDomain-pagi' ).val();
				var tengah = $( '#form-absenDomain-tengah' ).val();
				var siang = $( '#form-absenDomain-siang' ).val();
				var sore = $( '#form-absenDomain-sore' ).val();
				
				var _absen = {
					pegawai: _pegawai,
					tanggal: myDate.toFormattedString( tanggal ),
					pagi: pagi,
					tengah: tengah,
					siang: siang,
					sore: sore
				};
				
				rest.call( '/absenDomain', _absen, 'POST', absenDomain.success, message.error );
			}
		};
		
		rest.call( '/pegawai/' + nip, {}, 'GET', loadPegawai, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absenDomain-sakit', function() {
	
		$( '#form-absenDomain-sakit-nip' ).val( '' );
		$( '#form-absenDomain-sakit-tanggal' ).val( '' );
		$( '#form-absenDomain-sakit-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absenDomain-sakit-simpan', function() {
		
		var nip = $( '#form-absenDomain-sakit-nip' ).val();
		var keterangan = $( '#form-absenDomain-sakit-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absenDomain-sakit-tanggal' ).val() );
		
		var url = '/absenDomain/sakit/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absenDomain.success, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absenDomain-izin', function() {
	
		$( '#form-absenDomain-izin-nip' ).val( '' );
		$( '#form-absenDomain-izin-tanggal' ).val( '' );
		$( '#form-absenDomain-izin-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absenDomain-izin-simpan', function() {
		
		var nip = $( '#form-absenDomain-izin-nip' ).val();
		var keterangan = $( '#form-absenDomain-izin-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absenDomain-izin-tanggal' ).val() );
		
		var url = '/absenDomain/izin/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absenDomain.success, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absenDomain-cuti', function() {
	
		$( '#form-absenDomain-cuti-nip' ).val( '' );
		$( '#form-absenDomain-cuti-tanggal' ).val( '' );
		$( '#form-absenDomain-cuti-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absenDomain-cuti-simpan', function() {
		
		var nip = $( '#form-absenDomain-cuti-nip' ).val();
		var keterangan = $( '#form-absenDomain-cuti-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absenDomain-cuti-tanggal' ).val() );
		
		var url = '/absenDomain/cuti/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absenDomain.success, message.error );
		
	} );
	
	$( document ).on( 'change', '#absenDomain-unitKerjaDomain', function() {
		
		var namaSkpd = $( '#absenDomain-unitKerjaDomain' ).val();
		var _skpd = storage.getByNama( unitKerjaDomain, namaSkpd );
		
		var onSuccess = function( result ) {
			
			if ( result.tipe == 'LIST' )
				page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/unitKerjaDomain/' + _skpd.id, { }, 'GET', onSuccess, message.error );		
		
	} );
	
	$( document ).on( 'click', '#absenDomain-cari', function() {
		
		var namaBagian = $( '#absenDomain-bagian' ).val();
		var namaSkpd = $( '#absenDomain-unitKerjaDomain' ).val();
		var tanggalAwal = myDate.fromDatePicker( $( '#absenDomain-tanggal-awal' ).val() );
		var tanggalAkhir = myDate.fromDatePicker( $( '#absenDomain-tanggal-akhir' ).val() );

		if ( namaBagian || namaBagian != '' ) {

			var _bagian = storage.getByNama( bagian, namaBagian );
		
			rest.call( '/absenDomain/bagian/' + _bagian.id + '/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absenDomain.success, message.error );		
			
		} else if ( namaSkpd || namaSkpd != '' ) {

			var _skpd = storage.getByNama( unitKerjaDomain, namaSkpd );
				
			rest.call( '/absenDomain/unitKerjaDomain/' + _skpd.id + '/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absenDomain.success, message.error );		
			
		} else {
				
			rest.call( '/absenDomain/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absenDomain.success, message.error );		
			
		}
	} );

	$( document ).on( 'change', '#form-absenDomain-nip', function() {
		
		var nip = $( '#form-absenDomain-nip' ).val();
		
		var tmp = pegawai.getByNip( nip );
		
		$( '#form-absenDomain-nama' ).val( tmp.nama );
		
	} );


	// Otentikasi handler.
	$( document ).on( 'click', '#btn-kategori-tambah', function() {

		kategori.currentObject = choose( null, kategori.defaultObject );
		kategori.content.resetForm( kategori.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-kategori', function() {

		var object = kategori.content.getObject();
		var url = '/kategori/simpan.php';

		if ( object.id == 0 )
			url = '/kategori/baru.php';

		rest.call( url, object, 'POST', kategori.success, message.error );

		kategori.currentObject = null;
		
	} );


	
	// Operator handler.
	$( document ).on( 'click', '#btn-operator-tambah', function() {

		operatorAbsen.currentObject = choose( null, operatorAbsen.defaultObject );
		operatorAbsen.content.resetForm( operatorAbsen.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-operator', function() {

		var object = operatorAbsen.content.getObject();

		rest.call( '/operator', object, 'POST', operatorAbsen.success, message.error );
		
		operatorAbsen.currentObject = null;

	} );

	
	
	// Pegawai handler(s).
	$( document ).on( 'click', '#btn-pegawai-tambah', function() {

		pegawai.currentObject = choose( null, pegawai.defaultObject );
		pegawai.content.resetForm( pegawai.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-pegawai', function() {

		var object = pegawai.content.getObject();

		rest.call( '/pegawai', object, 'POST', pegawai.success, message.error );
		
		pegawai.currentObject = null;
		
	} );
	
	$( document ).on( 'change', '#form-pegawai-unitKerjaDomain', function() {
		
		var namaSkpd = $( '#form-pegawai-unitKerjaDomain' ).val();
		var _skpd = storage.getByNama( unitKerjaDomain, namaSkpd );
		
		var onSuccess = function( result ) {
		
			page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/unitKerjaDomain/' + _skpd.id, {}, 'GET', onSuccess, message.error );
	} );
	
	
	
	// Cari Handler.
	$( document ).on( 'focus', '#search', function() {
	
		$( '#search' ).attr( 'placeholder', 'Masukan Kata Kunci' );
		page.change( $( '#table' ), '' );
		
	} );
	
	$( document ).on( 'blur', '#search', function() {
	
		$( '#search' ).attr( 'placeholder', 'Cari...' );
		$( '#search' ).val( '' );
		
	} );
	
	$( document ).on( 'change', '#search', function() {
	
		var kataKunci = $( '#search' ).val();
		var halaman = page.getName();
		
		if ( !halaman )
			throw new Error( 'Nama halaman belum di atur' );
		
		if ( halaman == pegawai.nama ) {
		
			pegawai.loader.loadSearch( kataKunci );
			
		} else if ( halaman == operatorAbsen.nama ) {
		
			operatorAbsen.loader.loadSearch( kataKunci );
			
		} else if ( halaman == otentikasi.nama ) {
		
			otentikasi.loader.loadSearch( kataKunci );
			
		} else if ( halaman == absenDomain.nama ) {
		
			absenDomain.loader.loadSearch( kataKunci );
			
		} else if ( halaman == unitKerjaDomain.nama ) {
		
			unitKerjaDomain.loader.loadSearch( kataKunci );
			
		} else if ( halaman == bagian.nama ) {
		
			bagian.loader.loadSearch( kataKunci );
			
		} else {

			throw new Error( 'Nama halaman tidak terdaftar : ' + halaman );
			
		}
	} );
	
	// Rekap Handler
	$( document ).on( 'click', '#btn-rekap-bagian', function() {

		var listSkpd = storage.get( unitKerjaDomain.nama );
		var listBagian = storage.get( bagian.nama );
		
		page.change( $( '#list-unitKerjaDomain' ), page.list.option.generate( listSkpd ) );
		page.change( $( '#list-bagian' ), page.list.option.generate( listBagian ) );

		$( '#form-bagian-unitKerjaDomain' ).val( '' );
		$( '#form-bagian-bagian' ).val( '' );
	});
	
	$( document ).on( 'click', '#btn-rekap-unitKerjaDomain', function() {

		var listSkpd = storage.get( unitKerjaDomain.nama );
		page.change( $( '#list-unitKerjaDomain' ), page.list.option.generate( listSkpd ) );
		
		$( '#form-unitKerjaDomain-unitKerjaDomain' ).val( '' );
	});
	
	$( document ).on( 'change', '#form-bagian-unitKerjaDomain', function() {

		var namaSkpd = $( '#form-bagian-unitKerjaDomain' ).val();
		var _skpd = storage.getByNama( unitKerjaDomain, namaSkpd );
		
		var onSuccess = function( result ) {
			
			if ( result.tipe == 'LIST' )
				page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/unitKerjaDomain/' + _skpd.id, { }, 'GET', onSuccess, message.error );		
		
	});
	
	$( document ).on( 'click', '#btn-cetak-rekap-bagian', function() {

		var namaBagian = $( '#form-bagian-bagian' ).val();
		var tanggalAwal = $( '#form-bagian-tanggal-awal' ).val();
		var tanggalAkhir = $( '#form-bagian-tanggal-akhir' ).val();

		var formattedAwal = myDate.fromDatePicker( tanggalAwal );
		var formattedAkhir = myDate.fromDatePicker( tanggalAkhir );

		var _bagian = storage.getByNama( bagian, namaBagian );
		var firstDate = myDate.toFormattedString( formattedAwal );
		var lastDate = myDate.toFormattedString( formattedAkhir );
		
		printer.submitPost( '/pegawai/print/rekap/bagian/' + _bagian.id + '/' + firstDate + '/' + lastDate, [], 'GET' );	
		
	});
	
	$( document ).on( 'click', '#btn-cetak-rekap-skpd', function() {

		var namaSkpd = $( '#form-skpd-skpd' ).val();
		var tanggalAwal = $( '#form-skpd-tanggal-awal' ).val();
		var tanggalAkhir = $( '#form-skpd-tanggal-akhir' ).val();

		var formattedAwal = myDate.fromDatePicker( tanggalAwal );
		var formattedAkhir = myDate.fromDatePicker( tanggalAkhir );
		
		var _skpd = storage.getByNama( unitKerjaDomain, namaSkpd );
		var firstDate = myDate.toFormattedString( formattedAwal );
		var lastDate = myDate.toFormattedString( formattedAkhir );
		
		printer.submitPost( '/pegawai/print/rekap/skpd/' + _skpd.id + '/' + firstDate + '/' + lastDate, [], 'GET' );	
		
	});
	
	// Alert auto-close
	$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
	$("#warning-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
	$("#error-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
} );

function navigation( role ) {
	if ( role == "ADMIN" ) {
		
		alert( 'admin' );
		
	} else if ( role == "OPERATOR" ) {
		
		alert( 'operator' );

	} else {
		throw new Error( "Role: '" + role + "' is unknown" );
	}
};

function menu( role ) {
	if ( role == "ADMIN" ) {
		
		alert( 'admin' );
		
	} else if ( role == "OPERATOR" ) {
		
		alert( 'operator' );

	} else {
		throw new Error( "Role: '" + role + "' is unknown" );
	}
};
