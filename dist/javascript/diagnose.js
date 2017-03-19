$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		Image_type = IMAGE_TYPE.DIAGNOSE,
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');
	// INIT Basic info
	getBasicInfo(Nav_Item.diagnose, UID, CID, TID);


	// **************************************************
	// GET Addition Option of Selection
	window.getOtherOption({
		table_name : TABLE.DIAGNOSE,
		fields     : ["cure_plan"]
	});

	// **************************************************
	// GET:
	var ToothInfo;
	$.ajax({
		url      : URL_TOOTH + toquerystring({tooth_id : TID}),
		type     : "get",
		async    : false,
		dataType : "json",
		success  : function(vData) {
			ToothInfo = vData;
			$('.header[type=toothlocation]').text("牙位：" + vData.tooth_location_number + "牙");
		}
	});
	$.ajax({
		url      : URL_DIAGNOSE,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "json",
		error    : function() {
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showData(vData);
			setDefultFormData(vData);
		}
	});



	// **************************************************
	// POST
	$('form').form({
		fields: {
			caries_degree: {
				identifier: 'caries_degree',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择龋损程度'
					}
				]
			},
			cure_plan: {
				identifier: 'cure_plan',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择治疗方案'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){

			switch ($(this).form('get value', 'cure_plan')) {
				case "非手术治疗": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification1'));
					break;
				}
				case "龋病微创修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification2'));
					break;
				}
				case "复合树脂修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification3'));
					break;
				}
				case "美容修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification4'));
					break;
				}
			}

			$.ajax({
				url      : URL_DIAGNOSE,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function(data){
					$.ajaxFile({
						url           : URL_IMAGE, 
						type          : 'POST',  
						fileElementId : 'imageupload',
						dataType      : 'text',
						data          : {case_id : CID, picture_type : Image_type},
						async         : false,  
						cache         : false,  
						contentType   : false,  
						processData   : false,
						success       : function() {},
						error         : function() {alert("文件上传失败");}
					});
				},
				complete : function() {
					addOtherOption({
						form       : $('form'),
						table_name : TABLE.DIAGNOSE,
						fields     : ["cure_plan"]
					});

					location.reload();
				}
			});

			return false;
		}
	});


	// **************************************************
	// Other Envent
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});


	// **************************************************
	// 具体治疗计划选择
	$('select[name=cure_plan]').parent().dropdown({
		allowAdditions: true, 
		onChange: function(CurePlan) { 
			$('.select.field').addClass("invisible");
			$("div[field=" + CurePlan + "]").removeClass("invisible");
		}
	});
	

	// **************************************************
	// Function
	function showData(vData) {

		var $Description = $('#id_description');

		// diagnose
		var ToothLocation = ToothInfo.tooth_location_number + "牙",
			DiagnoseText  = "<span>诊断：</span>" + ToothLocation;
		DiagnoseText += vData.caries_degree;
		if (vData.caries_type != "无") {
			DiagnoseText += "，" + ToothLocation + vData.caries_type;
		}		
		appendpragraph($Description, DiagnoseText);

		// other diagnose
		if (vData.additional != "") {
			appendpragraph($Description, "<span>其他诊断：</span>" + vData.additional);
		}

		// plan
		var PlanText = "<span>治疗计划：</span>" + vData.cure_plan
		if (vData.specification != "") {
			PlanText += "（" + vData.specification + "）";
		}
		appendpragraph($Description, PlanText);

		// show image
		$.ajax({
			url      : URL_IMAGE,
			type     : "GET",
			data     : {case_id : CID, type : Image_type},
			dataType : "json",
			success  : function(FileData) {showImage(FileData);}
		});
	}

	function setDefultFormData(vData) {
        $('select[name=caries_degree]').dropdown("set selected", vData.caries_degree);
        $('select[name=caries_type]').dropdown("set selected", vData.caries_type);
        $('select[name=cure_plan]').dropdown("set selected", vData.cure_plan);
        $('textarea[name=additional]').val(vData.additional);

		$("div[field=" + vData.cure_plan + "]").removeClass("invisible");
		switch (vData.cure_plan) {
			case "非手术治疗": {
				$('select[name=specification1]').dropdown("set selected", vData.specification);
				break;
			}
			case "龋病微创修复": {
				$('select[name=specification2]').dropdown("set selected", vData.specification);
				break;
			}
			case "复合树脂修复": {
				$('select[name=specification3]').dropdown("set selected", vData.specification);
				break;
			}
			case "美容修复": {
				$('select[name=specification4]').dropdown("set selected", vData.specification);
				break;
			}
		}
	}


	// ***************************************************************
	// FUNCTION:
	function appendpragraph($Item, Text) {
		$Item.append("<p>" + Text + "</p>");
	}
});