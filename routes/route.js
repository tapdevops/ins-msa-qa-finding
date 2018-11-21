module.exports = ( app ) => {
	// Declare Controllers
	const finding = require( '../app/controllers/finding.js' );

	// ROUTE - FINDING
	app.post( '/finding', finding.create );
	app.get( '/finding', finding.find );
	app.get( '/finding/:id', finding.findOne );
	app.put( '/finding/:id', finding.update );
	app.delete( '/finding/:id', finding.delete );
}