var Info = require("../../models/info");
var cipher = require("util-cipher");
var rbac = require('util-rbac');
var log4js = require('log4js');
var logger = log4js.getLogger();

module.exports = function(router){
	router.get("/home",function(req,res){
        res.locals.home = "home";
		res.render("mongodata/home");
	})

    router.get("/reg",function(req,res){
        res.locals.reg = "reg";
        res.render("mongodata/reg");
    })

    router.get("/login",function(req,res){
        res.locals.login = "login";
        res.render("mongodata/login");
    })

    router.get("/index",checkLogin,function(req,res){
        res.locals.index = "index";
        res.render("mongodata/index");
    })

    router.post("/reg",checkNotLogin,function(req,res){
        var data = req.body;
        var errorString = "该用户名已存在，请重新注册！！！";
        var mongodata1 = new Info({
            username: data.username,
            password: cipher.md5["+"](data.password),
        });
        Info.findOne({"username":mongodata1.username},function(err,user){
            if(!user){
                console.log('用户名不存在');
                mongodata1.save(function(err, user){
                    if (err) {
                        console.log(err);
                        res.send('用户创建失败');
                    }else{
                        console.log('创建成功');
                        res.render("mongodata/result");
                    }
                });
            }else{
                res.locals.user = data.username + errorString;
                console.log('用户名已存在');
                res.render('mongodata/reg', {
                    error: '用户名已存在'
                });
            }
        });
    })
    

	router.post('/login',checkNotLogin, function(req, res) {
          var data = req.body;
          console.log("data",data);
          Info.findOne({"username":data.username},function(err,user){
            if(data.username == "" || data.username == null){
                return false;
            }
            if (!user) {
                res.locals.unuser = "登录的用户名不存在，请注册！！";
                res.render('mongodata/login', {
                        error: '用户不存在'
                    });
                return false;
            } 
            if(data.password == "" || user.password != cipher.md5["+"](data.password)){
                res.locals.unpsw = "登录密码错误❎，请重新登录！！";
                res.render('mongodata/login', {
                        error: '密码错误'
                    });
                return false;
            }
                req.session.user = {name:user.username};
                res.locals.username = req.session.user;
                res.render('mongodata/index');
          }); 
                
    })

    router.get("/logout",function(req,res){        
        req.session.destroy();
        res.redirect('/mongodata/home');
    })

    function checkLogin(req,res,next){
        if(!req.session.user){
            console.log("需要登录")
            res.render("mongodata/checkLog");
            return false;
        }
        res.locals.username = req.session.user;
        next();
    }
 
    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            console.log("已经登录了")
          res.locals.username = req.session.user;
          res.render('mongodata/index');
          return false;
        }
        next();
    }

}

//保存、插入、删除、更新、搜索