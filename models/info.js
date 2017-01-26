'use strict';

var mongoose = require('mongoose');
var clickCountModel = function() {

	var infoSchema = mongoose.Schema({
		username: String,
		password: String
	});
	return mongoose.model('Info', infoSchema);
};

module.exports = new clickCountModel();