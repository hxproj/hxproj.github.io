$(document).ready(function(){

	// **************************************************
	// INIT
 	var U_ID = Number(requestParameter("uid"));
	// INIT Basic info
	getBasicInfo(undefined, U_ID, undefined, undefined);


	// **************************************************
	// GET
	$.ajax({
		url      : URL_USERALLTOOTHINFO + toquerystring({user_id : U_ID}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(Data){
			Data.length ? $.each(Data, function() {showToothLocationRecord(this);})
			 : $('.icon.message').transition('tada'); 
		}
	});


	// **************************************************
	// POST
	// POST : 牙位
	$('#ID_AddToothLocation').click(function(){
		$('#ID_AddToothLocationModal').modal({
			closable  : false,
			onApprove : function(){

				$('#ID_AddToothLocationModal form').form({
					fields: {
						tooth_location_number: {
							identifier: 'tooth_location_number',
							rules: [
								{
									type   : 'empty',
			            			prompt : '请选择病人牙齿部位'
								}
							]
						},
						judge_doctor: {
							identifier: 'judge_doctor',
							rules: [
								{
									type   : 'empty',
			            			prompt : '请填写初诊医生'
								}
							]
						}
					},
					inline    : true,
					onSuccess : function(){

						$.ajax({
							url      : URL_TOOTH,
							type     : "POST",
							data     : toform({user_id : U_ID}) + $(this).serialize(),
							async    : false, 
							dataType : "json",
							error    : function() {networkError();},
							success  : function(data) {location.reload();}
						});

			        	return false;
					}
				}).submit();

				return false;
			}
		}).modal('show');
	});
	// 选择具体牙位
	$('#context .menu .item').tab({ context: $('#context') });
	$('.coupled.modal').modal({allowMultiple: true});
	$('#ID_SelectToothLocationModal .ui.label').click(function(){ $(this).toggleClass('teal'); });
	$('#ID_SelectToothLocationModal').modal('attach events', '#ID_SelectToothLocation').modal({
		onApprove : function(){
			var $AddLocation   = $('#ID_SelectToothLocationModal'),
				$ToothType     = $('.ID_SelectToothLocationModal .item.active'),
				ToothTypeValue = $ToothType.attr('data-tab'),
				ToothTypeName  = $ToothType.text();

			var FormData = "";
			$('.modal .segment.active .teal.label').each(function(){
				FormData += $(this).text() + "、";
			});

			if (FormData.length > 0) {FormData = FormData.substring(0, FormData.length - 1);} 

			$('#ID_SelectToothLocation input').val(FormData);
			$('#ID_SelectToothLocation input[name=tooth_type]').val(ToothTypeValue);
		}
	});
	// **************************************************
	// 删除牙位
	$('.corner.delete_tooth_record').click(function(){
		var This_TID= $(this).parents('.toothlocationrecord').attr("tooth_id");
		$('#ID_DeleteModal').modal({
			onApprove : function(){
				$.ajax({
					url      : URL_TOOTH + toquerystring({tooth_id : This_TID}),
					type     : "DELETE",
					async    : false, 
					error    : function() {networkError();},
					success  : function() {location.reload();}
				});
			}
		}).modal('show');
	});


	// **************************************************
	// POST: 复诊（处置or非处置）
	$('.add_re_examination.button').click(function(){
		var TID= $(this).parents('.toothlocationrecord').attr("tooth_id");
		$('#ID_ReExaminationModal').modal({
			closable  : false,
			onApprove : function(){

				$('#ID_ReExaminationModal form').form({
					fields: {
						judge_doctor: {
							identifier: 'judge_doctor',
							rules: [
								{
									type   : 'empty',
			            			prompt : '请填写复诊医生'
								}
							]
						}
					},
					inline    : true,
					onSuccess : function(){
						$.ajax({
							url      : URL_CASE,
							type     : "POST",
							data     : toform({tooth_id : TID}) + $(this).serialize(),
							async    : false, 
							dataType : "json",
							error    : function() {networkError();},
							success  : function(data) {location.reload();}
						});

						return false;
					}
				}).submit();

				return false;
			}
		}).modal('show');
	});


	// **************************************************
	// Other Envent
	// delete case
	$('.case_delete').click(function(){
		var This_CID= $(this).parents('.ui.labels').attr("case_id");
		$('#ID_DeleteModal').modal({
			onApprove : function(){
				$.ajax({
					url      : URL_CASE + toquerystring({case_id : This_CID}),
					type     : "DELETE",
					async    : false, 
					error    : function() {networkError();},
					success  : function() {location.reload();}
				});
			}
		}).modal('show');
	});


	// **************************************************
	// Function
	function showToothLocationRecord(Data) {

		var $ToothLocationRecord = $('.invisible.toothlocationrecord');

		var $ClonedToothLocationRecord = $ToothLocationRecord.clone(true).removeClass('invisible');
		$ClonedToothLocationRecord.attr("tooth_id", Data.tooth_id);
		$ClonedToothLocationRecord.find('div[type=tooth_location_number]').text(Data.tooth_location_number + "牙");

		$.each(Data.cases, function() { 
			showExamination({
				Examination     : this,
				TID             : Data.tooth_id,
				$LocationRecord : $ClonedToothLocationRecord
			}); 
		});

		$.each($ClonedToothLocationRecord.find('.right.buttons .button'), function(){
			$(this).prop('href', $(this).prop('href') + toquerystring({
				uid : U_ID,
				tid : Data.tooth_id
			}));
		});

		$ToothLocationRecord.after($ClonedToothLocationRecord);
	}
 
	function showExamination(Data) {
		if (Data.Examination.case_type) {
			var $ExaminationSelector;
			Data.Examination.if_handle ? $ExaminationSelector = $('.invisible.handle.labels') : $ExaminationSelector = $('.invisible.nohandle.labels');

			var $ClonedReExamination = $ExaminationSelector.clone(true).removeClass('invisible');
			$ClonedReExamination.attr("case_id", Data.Examination.case_id);
			$ClonedReExamination.find('span[type=doctor]').text(Data.Examination.judge_doctor);
			$ClonedReExamination.find("div.time span").text(Data.Examination.date);

			Data.$LocationRecord.find('.after.divider').after("<div class='ui hidden divider'></div>");
			Data.$LocationRecord.find('.after.divider').after($ClonedReExamination);

			setHref($ClonedReExamination.find('a.label'), U_ID, Data.TID, Data.Examination.case_id);
			activeReExaminationStep($ClonedReExamination.find('a.label'), Data.Examination.step, Data.Examination.if_handle);
		} else {
			var $FirstVisit = Data.$LocationRecord.find('.firstvisit.labels');

			$FirstVisit.attr("case_id", Data.Examination.case_id);
			$FirstVisit.find("span[type=doctor]").text(Data.Examination.judge_doctor);
			$FirstVisit.find("div.time span").text(Data.Examination.date);

			setHref($FirstVisit.find('a.label'), U_ID, Data.TID, Data.Examination.case_id);
			activeFirstVisitStep($FirstVisit.find('a.label'), Data.Examination.step);
		}
	}
	function setHref($Items, UID, TID, CID) {
		$.each($Items, function(){
			$(this).prop('href', $(this).prop('href') + toquerystring({
				uid : UID,
				tid : TID,
				cid : CID,
			}));
		});
	}
	function activeFirstVisitStep($Items, Steps) {
		if ($Items != undefined) {
			$.each(Steps, function(){
				$Items.eq(this - 1).addClass("blue");
			});
		}
	}
	function activeReExaminationStep($Items, Steps, IfHandle) {
		if ($Items != undefined) {
			$.each(Steps, function(){
				if (this == 8) {
					$Items.eq(0).addClass("blue");
				} else {
					if (IfHandle) {
						$Items.eq(this - 1).addClass("blue");
					} else {
						if (this == 3) {
							$Items.eq(1).addClass("blue");
						}
						if (this == 7) {
							$Items.eq(2).addClass("blue");
						}
					}
				}
			});
		}
	}
});