$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		Image_type = 1,
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');
	// INIT Basic info
	getBasicInfo(Nav_Item.mouthexamination, UID, CID, TID);


	// **************************************************
	// GET
	$.ajax({
		url      : URL_MOUTHEXAM + toquerystring({case_id : CID}),
		type     : "GET", 
		dataType : "json",
		error    : function() {
			setDefultToothLocationInfo();
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
			tooth_location: {
				identifier: 'tooth_location',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择病人牙位'
					}
				]
			},
			caries_tired_display: {
				identifier: 'caries_tired_display',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择龋坏累及牙面'
					}
				]
			},
			depth: {
				identifier: 'depth',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择深度'
					}
				]
			},
			flex_of_caries: {
				identifier: 'flex_of_caries',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			cold: {
				identifier: 'cold',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			hot: {
				identifier: 'hot',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			touch: {
				identifier: 'touch',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			bite: {
				identifier: 'bite',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			X_Ray_depth: {
				identifier: 'X_Ray_depth',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			X_Ray_fill_quality: {
				identifier: 'X_Ray_fill_quality',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			bop: {
				identifier: 'bop',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){

			var FormData = toform({
				user_id  : UID, 
				case_id  : CID,
				tooth_id : TID,
				caries_tired : $(this).form('get value', 'caries_tired_display')
			}) + $(this).serialize();

			$.ajax({
				url      : URL_MOUTHEXAM,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : FormData,
				dataType : "json",
				error    : function() {networkError();},
				success  : function(vData){
					
					// 上传图片
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
						error         : function() {
							alert("文件上传失败");
						}
					});

					location.reload();
				}
			});

			return false;
		}
	});


	// **************************************************
	// Other Envent
	// 选择牙位
	$('#SelectToothLocation').click(function(){
		// 设置当前默认选项值
		var TabIndex;
		$.each($(this).find('input').val().split("、"), function(){
			TabIndex = $('#SelectToothLocationModal').find(".ui.label[val=" + this + "]").addClass('teal').parents('.basic.segment').attr("data-tab");
		});

		// Set tab
		$('#context .menu .active').removeClass("active");
		$('#context .segment.active').removeClass("active");
		$('#context .menu a[data-tab=' + TabIndex + ']').addClass("active");
		$('#context .segment[data-tab=' + TabIndex + ']').addClass("active");

		$('#SelectToothLocationModal').modal({
			onApprove : function(){

				var FormData = "";
				$('#SelectToothLocationModal .segment.active .teal.label').each(function(){
					FormData += $(this).text() + "、";
				});

				if (FormData.length > 0) {FormData = FormData.substring(0, FormData.length - 1);} 

				$('#SelectToothLocation input[name=tooth_location]').val(FormData);
				$('#SelectToothLocation input[name=tooth_type]').val($('#SelectToothLocationModal.modal .item.active').attr('data-tab'));
			}
		}).modal('show');
	});
	$('#SelectToothLocationModal .ui.label').click(function(){ $(this).toggleClass('teal'); });
	$('#context .menu .item').tab({ context: $('#context') });

	// 修改
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});
	

	// **************************************************
	// Function
	function showData(vData) {
		// 牙体情况
		var ME_Body_Text = vData.tooth_location + "牙";
		ME_Body_Text += "龋坏累及" + vData.caries_tired + "，";
		ME_Body_Text += "为" + vData.depth + "，";

		// 当原充填体选择“无”时，不进行任何语言描述，且不描述有无继发龋
		if (vData.fill != "无") {
			ME_Body_Text += "原充填体为" + vData.fill + "，";
			ME_Body_Text += vData.secondary + "，";
		};

		ME_Body_Text += vData.color_of_caries + "，";
		ME_Body_Text += vData.flex_of_caries + "，";
		ME_Body_Text += vData.cold + "，";
		ME_Body_Text += vData.hot + "，";
		ME_Body_Text += vData.touch + "，";
		ME_Body_Text += vData.bite;

		// 如果牙齿活力值为空，则不显示
		if (vData.vitality_value_of_teeth != "") {
		ME_Body_Text += "，牙髓电活力值：" + vData.vitality_value_of_teeth;
		};
		$('#ME_Body').text(ME_Body_Text);


		// 牙周情况
		var ME_Around_Text = vData.gingival_hyperemia + "，";
		ME_Around_Text += vData.gingival_color + "，";
		ME_Around_Text += vData.tartar_up + "，";
		ME_Around_Text += vData.tartar_down + "，";
		ME_Around_Text += vData.bop + "，";
		ME_Around_Text += vData.periodontal_pocket_depth + "，";

		// 当选根分叉病变无时则不显示位置
		if (vData.furcation != "根分叉病变无") {
		ME_Around_Text += vData.furcation + "，";
		ME_Around_Text += vData.location + "，";
		}

		ME_Around_Text += vData.fistula + "，";
		ME_Around_Text += vData.overflow_pus + "，";
		ME_Around_Text += vData.mobility;
		$('#ME_Around').text(ME_Around_Text);


		// 患牙与邻牙接触关系
		var ME_Neighbor_Text = "";
		ME_Neighbor_Text += vData.relations_between_teeth + "，";
		ME_Neighbor_Text += vData.is_teeth_crowd + "，";
		ME_Neighbor_Text += vData.involution_teeth + "，";
		ME_Neighbor_Text += vData.tooth_shape;
		$('#ME_Neighbor').text(ME_Neighbor_Text);


		// X线片表现
		var ME_X_Text = "";
		ME_X_Text += vData.tooth_location + "牙";
		ME_X_Text += vData.X_Ray_location;
		ME_X_Text += vData.X_Ray_depth;
		ME_X_Text += vData.X_Ray_fill_quality + "，根尖周组织无明显异常。";


		// 如果CT表现和咬翼片表现为空时，则不显示
		if (vData.CT_shows != "") {
			ME_X_Text += "CT表现：" + vData.CT_shows;
			if (vData.piece != "" || vData.OtherExpression != "") {
				ME_X_Text += "，";
			};
		}
		if (vData.piece != "") {
			ME_X_Text += "咬翼片表现：" + vData.piece;
			if (vData.OtherExpression != "") {
				ME_X_Text += "，";
			};
		}
		if (vData.OtherExpression != "") {
			ME_X_Text += "其它表现：" + vData.OtherExpression;
		}
		$('#ME_X').text(ME_X_Text);
	}

	function setDefultToothLocationInfo() {
		// 远程获取牙位
		$.ajax({
			url      : URL_TOOTH + toquerystring({tooth_id : TID}),
			type     : "GET",
			dataType : "json",
			success  : function(ToothInfo) { $('input[name=tooth_location]').val(ToothInfo.tooth_location_number);}
		});
	}

	function setDefultFormData(vData) {

		$('input[name=tooth_location]').val(vData.tooth_location);
		$('input[name=tooth_type]').val(vData.tooth_type);

		// 龋坏累及牙面去掉逗号
		$.each(vData.caries_tired.split(","), function(){
			$('select[name=caries_tired_display]').dropdown("set selected", this);
		});

		$('select[name=secondary]').dropdown("set selected", vData.secondary);
		$('select[name=depth]').dropdown("set selected", vData.depth);
		$('select[name=cold]').dropdown("set selected", vData.cold);
		$('select[name=hot]').dropdown("set selected", vData.hot);
		$('select[name=touch]').dropdown("set selected", vData.touch);
		$('select[name=bite]').dropdown("set selected", vData.bite);
		$('select[name=color_of_caries]').dropdown("set selected", vData.color_of_caries);
		$('select[name=flex_of_caries]').dropdown("set selected", vData.flex_of_caries);
		$('select[name=fill]').dropdown("set selected", vData.fill);
		$('input[name=vitality_value_of_teeth]').val(vData.vitality_value_of_teeth);

		$('select[name=gingival_hyperemia]').dropdown("set selected", vData.gingival_hyperemia);
		$('select[name=gingival_color]').dropdown("set selected", vData.gingival_color);
		$('select[name=tartar_up]').dropdown("set selected", vData.tartar_up);
		$('select[name=tartar_down]').dropdown("set selected", vData.tartar_down);
		$('select[name=bop]').dropdown("set selected", vData.bop);
		$('select[name=periodontal_pocket_depth]').dropdown("set selected", vData.periodontal_pocket_depth);
		$('select[name=furcation]').dropdown("set selected", vData.furcation);
		$('select[name=location]').dropdown("set selected", vData.location);
		$('select[name=mobility]').dropdown("set selected", vData.mobility);
		$('select[name=fistula]').dropdown("set selected", vData.fistula);
		$('select[name=overflow_pus]').dropdown("set selected", vData.overflow_pus);

		$('select[name=relations_between_teeth]').dropdown("set selected", vData.relations_between_teeth);
		$('select[name=is_teeth_crowd]').dropdown("set selected", vData.is_teeth_crowd);
		$('select[name=involution_teeth]').dropdown("set selected", vData.involution_teeth);
		$('select[name=tooth_shape]').dropdown("set selected", vData.tooth_shape);
		$('select[name=X_Ray_location]').dropdown("set selected", vData.X_Ray_location);
		$('select[name=X_Ray_depth]').dropdown("set selected", vData.X_Ray_depth);
		$('select[name=X_Ray_fill_quality]').dropdown("set selected", vData.X_Ray_fill_quality);
		$('input[name=CT_shows]').val(vData.CT_shows);
		$('input[name=piece]').val(vData.piece);
		$('input[name=OtherExpression]').val(vData.OtherExpression);

		$.ajax({
			url      : URL_IMAGE,
			type     : "GET",
			data     : {case_id : CID, type : Image_type},
			dataType : "json",
			success  : function(FileData) {showImage(FileData);}
		});

		$('#submit .submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
	}
});