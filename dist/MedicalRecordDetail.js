$(document).ready(function(){
	var USER_DATA = null,
		U_ID      = Number(requestParameter("uid"));	// FIXME: check uid is empty

	// ***************************************************************
	// FUNCTION: 请求用户基本数据
	$.ajax({
  		url      : URL_SEARCH,
  		type     : "GET",
  		data     : {table : "user", user_id : U_ID, page : 1},
  		dataType : "json",
		async    : false,
		error    : function() {networkError();},
		success  : function(data){
			showMedicalRecord(data.info_list[0]);
		}
	});

	// ***************************************************************
	// FUNCTION: 在界面显示新的病历项
	function showMedicalRecord(UserData){

		var $MedicalRecord = $('.record.segment');
		$MedicalRecord.attr("value", UserData.user_id);
		$MedicalRecord.find('.name').text(UserData.name);
		$MedicalRecord.find('.gender').text(UserData.gender == 0 ? "男" : "女");
		$MedicalRecord.find('.age').text(UserData.age);
		$MedicalRecord.find('.occupation').text(UserData.occupation);
		$MedicalRecord.find('.contact').text(UserData.contact);
		$MedicalRecord.find('.time').text(UserData.in_date);

		$.each(UserData.tooth_location_list, function(){
			showToothLocation($MedicalRecord.find('.extra:first'), this);
		});
	}

	// ***************************************************************
	// FUNCTION: 在界面显示牙位
	function showToothLocation($Selector, ToothData){
		$ClonedExtra = $Selector.clone(true);

		var LocationStr = "主诉：" + ToothData.tooth_location;
		LocationStr += ToothData.is_fill_tooth ? "要求补牙" : ToothData.symptom + ToothData.time_of_occurrence;

		$ClonedExtra.attr("value", ToothData.tooth_id);
		$ClonedExtra.find('.location').text(LocationStr);

		// 设置当前牙位操作状态
		$.each(ToothData.step, function(){
			if (this != 0) {
				$ClonedExtra.find('a.label').eq(this - 1).addClass('blue');
			}
		});

		$ClonedExtra.find('a.label').bind('click', clickToothStep);

		$ClonedExtra.find('a.download').unbind().bind('click', downloadFile);
		$ClonedExtra.find('a.deletetooth').unbind().bind('click', deleteToothLocation);

		$Selector.after($ClonedExtra);
		$ClonedExtra.find('.invisible.header').removeClass('invisible');
	}

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
	
	$('#context .menu .item').tab({ context: $('#context') });

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
		$.ajax({
			url     : URL_TOOTH,
			type    : "post",
			data    : toform({user_id : USER_ID}) + $Form.serialize(),
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

	$('.coupled.modal').modal({allowMultiple: true});
	// 添加时间控件
	$('#ID_Time').modal('attach events', '#add_tooth .disabled.input');
	$('#ID_Time a.label').click(function(){
		$('#add_tooth .disabled.input input').val($(this).text() + $(this).prevAll('div.label').text());
		$('#ID_Time').modal('hide');
	});

	// ***************************************************************
	// FUNCTION:设置链接数据
	// 个人史，风险评估和预后管理
	$('a[href^=RiskEvaluation], a[href^=Manage], a[href^=PersonalHistory]').click(function(){
		var $Record = $(this).parents('.record.segment');
		$(this).prop('href', $(this).prop('href') + toquerystring({
			uid  : $Record.attr('value'),
			name : $Record.find('.name').text()
		}));
	});

	// *************************************************************
	// 单击牙位处理流程
	function clickToothStep(){
		$(this).prop('href', $(this).prop('href') + toquerystring({
			uid  : $(this).parents('.record.segment').attr('value'),
			tid  : $(this).parents('.extra').attr('value'),
			name : $(this).parents('.record.segment').find('.name').text()
		}));
	}

	// ***************************************************************
	// FUNCTION: 删除病历
	// FIXME: 删除病历后返回所有病例
	$('.corner.label').click(function(){
		var $Record = $(this).parents('.record.segment');
		$('#deletemodal').modal({
			onApprove: function() {
				$.ajax({
					url      : URL_USER + toquerystring({user_id : $Record.attr("value")}),
					type     : "DELETE",
					dataType : "text",
					error    : function() {networkError();},
					success  : function() {$Record.remove();}
				});
			}
		}).modal('show');
	});

	// ***************************************************************
	// FUNCTION: 删除牙位
	function deleteToothLocation(){
		var $Tooth = $(this).parents('.extra');
		$('#deletemodal').modal({
			onApprove: function() {
				$.ajax({
					url      : URL_TOOTH + toquerystring({tooth_id : $Tooth.attr('value')}),
					type     : "DELETE",
					dataType : "text",
					error    : function() {alert("删除牙位失败");},
					success  : function() {$Tooth.remove();}
				});
			}
		}).modal('show');
	}

	// ***************************************************************
	// FUNCTION: 下载文件
	function downloadFile(){
		$.ajax({
			url      : URL_DOC + toquerystring({tooth_id : $(this).parents('.extra').attr('value'), risk : ""}),
			type     : "GET",
			dataType : "text",
			error    : function() {networkError();},
			success  : function(text) {
				text = text.substring(text.lastIndexOf("Medical_Case\\"), text.length);
				location.href = text;
			}
		});

		return false;
	}
});