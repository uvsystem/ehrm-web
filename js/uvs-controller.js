/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.1.0
 */

 $( document ).ready( function () {

	if ( operator.isLogin() == false ) {
		
		window.location.href = 'login.html';
		return;
		
	}
	
	if ( operator.getRole() != 'ADMIN' && operator.getRole() != 'PEGAWAI' ) {
		
		message.write( 'Maaf, anda tidak bisa mengakses halaman ini' );
		
		window.location.href = 'login.html';
		return;
		
	}
	
	page.content.navigation.set();
	page.content.menu.set();
	page.content.home.set();

	//storage.reset();

	page.change( $( '#operator-nama' ), operator.getUsername() );

	$( function () {
	
		$( '[ data-toggle = "tooltip" ]' ).tooltip();
	  
	} );

	
	
	// Menu Handlers
	$( document ).on( 'click', '#menu-operator', function() {

		operatorAbsen.reload();

	} );

	$( document ).on( 'click', '#menu-pegawai', function() {
		
		pegawai.reload();

	} );

	$( document ).on( 'click', '#menu-otentikasi', function() {
		
		message.write("Maaf, belum tersedia");
		//otentikasi.reload();
		
	} );

	$( document ).on( 'click', '#menu-absensi', function() {
		
		absen.reload();

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
			
			todo = absen.reload;
			
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
		
		absen.reload();

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

	
	
	// Absen handler.
	$( document ).on( 'click', '#btn-absen-pagi', function() {
		
		$( '#form-absen-pagi-nip' ).val( '' );
		$( '#form-absen-pagi-jam' ).val( '' );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-pagi-simpan', function() {
		
		message.writeLog( 'Processing Absen Pagi' ); // DEBUG
		
		var nip = $( '#form-absen-pagi-nip' ).val();
		var jam = $( '#form-absen-pagi-jam' ).val();
		
		var url = '/absen/pagi/' + nip + '/' + jam;
		
		rest.call( url, {}, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-tengah', function() {
		
		$( '#form-absen-tengah-nip' ).val( '' );
		$( '#form-absen-tengah-jam' ).val( '' );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-tengah-simpan', function() {
		
		message.writeLog( 'Processing Absen Tengah' ); // DEBUG
		
		var nip = $( '#form-absen-tengah-nip' ).val();
		var jam = $( '#form-absen-tengah-jam' ).val();
		
		var url = '/absen/tengah/' + nip + '/' + jam;
		
		rest.call( url, {}, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-siang', function() {
		
		$( '#form-absen-siang-nip' ).val( '' );
		$( '#form-absen-siang-jam' ).val( '' );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-siang-simpan', function() {
		
		message.writeLog( 'Processing Absen Siang' ); // DEBUG
		
		var nip = $( '#form-absen-siang-nip' ).val();
		var jam = $( '#form-absen-siang-jam' ).val();
		
		var url = '/absen/siang/' + nip + '/' + jam;
		
		rest.call( url, {}, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-sore', function() {
		
		$( '#form-absen-sore-nip' ).val( '' );
		$( '#form-absen-sore-jam' ).val( '' );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-sore-simpan', function() {
		
		message.writeLog( 'Processing Absen Sore' ); // DEBUG
		
		var nip = $( '#form-absen-sore-nip' ).val();
		var jam = $( '#form-absen-sore-jam' ).val();
		
		var url = '/absen/sore/' + nip + '/' + jam;
		
		rest.call( url, {}, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-sakit', function() {
	
		$( '#form-absen-sakit-nip' ).val( '' );
		$( '#form-absen-sakit-keterangan' ).val( '' );
		
	} );

	$( document ).on( 'click', '#btn-absen-sakit-simpan', function() {
		
		var nip = $( '#form-absen-sakit-nip' ).val();
		var keterangan = $( '#form-absen-sakit-keterangan' ).val();
		
		var url = '/absen/sakit/' + nip;
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-izin-simpan', function() {
		
		var nip = $( '#form-absen-izin-nip' ).val();
		var keterangan = $( '#form-absen-izin-keterangan' ).val();
		
		var url = '/absen/izin/' + nip;
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
	} );

	$( document ).on( 'click', '#btn-absen-cuti-simpan', function() {
		
		var nip = $( '#form-absen-cuti-nip' ).val();
		var keterangan = $( '#form-absen-cuti-keterangan' ).val();
		
		var url = '/absen/cuti/' + nip;
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
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
	
	
	
	// Cari Handler.
	$( document ).on( 'focus', '#search', function() {
	
		$( '#search' ).attr( 'placeholder', 'Masukan Kata Kunci' );
		
	} );
	
	$( document ).on( 'blur', '#search', function() {
	
		$( '#search' ).attr( 'placeholder', 'Cari...' );
		
	} );
	
	$( document ).on( 'change', '#search', function() {
	
		var kataKunci = $( '#search' ).val();
		var halaman = page.getName();
		
		if ( !name )
			throw new Error( 'Nama halaman belum di atur' );
		
		if ( halaman == pegawai.nama ) {
		
			message.writeLog( 'Cari pegawai' );
			
		} else if ( halaman == operator.nama ) {
		
			message.writeLog( 'Cari operator' );
			
		} else if ( halaman == otentikasi.nama ) {
		
			message.writeLog( 'Cari otentikasi' );
			
		} else if ( halaman == absen.nama ) {
		
			message.writeLog( 'Cari absen' );
			
		} else {
		
			throw new Error( 'Nama halaman tidak terdaftar' );
			
		}
	} );
} );
