module.exports = {

	/*
	|--------------------------------------------------------------------------
	| App Config
	|--------------------------------------------------------------------------
	*/
	app_port: process.env.PORT || 3011,
	app_name: 'Microservice Finding (08-01-2019 16:26)',

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
		create_200: 'Success! ',
		create_403: 'Forbidden ',
		create_404: 'Error! Data gagal diproses ',
		create_500: 'Error! Terjadi kesalahan dalam pembuatan data ',
		find_200: 'Success! ',
		find_403: 'Forbidden ',
		find_404: 'Error! Tidak ada data yang ditemukan ',
		find_500: 'Error! Terjadi kesalahan dalam penampilan data ',
		put_200: 'Success! ',
		put_403: 'Forbidden ',
		put_404: 'Error! Data gagal diupdate ',
		put_500: 'Error! Terjadi kesalahan dalam perubahan data ',
		delete_200: 'Success! ',
		delete_403: 'Forbidden ',
		delete_404: 'Error! Data gagal dihapus ',
		delete_500: 'Error! Terjadi kesalahan dalam penghapusan data ',
	}


}