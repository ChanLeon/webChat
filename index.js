/* 该文件禁止任何修改 */
var kraken = require('kraken-js'),
	app = require('express')(),
	options = require('./lib/option')(),
	port = process.env.PORT || 3600;

var http = require("http");
var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.use(kraken(options));

server.listen(port, function(err) {
	console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});

//socket部分
io.on("connection",function(socket){
	//通过socket.on()来侦听和处理对应的emit()激发的事件，接收并处理客户端发送的foo事件
	var users = []; 
	socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(socket.nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', socket.nickname, socket.userIndex, 'login');//添加login字符串来表明用户进入还是离开
        };

    });

     //断开连接事件
	socket.on('disconnect', function() {
		//断开连接，将用户删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的所有人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });

    //接收新的信息
    socket.on("postmessage",function(postmsg,color){
        //将新信息发送到除自己外的所有用户
        socket.broadcast.emit("newmsg",socket.nickname,postmsg,color);
    });
     
     //接收用户发来的图片
    socket.on("img",function(image){
        socket.broadcast.emit("newimg",socket.nickname,image);
    });
});
