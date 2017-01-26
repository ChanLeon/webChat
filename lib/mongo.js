var mongoose = require('mongoose');
var db = function() {
    return {
        config: function(conf) {
            var url = 'mongodb://' + conf.host + '/' + conf.database;
            mongoose.connect(url);
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection :' + url);
            });

        }
    };
};

module.exports = db();