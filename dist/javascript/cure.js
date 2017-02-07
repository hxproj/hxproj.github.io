$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		Image_type = 3,
		IsEditMode = false;

	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');
	// INIT Context
	$('#context .menu .item').tab({ context: $('#context') });
	// INIT Basic info
	getBasicInfo(Nav_Item.cure, UID, CID, TID);

	// **************************************************
	// GET
	/*
	$.ajax({
		url      : URL_RISKEVALUATION,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "json",
		error    : function() {
			// TODO: check the return data 
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showData(vData);
			setDefultFormData(vData);
			$FormSegement.hide();
		}
	});
	*/


	// Define field and rule
	var Empty = {
		type   : 'empty',
		prompt : '请选择该项'
	};
	function Field(field, Rule) {

		// Set Field
		this.identifier = field;
		// Set Rules
		Rule == undefined ? this.rules = [Empty] : this.rules = Rule;
	}


	// INIT fields and rules;
	var NoSurgical_MedicalCure_Fields = [
			new Field("fluorination"), new Field("silver_nitrate")
		],
		NoSurgical_PitFissure_Fields = [
			new Field("additional_device"), new Field("reagent"), 
			new Field("tools"), new Field("time_of_etching"), 
			new Field("lamp"), new Field("check_time")
		];


	// ----------------------------------------------------------------------
	// 牙非手术治疗
	// ----------------------------------------------------------------------
	// **************************************************
	// 药物治疗
	$('#noSurgicalContext form[data-tab=noSurgicalContext1]').form({
		fields: NoSurgical_MedicalCure_Fields,
		inline: true,
		onSuccess: function(){
			submitForm(toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize());

			return false;
		}
	});
	// **************************************************
	// 再矿化治疗
	$('#noSurgicalContext form[data-tab=noSurgicalContext2]').form({
		onSuccess: function(){

			submitForm(toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize());

			return false;
		}
	});
	// **************************************************
	// 窝沟封闭
	$('#noSurgicalContext form[data-tab=noSurgicalContext3]').form({
		fields: NoSurgical_PitFissure_Fields,
		inline: true,
		onSuccess: function(){

			submitForm(toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize());

			return false;
		}
	});

	// ----------------------------------------------------------------------
	// 龋病微创修复
	// ----------------------------------------------------------------------
	// **************************************************
	// ART修复
	/*
	$('#minimalContext div[data-tab=minimalContext1] form').form({
		fields: NoSurgical_PitFissure_Fields,
		inline: true,
		onSuccess: function(){

			submitForm(toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize());

			return false;
		}
	});
	*/
	// **************************************************
	// 预防性填充
	// **************************************************
	// 玻璃离子过渡性修复
	// **************************************************
	// 釉质成型术

	// ----------------------------------------------------------------------
	// 复合树脂修复
	// ----------------------------------------------------------------------
	// **************************************************
	// 牙树脂直接充填修复
	// **************************************************
	// 牙安抚治疗&树脂充填修复

	// ----------------------------------------------------------------------
	// 美容修复
	// ----------------------------------------------------------------------
	// **************************************************
	// 渗透树脂修复
	// **************************************************
	// 微创复合树脂分层修复

	// ----------------------------------------------------------------------
	// 间接修复
	// ----------------------------------------------------------------------



	// **************************************************
	// Function
	function submitForm(vData) {
		$.ajax({
			url      : URL_CURE,
			type     : IsEditMode ? "PUT" : "POST", 
			data     : vData,
			dataType : "json",
			error    : function() {networkError();},
			success  : function(data) {
				//location.reload();
				submitImage();
				alert("ok");
			}
		});
	};
	function submitImage(vImage) {
		alert("submited image");
	}

});