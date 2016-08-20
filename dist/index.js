$(document).ready(function(){

  var SERVER_URL    = "http://127.0.0.1:9000";
  var ADD_USER_URL  = SERVER_URL + "/medical-case-of-illness/user";
  var ADD_TOOTH_URL = SERVER_URL + "/medical-case-of-illness/tooth-location-record";
  var ADD_PERSONAL_HISTORY_URL = SERVER_URL + "/medical-case-of-illness/personal-history";

	$('.ui.dropdown').dropdown();

	// ***************************************************************
	// FUNCTION: AJAX提交病历添加表单
	$('.right.item a').click(function(){
		$('#MedicalRecords').modal({
			closable: false,
  			onApprove : function() {
  			var IsOK = true;
  			var UserInfo;
  			$.ajax({
  				url: ADD_USER,
  				type: "post",
  				async: false, 
  				data: $("#basicinfoform").serialize(),
  				dataType: "json",
  				error: function(){
  					IsOK = false;
  					alert("网络连接错误...");
  				},
  				success: function(data){
  					UserInfo = data;
  			}
			});

      		var UserID    = UserInfo.user_id;
      		var UserIDStr = "user_id=" + UserID + "&";
			if (IsOK){
				$.ajax({
					url: ADD_PERSONAL_HISTORY_URL,
					type: "post",
					async: false, 
					data: UserIDStr + $("#personalhistoryform").serialize(),
					dataType: "text",
					error: function(){
						IsOK = false;
						alert("网络连接错误...");
					},
					success: function(data){
						alert("OK");
					}
				});
			}

			return IsOK;
		}
		}).modal('show');
	});

	// ***************************************************************
	// FUNCTION: AJAX提交牙位添加表单
	$('.add.button').click(function(){
		$('#add_tooth').modal({
			onApprove: function(){
	       		var IsOK = true;
	        	var data_tab = $('#add_tooth .item.active').attr('data-tab');
	        	var submit_form = $("#add_tooth .tab[data-tab="+ data_tab +"] form");
	        	var UserID    = 5;
	        	var UserIDStr = "user_id=" + UserID + "&";

		      	$.ajax({
	          		url: ADD_TOOTH_URL,
	          		type: "post",
	          		data: UserIDStr + submit_form.serialize(),
	          		dataType: "text",
	          		error: function(){
	            	IsOK = false;
	            	alert("网络连接错误...");
	          		},
	          		success: function(data){
	            	alert("OK");
	          		}
	        	});

	        	return IsOK;
			}
		}).modal('show');
	});

	$('#context .menu .item').tab({
		context: $('#context')
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