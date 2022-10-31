exports.getError = (req, res, next) => {
	res.status(404).render('error', {
		pageTitle: 'Page not found', 
		path: '', 
		isAuthenticated: req.session.isLoggedIn
	});     
};

exports.getError500 = (req, res, next) => {
	res.status(500).render('error-500', {
		pageTitle: 'Error', 
		path: '/500', 
		isAuthenticated: req.session.isLoggedIn
	});     
};