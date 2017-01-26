$(document).ready(function(){
	var pswfirst = $("#psw");
    var pswcon = $("#pswagain");
    var user_val = $("#username");
    $("#psw_right").hide();
    $("#pswagain_right").hide();
    $("#username_right").hide();
    var reg = /^[a-zA-Z]+\S.*/;
    var regpsw = /^\S+.*/;
    $("#reg").click(function(e){
    	if(user_val.val()=="" || reg.test(user_val.val()) == false) {
              $("#username_right").show();
              e.preventDefault();
	    	  return false;
    	}else {
    		$("#username_right").hide();
    	}
    	
    	if(pswfirst.val()=="" || regpsw.test(pswfirst.val()) == false) {
    		$("#psw_right").show();
              e.preventDefault();
	    	  return false;
    	}else {
    		$("#psw_right").hide();
    	}
	    
	    if(pswcon.val() != pswfirst.val()){
	    	$("#pswagain_right").show();
	    	e.preventDefault();
	    	  return false;
	    }else {	    	
		    $("#pswagain_right").hide();  
	    }
	});
})