module.exports = function(router){
	router.get("/",function(req,res){
		res.redirect("/mongodata/home");
	})
}