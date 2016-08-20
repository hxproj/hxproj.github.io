$(document).ready(function(){

	var SERVER_URL   = "http://127.0.0.1:9000";
	var ADD_ILLNESS_HISTORY_URL = SERVER_URL + "/medical-case-of-illness/illness-history";

	$('.ui.dropdown').dropdown();
	$('.ui.accordion').accordion();
	
	$('#context .menu .item').tab({
		context: $('#context')
	});

	// ***************************************************************
	// FUNCTION: AJAX提交现病史
	$('.ui.tab .submit.button').click(function(){

		var UserID    = 5;
		var ToothID   = 2;
	    var AdditionStr = "user_id=" + UserID + "&" + "tooth_id=" + ToothID + "&";

      	$.ajax({
      		url: ADD_ILLNESS_HISTORY_URL,
      		type: "post",
      		data: AdditionStr + $(this).parent().serialize(),
      		dataType: "json",
      		error: function(){
	        	IsOK = false;
	        	alert("网络连接错误...");
      		},
      		success: function(data){
        		alert("OK");
      		}
    	});
	});
});