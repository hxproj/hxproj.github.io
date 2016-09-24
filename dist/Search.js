$(document).ready(function(){

	var Table  = requestParameter("type");
	var Field  = requestParameter("name");
	var Value  = requestParameter("value");
	var Search = requestParameter("search");

	// ***************************************************************
	// FUNCTION: 搜索
	requestPageData(1);

	// ***************************************************************
	// FUNCTION: 获取页面数据
	function requestPageData(PageNum){

		var AddtionParameter = addParameter("table", Table) 
				+ "&" + addParameter(Field, Value)
				+ "&" + addParameter("page", PageNum);

		$.ajax({
			url       : URL_SEARCH,
			type      : "get",
			data      : AddtionParameter,
			dataType  : "json",
			beforeSend: function(){
				
			},
			complete  : function(){

			},
			error     : function(){
				alert("网络连接错误...");
			},
			success   : function(data){

				$('.record.segment:visible').each(function(){ this.remove(); });

				if (data.searched == "ok") {
					$('.orange.header').text("搜索结果：" + decodeURI(Search));
					// 如果数据库内容不为空
					if (data.info_list != undefined) {
						$.each(data.info_list.reverse(), function(){ showNewMedicalRecord(this); });
						showPagination(data.pages, Number(PageNum), data.info_list.length);
					}
					// FIXME: 为空？更改MedicalRecord
				} else if (data.searched == "failed") {
					$('.orange.header').text("没有搜索到'" + decodeURI(Search) + "'相关病历");
				}
			}
		});
	}

	// ***************************************************************
	// FUNCTION: 在界面现实新的病历项
	function showNewMedicalRecord(UserData){
		$MedicalRecord = $('.invisible.segment');

		$ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
		$ClonedMedicalRecord.attr("value", UserData.user_id);
		$ClonedMedicalRecord.find('.name').text(UserData.name);
		$ClonedMedicalRecord.find('.gender').text(UserData.gender == 0 ? "男" : "女");
		$ClonedMedicalRecord.find('.age').text(UserData.age);
		$ClonedMedicalRecord.find('.occupation').text(UserData.occupation);
		$ClonedMedicalRecord.find('.contact').text(UserData.contact);
		$ClonedMedicalRecord.find('.time').text(UserData.in_date);

		$.each(UserData.tooth_location_list, function(){
			showToothLocation($ClonedMedicalRecord.find('.extra:first'), this);
		});

		// FIXME: 设置风险评估和预后管理的状态disabled，是否是所有填写完成显示状态
		

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
		$.each($ClonedExtra.find('.disabled.button'), function(index){
			if (index + 1 <= ToothData.step) {
				$(this).addClass('blue').removeClass('disabled');
			}
		});

		$Selector.after($ClonedExtra);
		$ClonedExtra.find('.invisible.header').removeClass('invisible');
	}

	// ***************************************************************
	// FUNCTION: 显示分页
	function showPagination(Pages, Page, IsContainContent){
		var $Menu = $('.borderless.menu');
		if (IsContainContent) {

			if ($Menu.hasClass('invisible')) {$Menu.removeClass('invisible');}
			$('.borderless.menu').find('.blue.item').remove();
			$('.borderless.menu').find('.disabled.item').remove();

			var DisabledItem    = "<div class='disabled item'>...</div>";
			var PageItem        = "<a class='blue item' href='#'></a>";

			var MaxDisplayPages = 5;

			var StartPage = Page - 2;
			if (StartPage < 1) {
				StartPage = 1
			}

			if (Pages < 1) { Pages = 1; }

			var EndPage = Page + 2;
			if (EndPage < MaxDisplayPages) {
				EndPage = MaxDisplayPages;
			}
			if (EndPage > Pages) {
				EndPage = Pages;
			} 

			var $LeftItem  = $Menu.find('.left.item');
			var $RightItem = $Menu.find('.right.item');

			// 设置首尾页点击事件
			$LeftItem.bind('click', function() { requestPageData(1); });
			$RightItem.bind('click', function() { requestPageData(Pages); });

			// 添加disable item
			var $Item = $LeftItem;
			if (StartPage > 1) {
				$Item.after(DisabledItem);
				$Item = $Item.next();
			}

			if (Pages - EndPage > 0) {
				$RightItem.before(DisabledItem);
			}

			for (var i=StartPage; i<=EndPage; ++i) {
				$Item.after(PageItem);
				$Item = $Item.next().text(i);
 
				$Item.bind('click', function() {requestPageData(this.text)});
			}
		} else {
			if (!$Menu.hasClass('invisible')) {$Menu.addClass('invisible');}
		}
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
		var AddtionParameter = addParameter("tooth_id", $Tooth.attr('value'));

		$.ajax({
			url     : URL_TOOTH + "?" + AddtionParameter,
			type    : "DELETE",
			dataType: "text",
			error   : function(){
				alert("网络连接错误...");
			},
			success : function(data){
				$Tooth.remove();
			}
		});

		return false;
	});
});