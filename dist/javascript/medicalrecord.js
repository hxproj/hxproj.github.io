$(document).ready(function(){

	// **************************************************
	// INIT
 	var U_ID = Number(requestParameter("uid"));

	$('#ID_AddToothLocationModal form').form({
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
			doctor: {
				identifier: 'doctor',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写初诊医生'
					}
				]
			}
		}
	});


	// **************************************************
	// GET
	// GET: 用户基本信息
	$.ajax({
		url      : URL_USER + toquerystring({user_id : U_ID}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(data){
			var $BasicInfo = $('.basicinfo.labels'),
				$Gender    = $BasicInfo.find('div[name=gender]');
			
			 if (data.gender) {
				$Gender.find("i").addClass("woman");
				$Gender.find("span").text("女");
			 } else {
				$Gender.find("i").addClass("man");
				$Gender.find("span").text("男");
			 }

			$('.header[name=name]').text(data.name);
			$BasicInfo.find('div[name=age]').text(data.age);
			$BasicInfo.find('div[name=ID]').text(data.id_number);
			$BasicInfo.find('div[name=occupation]').text(data.occupation);
			$BasicInfo.find('div[name=contact]').text(data.contact);
		}
	});
	// GET: 初诊复诊
	$.ajax({
		url      : URL_USERTOOTHINFO + toquerystring({user_id : U_ID}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(Data){
			$.each(Data, function(){ 
				showToothLocationRecord(this);
			});  // .reverse()
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
					onSuccess : function(){

						$.ajax({
							url      : URL_TOOTH,
							type     : "POST",
							data     : toform({user_id : U_ID}) + $(this).serialize(),
							async    : false, 
							dataType : "json",
							error    : function() {networkError();},
							success  : function(data) {
								
								// TODO : reload and remove this item
								// location.reload();
								showToothLocationRecord({
									id : data.id,  
									tooth_location: $(this).form('get value', 'tooth_location'),
									doctor: $(this).form('get value', 'doctor'),
								});


								$('#ID_AddToothLocationModal').modal('hide');
							}
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
				FormData += $(this).text() + ",";
			});

			if (FormData.length > 0) {FormData = FormData.substring(0, FormData.length - 1);} 

			$('#ID_SelectToothLocation input').val(FormData);
			$('#ID_SelectToothLocation input[name=tooth_type]').val(ToothTypeValue);
		}
	});
	// **************************************************
	// 删除牙位
	$('.corner.delete_tooth_record').click(function(){
		var $DeleteToothRecord = $(this).parent();
		$('#ID_DeleteModal').modal({
			onApprove : function(){
				$DeleteToothRecord.remove();
			}
		}).modal('show');
	});


	// **************************************************
	// 添加复诊（处置or非处置）
	$('.add_re_examination.button').click(function(){

		$ToothLocationRecord = $(this).parents('.toothlocationrecord');

		$('#ID_ReExaminationModal').modal({
			closable  : false,
			onApprove : function(){

				$('#ID_ReExaminationModal form').form({
					onSuccess : function(){

						// FIXME: submit the tooth
						$('#ID_ReExaminationModal').modal('hide');

						showReExamination({
							id             : 6,  // FIXME: should form server
							handle         : $(this).form('get value', 'is_handle') == "是" ? true : false,
							doctor         : $(this).form('get value', 'doctor'),
							afterSelector  : $ToothLocationRecord.find('.after.divider')
						});

			        	return false;
					}
				}).submit();

				return false;
			}
		}).modal('show');
	});


	// **************************************************
	// Function
	function showToothLocationRecord(Data) {

		var $ToothLocationRecord = $('.invisible.toothlocationrecord');

		var $ClonedToothLocationRecord = $ToothLocationRecord.clone(true).removeClass('invisible');
		$ClonedToothLocationRecord.attr("tooth_id", Data.id);
		$ClonedToothLocationRecord.find('div[type=tooth_location]').text(Data.tooth_location);
		$ClonedToothLocationRecord.find('span[type=doctor]').text(Data.doctor);

		$ToothLocationRecord.after($ClonedToothLocationRecord);

		$.each(Data, function(index, element){ 
			if (index != 0){
				
				$.ajax({
					url      : URL_CASE + toquerystring({case_id : element.case_id}),
					type     : "GET",
					async    : false, 
					dataType : "json",
					error    : function() {networkError();},
					success  : function(data) {
						
						showReExamination({
							
						});

					}
				});
			}
		});
	}

	function showReExamination(Data) {
		var $ReExaminationSelector;
		Data.handle ? $ReExaminationSelector = $('.invisible.handle.labels') : $ReExaminationSelector = $('.invisible.nohandle.labels');

		var $ClonedReExamination = $ReExaminationSelector.clone(true).removeClass('invisible');
		$ClonedReExamination.attr("re_examination_id", Data.id);
		$ClonedReExamination.find('span[type=doctor]').text(Data.doctor);

		Data.afterSelector.after("<div class='ui hidden divider'></div>")
		Data.afterSelector.after($ClonedReExamination);
	}
});