$(document).ready(function(){

	var URL_ADD_PERSONAL_HISTORY = URL_SERVER + "/medical-case-of-illness/personal-history";
	var USER_ID = Number(requestParameter("uid"));

	// ***************************************************************
	// FUNCTION: 添加额外事件
	$.fn.form.settings.rules.matchOption = function() {
		return ($("form").form('get value', 'times_of_teeth_brush') == $("select[name=time_of_teeth_brush]").dropdown('get selectionCount').toString().split(",")[0]);
	};

	// 设置病历个人史表单相关属性
	$("form").form({
		fields: {
			long_of_teeth_brush: {
				identifier: 'long_of_teeth_brush',
				rules: [
					{
						type   : 'empty',
            			prompt : '请输入刷牙时长'
					}
				]
			},
			time_of_teeth_brush: {
				identifier: 'time_of_teeth_brush',
				rules: [
					{
						type   : 'matchOption',
            			prompt : '刷点时间点次数必须与每天刷牙次数相等'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){
	      	if (!isNaN(USER_ID)) {
	      		var AddtionParameter = "user_id=" + USER_ID + "&";
	      		
				$.ajax({
	  				url: URL_ADD_PERSONAL_HISTORY,
					type: "post",
					async: false, 
					data: AddtionParameter + $(this).serialize(),
					dataType: "json",
					error: function(){
						IsOK = false;
	  					alert("网络连接错误...");
	  				},
	  				success: function(data){
	  					IsOK = true;
		            	alert("OK");
					}
				});
	      	}

			return false;
		}
	});
});