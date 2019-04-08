/*
|--------------------------------------------------------------------------
| Module Exports
|--------------------------------------------------------------------------
*/
	module.exports = {
		production: {
			url: 'mongodb://dbapp:dbapp123@dbapp.tap-agri.com:27017/s_finding?authSource=admin',
			ssl: false
		},
		development: {
			url: 'mongodb://s_finding:s_finding@dbappdev.tap-agri.com:4848/s_finding?authSource=s_finding',
			ssl: false
		}
	}