$(document).ready(function(){

	// ***************************************************************
	// 请求首页数据
	$.ajax({
		url      : URL_PAGE,
		type     : "get",
		data     : {page : 1},
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(data){
			if (data.info_list.length) {
				// 设置分页属性
				$.Page(
					$('.record.segment'),
				 	data.pages,
				 	1,
				 	URL_PAGE,
				 	function() { networkError(); },
				 	function(data) { showAllMedicalRecord(data); }
				 );
	 			
	 			// 显示当前页所有病历
	 			showAllMedicalRecord(data);
			} else {
				$('#id_infomessage').show();
			}
		}
	});
	
	// ***************************************************************
	// FUNCTION: 显示所有病历
	function showAllMedicalRecord(data) {
		$('.record.segment:visible').remove();
		$.each(data.info_list.reverse(), function(){ showMedicalRecord(this); });
	}
	
	// ***************************************************************
	// FUNCTION: 在界面现实新的病历项
	function showMedicalRecord(UserData){
		$MedicalRecord = $('.invisible.segment');

		$ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
		$ClonedMedicalRecord.attr("value", UserData.user_id);
		$ClonedMedicalRecord.find('.name').text(UserData.name);
		$ClonedMedicalRecord.find('.gender').text(UserData.gender == 0 ? "男" : "女");
		$ClonedMedicalRecord.find('.age').text(UserData.age);
		$ClonedMedicalRecord.find('.occupation').text(UserData.occupation);
		$ClonedMedicalRecord.find('.contact').text(UserData.contact);
		$ClonedMedicalRecord.find('.time').text(UserData.in_date);

		if (UserData.tootn_location_list != undefined && UserData.tootn_location_list.length > 0) {
			$.each(UserData.tootn_location_list, function(){
				showToothLocation($ClonedMedicalRecord.find('.extra:first'), this);
			});
		}

		$MedicalRecord.after($ClonedMedicalRecord);
	}

	// ***************************************************************
	// FUNCTION: 在界面显示牙位
	function showToothLocation($Selector, ToothData){
		$ClonedExtra = $Selector.clone(true);

		var LocationStr = ToothData.tooth_location;
		ToothData.is_fill_tooth ? LocationStr += "（要求直接补牙）" :
			LocationStr += "（" + ToothData.time_of_occurrence + ", " + ToothData.symptom + "）";

		$ClonedExtra.attr("value", ToothData.tooth_id);
		$ClonedExtra.find('.location').text(LocationStr);

		// 设置当前牙位操作状态
		$.each(ToothData.step, function(){
			if (this != 0) {
				$ClonedExtra.find('a.button').eq(this - 1).addClass('blue');
			}
		});

		$Selector.after($ClonedExtra);
		$ClonedExtra.find('.invisible.header').removeClass('invisible');
	}

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
  				url      : URL_USER,
				type     : "post",
				async    : false, 
				data     : $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});

			return false;
		}
	});

	$('.right.menu .add.href').click(function(){
		$('#MedicalRecords').modal({
			closable  : false,
  			onApprove : function() {
  				$("#basicinfoform").submit();
				return false;
			}
		}).modal('show');
	});

	var USER_ID         = null;
	var $InvisibleExtra = null;
	// ***************************************************************
	// FUNCTION: AJAX提交牙位添加表单
	$('.add.button').click(function(){
		$InvisibleExtra = $(this).parents(".content").find(".extra:first");
		USER_ID = $(this).parents('.record.segment').attr('value');
		$('#add_tooth').modal({
			onApprove: function(){

	        	var data_tab    = $('#add_tooth .item.active').attr('data-tab');
	        	var submit_form = $("#add_tooth .tab[data-tab="+ data_tab +"] form");

	        	submit_form.submit();

	        	return false;
			}
		}).modal('show');
	});

	// ***************************************************************
	// FUNCTION: 设置添加牙位相关属性
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
        	submitTooth($(this));

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
        	submitTooth($(this));

        	return false;
		}
	});

	function submitTooth($Form){
		
		var AddtionParameter = "user_id=" + USER_ID + "&";
		$.ajax({
			url     : URL_TOOTH,
			type    : "post",
			data    : AddtionParameter + $Form.serialize(),
			dataType: "json",
			error   : function(){
				IsToothAddOK = false;
				alert("网络连接错误...");
			},
			success : function(data){
				$('#add_tooth').modal('hide');
				showToothLocation($InvisibleExtra, data);
			}
		});
	}

	$('#context .menu .item').tab({ context: $('#context') });

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
			Result += "天";
		} else if (TimeType === "time_week") {
			Result += "周";
		} else if (TimeType === "time_month") {
			Result += "月";
		} else if (TimeType === "time_year") {
			Result += "年";
		}

		$('#add_tooth .disabled.input input').val(Result);

		$('#add_tooth .disabled.input').popup('hide');
	});

	// ***************************************************************
	// FUNCTION:设置链接数据
	// 个人史，风险评估和预后管理
	$('a[href^=RiskEvaluation], a[href^=Manage], a[href^=PersonalHistory]').click(function(){
		var $Record = $(this).parents('.record.segment');
		$(this).prop('href', $(this).prop('href') + "?" 
			+ addParameter("uid", $Record.attr('value'))
			+ "&" + addParameter("name", $Record.find('.name').text()));
	});

	// 其它
	$('.record.segment .extra:first a').click(function(){
		var U_ID = $(this).parents('.record.segment').attr('value');
		var T_ID = $(this).parents('.extra').attr('value');
		var Name = $(this).parents('.record.segment').find('.name').text();

		var Href = $(this).prop('href');
		Href += "?" + addParameter("uid", U_ID)
			 + "&" + addParameter("tid", T_ID)
			 + "&" + addParameter("name", Name); 

		$(this).prop('href', Href);
	});

	// ***************************************************************
	// FUNCTION: 删除牙位
	$('.deletetooth.button').click(function(){
		var $Tooth = $(this).parents('.extra');
		$('#deletemodal').modal({
			onApprove: function() {
				$.ajax({
					url      : URL_TOOTH + "?" + addParameter("tooth_id", $Tooth.attr('value')),
					type     : "DELETE",
					dataType : "text",
					error    : function() {alert("删除牙位失败");},
					success  : function() {$Tooth.remove();}
				});
			}
		}).modal('show');
	});

	// ***************************************************************
	// FUNCTION: 下载文件
	$('.download.button').click(function(){
		var THIS_TOOTH_ID = $(this).parents('.extra').attr('value');
		var AddtionParameter = addParameter("tooth_id", THIS_TOOTH_ID) + "&risk=";
		
		$.ajax({
			url      : URL_DOC + "?" + AddtionParameter,
			type     : "GET",
			dataType : "text",
			error    : function() {networkError();},
			success  : function(text) {location.href = text;}
		});

		return false;
	});

	// ***************************************************************
	// FUNCTION: 删除病历
	$('.corner.label').click(function(){
		var $Record = $(this).parents('.record.segment');
		$('#deletemodal').modal({
			onApprove: function() {
				$.ajax({
					url      : URL_USER + "?" + addParameter("user_id", $Record.attr("value")),
					type     : "DELETE",
					dataType : "text",
					error    : function() {networkError();},
					success  : function() {$Record.remove();}
				});
			}
		}).modal('show');
	});
});