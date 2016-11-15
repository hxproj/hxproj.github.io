$(document).ready(function(){
  	$('#context .menu .item').tab({ context: $('#context') });
	
    var DATA       = null,
    	U_ID       = Number(requestParameter("uid")),
		T_ID       = Number(requestParameter("tid")),
		Image_type = 2,
		NewLine    = "<br/><br/>";

	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_CURE,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      	async    : false,
  		success  : function(data){
  			$('#context').hide();
  			DATA = data;

        	// 表头
        	$('#display th').text("处置 - " + decodeURI(requestParameter("name")));

	        // 设置牙位信息
	        /*
	        $.get(URL_TOOTH, {tooth_id : DATA.tooth_id}, function(data){
	        	$('#ToothLocation').text(data.tooth_location);
	        }, "json");
			*/
	        
  			// 牙非手术治疗
  			if (DATA.handle_type == 0) {
  				$('#Method').text("牙非手术治疗：" + DATA.specific_method);

  				var Describe_Text = "<bold>" + DATA.specific_method + "：</bold>";
  				switch (DATA.specific_method) {
  					case "药物治疗": {
  						Describe_Text += "将" + DATA.fluorination + "，" + DATA.silver_nitrate + "涂布于龋损处30s";
  						break;
  					}
  					case "再矿化治疗": {
  						Describe_Text += "患牙清洁，干燥，将矿化液浸湿的小棉球置于患牙牙面，反复涂搽3-4次";
  						break;
  					}
  					case "窝沟封闭": {
  						Describe_Text += "" + NewLine
  							+ "1. 清洁牙面： 在低速手机上装好" + DATA.additional_device 
  							+ "，蘸取适量" + DATA.reagent + "于牙面，对牙面和窝沟来回刷洗1分钟，同时不断滴水保持毛刷湿润" + NewLine
  							+ "2. 用棉纱球隔湿，压缩空气牙面吹干，" + DATA.tools + "蘸取酸蚀剂置于牙尖斜面的2/3上。" + DATA.time_of_etching + NewLine
  							+ "3. 流水冲洗牙面10-15秒，去除牙釉质表面和反应沉淀物" + NewLine
  							+ "4. 洗刷笔蘸取适量封闭剂沿窝沟从远中向近中涂布在酸蚀后的牙面上" + NewLine
  							+ "5. " + DATA.lamp + NewLine
  							+ "6. 探针进行检查，调合，" + DATA.check_time;
  						break;
  					}
  				}
  				$('#Describe').html(Describe_Text);
  			}
  			// 手术治疗
  			else if (DATA.handle_type == 1) {
  				$('#Method').text(DATA.specific_method);

  				var Describe_Text = "<h4 class='ui blue header'>" + DATA.specific_method + "：</h4>";

	  			// 获取牙位信息
	  			var MouthData = null;
	  			$.ajax({
			  		url      : URL_MOUTHEXAM,
			  		type     : "get",
			  		data     : {tooth_id : DATA.tooth_id},
			  		dataType : "json",
	      			async    : false,
			  		success  : function(data) {
			  			MouthData = data.tooth_location;
			  		}
	  			})
	  			// 1. 麻醉
	  			var Anesthesia = "";
	  			if (MouthData != null) {
	  				Anesthesia += MouthData + "牙";
					Anesthesia += "使用" + DATA.anesthesia_medicine + "，";
					Anesthesia += "局部" + DATA.part_anesthesia + "，";
					Anesthesia += DATA.rubber;
	  			} else {
					Anesthesia += "使用" + DATA.anesthesia_medicine + "，";
					Anesthesia += "局部" + DATA.part_anesthesia + "，";
					Anesthesia += DATA.rubber;
					Anesthesia += "<bold>（注：还未设置病人“牙位”，请到“口腔检查”功能项中完善相关信息）</bold>";
	  			}

  				switch (DATA.specific_method) {
  					case "牙树脂直接充填修复": {
  						// 1. 
  						Describe_Text += "1. ";
  						Describe_Text += Anesthesia;
						Describe_Text += NewLine;

  						// 2.
						Describe_Text += "2. ";
						if (DATA.microscope == "显微镜下") {
							Describe_Text += DATA.microscope + "，";
						}

						Describe_Text += DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
						Describe_Text += DATA.shape_of_hole + "制备洞形，";
						Describe_Text += "深度：" + DATA.depth_of_hole + "mm";
						Describe_Text += NewLine;

						// 3. 
						Describe_Text += "3. 干燥，隔湿，";
						Describe_Text += DATA.is_piece + "，";
						Describe_Text += DATA.is_chock;
						Describe_Text += NewLine;

  						// 4.
						Describe_Text += "4. ";
						Describe_Text += DATA.shade_guide + "，";
						Describe_Text += "选择牙色" + DATA.color_of_tooth;
						Describe_Text += NewLine;

  						// 5.
						Describe_Text += "5. ";
						Describe_Text += DATA.disinfect + "窝洞消毒";
						// 如果垫底为空，则不显示
						if (DATA.bottom != "")
						{
							Describe_Text += "，" + DATA.bottom;
						}
						Describe_Text += NewLine;

  						// 6. TODO
						Describe_Text += "6. 涂布粘接剂：";
						Describe_Text += DATA.etching_type + "：";
						Describe_Text += "全酸蚀粘接系统" == DATA.etching_type ? DATA.full_etching : DATA.full_etching;
						Describe_Text += "，涂布" + DATA.coating_time;
						Describe_Text += "，吹干5s，光照" + DATA.illumination_time;
						Describe_Text += NewLine;

  						// 7.
						Describe_Text += "7. 树脂：";
						Describe_Text += DATA.resin;
						Describe_Text += NewLine;

  						// 8.
						Describe_Text += "8. 修型：";
						Describe_Text += DATA.modification + "，";
						Describe_Text += DATA.lamp + "光照" + DATA.time_of_lamp + "，"
						Describe_Text += DATA.polishing + "调合打磨抛光";
						Describe_Text += NewLine;

  						break;
  					}
  					case "牙安抚治疗&树脂充填修复": {
  						// 初诊
  						Describe_Text += "<bold>初诊：</bold>";
						Describe_Text += "使用"+ DATA.appease_medicine + "，";
						Describe_Text += "观察" + DATA.observed_time;
						Describe_Text += NewLine;

  						// 复诊：1. 
  						Describe_Text += "<bold>复诊：</bold>";
						Describe_Text += NewLine;
  						Describe_Text += "1. ";
  						Describe_Text += Anesthesia;
						Describe_Text += NewLine;

  						// 2.
						Describe_Text += "2. 显微镜下，";
						Describe_Text += DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
						Describe_Text += DATA.shape_of_hole + "制备洞形，";
						Describe_Text += "深度：" + DATA.depth_of_hole + "mm";
						Describe_Text += NewLine;

						// 3. 
						Describe_Text += "3. 干燥，隔湿，";
						Describe_Text += DATA.is_piece + "，";
						Describe_Text += DATA.is_chock;
						Describe_Text += NewLine;

  						// 4.
						Describe_Text += "4. ";
						Describe_Text += DATA.shade_guide + "，";
						Describe_Text += "选择牙色" + DATA.color_of_tooth;
						Describe_Text += NewLine;

  						// 5.
						Describe_Text += "5. ";
						Describe_Text += DATA.disinfect + "窝洞消毒";
						// 如果垫底为空，则不显示
						if (DATA.bottom != "")
						{
							Describe_Text += "，" + DATA.bottom;
						}
						Describe_Text += NewLine;

  						// 6. TODO
						Describe_Text += "6. 涂布粘接剂：";
						Describe_Text += DATA.etching_type + "：";
						Describe_Text += "全酸蚀粘接系统" == DATA.etching_type ? DATA.full_etching : DATA.full_etching;
						Describe_Text += "，涂布" + DATA.coating_time;
						Describe_Text += "，吹干5s，光照" + DATA.illumination_time;
						Describe_Text += NewLine;

  						// 7.
						Describe_Text += "7. 树脂：";
						Describe_Text += DATA.resin;
						Describe_Text += NewLine;

  						// 8.
						Describe_Text += "8. 修型：";
						Describe_Text += DATA.modification + "，";
						Describe_Text += DATA.lamp + "光照" + DATA.time_of_lamp + "，"
						Describe_Text += DATA.polishing + "调合打磨抛光";
						Describe_Text += NewLine;

  						break;
  					}
  					case "嵌体修复": {
  						// 1. 
  						Describe_Text += "1. ";
  						Describe_Text += Anesthesia;
						Describe_Text += NewLine;

  						// 2.
						Describe_Text += "2. 显微镜下，";
						Describe_Text += DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
						Describe_Text += DATA.shape_of_hole + "制备洞形，";
						Describe_Text += "深度：" + DATA.depth_of_hole + "mm";
						Describe_Text += NewLine;

  						// 3.
						Describe_Text += "3. ";
						Describe_Text += DATA.shade_guide + "，";
						Describe_Text += "选择牙色" + DATA.color_of_tooth;
						Describe_Text += NewLine;

						// 4.
						Describe_Text += "4. ";
						Describe_Text += "取模材料：" + DATA.modulo + "，";
						Describe_Text += "嵌体材料：" + DATA.inlay;
						Describe_Text += NewLine;

  						// 5.
						Describe_Text += "5. ";
						Describe_Text += DATA.disinfect + "窝洞消毒";
						// 如果垫底为空，则不显示
						if (DATA.bottom != "")
						{
							Describe_Text += "，" + DATA.bottom;
						}
						Describe_Text += NewLine;

  						// 6. TODO
						Describe_Text += "6. 涂布粘接剂：";
						Describe_Text += DATA.etching_type + "：";
						Describe_Text += "全酸蚀粘接系统" == DATA.etching_type ? DATA.full_etching : DATA.full_etching;
						Describe_Text += "，涂布" + DATA.coating_time;
						Describe_Text += "，吹干5s，光照" + DATA.illumination_time;
						Describe_Text += NewLine;

  						// 7.
						Describe_Text += "7. 放置嵌体";
						Describe_Text += NewLine;

  						// 8.
						Describe_Text += "8. ";
						Describe_Text += DATA.polishing + "调合打磨抛光";
						Describe_Text += NewLine;

  						break;
  					}
  					case "贴面修复": {
  						// 1. 
  						Describe_Text += "1. ";
  						Describe_Text += Anesthesia;
						Describe_Text += NewLine;

  						// 2.
						Describe_Text += "2. 显微镜下，";
						Describe_Text += DATA.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
						Describe_Text += DATA.shape_of_hole + "制备洞形，";
						Describe_Text += "深度：" + DATA.depth_of_hole + "mm";
						Describe_Text += NewLine;

  						// 3.
						Describe_Text += "3. ";
						Describe_Text += DATA.shade_guide + "，";
						Describe_Text += "选择牙色" + DATA.color_of_tooth;
						Describe_Text += NewLine;

						// 4.
						Describe_Text += "4. ";
						Describe_Text += "取模材料：" + DATA.modulo + "，";
						Describe_Text += "嵌体材料：" + DATA.inlay;
						Describe_Text += NewLine;

  						// 5.
						Describe_Text += "5. ";
						Describe_Text += DATA.disinfect + "窝洞消毒";
						// 如果垫底为空，则不显示
						if (DATA.bottom != "")
						{
							Describe_Text += "，" + DATA.bottom;
						}
						Describe_Text += NewLine;

  						// 6. TODO
						Describe_Text += "6. 涂布粘接剂：";
						Describe_Text += DATA.etching_type + "：";
						Describe_Text += "全酸蚀粘接系统" == DATA.etching_type ? DATA.full_etching : DATA.full_etching;
						Describe_Text += "，涂布" + DATA.coating_time;
						Describe_Text += "，吹干5s，光照" + DATA.illumination_time;
						Describe_Text += NewLine;

  						// 7.
						Describe_Text += "7. 放置贴面";
						Describe_Text += NewLine;

  						// 8.
						Describe_Text += "8. ";
						Describe_Text += DATA.polishing + "调合打磨抛光";
						Describe_Text += NewLine;

  						break;
  					}
  				}
  				$('#Describe').html(Describe_Text);
  			}

		    // 显示图片
			$.ajax({
				url      : URL_IMAGEUPLOAD,
				type     : "GET",
				data     : {tooth_id : T_ID, type : Image_type},
				dataType : "json",
				success  : function(FileData) {

					if (FileData.length == 0) {
						$('#IMAGE').text("未添加任何图片，请点击右下角修改按钮添加");
					} else {
						$.each(FileData, function(){
							var $ClonedImage = $('#IMAGE .hidden.image').clone().removeClass('hidden');
							$ClonedImage.attr("value", this.img_id);

							var ImagePath = this.path;
							ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
							window.loadImage(ImagePath, function(){
								$ClonedImage.find('img').attr('src', ImagePath);
								$ClonedImage.find('.corner').removeClass('hidden');
							});
							
							$ClonedImage.find('.corner').bind('click', function(){
								var $Image = $(this).parent();
		                
								$('#deletemodal').modal({
									onApprove: function() {
										$.ajax({
											url      : URL_IMAGEUPLOAD + toquerystring({picture_id : $Image.attr("value")}),
											type     : "DELETE",
											data     : {},
											dataType : "text",
											error    : function(data) {
												alert("删除文件失败，请检查网络设置。");
											},
											success  : function() {
												$Image.remove();
											}
										});
									}
								}).modal('show');
	              			});

							$('#IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
						});
					}
				}
			});

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
		shape_of_hole_display: {
			identifier: 'shape_of_hole_display',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole_display: {
			identifier: 'depth_of_hole_display',
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
		etching_type: {
			identifier: 'etching_type',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择酸蚀粘接系统类型'
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
		shape_of_hole_display: {
			identifier: 'shape_of_hole_display',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole_display: {
			identifier: 'depth_of_hole_display',
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
		etching_type: {
			identifier: 'etching_type',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择酸蚀粘接系统类型'
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
		shape_of_hole_display: {
			identifier: 'shape_of_hole_display',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择制备洞形'
				}
			]
		},
		depth_of_hole_display: {
			identifier: 'depth_of_hole_display',
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
		etching_type: {
			identifier: 'etching_type',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择酸蚀粘接系统类型'
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

		var FileID = $(this).find('input[type=file]').attr("id");
		$(this).form({
			fields   : Rules,
			inline   : true,
			onSuccess: function(){
				var AddtionFormField = toform({
					user_id  : U_ID, 
					tooth_id : T_ID,
					shape_of_hole : $(this).form('get value', 'shape_of_hole_display'),
					depth_of_hole : $(this).form('get value', 'depth_of_hole_display'),
					//depth_of_hole : $(this).form('get value', 'depth_of_hole_display') + "mm",
				});

				$.ajax({
					url      : URL_CURE,
					type     : DATA == null ? "POST" : "PUT", 
					data     : AddtionFormField + $(this).serialize(),
					dataType : "json",
					error    : function() {networkError();},
					success  : function(data) {
						// 上传图片
						$.ajaxFile({
							url           : URL_IMAGEUPLOAD, 
							type          : 'POST',  
							fileElementId : FileID,
							dataType      : 'text',
							data          : {tooth_id : data.tooth_id, picture_type : Image_type},
							async         : false,  
							cache         : false,  
							contentType   : false,  
							processData   : false,
							success       : function() {
								location.reload()
							},
							error         : function() {
								alert("文件上传失败");
							}
						});
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

		$MainContextLink = $('#MainContext a').removeClass('active');
		$TabSegment      = $('.tab.segment').removeClass('active');
		// 牙非手术治疗
  		if (DATA.handle_type == 0) {
  			ChangeTabActive($MainContextLink, $TabSegment, 0);

  			$DetailContextLink = $('#contextDetail .menu a').removeClass('active');
  			$DetailTab         = $('#contextDetail .ui.tab').removeClass('active');
			switch (DATA.specific_method) {
				case "药物治疗": {
  					ChangeTabActive($DetailContextLink, $DetailTab, 0);

  					$('select[name=fluorination]').dropdown("set selected", DATA.fluorination);
        			$('select[name=silver_nitrate]').dropdown("set selected", DATA.silver_nitrate);

					break;
				}
				case "再矿化治疗": {
  					ChangeTabActive($DetailContextLink, $DetailTab, 1);
					break;
				}
				case "窝沟封闭": {
  					ChangeTabActive($DetailContextLink, $DetailTab, 2);

  					$('select[name=additional_device]').dropdown("set selected", DATA.additional_device);
        			$('select[name=reagent]').dropdown("set selected", DATA.reagent);
        			$('select[name=tools]').dropdown("set selected", DATA.tools);
        			$('select[name=time_of_etching]').dropdown("set selected", DATA.time_of_etching);
        			$('select[name=lamp]').dropdown("set selected", DATA.lamp);
        			$('select[name=check_time]').dropdown("set selected", DATA.check_time);

					break;
				}
			}
  		}
		// 手术治疗
		else if (DATA.handle_type == 1) {

  			switch (DATA.specific_method) {
  				case "牙树脂直接充填修复": {
  					ChangeTabActive($MainContextLink, $TabSegment, 1);

  					$('select[name=anesthesia_medicine]').dropdown("set selected", DATA.anesthesia_medicine);
        			$('select[name=part_anesthesia]').dropdown("set selected", DATA.part_anesthesia);
        			$('select[name=rubber]').dropdown("set selected", DATA.rubber);
        			$('select[name=tools]').dropdown("set selected", DATA.tools);

        			// 制备洞型
        			$.each(DATA.shape_of_hole.split(','), function(){
        				$('select[name=shape_of_hole_display]').dropdown("set selected", this);
        			});
        			$('input[name=depth_of_hole_display]').val(DATA.depth_of_hole);

        			$('select[name=is_piece]').dropdown("set selected", DATA.is_piece);
        			$('select[name=is_chock]').dropdown("set selected", DATA.is_chock);
        			$('select[name=shade_guide]').dropdown("set selected", DATA.shade_guide);
        			$('select[name=color_of_tooth]').dropdown("set selected", DATA.color_of_tooth);
        			$('select[name=disinfect]').dropdown("set selected", DATA.disinfect);
        			$('select[name=bottom]').dropdown("set selected", DATA.bottom);

        			// 设置酸蚀粘接系统类型
        			$('select[name=etching_type]').dropdown("set selected", DATA.etching_type);
        			changeEtching(DATA.etching_type);
        			$('select[name=full_etching]').dropdown("set selected", DATA.full_etching);
        			$('select[name=self_etching]').dropdown("set selected", DATA.self_etching);

        			$('select[name=coating_time]').dropdown("set selected", DATA.coating_time);
        			$('select[name=illumination_time]').dropdown("set selected", DATA.illumination_time);
        			$('select[name=resin]').dropdown("set selected", DATA.resin);
        			$('select[name=modification]').dropdown("set selected", DATA.modification);
        			$('select[name=lamp]').dropdown("set selected", DATA.lamp);
        			$('select[name=time_of_lamp]').dropdown("set selected", DATA.time_of_lamp);
        			$('select[name=polishing]').dropdown("set selected", DATA.polishing);

					break;
				}
  				case "牙安抚治疗&树脂充填修复": {
  					ChangeTabActive($MainContextLink, $TabSegment, 2);
  					$('select[name=appease_medicine]').dropdown("set selected", DATA.appease_medicine);
  					$('select[name=observed_time]').dropdown("set selected", DATA.observed_time);

  					$('select[name=anesthesia_medicine]').dropdown("set selected", DATA.anesthesia_medicine);
        			$('select[name=part_anesthesia]').dropdown("set selected", DATA.part_anesthesia);
        			$('select[name=rubber]').dropdown("set selected", DATA.rubber);
        			$('select[name=tools]').dropdown("set selected", DATA.tools);

        			// 制备洞型
        			$.each(DATA.shape_of_hole.split(','), function(){
        				$('select[name=shape_of_hole_display]').dropdown("set selected", this);
        			});
        			$('input[name=depth_of_hole_display]').val(DATA.depth_of_hole);

        			$('select[name=is_piece]').dropdown("set selected", DATA.is_piece);
        			$('select[name=is_chock]').dropdown("set selected", DATA.is_chock);
        			$('select[name=shade_guide]').dropdown("set selected", DATA.shade_guide);
        			$('select[name=color_of_tooth]').dropdown("set selected", DATA.color_of_tooth);
        			$('select[name=disinfect]').dropdown("set selected", DATA.disinfect);
        			$('select[name=bottom]').dropdown("set selected", DATA.bottom);
        			
        			// 设置酸蚀粘接系统类型
        			$('select[name=etching_type]').dropdown("set selected", DATA.etching_type);
        			changeEtching(DATA.etching_type);
        			$('select[name=full_etching]').dropdown("set selected", DATA.full_etching);
        			$('select[name=self_etching]').dropdown("set selected", DATA.self_etching);

        			$('select[name=coating_time]').dropdown("set selected", DATA.coating_time);
        			$('select[name=illumination_time]').dropdown("set selected", DATA.illumination_time);
        			$('select[name=resin]').dropdown("set selected", DATA.resin);
        			$('select[name=modification]').dropdown("set selected", DATA.modification);
        			$('select[name=lamp]').dropdown("set selected", DATA.lamp);
        			$('select[name=time_of_lamp]').dropdown("set selected", DATA.time_of_lamp);
        			$('select[name=polishing]').dropdown("set selected", DATA.polishing);
					break;
				}
  				case "嵌体修复": {
  					ChangeTabActive($MainContextLink, $TabSegment, 3);

  					$('select[name=anesthesia_medicine]').dropdown("set selected", DATA.anesthesia_medicine);
        			$('select[name=part_anesthesia]').dropdown("set selected", DATA.part_anesthesia);
        			$('select[name=rubber]').dropdown("set selected", DATA.rubber);
        			$('select[name=tools]').dropdown("set selected", DATA.tools);

        			// 制备洞型
        			$.each(DATA.shape_of_hole.split(','), function(){
        				$('select[name=shape_of_hole_display]').dropdown("set selected", this);
        			});
        			$('input[name=depth_of_hole_display]').val(DATA.depth_of_hole);

        			$('select[name=is_piece]').dropdown("set selected", DATA.is_piece);
        			$('select[name=shade_guide]').dropdown("set selected", DATA.shade_guide);
        			$('select[name=color_of_tooth]').dropdown("set selected", DATA.color_of_tooth);
        			
        			$('select[name=modulo]').dropdown("set selected", DATA.modulo);
        			$('select[name=inlay]').dropdown("set selected", DATA.inlay);
        			

        			$('select[name=disinfect]').dropdown("set selected", DATA.disinfect);
        			$('select[name=bottom]').dropdown("set selected", DATA.bottom);
        			
        			// 设置酸蚀粘接系统类型
        			$('select[name=etching_type]').dropdown("set selected", DATA.etching_type);
        			changeEtching(DATA.etching_type);
        			$('select[name=full_etching]').dropdown("set selected", DATA.full_etching);
        			$('select[name=self_etching]').dropdown("set selected", DATA.self_etching);

        			$('select[name=coating_time]').dropdown("set selected", DATA.coating_time);
        			$('select[name=illumination_time]').dropdown("set selected", DATA.illumination_time);
        			
        			$('select[name=polishing]').dropdown("set selected", DATA.polishing);
					break;
				}
  				case "贴面修复": {
  					ChangeTabActive($MainContextLink, $TabSegment, 4);

  					$('select[name=anesthesia_medicine]').dropdown("set selected", DATA.anesthesia_medicine);
        			$('select[name=part_anesthesia]').dropdown("set selected", DATA.part_anesthesia);
        			$('select[name=rubber]').dropdown("set selected", DATA.rubber);
        			$('select[name=tools]').dropdown("set selected", DATA.tools);
        			
        			// 制备洞型
        			$.each(DATA.shape_of_hole.split(','), function(){
        				$('select[name=shape_of_hole_display]').dropdown("set selected", this);
        			});
        			$('input[name=depth_of_hole_display]').val(DATA.depth_of_hole);

        			$('select[name=is_piece]').dropdown("set selected", DATA.is_piece);
        			$('select[name=shade_guide]').dropdown("set selected", DATA.shade_guide);
        			$('select[name=color_of_tooth]').dropdown("set selected", DATA.color_of_tooth);
        			
        			$('select[name=modulo]').dropdown("set selected", DATA.modulo);
        			$('select[name=inlay]').dropdown("set selected", DATA.inlay);
        			

        			$('select[name=disinfect]').dropdown("set selected", DATA.disinfect);
        			$('select[name=bottom]').dropdown("set selected", DATA.bottom);

        			// 设置酸蚀粘接系统类型
        			$('select[name=etching_type]').dropdown("set selected", DATA.etching_type);
        			changeEtching(DATA.etching_type);
        			$('select[name=full_etching]').dropdown("set selected", DATA.full_etching);
        			$('select[name=self_etching]').dropdown("set selected", DATA.self_etching);

        			$('select[name=coating_time]').dropdown("set selected", DATA.coating_time);
        			$('select[name=illumination_time]').dropdown("set selected", DATA.illumination_time);
        			
        			$('select[name=polishing]').dropdown("set selected", DATA.polishing);
					break;
				}
  			}
		}

    	$('#context .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
		$('#context').show();
	});

	function ChangeTabActive($Context, $TabSegment, Index){
		$Context.eq(Index).addClass('active');
		$TabSegment.eq(Index).addClass('active');
	}
	
	// ***************************************************************
	// FUNCTION: 下一项，USPHS
	$('.right.labeled.button').click(function(){
   		redirection("USPHS.html", U_ID, T_ID, requestParameter("name"));
	});
	// ***************************************************************
	// FUNCTION: 上一项，难度评估
	$('.left.labeled.button').click(function(){
   		redirection("DifficultyAssessment.html", U_ID, T_ID, requestParameter("name"));
	});

	// ***************************************************************
	// FUNCTION: 导航栏
	$('#nav a').not('.active, .return').click(function(){
		$(this).prop('href', $(this).prop('href') + toquerystring({
			uid  : U_ID,
			tid  : T_ID,
			name : requestParameter("name")
		}));
	});
  
	// ***************************************************************
	// FUNCTION: 导航栏，返回病历
	$('#nav a.return').click(function(){
		$(this).prop('href', "MedicalRecordDetail.html" + toquerystring({uid  : U_ID}));
	});

	// ***************************************************************
	// FUNCTION: 酸蚀粘接系统类型选择
	$('select[name=etching_type]').parent().dropdown({
		onChange: function(value, text, $selected) { changeEtching(value); }
	});

	function changeEtching(EtchingType) {
		var $FullEtching = $('.tag_full_etching'),
			$SelfEtching = $('.tag_self_etching');

		if (EtchingType == "全酸蚀粘接系统") {
			$SelfEtching.addClass('invisible');
			$FullEtching.removeClass('invisible');
		} else if (EtchingType == "自酸蚀粘接系统") {
			$FullEtching.addClass('invisible');
			$SelfEtching.removeClass('invisible');
		}
	}
});