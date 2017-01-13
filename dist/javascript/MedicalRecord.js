$(document).ready(function(){

	// **************************************************
	// 添加牙位
	$('#ID_AddToothLocation').click(function(){
		$('#ID_AddToothLocationModal').modal({
			closable  : false,
			onApprove : function(){

				$('#ID_AddToothLocationModal form').submit();

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
		$DeleteToothRecord = $(this).parent();
		$('#ID_DeleteModal').modal({
			onApprove : function(){
				$DeleteToothRecord.remove();
			}
		}).modal('show');
	});


	// **************************************************
	// 向服务器提交牙位数据
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
		},
		inline    : true,
		onSuccess : function(){

			// FIXME: submit the tooth
			$('#ID_AddToothLocationModal').modal('hide');

			showToothLocationRecord({
				id : 6,  // FIXME: should form server
				tooth_location: $(this).form('get value', 'tooth_location'),
				doctor: $(this).form('get value', 'doctor'),
			});

        	return false;
		}
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
	}

});