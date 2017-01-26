window.onload = function(){
    var newchat = new Chat();
    //实例并初始化newchat程序
    newchat.init();
};

var Chat = function(){
    this.socket = null;
};

//向原型添加业务方法
Chat.prototype = {
    init:function(){
        var that = this;
        //建立到服务器的socket连接
        that.socket = io.connect();
        //监听socket的connect事件，并表示该事件已经建立连接
        that.socket.on("connect",function(){
            //连接到服务器之后，出现昵称输入框
            document.getElementById("info").textContent = "请注册你的昵称：";
            document.getElementById("nickWrapper").style.display = "block";
            document.getElementById("nicknameInput").focus();

        });
        that.socket.on("nickExisted",function(){
            document.getElementById("info").textContent = "昵称已经存在，请重新注册昵称！";
        });

        that.socket.on("loginSuccess",function(){
            document.title = '欢迎你 | ' + document.getElementById('nicknameInput').value;
            document.getElementById("loginpage").style.display = "none"; //成功之后去除遮罩层
            document.getElementById("messageInput").focus();
        }); 
        
       
        that.socket.on("system",function(nickname,usercount,type){
             //判断用户是连接还是离开，以显示不同信息
             if(nickname == null){
                return false;
             }else {
            var msg1 = "“" + nickname  + "”" + (type == "login" ? "加入了聊天：" : "离开了");
            that._displaymsg('系统 ', msg1, 'red');
            document.getElementById("status").textContent = usercount + "个好友在线";
            };
        });

        that.socket.on("newmsg",function(user,newmessage,color){
            that._displaymsg(user,newmessage,color);
        });

        that.socket.on("newimg",function(user,img){
            that._displayimg(user,img);
        });

        document.getElementById("loginBtn").addEventListener("click",function(){
             var nickname = document.getElementById("nicknameInput").value;
             if(nickname.trim().length != 0 && nickname != null){
                //发起一个login事件，并将nickname发送到服务器  
                that.socket.emit("login",nickname);
             } else {
                document.getElementById("nicknameInput").focus();
             };
        },false);

        document.getElementById("sendBtn").addEventListener("click",function(){
             var messageInput = document.getElementById("messageInput");
             var postmsg=messageInput.value;
             // 开始的时候是空的，并且发送信息后返回空值。
             messageInput.value = "";
             // 返回空值的时候仍然焦点
             messageInput.focus();
             var color = document.getElementById("color").value;
             if(postmsg != "" && postmsg != null && postmsg.trim().length != 0 ){
                that.socket.emit("postmessage",postmsg,color); //激发一个postmessage事件，并将postmsg发送到服务器
                that._displaymsg("我",postmsg,color); //把自己的信息留在自己的窗口，并显示绿色字体
                // messageInput.value = "";//只能用messageInput.value = "",不能postmsg="".
                // messageInput.focus();
                return;
             };
        },false);

        document.getElementById("sendImage").addEventListener("change",function(){
              //检查是否有文件被选中
            if(this.files.length != 0){
               //获取文件并用FileReader读取
               var file = this.files[0];
               var reader = new FileReader();
               //不支持FileReader接口的浏览器给出提示
                if(!reader){
                    that._displaymsg("系统","该浏览器不支持图片读取功能，请换浏览器！","red");
                    this.value="";
                    return;
                };
                reader.onload = function(e){
                    //获取到成功读取的文件内容，显示到页面并发送到服务器
                    this.value="";
                    that.socket.emit("img",e.target.result);
                    that._displayimg("我",e.target.result,"blue");
                };
                //使用readAsDataURL方法来读取选中的图片文件
                reader.readAsDataURL(file);
            };
        },false);

            //一是表情按钮单击显示表情窗口，
        this._initialemoji();
        document.getElementById("emoji").addEventListener("click",function(e){  //e其实就是event，是event的一个对象
                var emojiWrapper = document.getElementById("emojiWrapper");                
                emojiWrapper.style.display = "block";
                // emojiWrapper.style.cssText = "margin-bottom:50px"; 
                 e.stopPropagation(); 
                 //阻止冒泡,因为document.getElementById("emoji")属于document.body下的，点击了emoji之后，
                 //执行了 emojiWrapper.style.display = "block";然后会继续冒泡，执行emojiWrapper.style.display = "none";
                 //e.stopPropagation(); 阻止其继续冒泡，阻止执行emojiWrapper.style.display = "none";也可以用return false 代替
        },false);
         // 二是点击页面其他地方关闭表情窗口。
        document.body.addEventListener("click",function(e){
            var emojiWrapper = document.getElementById("emojiWrapper");
            if(e.target != emojiWrapper){
                emojiWrapper.style.display = "none";
            };
        });

        document.getElementById("emojiWrapper").addEventListener("click",function(e){
                    //获取被点击的表情(获取目标对象)
                    var target = e.target;
                    //表情转换为相应的表情代码插入到消息框中
                    if(target.nodeName.toLowerCase() == "img"){
                        var messageInput = document.getElementById("messageInput");
                        messageInput.focus();
                        messageInput.value = messageInput.value + "[emoji:" + target.title + "]";

                    };
        },false);

        document.getElementById("nicknameInput").addEventListener("keyup",function(e){
                 if(e.keyCode == 13){
                    var register = document.getElementById("nicknameInput").value;
                    if(register.trim().length != 0 && register != ""){
                      that.socket.emit("login",register);
                    }else{
                     document.getElementById("nicknameInput").focus();
                    };
                 };
        },false);
        
        document.getElementById("messageInput").addEventListener("keyup",function(e){
                if(e.keyCode == 13){
                    var sendmsg = document.getElementById("messageInput");
                    var sendmsgInput = sendmsg.value;
                    sendmsg.value = "";
                    sendmsg.focus();
                    var color = document.getElementById("color").value;
                    if(sendmsgInput.trim().length != 0 && sendmsgInput != ""){
                        that.socket.emit("postmessage",sendmsgInput,color);
                        that._displaymsg("我",sendmsgInput,color);

                    };
                };
        },false);

        document.getElementById("clear").addEventListener("click",function(){
                 var message1 = document.getElementById("msg");
                 message1.innerHTML = "";//向document.getElementById("msg")插入空内容，自然达到了清屏作用。
                 
        },false);
    },
    
    _displaymsg:function(user,message,color){
        var msgpanel = document.getElementById("msg");
        var msgToDisplay = document.createElement("p");
        var date = new Date().toTimeString().substr(0,8);
        //消息中的表情转换为图片
         message = this._showemoji(message);
        msgToDisplay.style.color = color || "#000"; //判断调用时有没有用到传递过来的颜色参数。
        msgToDisplay.innerHTML = user + "<span class='timespan'>(" + date + "):</span>" + message;
        msgpanel.appendChild(msgToDisplay);
        msgpanel.scrollTop = msgpanel.scrollHeight;
    },

    _displayimg:function(user,imagedata,color){
        var container = document.getElementById("msg");
        var msgToDisplay = document.createElement("p");
        var date = new Date().toTimeString().substr(0,8);
        msgToDisplay.style.color = color || "#000"; //判断调用时有没有用到传递过来的颜色参数。
        msgToDisplay.innerHTML = user + "<span class='timespan'>(" + date + "):</span><br/>" + '<a href="' + imagedata + '" target="_blank"><img src="' + imagedata + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },

    _initialemoji:function(){
        var divemoji = document.getElementById("emojiWrapper");
        //创建一个文档碎片
        var objfragment = document.createDocumentFragment();
        for(var i = 1;i <= 81; i++){
            var itememoji = document.createElement("img");
            itememoji.src = "../static/mongodata/image/emoji/" + i + ".gif";
            itememoji.title = i;
            //把要插入的新节点先附加到文档碎片上
            objfragment.appendChild(itememoji);
        };
        //再一次性把携带新节点的文档碎片添加到document上。
        divemoji.appendChild(objfragment);

    },

    //首先判断消息文本中是否含有表情符号，如果有，则转换为图片，最后再显示到页面。
    //写一个方法接收文本消息为参数，用正则搜索其中的表情符号，将其替换为img标签，最后返回处理好的文本消息。
    _showemoji:function(msg){
        var match,result = msg;
        var reg = /\[emoji:\d+\]/g;
        var emojiIndex;
        var totalEmojiNum = document.getElementById("emojiWrapper").children.length; //取得emojiWrapper下的子节点长度。
        while(match = reg.exec(msg)){
            emojiIndex = match[0].slice(7,-1);
            if(emojiIndex > totalEmojiNum){
                result = result.replace(match[0],"[X]");
            }else{
                result = result.replace(match[0],'<img class="emoji" src="../static/mongodata/image/emoji/' + emojiIndex + '.gif"/>');               
            };
        };
        return result;
    },

};



