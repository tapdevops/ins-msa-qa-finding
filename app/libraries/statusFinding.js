module.exports.set = function ( value ) { 
	var value = Number( value );
	var result = '';
	if ( value == 0 ) {
		result = 'BARU';
	}
	else if ( value > 0 && value < 100 ) {
		result = 'SEDANG DIPROSES';
	}
	else if ( value == 100 ) {
		result = 'SELESAI';
	}

	return result;
};