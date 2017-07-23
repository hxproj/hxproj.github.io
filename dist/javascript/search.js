$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var parameter  = requestParameter("parameter"),
	    value      = requestParameter("value"),
	    pre_value  = requestParameter("pre_value"),
	    post_value = requestParameter("post_value");

	// Table active animate
	$('table tbody tr').hover(
		function() { $(this).addClass('active'); },
		function() { $(this).removeClass('active'); }
	);

	// Detail button
	$('.detail.button').click(function(){
		redirection("medicalrecord.html", {uid : $(this).parents('tr.record').find("td[name=user_id]").text()});
	});


	// ***************************************************************
	// Search
	searchAndShowResult("user_id", 2);


	// ***************************************************************
	// DELETE
	$('.delete.button').click(function(){
		var $Record = $(this).parents('tr.record');
		$('#ID_DeleteModal').modal({
			onApprove : function(){
				$.ajax({
					url      : URL_USER + toquerystring({user_id : $Record.find("td[name=user_id]").text()}),
					type     : "DELETE",
					error    : function() {networkError();},
					success  : function() {location.reload();}
				});
			}
		}).modal('show');
	});


	// ***************************************************************
	// Function
	function showAllMedicalRecord(Data) {
		$('tbody tr:visible').remove();
		$.each(Data.reverse(), function(){ showMedicalRecord(this); });
	}

	function showMedicalRecord(UserData) {
		$MedicalRecord = $('.invisible.record');

		var $ClonedMedicalRecord = $MedicalRecord.clone(true).removeClass('invisible');
		$ClonedMedicalRecord.attr("id_number", UserData.id_number);
		$ClonedMedicalRecord.find('td[name=user_id]').text(UserData.user_id);
		$ClonedMedicalRecord.find('td[name=name]').text(UserData.name);
		$ClonedMedicalRecord.find('td[name=age]').text(UserData.age);
		$ClonedMedicalRecord.find('td[name=gender]').text(UserData.gender == 0 ? "男" : "女");
		$ClonedMedicalRecord.find('td[name=contact]').text(UserData.contact);
		$ClonedMedicalRecord.find('td[name=occupation]').text(UserData.occupation);
		$ClonedMedicalRecord.find('td[name=doctor]').text(UserData.doctor);
		$ClonedMedicalRecord.find('td[name=diagnose_list]').text(UserData.diagnose_list ? UserData.diagnose_list : "未进行诊断");
		$ClonedMedicalRecord.find('td[name=in_date]').text(UserData.in_date);

		$MedicalRecord.after($ClonedMedicalRecord);
	}


	// ***************************************************************
	// SORT
	function changesort($Item, Type) {

		var $Icon = $Item.find('i.icon');
		// 按人名拼音a-z
		if ($Icon.hasClass('down')) {
			searchAndShowResult(Type, 1);
			$Icon.removeClass('down').addClass('up');
		} 
		// 按人名拼音z-a
		else if ($Icon.hasClass('up'))
		{
			searchAndShowResult(Type, 2);
			$Icon.removeClass('up').addClass('down');
		}
	}
	// 姓名
	$('th .name.sort').click(function() { changesort($(this), "name"); });
	$('th .in_date.sort').click(function() { changesort($(this), "in_date"); });
	$('th .age.sort').click(function() { changesort($(this), "age"); });
	$('th .uid.sort').click(function() { changesort($(this), "user_id"); });


	// ***************************************************************
	// FUNCTION
	function searchAndShowResult(Order, OrderType) {

		var queryURL = URL_GETALLUSER + toquerystring({
			order      : Order,
			order_type : OrderType,
			parameter  : parameter,
			value      : value,
			pre_value  : pre_value,
			post_value : post_value,
		});

		$.ajax({
			url      : queryURL,
			type     : "GET",
			dataType : "json",
			error    : function(){ networkError(); },
			success  : function(data){
				showSearchResult(data.user_list.length);

				if (data.user_list.length) {
					$('.invisible.table').show();
					showAllMedicalRecord(data.user_list);
		 			
					$.Page(
						$('table'),
					 	data.pages,
					 	1,
					 	queryURL,
					 	function() { networkError(); },
					 	function(data) { showAllMedicalRecord(data.user_list); }
					 );
				}
			}
		});
	}

	function showSearchResult(dataLength) {

		var Message = "";
		dataLength ? Message += "搜索内容：" : Message += "未搜索到相关内容：";

		if (parameter == "name") {
			Message += decodeURI(value);
		} else if (parameter == "doctor") {
			Message += decodeURI(value);
		} else if (parameter == "age") {
			if (value != "") {
				Message += value + "岁";
			} else if (pre_value != "" && post_value != "") {
				Message += pre_value + "岁 ~ " + post_value + "岁";
			}
		} else if (parameter == "in_date") {
			Message += "诊断时间（"
			if (value != "") {
				Message += value;
			} else if (pre_value != "" && post_value != "") {
				Message += pre_value + " ~ " + post_value;
			}
			Message += "）";
		}

		$('#message .header').text(Message);
	}


	// ***************************************************************
	// PUT
	$('.edit.button').click(function(){
		var $MedicalRecord = $(this).parents('tr.record'),
			$Modal         = $('#EditMedicalRecordModal');

		$Modal.find("input[name=name]").val($MedicalRecord.find("td[name=name]").text());
		$Modal.find("input[name=occupation]").val($MedicalRecord.find("td[name=occupation]").text());
		$Modal.find("input[name=contact]").val($MedicalRecord.find("td[name=contact]").text());
		$Modal.find('select[name=gender]').dropdown("set selected", $MedicalRecord.find("td[name=gender]").text());
		$Modal.find("input[name=main_doctor]").val($MedicalRecord.find("td[name=doctor]").text());
		$Modal.find("input[name=ID]").val($MedicalRecord.attr("id_number"));

		$Modal.modal({
			closable  : false,
  			onApprove : function() {
				submitMedicalRecordForm("PUT", toform({user_id : $MedicalRecord.find("td[name=user_id]").text()}));
				return false;
			}
		}).modal('show');
	});

	function submitMedicalRecordForm(Method, Data) {
		$("#EditMedicalRecordModal form").form({
			fields : {
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
				ID: {
					identifier: 'ID',
					rules: [
						{
							type   : 'regExp[/^[0-9]{6}(19|20)?[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[0-9]{3}([0-9]|X)?$/i]',
		        			prompt : '请填写正确的身份证号'
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
				},
			},
			inline    : true,
			onSuccess : function(){
				var FormData = $(this).serialize();
				if (Data != undefined) {
					FormData = Data + FormData;
				}

				$.ajax({
					url      : URL_USER,
					type     : Method,
					data     : FormData,
					dataType : "json",
					error    : function(jqXHR) {
						// 用户病历重复，跳转到相应病历
						if (jqXHR.responseText != undefined) {
							var Response = JSON.parse(jqXHR.responseText);
							alert("已添加该身份证号的病历，即将跳转至相关病历...");
							redirection("medicalrecord.html", {uid : Response.user_id});
						} else {
							networkError();
						}
					},
					success  : function() {location.reload();}
				});
				return false;
			}
		}).submit();
	}
});