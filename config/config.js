module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3005,
	app_name: 'Microservice Finding',

	/*
	|--------------------------------------------------------------------------
	| Token
	|--------------------------------------------------------------------------
	*/
	secret_key: 'T4pagri123#',
	token_expiration: 7, // Days
	token_algorithm: 'HS256',

	/*
	|--------------------------------------------------------------------------
	| URL
	|--------------------------------------------------------------------------
	*/
	url: {},
	
	/*
	|--------------------------------------------------------------------------
	| Error Message
	|--------------------------------------------------------------------------
	*/
	error_message: {
		invalid_token: 'Token expired! ',
		invalid_input: 'Invalid Input! ',
		create_200: 'Success! ',
		create_403: 'Forbidden ',
		create_404: 'Error! Data gagal diproses ',
		create_500: 'Error! Terjadi kesalahan dalam pembuatan data ',
		find_200: 'Success! ',
		find_403: 'Forbidden ',
		find_404: 'Error! Tidak ada data yang ditemukan ',
		find_500: 'Error! Terjadi kesalahan dalam penampilan data ',
	}


}