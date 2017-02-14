$(document).ready(function(){

	// Table active animate
	$('table tbody tr').hover(
		function(){
			$(this).addClass('active');
		},
		function(){
			$(this).removeClass('active');
		}
	);

	// Detail button
	$('.detail.button').click(function(){
		redirection("medicalrecord.html", {uid : $(this).parents('tr.record').find("td[name=user_id]").text()});
	});


	// ***************************************************************
	// GET
	$.ajax({
		url      : URL_GETALLUSER,
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(data){
			if (data.user_list.length) {
				$('.invisible.table').show();
				showAllMedicalRecord(data.user_list);
	 			
				$.Page(
					$('table'),
				 	data.pages,
				 	1,
				 	URL_GETALLUSER,
				 	function() { networkError(); },
				 	function(data) { showAllMedicalRecord(data.user_list); }
				 );
			} else {
				$('.ui.message').show();
			}
		}
	});


	// ***************************************************************
	// PUT
	$('.edit.button').click(function(){
		var $MedicalRecord = $(this).parents('tr.record'),
			$Modal         = $('#MedicalRecordAddModal');

		$Modal.find("input[name=name]").val($MedicalRecord.find("td[name=name]").text());
		$Modal.find("input[name=occupation]").val($MedicalRecord.find("td[name=occupation]").text());
		$Modal.find("input[name=contact]").val($MedicalRecord.find("td[name=contact]").text());
		$Modal.find('select[name=gender]').dropdown("set selected", $MedicalRecord.find("td[name=gender]").text());
		$Modal.find("input[name=ID]").val($MedicalRecord.attr("id_number"));

		$Modal.modal({
			closable  : false,
  			onApprove : function() {
				$("#basicinfoform").form({
					onSuccess: function(){
						submitUserInfo({
							method : "PUT",
							info   : toform({user_id : $MedicalRecord.find("td[name=user_id]").text()}) + $(this).serialize()
						});
						return false;
					}
				}).submit();
				return false;
			}
		}).modal('show');
	});


	// ***************************************************************
	// DELETE
	$('.delete.button').click(function(){
		var $Record = $(this).parents('tr.record');
		$('#ID_DeleteModal').modal({
			onApprove : function(){

				$.ajax({
					url      : URL_USER + toquerystring({user_id : $Record.find("td[name=user_id]").text()}),
					type     : "DELETE",
					async    : false, 
					dataType : "json",
					error    : function() {networkError();},
					success  : function() {location.reload();}
				});

				$Record.remove();  // FIXME: 如果reload了，则此处的remove可删除
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
	// SEARCH
	// 搜索姓名
	$('th .name.search').click(function(){
		$('#SearchNameModal').modal("show");
	});
	$('#SearchNameModal button').click(function(){
		redirection("search.html", {
			table : "user",
			field : "name", 
			value : $(this).prev().val()
		});
	});


	// 搜索年龄
	$('th .age.search').click(function(){
		$('#SearchAgeModal').modal("show");
	});
});