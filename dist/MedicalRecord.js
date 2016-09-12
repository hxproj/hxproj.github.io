$(document).ready(function(){

	var URL_ADD_USER  = URL_SERVER + "/medical-case-of-illness/user";
	var URL_ADD_TOOTH = URL_SERVER + "/medical-case-of-illness/tooth-location-record";
	var URL_PAGE      = URL_SERVER + "/medical-case-of-illness/index-info";
	
	// 刷新页面获取首页数据
	requestPageData(1);

	// ***************************************************************
	// FUNCTION: 获取页面数据
	function requestPageData(PageNum){
		$.ajax({
			url       : URL_PAGE,
			type      : "get",
			data      : "page=" + PageNum,
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

				$.each(data.info_list.reverse(), function(){ showNewMedicalRecord(this); });
				
				showPagination(data.pages, Number(PageNum), data.info_list.length);
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

		$MedicalRecord.after($ClonedMedicalRecord);
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

				i == Page ? $Item.addClass('active') : 
					$Item.bind('click', function() {
						requestPageData(this.text)
					});
			}
		} else {
			if (!$Menu.hasClass('invisible')) {$Menu.addClass('invisible');}
		}
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
  				url     : URL_ADD_USER,
				type    : "post",
				async   : false, 
				data    : $(this).serialize(),
				dataType: "json",
				error   : function(){

					IsSubmitOK = false;
  					alert("网络连接错误...");
  				},
  				success : function(UserInfo){

  					IsSubmitOK = true;
  					showNewMedicalRecord(UserInfo);
				}
			});

			return false;
		}
	});

	$('.right.menu .add.href').click(function(){
		$('#MedicalRecords').modal({
			closable: false,
  			onApprove : function() {

  				$Form = $("#basicinfoform");
  				$Form.submit();

  				if (IsSubmitOK) {$Form.form('clear')};

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