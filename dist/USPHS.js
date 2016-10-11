$(document).ready(function(){

	$('.orange.header').text("USPHS评估 - " + decodeURI(requestParameter("name")));
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_USPHS,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      	async    : false,
  		success  : function(data){
  			$('form').hide();
  			DATA = data;

        	// 表头
        $('#display th').text("USPHS评估 - " + decodeURI(requestParameter("name")));
  			$('#color').text(DATA.color);
  			$('#marginal_accuracy').text(DATA.marginal_accuracy);
  			$('#anatomic_form').text(DATA.anatomic_form);
        $('#surfaceness').text(DATA.surfaceness);
  			$('#edge_color').text(DATA.edge_color);
  			$('#occlusal_contact').text(DATA.occlusal_contact);
  			$('#sensitivity_of_tooth').text(DATA.sensitivity_of_tooth);
  			$('#secondary_caries').text(DATA.secondary_caries);
  			$('#integrity').text(DATA.integrity);

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('form').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('form').form({
		onSuccess: function(){
			var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

			$.ajax({
				url      : URL_USPHS,
				type     : DATA == null ? "post" : "PUT", 
				data     : AddtionParameter + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});

			return false;
		}
	});

  // ***************************************************************
  // FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

    	$('input[value=' + DATA.color + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.marginal_accuracy + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.anatomic_form + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.surfaceness + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.edge_color + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.occlusal_contact + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.sensitivity_of_tooth + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.secondary_caries + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.integrity + ']').parent().checkbox('check'); 
    	
   		$('form .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
		$('form').show();
	});

	// ***************************************************************
	// FUNCTION: 上一项，处置
	$('.right.labeled.button').click(function(){
    	redirection("Cure.html", U_ID, T_ID, requestParameter("name"));
	});
});