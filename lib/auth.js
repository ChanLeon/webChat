var rbac = require('util-rbac');

module.exports = function(options) {

	var filter = ',' + (options.filter || []).join(',') + ','+'/trade/gnete_res'+',';

	return function auth(req, res, next) {
		if (!req.session.user) {
			res.redirect('/mongodata/home');
			return false;
		}
		
		res.locals._user_ = req.session.user;
		next();
	};

};