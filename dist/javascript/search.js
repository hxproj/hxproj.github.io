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
		$ClonedMedicalRecord.find('td[name=occupation]').text(UserData.occupation); // 
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
});