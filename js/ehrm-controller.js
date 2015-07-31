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

var restAdapter = rest( 'http://localhost:8080', 'ehrm' );
 
$( document ).ready( function () {

	if ( operator.isLogin() == false ) {
		
		window.location.href = 'login.html';
		return;
		
	}
	
	if ( operator.getTokenString == '********' && operator.getPegawai() ) {
		
		if ( ( operator.getRole() != 'ADMIN' && operator.getRole() != 'PEGAWAI' ) ) {
			
			message.write( 'Maaf, anda tidak bisa mengakses halaman ini' );
			message.writeLog( 'Maaf, anda tidak bisa mengakses halaman ini' ); // LOG
			
			window.location.href = 'login.html';
			return;
			
		}
		
	}
	
	storage.reset();

	page.change( $( '#operator-nama' ), operator.getName() );
	page.setName( 'HOME' );
	
	message.writeLog( operator.getUsername() );
	var navDef = navigation( operator.getUsername() == 'superuser' ? 'ADMIN' : operator.getRole() );
	page.change( $( '#nav-menu' ), navDef );

	$( function () {
	
		$( '[ data-toggle = "tooltip" ]' ).tooltip();
	  
	} );

	
	
	// Menu Handlers
	$( document ).on( 'click', '#menu-skpd', function() {

		page.change( $( '#message' ), '');
		unitKerjaDomain.reload();

	} );

	$( document ).on( 'click', '#menu-jabatan', function() {

		page.change( $( '#message' ), '');
		jabatanDomain.reload();

	} );

	$( document ).on( 'click', '#menu-pegawai', function() {
		
		page.change( $( '#message' ), '');
		pegawaiDomain.reload();

	} );

	$( document ).on( 'click', '#menu-kalendar', function() {
		
		page.change( $( '#message' ), '');
		kalendarDomain.reload();

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
	$( document ).on( 'click', '#btn-skpd-tambah', function() {
	
		page.change( $( '#unitkerja-list' ), page.list.dataList.generateFromStorage( unitKerjaDomain.nama, 'unitkerja-list' ) );
		
		$( '#form-skpd-parent' ).val( '' );
		$( '#form-skpd-kode' ).val( '' );
		$( '#form-skpd-nama' ).val( '' );
		
		unitKerjaDomain.currentId = 0;

	} );
	
	$( document ).on( 'click', '#btn-simpan-skpd', function() {

		var id = unitKerjaDomain.currentId;
		var kode = $( '#form-skpd-kode' ).val();
		var nama = $( '#form-skpd-nama' ).val();
		var tipe = $( '#form-skpd-tipe' ).val();
		
		var onSuccess = function ( result ) {

			message.success( result );
			unitKerjaDomain.reload();

		};

		var namaParent = $( '#form-skpd-parent' ).val();
		if ( namaParent != '' ) {
			
			var parent = storage.getByNama( unitKerjaDomain, namaParent );
			var kodeParent = ( parent ? parent.singkatan : '' );

			unitKerjaRestAdapter.addSubUnit( kodeParent, id, nama, tipe, kode, onSuccess);
			
		} else {

			unitKerjaRestAdapter.save( id, nama, tipe, kode, onSuccess);
		
		}
	} );

	$( document ).on( 'click', '#btn-hapus-skpd', function() {
		throw new Error( 'Not Yet Implemented' );
	} );


	// Absen handler.
	$( document ).on( 'click', '#btn-absen-tambah', function() {
		
		$( '#form-absen-nip' ).val( '' );
		$( '#form-absen-tanggal' ).val( '' );
		$( '#form-absen-pagi' ).val( '7:30' );
		$( '#form-absen-tengah' ).val( '11:30' );
		$( '#form-absen-siang' ).val( '13:00' );
		$( '#form-absen-sore' ).val( '16:00' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		page.change( $( '#list-nip' ), daftarNip );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-simpan', function() {
		
		var nip = $( '#form-absen-nip' ).val();
		
		var loadPegawai = function( result ) {
			
			if ( result.tipe == 'ENTITY' ) {

				var _pegawai = result.object;
			
				var tanggal = myDate.fromDatePicker( $( '#form-absen-tanggal' ).val() );
				var pagi = $( '#form-absen-pagi' ).val();
				var tengah = $( '#form-absen-tengah' ).val();
				var siang = $( '#form-absen-siang' ).val();
				var sore = $( '#form-absen-sore' ).val();
				
				var _absen = {
					pegawai: _pegawai,
					tanggal: myDate.toFormattedString( tanggal ),
					pagi: pagi,
					tengah: tengah,
					siang: siang,
					sore: sore
				};
				
				rest.call( '/absen', _absen, 'POST', absenDomain.success, message.error );
			}
		};
		
		rest.call( '/pegawai/' + nip, {}, 'GET', loadPegawai, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-sakit', function() {
	
		$( '#form-absen-sakit-nip' ).val( '' );
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
	
	$( document ).on( 'click', '#absen-cari', function() {
		
		var namaBagian = $( '#absen-bagian' ).val();
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
	
	
	// Pegawai handler(s).
	$( document ).on( 'click', '#btn-pegawai-tambah', function() {
			
		$( '#form-pegawai-nip' ).val( '' );
		$( '#form-pegawai-nik' ).val( '' );
		$( '#form-pegawai-nama' ).val( '' );
		$( '#form-pegawai-tanggal-lahir' ).val( '' );
		$( '#form-pegawai-password' ).val( '' );

		pegawaiDomain.currentId = 0;
		pegawaiDomain.currentIdPenduduk = 0;
		pegawaiDomain.currentIdUnitKerja = pegawaiDomain.idSekretariatDaerah();

	} );

	$( document ).on( 'click', '#btn-simpan-pegawai', function() {

		var idSatuanKerja = pegawaiDomain.currentIdUnitKerja;
		var id = pegawaiDomain.currentId;
		var idPenduduk = pegawaiDomain.currentIdPenduduk;
		var nip = $( '#form-pegawai-nip' ).val();
		var nik = $( '#form-pegawai-nik' ).val();
		var nama = $( '#form-pegawai-nama' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-pegawai-tanggal-lahir' ).val() );
		var tanggalLahir = myDate.toFormattedString( tanggal );
		var password = $( '#form-pegawai-password' ).val();
		
		if ( !password )
			password = 'password';

		pegawaiRestAdapter.save( idSatuanKerja, id, nip, password, nik, nama, tanggalLahir, '', '', idPenduduk, pegawaiDomain.success );
	} );
	
	$( document ).on( 'click', '#btn-simpan-mutasi', function() {
		
		var pegawai = storage.getById( pegawaiDomain, pegawaiDomain.currentId );
		var nip = pegawai.nip;
		
		var namaUnitKerja = $( '#form-mutasi-unit-kerja' ).val();
		var unitKerja = storage.getByNama( unitKerjaDomain, namaUnitKerja );
		var kode = unitKerja.singkatan;

		pegawaiRestAdapter.mutasi( nip, kode, pegawaiDomain.success );
	} );
	
	$( document ).on( 'click', '#btn-simpan-promosi-pangkat', function() {
		
		var pegawai = storage.getById( pegawaiDomain, pegawaiDomain.currentId );
		var nip = pegawai.nip;
		var pangkat = $( '#form-promosi-pangkat-pangkat' ).val();
		var nomorSk = $( '#form-promosi-pangkat-nomor-sk' ).val();
		var tanggalMulai = myDate.fromDatePicker( $( '#form-promosi-pangkat-tanggal-mulai' ).val() );
		tanggalMulai = tanggalMulai.getFormattedString();
		var tanggalSelesai = $( '#form-promosi-pangkat-tanggal-selesai' ).val();
		if ( tanggalSelesai )
			tanggalSelesai = myDate.fromDatePicker( tanggalSelesai ).getFormattedString();

		pegawaiRestAdapter.promosiPangkat( nip, pangkat, nomorSk, tanggalMulai, tanggalSelesai, pegawaiDomain.success );
	} );
	
	$( document ).on( 'click', '#btn-simpan-promosi-jabatan', function() {
		
		var pegawai = storage.getById( pegawaiDomain, pegawaiDomain.currentId );
		var nip = pegawai.nip;
		var jabatan = storage.getByNama( jabatanDomain, $( '#form-promosi-jabatan-jabatan' ).val() );
		var nomorSk = $( '#form-promosi-jabatan-nomor-sk' ).val();
		var tanggalMulai = myDate.fromDatePicker( $( '#form-promosi-jabatan-tanggal-mulai' ).val() );
		tanggalMulai = tanggalMulai.getFormattedString();
		var tanggalSelesai = $( '#form-promosi-jabatan-tanggal-selesai' ).val();
		if ( tanggalSelesai )
			tanggalSelesai = myDate.fromDatePicker( tanggalSelesai ).getFormattedString();

		pegawaiRestAdapter.promosiJabatan( nip, jabatan.id, nomorSk, tanggalMulai, tanggalSelesai, pegawaiDomain.success );
	} );

	$( document ).on( 'change', '#text-pegawai-satuan-kerja', function() {
		var satker = storage.getByNama( unitKerjaDomain, $( '#text-pegawai-satuan-kerja' ).val() );
		
		pegawaiRestAdapter.findBySatker( satker.id, function( result ) {
			pegawaiDomain.load( result.list );
		});
	} );
	
	
	// Jabatan Handler
	$( document ).on( 'click', '#btn-jabatan-tambah', function() {

		$( '#form-jabatan-satuan-kerja' ).val( '' );
		$( '#form-jabatan-eselon' ).val( '' );
		$( '#form-jabatan-pangkat' ).val( '' );
		$( '#form-jabatan-nama' ).val( '' );

		jabatanDomain.currentId = 0;

	} );
	
	$( document ).on( 'click', '#btn-simpan-jabatan', function() {

		var satker = storage.getByNama( unitKerjaDomain, $( '#form-jabatan-satuan-kerja' ).val() );
		var id = jabatanDomain.currentId;
		var eselon = $( '#form-jabatan-eselon' ).val();
		var pangkat = $( '#form-jabatan-pangkat' ).val();
		var nama = $( '#form-jabatan-nama' ).val();

		jabatanRestAdapter.save( satker.id, id, eselon, pangkat, nama, function( result ) {
			message.success( result );
			jabatanDomain.reload();
		});
	} );

	$( document ).on( 'change', '#text-jabatan-satuan-kerja', function() {
		var satker = storage.getByNama( unitKerjaDomain, $( '#text-jabatan-satuan-kerja' ).val() );
		
		jabatanRestAdapter.findBySatker( satker.id, function( result ) {
			jabatanDomain.load( result.list );
		});
	} );

	
	// Kalendar Handler
	$( document ).on( 'click', '#btn-simpan-kalendar', function() {
		
		var tanggal = myDate.fromDatePicker( $( '#form-kalendar-tanggal' ).val() );
		kalendarRestAdapter.add( tanggal.getFormattedString(), function( result ) {
			message.success( result );
			kalendarDomain.reload();
		});
	} );
	
	$( document ).on( 'change', '#text-tanggal-awal', function() {
		var awalStr = $( '#text-tanggal-awal' ).val();
		var akhirStr = $( '#text-tanggal-akhir' ).val();
		
		message.writeLog( awalStr + ':' + akhirStr );
		
		var awal = awalStr ? myDate.fromDatePicker( awalStr ) : null;
		var akhir = akhirStr ? myDate.fromDatePicker( akhirStr ) : null;
		
		if ( awal && akhir && awal.isBefore( akhir ) ) {
			kalendarRestAdapter.findRange( awal.getFormattedString(), akhir.getFormattedString(), function( result ) {
				kalendarDomain.load( result.list );
			});
		}
	} );
	
	$( document ).on( 'change', '#text-tanggal-akhir', function() {
		var awalStr = $( '#text-tanggal-awal' ).val();
		var akhirStr = $( '#text-tanggal-akhir' ).val();

		message.writeLog( awalStr + ':' + akhirStr );
		
		var awal = awalStr ? myDate.fromDatePicker( awalStr ) : null;
		var akhir = akhirStr ? myDate.fromDatePicker( akhirStr ) : null;
		
		if ( awal && akhir && awal.isBefore( akhir ) ) {
			kalendarRestAdapter.findRange( awal.getFormattedString(), akhir.getFormattedString(), function( result ) {
				kalendarDomain.load( result.list );
			});
		}
	} );
	
	// Cari Handler.
	$( document ).on( 'focus', '#search', function() {
	
		$( '#search' ).attr( 'placeholder', 'Masukan Kata Kunci' );
		page.change( $( '#table' ), '' );
		page.change( $( '#message' ), '');
		
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
		
		if ( halaman == pegawaiDomain.nama ) {

			pegawaiRestAdapter.search( kataKunci, function( result ) {
				pegawaiDomain.load( result.list );
			});
			
		} else if ( halaman == unitKerjaDomain.nama ) {
		
			unitKerjaRestAdapter.search( kataKunci, function( result ) {
				unitKerjaDomain.load( result.list );
			});
			
		} else if ( halaman == jabatanDomain.nama ) {
		
			jabatanRestAdapter.search( kataKunci, function( result ) {
				jabatanDomain.load( result.list );
			});
			
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
		
		return '' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-skpd" href="#" data-toggle="tooltip" data-placement="right" title="Unit Kerja"><span class="glyphicon glyphicon-home big-icon"></span><b class="icon-text">Unit Kerja</b></a></li>' +
			'<li><a id="menu-jabatan" href="#" data-toggle="tooltip" data-placement="right" title="Jabatan"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Jabatan</b></a></li>' +
			'<li><a id="menu-pegawai" href="#" data-toggle="tooltip" data-placement="right" title="Pegawai"><span class="glyphicon glyphicon-user big-icon"></span><b class="icon-text">Pegawai</b></a></li>' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-sppd" href="#" data-toggle="tooltip" data-placement="right" title="SPPD"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">SPPD</b></a></li>' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-kalendar" href="#" data-toggle="tooltip" data-placement="right" title="Kalendar"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Kalendar</b></a></li>' +
			'<li><a id="menu-absensi" href="#" data-toggle="tooltip" data-placement="right" title="Absensi"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Absensi</b></a></li>' +
			'<li><a id="menu-rekap" href="#" data-toggle="tooltip" data-placement="right" title="Rekap"><span class="glyphicon glyphicon-briefcase big-icon"></span><b class="icon-text">Rekap</b></a></li>';

	} else if ( role == "OPERATOR" ) {
		
		return '' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-skpd" href="#" data-toggle="tooltip" data-placement="right" title="Unit Kerja"><span class="glyphicon glyphicon-home big-icon"></span><b class="icon-text">Unit Kerja</b></a></li>' +
			'<li><a id="menu-jabatan" href="#" data-toggle="tooltip" data-placement="right" title="Jabatan"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Jabatan</b></a></li>' +
			'<li><a id="menu-pegawai" href="#" data-toggle="tooltip" data-placement="right" title="Pegawai"><span class="glyphicon glyphicon-user big-icon"></span><b class="icon-text">Pegawai</b></a></li>' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-sppd" href="#" data-toggle="tooltip" data-placement="right" title="SPPD"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">SPPD</b></a></li>' +
			'<li class="divider"><hr /></li>' +
			'<li><a id="menu-kalendar" href="#" data-toggle="tooltip" data-placement="right" title="Kalendar"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Kalendar</b></a></li>' +
			'<li><a id="menu-absensi" href="#" data-toggle="tooltip" data-placement="right" title="Absensi"><span class="glyphicon glyphicon-calendar big-icon"></span><b class="icon-text">Absensi</b></a></li>' +
			'<li><a id="menu-rekap" href="#" data-toggle="tooltip" data-placement="right" title="Rekap"><span class="glyphicon glyphicon-briefcase big-icon"></span><b class="icon-text">Rekap</b></a></li>';

	} else {
		throw new Error( "Role: '" + role + "' is unknown" );
	}
};
