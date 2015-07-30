var restAdapter = rest( 'http://localhost:8080', 'ehrm' );

$( document ).ready( function () {
	
	$( '#btn-login' ).click( function () {
	
		var username = $( '#username' ).val();
		var password = $( '#password' ).val();

		restAdapter.login( username, password );

	} );
});
