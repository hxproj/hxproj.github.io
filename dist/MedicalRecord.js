$(document).ready(function(){

	var URL_ADD_USER  = URL_SERVER + "/medical-case-of-illness/user";
	var URL_ADD_TOOTH = URL_SERVER + "/medical-case-of-illness/tooth-location-record";

	var IsSubmitOK = false;
	$("#basicinfoform").form({
		fields: {
			name: {
				identifier: 'name',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的姓名'
					}
				]
			},
			gender: {
				identifier: 'gender',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的性别'
					}
				]
			},
			age: {
				identifier: 'age',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的年龄'
					}
				]
			},
			occupation: {
				identifier: 'occupation',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的职业'
					}
				]
			},
			contact: {
				identifier: 'contact',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的联系方式'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){
			$.ajax({
  				url: URL_ADD_USER,
				type: "post",
				async: false, 
				data: $(this).serialize(),
				dataType: "json",
				error: function(){
					IsSubmitOK = false;
  					alert("网络连接错误，请检查网络是否正常");
  				},
  				success: function(UserInfo){
  					IsSubmitOK = true;

  					alert("添加成功");
					// ***************************************************************
					// FUNCTION: 在界面添加新的病历
					$MedicalRecord = $('.invisible.segment');

					var Gender = "男";
					if (UserInfo.gender == 1) { Gender = "女"}

					$ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
					$ClonedMedicalRecord.find('.name').text(UserInfo.name);
					$ClonedMedicalRecord.find('.gender').text(Gender);
					$ClonedMedicalRecord.find('.age').text(UserInfo.age);
					$ClonedMedicalRecord.find('.occupation').text(UserInfo.occupation);
					$ClonedMedicalRecord.find('.contact').text(UserInfo.contact);

					$MedicalRecord.after($ClonedMedicalRecord);
				}
			});

			// 防止表单提交导致页面跳转
			return false;
		}
	});

	$('.right.menu a').click(function(){
		$('#MedicalRecords').modal({
			closable: false,
  			onApprove : function() {
  				$("#basicinfoform").submit();

				return IsSubmitOK;
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