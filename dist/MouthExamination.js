$(document).ready(function(){
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
  			if (DATA.fistula != "正常") {
  				ME_Neighbor_Text += "患牙与邻牙接触关系正常，";
  			} else if (DATA.gingival_hyperemia != "否") {
  				ME_Neighbor_Text += "患牙与邻牙接触关系不正常，";
  			}
  			if (DATA.fistula != "否") {
  				ME_Neighbor_Text += "牙列不拥挤，";
  			} else if (DATA.gingival_hyperemia != "是") {
  				ME_Neighbor_Text += "牙列拥挤，";
  			}
  			if (DATA.fistula != "有") {
  				ME_Neighbor_Text += "患牙有对合牙";
  			} else if (DATA.gingival_hyperemia != "无") {
  				ME_Neighbor_Text += "患牙无对合牙";
  			}

			$('#ME_Neighbor').text(ME_Neighbor_Text);

			// 患牙修复治疗情况
			var ME_Cure_Text = "";
			$('#ME_Cure').text(ME_Cure_Text);

			// X线片表现
			var ME_X_Text = "";
			$('#ME_X').text(ME_X_Text);

  		}
	});

	if (DATA == null) {$('#submit').show();};

	// ******************************************************
	// 提交表单数据
	$('form').form({
		fields: {
			vitality_value_of_teeth: {
				rules: [
					{
						type: 'empty',
						prompt : '牙齿活力值不能为空'
					}
				]
			}
		},
		inline   : true,
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

  		// FIXME: todo
  		
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

	// ******************************************************
	// Other
	$('.modal .ui.label').click(function(){ $(this).toggleClass('teal'); });
	$('#context .menu .item').tab({ context: $('#context') });
});