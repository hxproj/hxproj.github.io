$(document).ready(function(){

	var URL_ADD_PERSONAL_HISTORY = URL_SERVER + "/medical-case-of-illness/personal-history";

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
		},
		inline: true,
		onSuccess: function(){
			//if (IsOK){
	      	//var UserID    = UserInfo.user_id;
	      	//var UserIDStr = "user_id=" + UserID + "&";
			$.ajax({
  				url: URL_ADD_PERSONAL_HISTORY,
				type: "post",
				async: false, 
				data: $(this).serialize(),
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

			return false;
		}
	});

	// ***************************************************************
	// FUNCTION: 额外添加项弹出框
	$('.detail .dropdown').dropdown({
		onChange: function(Value, Text, $Choice){
			$This  = $(this).parents('.detail');
			$Popup = $("#" + $(this).parent().find('select').prop('name'));
			if (Text == "是") {
				$This.popup({
					hoverable: false,
					on       : 'manual',
					inline   : true,
					popup    : $Popup
				}).popup('show');
			}
			else {
				$This.popup('hide');
			}
		}
	});

	$('.popup .button').click(function(){
		if ($(this).text() == "确定"){
			//验证输入框是否为空
			$This.popup('hide');
		} else {
			var PopupName = $(this).parents('.popup').prop('id');
			$Select = $("select[name='" + PopupName + "']");
			$Select.parents(".detail.field").popup('hide');
			$Select.dropdown('set selected', '否');
		}
	});
});