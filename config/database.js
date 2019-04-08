/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = {
		production: {
			url: 'mongodb://s_finding:f1n2019@dbapp.tap-agri.com:4848/s_finding?authSource=s_finding',
			ssl: false
		},
		development: {
			url: 'mongodb://s_finding:s_finding@dbappdev.tap-agri.com:4848/s_finding?authSource=s_finding',
			ssl: false
		}
	}