$(document).ready(function(){

	var URL_ADD_USER  = URL_SERVER + "/medical-case-of-illness/user";
	var URL_ADD_TOOTH = URL_SERVER + "/medical-case-of-illness/tooth-location-record";
	var URL_PAGE      = URL_SERVER + "/medical-case-of-illness/index-info";
	

	// ***************************************************************
	// FUNCTION: 获取第几页的数据
	var CurrentPageNum = 1;
	$.ajax({
		url     : URL_PAGE,
		type    : "get",
		data    : "page=" + CurrentPageNum,
		dataType: "json",
		error   : function(){
			alert("网络连接错误...");
		},
		success : function(data){
			$.each(data, function(){
				showNewMedicalRecord(this);
			});
		}
	});

	// ***************************************************************
	// FUNCTION: 在界面现实新的病历项
	function showNewMedicalRecord(UserData){
		$MedicalRecord = $('.invisible.segment');

		var Gender = "男";
		if (UserData.gender == 1) { Gender = "女"}

		$ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
		$ClonedMedicalRecord.find('.name').text(UserData.name);
		$ClonedMedicalRecord.find('.gender').text(Gender);
		$ClonedMedicalRecord.find('.age').text(UserData.age);
		$ClonedMedicalRecord.find('.occupation').text(UserData.occupation);
		$ClonedMedicalRecord.find('.contact').text(UserData.contact);
		$ClonedMedicalRecord.find('.time').text(UserData.in_date);

		$MedicalRecord.after($ClonedMedicalRecord);
	}

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
					},
					{
						type   : 'integer[1..100]',
            			prompt : '请正确填写病人的年龄'
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
  					alert("网络连接错误...");
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
					$ClonedMedicalRecord.find('.time').text(UserInfo.in_date);

					$MedicalRecord.after($ClonedMedicalRecord);
				}
			});

			// 防止表单提交导致页面跳转
			return false;
		}
	});

	$('.right.menu .add.href').click(function(){
		$('#MedicalRecords').modal({
			closable: false,
  			onApprove : function() {
  				$("#basicinfoform").submit();

				return IsSubmitOK;
			}
		}).modal('show');
	});

	// 设置添加牙位相关属性
	// 主诉
	$("#add_tooth .tab[data-tab=1] form").form({
		fields: {
			tooth_location: {
				identifier: 'tooth_location',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择病人牙齿部位'
					}
				]
			},
			symptom: {
				identifier: 'symptom',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择病人牙齿症状'
					}
				]
			},
			time_of_occurrence: {
				identifier: 'time_of_occurrence',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病发时间'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){

        	var UserID       = 5;
        	var AdditionForm = "user_id=" + UserID + "&";

        	submitTooth($(this), AdditionForm);

        	return false;
		}
	});
	// 要求补牙
	$("#add_tooth .tab[data-tab=2] form").form({
		fields: {
			tooth_location: {
				identifier: 'tooth_location',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择病人牙齿部位'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){

        	var UserID       = 5;
        	var AdditionForm = "user_id=" + UserID + "&";

        	submitTooth($(this), AdditionForm);

        	return false;
		}
	});

	var ToothData = null;
	function submitTooth($Form, AdditionForm){
		$.ajax({
			url     : URL_ADD_TOOTH,
			type    : "post",
			data    : AdditionForm + $Form.serialize(),
			dataType: "json",
			error   : function(){
				IsSubmitOK = false;
				alert("网络连接错误...");
			},
			success : function(data){
				IsSubmitOK = true;
				ToothData  = data;

				alert("OK");
			}
		});
	}

	// ***************************************************************
	// FUNCTION: AJAX提交牙位添加表单
	$('.add.button').click(function(){
		$InvisibleExtra = $(this).parents(".content").find(".extra:first");
		$('#add_tooth').modal({
			onApprove: function(){

	        	var data_tab    = $('#add_tooth .item.active').attr('data-tab');
	        	var submit_form = $("#add_tooth .tab[data-tab="+ data_tab +"] form");

	        	submit_form.submit();

        		// ***************************************************************
				// FUNCTION: 在界面添加新的牙位
	        	if (IsSubmitOK) {
					$ClonedExtra = $InvisibleExtra.clone(true);
					$InvisibleExtra.after($ClonedExtra);
					$ClonedExtra.find('.invisible.header').removeClass('invisible');
	        	}
	        	
	        	return IsSubmitOK;
			}
		}).modal('show');
	});

	$('#context .menu .item').tab({
		context: $('#context')
	});

	// 添加时间控件
	$('#add_tooth .disabled.input').click(function(){
		$(this).popup({
			on       : 'manual',
			inline   : true,
			popup    : $('#add_tooth .popup')
		}).popup('show');
	});

	$('#add_tooth .popup a.label').click(function(){
		var Result   = $(this).text();
		var TimeType = $(this).parent().prop('id');

		if (TimeType === "time_day")
		{
			Result += "天前";
		} else if (TimeType === "time_week") {
			Result += "周前";
		} else if (TimeType === "time_month") {
			Result += "月前";
		} else if (TimeType === "time_year") {
			Result += "年前";
		}

		$('#add_tooth .disabled.input input').val(Result);

		$('#add_tooth .disabled.input').popup('hide');
	});
});