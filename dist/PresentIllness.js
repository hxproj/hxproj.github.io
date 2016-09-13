$(document).ready(function(){

	var ADD_ILLNESS_HISTORY_URL = URL_SERVER + "/medical-case-of-illness/illness-history";
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));

	$('#context .menu .item').tab({
		context: $('#context')
	});

	// ***************************************************************
	// FUNCTION: AJAX提交现病史
	$('.ui.tab .submit.button').click(function(){

	    var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

      	$.ajax({
      		url: ADD_ILLNESS_HISTORY_URL,
      		type: "post",
      		data: AddtionParameter + $(this).parent().serialize(),
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