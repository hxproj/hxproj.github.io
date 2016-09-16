$(document).ready(function(){

	// ******************************************************
	// Other
	$('.modal .ui.label').click(function(){ $(this).toggleClass('teal'); });
	$('#context .menu .item').tab({ context: $('#context') });
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));

	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));

	// ******************************************************
	// 检查数据是否已经提交
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_MOUTHEXAM,
  		type    : "get",
  		data    : addParameter("tooth_id", T_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#submit').hide();
  			$('#display').show();

  			DATA = data;

  			// 牙体情况
  			var ME_Body_Text = "";
  			if (DATA.tooth_location != "") {
  				ME_Body_Text += "牙位：" + DATA.tooth_location;
  			}

			if (DATA.caries_tired != "") {
				ME_Body_Text += "龋坏累及牙面：" + DATA.caries_tired + "，";
			}

			if (DATA.depth != "") {
				ME_Body_Text += "深度：" + DATA.depth + "，";
			}

			if (DATA.cold != "") {
				ME_Body_Text += "冷：" + DATA.cold + "，";
			}

			if (DATA.hot != "") {
				ME_Body_Text += "热：" + DATA.hot + "，";
			}

			if (DATA.touch != "") {
				ME_Body_Text += "探：" + DATA.touch + "，";
			}

			if (DATA.bite != "") {
				ME_Body_Text += "叩：" + DATA.bite + "，";
			}

			ME_Body_Text += "色" + DATA.color_of_caries + "，";
			ME_Body_Text += "质" + DATA.flex_of_caries + "，";

			if (DATA.fill != "") {
				ME_Body_Text += "无原填充体，";
			} else {
				ME_Body_Text += "原填充体：" + DATA.fill + "，";
			}

			ME_Body_Text += "牙齿活力值：" + DATA.vitality_value_of_teeth + "，";

  			if (DATA.secondary != "否") {
  				ME_Body_Text += " 无继发龋";
  			} else if (DATA.secondary != "是") {
  				ME_Body_Text += " 有继发龋";
  			}

			$('#ME_Body').text(ME_Body_Text);

  			// 牙周情况
  			var ME_Around_Text = "";
  			if (DATA.gingival_hyperemia != "否") {
  				ME_Around_Text += " 牙龈未充血，";
  			} else if (DATA.gingival_hyperemia != "是") {
  				ME_Around_Text += " 有继发龋，";
  			}

  			ME_Around_Text += "龈上牙石：" + DATA.tartar_up + "，";
  			ME_Around_Text += "龈下牙石：" + DATA.tartar_down + "，";
  			ME_Around_Text += "BOP：" + DATA.bop + "，";
  			ME_Around_Text += "牙周袋深度：" + DATA.periodontal_pocket_depth + "，";
  			ME_Around_Text += "根分叉病变：" + DATA.furcation + "，";
  			ME_Around_Text += "位置：" + DATA.location + "，";
  			ME_Around_Text += "牙齿松动度：" + DATA.mobility + "，";

  			if (DATA.fistula != "无") {
  				ME_Around_Text += " 牙龈无瘘道" + "，";
  			} else if (DATA.gingival_hyperemia != "有") {
  				ME_Around_Text += " 牙龈有瘘道" + "，";
  			}
  			
  			if (DATA.fistula != "无") {
  				ME_Around_Text += " 牙龈无溢脓";
  			} else if (DATA.gingival_hyperemia != "有") {
  				ME_Around_Text += " 牙龈有溢脓";
  			}
  			
			$('#ME_Around').text(ME_Around_Text);

			// 龋失补指数
			$('#ME_Loss').text(DATA.loss_caries_index_up);

			// 牙齿发育情况
			var ME_Condition_Text = "";
			$('#ME_Condition').text(DATA.development_of_the_situation);

			// 患牙与邻牙接触关系
			var ME_Neighbor_Text = "";
  			if (DATA.relations_between_teeth != "正常") {
  				ME_Neighbor_Text += "患牙与邻牙接触关系正常，";
  			} else if (DATA.relations_between_teeth != "否") {
  				ME_Neighbor_Text += "患牙与邻牙接触关系不正常，";
  			}
  			if (DATA.is_teeth_crowd != "否") {
  				ME_Neighbor_Text += "牙列不拥挤，";
  			} else if (DATA.is_teeth_crowd != "是") {
  				ME_Neighbor_Text += "牙列拥挤，";
  			}
  			if (DATA.involution_teeth != "有") {
  				ME_Neighbor_Text += "患牙有对合牙，";
  			} else if (DATA.involution_teeth != "无") {
  				ME_Neighbor_Text += "患牙无对合牙，";
  			}
  			ME_Neighbor_Text += "牙体形态：" + DATA.tooth_shape;

			$('#ME_Neighbor').text(ME_Neighbor_Text);

			// 患牙修复治疗情况
			var ME_Cure_Text = "";
  			ME_Cure_Text += "患牙修复治疗情况：" + DATA.treatment + "，";
  			if (DATA.orthodontic != "否") {
  				ME_Cure_Text += "没有正畸治疗史";
  			} else if (DATA.orthodontic != "是") {
  				ME_Cure_Text += "有正畸治疗史";
  			}
			$('#ME_Cure').text(ME_Cure_Text);

			// X线片表现
			var ME_X_Text = "";

  			if (DATA.X_Ray_depth != "") {
  				ME_X_Text += "程度：" + DATA.X_Ray_depth + "，";
  			}
  			if (DATA.X_Ray_fill_quality != "") {
  				ME_X_Text += "充填体影像：" + DATA.X_Ray_fill_quality + "，";
  			}
  			if (DATA.CT_shows != "") {
  				ME_X_Text += "CT表现：" + DATA.CT_shows + "，";
  			}
  			if (DATA.piece != "") {
  				ME_X_Text += "咬翼片表现：" + DATA.piece + "，";
  			}
  			ME_X_Text += "部位：" + DATA.X_Ray_location;

			$('#ME_X').text(ME_X_Text);
  		}
	});

	if (DATA == null) {$('#submit').show();};

	// ******************************************************
	// 提交表单数据
	$('form').form({
		onSuccess: function() {
	    	var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";
		    $.ajax({
	      		url : URL_MOUTHEXAM,
	      		type: DATA == null ? "post" : "PUT", 
	      		data: AddtionParameter + $(this).serialize(),
	      		dataType: "json",
	      		error: function(){
		        	alert("网络连接错误...");
	      		},
	      		success: function(data){
	        		location.reload();
	      		}
	    	});
    	
			return false;
		}
	});

	// ******************************************************
	// 修改口腔检查
	$('.edit.button').click(function(){
		$('#display').hide();

		// FIXME: 添加空元素判断
        $('select[name=secondary]').dropdown("set selected", DATA.secondary);
        $('select[name=caries_tired]').dropdown("set selected", DATA.caries_tired);
        $('select[name=depth]').dropdown("set selected", DATA.depth);
        $('select[name=cold]').dropdown("set selected", DATA.cold);
        $('select[name=hot]').dropdown("set selected", DATA.hot);
        $('select[name=touch]').dropdown("set selected", DATA.touch);
        $('select[name=bite]').dropdown("set selected", DATA.bite);
        $('select[name=color_of_caries]').dropdown("set selected", DATA.color_of_caries);
        $('select[name=flex_of_caries]').dropdown("set selected", DATA.flex_of_caries);
        $('select[name=fill]').dropdown("set selected", DATA.fill);
    	$('input[name=vitality_value_of_teeth]').val(DATA.vitality_value_of_teeth);

        $('select[name=gingival_hyperemia]').dropdown("set selected", DATA.gingival_hyperemia);
        $('select[name=tartar_up]').dropdown("set selected", DATA.tartar_up);
        $('select[name=tartar_down]').dropdown("set selected", DATA.tartar_down);
        $('select[name=bop]').dropdown("set selected", DATA.bop);
        $('select[name=periodontal_pocket_depth]').dropdown("set selected", DATA.periodontal_pocket_depth);
        $('select[name=furcation]').dropdown("set selected", DATA.furcation);
        $('select[name=location]').dropdown("set selected", DATA.location);
        $('select[name=mobility]').dropdown("set selected", DATA.mobility);
        $('select[name=fistula]').dropdown("set selected", DATA.fistula);
        $('select[name=overflow_pus]').dropdown("set selected", DATA.overflow_pus);
    	$('input[name=loss_caries_index_up]').val(DATA.loss_caries_index_up);

        $('select[name=development_of_the_situation]').dropdown("set selected", DATA.development_of_the_situation);
        $('select[name=relations_between_teeth]').dropdown("set selected", DATA.relations_between_teeth);
        $('select[name=is_teeth_crowd]').dropdown("set selected", DATA.is_teeth_crowd);
        $('select[name=involution_teeth]').dropdown("set selected", DATA.involution_teeth);
        $('select[name=tooth_shape]').dropdown("set selected", DATA.tooth_shape);
        $('select[name=treatment]').dropdown("set selected", DATA.treatment);
        $('select[name=orthodontic]').dropdown("set selected", DATA.orthodontic);
        $('select[name=X_Ray_location]').dropdown("set selected", DATA.X_Ray_location);
        $('select[name=X_Ray_depth]').dropdown("set selected", DATA.X_Ray_depth);
        $('select[name=X_Ray_fill_quality]').dropdown("set selected", DATA.X_Ray_fill_quality);
    	$('input[name=CT_shows]').val(DATA.CT_shows);
    	$('input[name=piece]').val(DATA.piece);
        
		$('#submit').show();
	});

	// ******************************************************
	// 添加牙位
	$('#addLocation').click(function(){
		$('.ui.modal').modal({
			onApprove: function(){
				var $AddLocation = $('#addLocation');
				var $ToothType   = $('.modal .item.active');
				var ToothTypeValue = $ToothType.attr('data-tab');
				var ToothTypeName  = $ToothType.text();

				$AddLocation.nextAll().remove();
				$AddLocation.after("<a class='ui orange label'>" + ToothTypeName + "</a>");

				var FormData = ToothTypeValue;
				$('.modal .segment.active .teal.label').each(function(){
					var ToothLocation = $(this).text();
					FormData += "," + ToothLocation;

					$AddLocation.next().last().after("<a class='ui teal label'>" + ToothLocation + "</a>");
				});

				$('input[name=tooth_location]').val(FormData);
			}
		}).modal('show');
	});
});