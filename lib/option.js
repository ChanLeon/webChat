var filter = require('util-format');
var mongoose = require("mongoose");
var mongo = require("./mongo");
var ejs = require('ejs');

for (var k in filter) {
	ejs.filters[k] = filter[k];
}

module.exports = function spec() {

	return {
		onconfig: function(config, next) {
			// log.config(config.get('tracerConfig'));
			mongo.config(config.get('mongoTest'));  //在development.json里有mongoTest对象。
			next(null, config);
		}
	};
};