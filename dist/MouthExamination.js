$(document).ready(function(){
	var ADD_MOUTHEXAM_URL = URL_SERVER + "/medical-case-of-illness/oral-examination";

	$('form').form({
		fields: {
			vitality_value_of_teeth: {
				rules: [
					{
						type: 'empty',
						prompt : '牙齿活力值不能为空'
					}
				]
			}
		},
		inline: true,
		onSuccess: function() {
		var UserID    = 5;
		var ToothID   = 1;
	    var AdditionStr = "user_id=" + UserID + "&" + "tooth_id=" + ToothID + "&";

	    $.ajax({
      		url : ADD_MOUTHEXAM_URL,
      		type: "post",
      		data: AdditionStr + $(this).serialize(),
      		dataType: "json",
      		error: function(){
	        	IsOK = false;
	        	alert("网络连接错误...");
      		},
      		success: function(data){
        		alert("OK");
      		}
    	});
    	
			return false;
		}
	});

	// ******************************************************
	// 添加牙位
	$('#addLocation').click(function(){
		$('.ui.modal').modal({
			onApprove: function(){
				var $ToothType = $('.modal .item.active');
				var Value = $ToothType.attr('data-tab');
				var Name  = $ToothType.text();

				var 
				$('.modal .segment.active .teal.label').each(function(){
					$(this).text();
				});
			}
		}).modal('show');
	});

	$('.modal .ui.label').click(function(){
		$(this).toggleClass('teal');
	});

	$('#context .menu .item').tab({
		context: $('#context')
	});
});