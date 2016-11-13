$(document).ready(function(){

	var Table       = requestParameter("type"),
		Field       = requestParameter("name"),
		Value       = requestParameter("value"),
		Search      = requestParameter("search"),
		QueryString = URL_SEARCH + toquerystring({table : Table}) + "&" + Field + "=" + Value;

	// ***************************************************************
	// 请求首页数据
	$.ajax({
		url      : QueryString,
		type     : "get",
		data     : {page : 1},
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(data){

			if (data.searched == "ok") {
				$('.orange.header').text("搜索结果：" + decodeURI(Search));
				// 设置分页属性
				$.Page(
					$('.record.segment'),
				 	data.pages,
				 	1,
				 	QueryString,
				 	function() { networkError(); },
				 	function(data) { showAllMedicalRecord(data); }
				 );
	 			
	 			// 显示当前页所有病历
	 			showAllMedicalRecord(data);
			} else {
				$('.orange.header').text("没有搜索到'" + decodeURI(Search) + "'相关病历");
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
	// FUNCTION: 在界面显示新的病历项
	function showMedicalRecord(UserData){
		$MedicalRecord = $('.invisible.segment');

		var $ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
		$ClonedMedicalRecord.attr("value", UserData.user_id);
		$ClonedMedicalRecord.find('.name').text(UserData.name);
		$ClonedMedicalRecord.find('.gender').text(UserData.gender == 0 ? "男" : "女");
		$ClonedMedicalRecord.find('.age').text(UserData.age);
		$ClonedMedicalRecord.find('.occupation').text(UserData.occupation);
		$ClonedMedicalRecord.find('.contact').text(UserData.contact);
		$ClonedMedicalRecord.find('.time').text(UserData.in_date);

		if (UserData.tooth_location_list != undefined && UserData.tooth_location_list.length > 0) {
			$.each(UserData.tooth_location_list, function(){
				showToothLocation($ClonedMedicalRecord.find('.extra:first'), this);
			});
		}

		$MedicalRecord.after($ClonedMedicalRecord);
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

	$('#context .menu .item').tab({ context: $('#context') });
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
	
	// ***************************************************************
	// FUNCTION: 删除病历
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
});