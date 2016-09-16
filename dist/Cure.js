$(document).ready(function(){
	// 设置表头用户数据
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));
  	$('#context .menu .item').tab({ context: $('#context') });
	
    var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));

	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_CURE,
  		type    : "get",
  		data    : addParameter("tooth_id", T_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#context').hide();

  			DATA = data;
  			
  			// 牙非手术治疗
  			if (DATA.handle_type == 0) {
  				$('#Method').text("牙非手术治疗 - " + DATA.specific_method);

  				var Describe_Text = "";
  				switch (DATA.specific_method) {
  					case "药物治疗": {
  						Describe_Text += "将" + DATA.fluorination + "，" + DATA.silver_nitrate + "涂布于龋损处30s";
  						break;
  					}
  					case "再矿物治疗": {
  						Describe_Text += "患牙清洁，干燥，将矿化液浸湿的小棉球置于患牙牙面，反复涂搽3-4次";
  						break;
  					}
  					case "窝沟封闭": {
  						Describe_Text += "1. 清洁牙面： 在低速手机上装好" + DATA.additional_device 
  							+ "，蘸取适量" + DATA.reagent + "于牙面，对牙面和窝沟来回刷洗1分钟，同时不断滴水保持毛刷湿润<br/><br/>"
  							+ "2. 用棉纱球隔湿,压缩空气牙面吹干，" + DATA.tools + "蘸取酸蚀剂置于牙尖斜面的2／3上。酸蚀" + DATA.time_of_etching + "<br/><br/>" 
  							+ "3. 流水冲洗牙面10-15秒，去除牙釉质表面和反应沉淀物<br/><br/>" 
  							+ "4. 洗刷笔蘸取适量封闭剂沿窝沟从远中向近中涂布在酸蚀后的牙面上<br/><br/>" 
  							+ "5. 1-2分钟自行" + DATA.lamp + "灯离牙尖1mm照射20-40秒<br/><br/>" 
  							+ "6. 探针进行检查，调合，定期" + DATA.check_time + "复查";
  						break;
  					}
  				}
  				$('#Describe').html(Describe_Text);
  			}

  			// 手术治疗
  			else if (DATA.handle_type == 1) {
  				$('#Method').text(DATA.specific_method);

  				var Describe_Text = "";
  				switch (DATA.specific_method) {
  					case "牙树脂直接填充修复": {
  						// 1. 
  						Describe_Text += "1. 使用" + DATA.anesthesia_medicine + "局部" + DATA.part_anesthesia + "，";
  						if (DATA.rubber == "否") {
  							Describe_Text += "不使用橡皮障<br/><br/>";
  						} else if (DATA.rubber == "是") {
  							Describe_Text += "使用橡皮障<br/><br/>";
  						}

  						// 2.
						Describe_Text += "2. 显微镜下，" + DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，制备洞形：" + DATA.shape_of_hole 
							+ "，深度：" + DATA.depth_of_hole + "mm<br/><br/>" ;

						// 3. 
						Describe_Text += "3. 干燥，隔湿，";
  						if (DATA.is_piece == "否") {
  							Describe_Text += "不使用成形片，";
  						} else if (DATA.is_piece == "是") {
  							Describe_Text += "使用成形片，";
  						}
  						if (DATA.is_chock == "否") {
  							Describe_Text += "不使用楔子";
  						} else if (DATA.is_chock == "是") {
  							Describe_Text += "使用楔子";
  						}
						Describe_Text += "<br/><br/>";

  						// 4.
						Describe_Text += "4. " + DATA.shade_guide + "选择牙色：" + DATA.color_of_tooth + "<br/><br/>" ;

  						// 5.
						Describe_Text += "5. 窝洞消毒：" + DATA.disinfect + "，垫底：" + DATA.bottom + "<br/><br/>" ;

  						// 6.
						Describe_Text += "6. 涂布粘接剂：全酸蚀粘接系统：" + DATA.full_etching + "，自酸蚀粘接系统：" + DATA.self_etching  
							+ "，涂布时间：" + DATA.coating_time + "，吹干5s，光照" + DATA.illumination_time + "<br/><br/>" ;

  						// 7.
						Describe_Text += "7. 树脂：" + DATA.resin + "<br/><br/>" ;

  						// 8.
						Describe_Text += "8. " + DATA.modification + "修型，" + DATA.lamp 
							+ "光照" + DATA.time_of_lamp + "，" + DATA.polishing + "打磨抛光" + "<br/><br/>" ;

  						break;
  					}
  					case "牙安抚治疗&树脂充填修复": {
  						// 1. 
						Describe_Text += "1. 使用安抚药物：" + DATA.appease_medicine + "，观察时间：" + DATA.observed_time + "<br/><br/>" ;
  						
  						// 2.
  						Describe_Text += "2. 使用" + DATA.anesthesia_medicine + "局部" + DATA.part_anesthesia + "，";
  						if (DATA.rubber == "否") {
  							Describe_Text += "不使用橡皮障<br/><br/>";
  						} else if (DATA.rubber == "是") {
  							Describe_Text += "使用橡皮障<br/><br/>";
  						}

  						// 3.
						Describe_Text += "3. 显微镜下，" + DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，制备洞形：" + DATA.shape_of_hole 
							+ "，深度：" + DATA.depth_of_hole + "mm<br/><br/>" ;

						// 4. 
						Describe_Text += "4. 干燥，隔湿，";
  						if (DATA.is_piece == "否") {
  							Describe_Text += "不使用成形片，";
  						} else if (DATA.is_piece == "是") {
  							Describe_Text += "使用成形片，";
  						}
  						if (DATA.is_chock == "否") {
  							Describe_Text += "不使用楔子";
  						} else if (DATA.is_chock == "是") {
  							Describe_Text += "使用楔子";
  						}
						Describe_Text += "<br/><br/>";

  						// 5.
						Describe_Text += "5. " + DATA.shade_guide + "选择牙色：" + DATA.color_of_tooth + "<br/><br/>" ;
						
  						// 6.
						Describe_Text += "6. 窝洞消毒：" + DATA.disinfect + "，垫底：" + DATA.bottom + "<br/><br/>" ;

  						// 7.
						Describe_Text += "7. 涂布粘接剂：全酸蚀粘接系统：" + DATA.full_etching + "，自酸蚀粘接系统：" + DATA.self_etching  
							+ "，涂布时间：" + DATA.coating_time + "，吹干5s，光照" + DATA.illumination_time + "<br/><br/>" ;

  						// 8.
						Describe_Text += "8. 树脂：" + DATA.resin + "<br/><br/>" ;

  						// 9.
						Describe_Text += "9. " + DATA.modification + "修型，" + DATA.lamp 
							+ "光照" + DATA.time_of_lamp + "，" + DATA.polishing + "打磨抛光" + "<br/><br/>" ;

  						break;
  					}
  					case "嵌体修复": {
  						// 1. 
  						Describe_Text += "1. 使用" + DATA.anesthesia_medicine + "局部" + DATA.part_anesthesia + "，";
  						if (DATA.rubber == "否") {
  							Describe_Text += "不使用橡皮障<br/><br/>";
  						} else if (DATA.rubber == "是") {
  							Describe_Text += "使用橡皮障<br/><br/>";
  						}

  						// 2.
						Describe_Text += "2. 显微镜下，" + DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，制备洞形：" + DATA.shape_of_hole 
							+ "，深度：" + DATA.depth_of_hole + "mm<br/><br/>" ;

						// 3. 
						Describe_Text += "3. " + DATA.is_piece + "干燥，隔湿<br/><br/>";

  						// 4.
						Describe_Text += "4. " + DATA.shade_guide + "选择牙色：" + DATA.color_of_tooth + "<br/><br/>" ;

						// 5.
						Describe_Text += "5. 取模材料：" + DATA.modulo + "，嵌体材料：" + DATA.inlay + "<br/><br/>" ;

  						// 6.
						Describe_Text += "6. 窝洞消毒：" + DATA.disinfect + "，垫底：" + DATA.bottom + "<br/><br/>" ;

  						// 7.
						Describe_Text += "7. 涂布粘接剂：全酸蚀粘接系统：" + DATA.full_etching + "，自酸蚀粘接系统：" + DATA.self_etching  
							+ "，涂布时间：" + DATA.coating_time + "，吹干5s，光照" + DATA.illumination_time + "<br/><br/>" ;

  						// 8.
						Describe_Text += "8. 放置嵌体<br/><br/>" ;

  						// 9.
						Describe_Text += "9. " + DATA.polishing + "打磨抛光" + "<br/><br/>" ;
  						break;
  					}
  					case "贴面修复": {
  						// 1. 
  						Describe_Text += "1. 使用" + DATA.anesthesia_medicine + "局部" + DATA.part_anesthesia + "，";
  						if (DATA.rubber == "否") {
  							Describe_Text += "不使用橡皮障<br/><br/>";
  						} else if (DATA.rubber == "是") {
  							Describe_Text += "使用橡皮障<br/><br/>";
  						}

  						// 2.
						Describe_Text += "2. 显微镜下，" + DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，制备洞形：" + DATA.shape_of_hole 
							+ "，深度：" + DATA.depth_of_hole + "mm<br/><br/>" ;

						// 3. 
						Describe_Text += "3. " + DATA.is_piece + "干燥，隔湿<br/><br/>";

  						// 4.
						Describe_Text += "4. " + DATA.shade_guide + "选择牙色：" + DATA.color_of_tooth + "<br/><br/>" ;

						// 5.
						Describe_Text += "5. 取模材料：" + DATA.modulo + "，嵌体材料：" + DATA.inlay + "<br/><br/>" ;

  						// 6.
						Describe_Text += "6. 窝洞消毒：" + DATA.disinfect + "，垫底：" + DATA.bottom + "<br/><br/>" ;

  						// 7.
						Describe_Text += "7. 涂布粘接剂：全酸蚀粘接系统：" + DATA.full_etching + "，自酸蚀粘接系统：" + DATA.self_etching  
							+ "，涂布时间：" + DATA.coating_time + "，吹干5s，光照" + DATA.illumination_time + "<br/><br/>" ;

  						// 8.
						Describe_Text += "8. 放置贴面<br/><br/>" ;

  						// 9.
						Describe_Text += "9. " + DATA.polishing + "打磨抛光" + "<br/><br/>" ;
  						break;
  					}
  				}
  				$('#Describe').html(Describe_Text);
  			}


  			$('#display').show();
  		}
	});

	if (DATA == null) {$('#context').show();};

	// ***************************************************************
	// FUNCTION: 设置各表单规则
	// 牙非手术治疗 - 药物治疗
	var vForm1Rules = {
		fluorination: {
			identifier: 'fluorination',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择药物氟化物'
				}
			]
		},
		silver_nitrate: {
			identifier: 'silver_nitrate',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择硝酸银种类'
				}
			]
		}
	}
	// 牙非手术治疗 - 窝沟封闭
	var vForm3Rules = {
		additional_device: {
			identifier: 'additional_device',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择低速手机额外装置'
				}
			]
		},
		time_of_etching: {
			identifier: 'time_of_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择酸蚀时间'
				}
			]
		},

		reagent: {
			identifier: 'reagent',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择蘸取试剂类型'
				}
			]
		},
		tools: {
			identifier: 'tools',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择蘸取工具类型'
				}
			]
		},
		lamp: {
			identifier: 'lamp',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择固化灯类型类型'
				}
			]
		},
		check_time: {
			identifier: 'check_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择定期复查时间'
				}
			]
		}
	}
	// 手术治疗 - 牙树脂直接充填修复
	var vForm4Rules = {
		anesthesia_medicine: {
			identifier: 'anesthesia_medicine',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择麻醉药物类型'
				}
			]
		},
		part_anesthesia: {
			identifier: 'part_anesthesia',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择局部麻醉方法'
				}
			]
		},
		tools: {
			identifier: 'tools',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择去龋工具类型'
				}
			]
		},
		shape_of_hole: {
			identifier: 'shape_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole: {
			identifier: 'depth_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入洞形深度'
				}
			]
		},
		shade_guide: {
			identifier: 'shade_guide',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择比色板类型'
				}
			]
		},
		color_of_tooth: {
			identifier: 'color_of_tooth',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择牙色'
				}
			]
		},
		disinfect: {
			identifier: 'disinfect',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择窝洞消毒方法'
				}
			]
		},
		bottom: {
			identifier: 'bottom',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择垫底'
				}
			]
		},
		full_etching: {
			identifier: 'full_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择全酸蚀粘接系统'
				}
			]
		},
		self_etching: {
			identifier: 'self_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择自酸蚀粘接系统'
				}
			]
		},
		coating_time: {
			identifier: 'coating_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择涂布时间'
				}
			]
		},
		illumination_time: {
			identifier: 'illumination_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光照时间'
				}
			]
		},
		resin: {
			identifier: 'resin',
			rules: [
				{
					type   : 'empty',
					prompt : '请选树脂'
				}
			]
		},
		modification: {
			identifier: 'modification',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择修型工具'
				}
			]
		},
		lamp: {
			identifier: 'lamp',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光固化灯类型'
				}
			]
		},
		time_of_lamp: {
			identifier: 'time_of_lamp',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光固化灯光照时间'
				}
			]
		},
		polishing: {
			identifier: 'polishing',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择打磨抛光方式'
				}
			]
		}
	}
	// 手术治疗 - 牙安抚治疗&树脂充填修复
	var vForm5Rules = {
		appease_medicine: {
			identifier: 'appease_medicine',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择安抚药物类型'
				}
			]
		},
		observed_time: {
			identifier: 'observed_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择观察时间'
				}
			]
		},
		anesthesia_medicine: {
			identifier: 'anesthesia_medicine',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择麻醉药物类型'
				}
			]
		},
		part_anesthesia: {
			identifier: 'part_anesthesia',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择局部麻醉方法'
				}
			]
		},
		tools: {
			identifier: 'tools',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择去龋工具类型'
				}
			]
		},
		shape_of_hole: {
			identifier: 'shape_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole: {
			identifier: 'depth_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入洞形深度'
				}
			]
		},
		shade_guide: {
			identifier: 'shade_guide',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择比色板类型'
				}
			]
		},
		color_of_tooth: {
			identifier: 'color_of_tooth',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择牙色'
				}
			]
		},
		disinfect: {
			identifier: 'disinfect',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择窝洞消毒方法'
				}
			]
		},
		bottom: {
			identifier: 'bottom',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择垫底'
				}
			]
		},
		full_etching: {
			identifier: 'full_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择全酸蚀粘接系统'
				}
			]
		},
		self_etching: {
			identifier: 'self_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择自酸蚀粘接系统'
				}
			]
		},
		coating_time: {
			identifier: 'coating_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择涂布时间'
				}
			]
		},
		illumination_time: {
			identifier: 'illumination_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光照时间'
				}
			]
		},
		resin: {
			identifier: 'resin',
			rules: [
				{
					type   : 'empty',
					prompt : '请选树脂'
				}
			]
		},
		modification: {
			identifier: 'modification',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择修型工具'
				}
			]
		},
		lamp: {
			identifier: 'lamp',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光固化灯类型'
				}
			]
		},
		time_of_lamp: {
			identifier: 'time_of_lamp',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光固化灯光照时间'
				}
			]
		},
		polishing: {
			identifier: 'polishing',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择打磨抛光方式'
				}
			]
		}
	}
	// 手术治疗 - 嵌体修复/贴面修复 
	var vForm67Rules = {
		anesthesia_medicine: {
			identifier: 'anesthesia_medicine',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择麻醉药物类型'
				}
			]
		},
		part_anesthesia: {
			identifier: 'part_anesthesia',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择局部麻醉方法'
				}
			]
		},
		tools: {
			identifier: 'tools',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择去龋工具类型'
				}
			]
		},
		shape_of_hole: {
			identifier: 'shape_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole: {
			identifier: 'depth_of_hole',
			rules: [
				{
					type   : 'empty',
					prompt : '请输入洞形深度'
				}
			]
		},
		is_piece: {
			identifier: 'is_piece',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择干燥方法'
				}
			]
		},
		shade_guide: {
			identifier: 'shade_guide',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择比色板类型'
				}
			]
		},
		color_of_tooth: {
			identifier: 'color_of_tooth',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择牙色'
				}
			]
		},
		modulo: {
			identifier: 'modulo',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择取模材料'
				}
			]
		},
		inlay: {
			identifier: 'inlay',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择嵌体材料'
				}
			]
		},
		disinfect: {
			identifier: 'disinfect',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择窝洞消毒方法'
				}
			]
		},
		bottom: {
			identifier: 'bottom',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择垫底'
				}
			]
		},
		full_etching: {
			identifier: 'full_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择全酸蚀粘接系统'
				}
			]
		},
		self_etching: {
			identifier: 'self_etching',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择自酸蚀粘接系统'
				}
			]
		},
		coating_time: {
			identifier: 'coating_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择涂布时间'
				}
			]
		},
		illumination_time: {
			identifier: 'illumination_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择光照时间'
				}
			]
		},
		polishing: {
			identifier: 'polishing',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择打磨抛光方式'
				}
			]
		}
	}

	// ***************************************************************
	// FUNCTION: 提交表单数据
	$.each($('#context form'), function(){

		// 设置当前表单规则
		var Rules = {};
		switch ($(this).attr('id')) {
			case "CureForm1": Rules = vForm1Rules; break;
			case "CureForm3": Rules = vForm3Rules; break;
			case "CureForm4": Rules = vForm4Rules; break;
			case "CureForm5": Rules = vForm5Rules; break;
			case "CureForm6": Rules = vForm67Rules; break;
			case "CureForm7": Rules = vForm67Rules; break;
		}

		$(this).form({
			fields   : Rules,
			inline   : true,
			onSuccess: function(){
				var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

				$.ajax({
					url      : URL_CURE,
					type     : DATA == null ? "POST" : "PUT", 
					data     : AddtionParameter + $(this).serialize(),
					dataType : "json",
					error    : function(){	
						alert("网络连接错误...");
					},
					success: function(data){
						location.reload();
					}
				});

  				return false;
  			}
		});
	});
  	

	// ***************************************************************
	// FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

		$('#context').show();
	});
});