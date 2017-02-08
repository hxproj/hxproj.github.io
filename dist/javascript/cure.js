$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		Image_type = 3,
		IsEditMode = false,
		NewLine    = "<br/><br/>";

	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('#maincontext');
	// INIT Context
	$('#maincontext .menu .item').tab({ context: $('#maincontext') });
	// INIT Basic info
	getBasicInfo(Nav_Item.cure, UID, CID, TID);

	// **************************************************
	// GET
	$.ajax({
		url      : URL_CURE,
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
			$FormSegement.hide();
		}
	});


	// Define field and rule
	var Empty = {
		type   : 'empty',
		prompt : '请选择该项'
	};
	var EmptyInput = {
		type   : 'empty',
		prompt : '请填写该项'
	};
	function Field(field, Rule) {

		// Set Field
		this.identifier = field;
		// Set Rules
		Rule == undefined ? this.rules = [Empty] : this.rules = Rule;
	}
	// ----------------------------------------------------------------------
	// 牙非手术治疗
	// ----------------------------------------------------------------------
	// INIT fields and rules;
	var NoSurgical_MedicalCure_Fields = [
			new Field("fluorination"), new Field("silver_nitrate")
		],
		NoSurgical_PitFissure_Fields = [
			new Field("additional_device"), new Field("reagent"), 
			new Field("tools"), new Field("time_of_etching"), 
			new Field("lamp"), new Field("check_time")
		];
	// **************************************************
	// 药物治疗
	$('#noSurgicalContext form[data-tab=noSurgicalContext1]').form({
		fields: NoSurgical_MedicalCure_Fields,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 再矿化治疗
	$('#noSurgicalContext form[data-tab=noSurgicalContext2]').form({
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 窝沟封闭
	$('#noSurgicalContext form[data-tab=noSurgicalContext3]').form({
		fields: NoSurgical_PitFissure_Fields,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});

	// ----------------------------------------------------------------------
	// 龋病微创修复
	// ----------------------------------------------------------------------
	// INIT fields and rules;
	var MinimalFields1 = [
			new Field("tools"), new Field("shape_of_hole"),
			new Field("depth_of_hole", [EmptyInput])
		],
		MinimalFields2 = [
			new Field("tools"), new Field("shape_of_hole"), 
			new Field("depth_of_hole", [EmptyInput]), new Field("shade_guide"), 
			new Field("color_of_tooth"), new Field("disinfect"),
			new Field("etching_type"),new Field("coating_time"), 
			new Field("illumination_time"), new Field("resin"),
			new Field("color_of_resin"), new Field("modification"), 
			new Field("lamp"), new Field("time_of_lamp"), 
			new Field("modulo"), new Field("polishing"),
		],
		MinimalFields3 = [
			new Field("tools"), new Field("shape_of_hole"), 
			new Field("depth_of_hole", [EmptyInput]), 
			new Field("disinfect"), new Field("modulo"),
		];
	// **************************************************
	// ART修复
	$('#minimalContext form[data-tab=minimalContext1]').form({
		fields: MinimalFields1,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 预防性充填
	$('#minimalContext form[data-tab=minimalContext2]').form({
		fields: MinimalFields2,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 玻璃离子过渡性修复
	$('#minimalContext form[data-tab=minimalContext3]').form({
		fields: MinimalFields3,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 釉质成型术 & 微打磨术
	$('#minimalContext form[data-tab=minimalContext4], #minimalContext form[data-tab=minimalContext5]').form({
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});


	// ----------------------------------------------------------------------
	// 复合树脂修复
	// ----------------------------------------------------------------------
	// INIT fields and rules;
	var ResinFields1 = [
			new Field("tools"), new Field("shape_of_hole"), 
			new Field("depth_of_hole", [EmptyInput]), new Field("shade_guide"), 
			new Field("color_of_tooth"), new Field("disinfect"),
			new Field("etching_type"),new Field("coating_time"), 
			new Field("illumination_time"), new Field("resin"),
			new Field("color_of_resin"), new Field("modification"), 
			new Field("lamp"), new Field("time_of_lamp"), 
			new Field("modulo"), new Field("polishing"), 
		],
		ResinFields2 = [
			new Field("appease_medicine"), new Field("observed_time"), 
			new Field("anesthesia_medicine"),
			new Field("tools"), new Field("shape_of_hole"), 
			new Field("depth_of_hole", [EmptyInput]), new Field("shade_guide"), 
			new Field("color_of_tooth"), new Field("disinfect"),
			new Field("etching_type"),new Field("coating_time"), 
			new Field("illumination_time"), new Field("resin"),
			new Field("color_of_resin"), new Field("modification"), 
			new Field("lamp"), new Field("time_of_lamp"), 
			new Field("modulo"), new Field("polishing"), 
		];
	// **************************************************
	// 牙树脂直接充填修复
	$('#resinContext form[data-tab=resinContext1]').form({
		fields: ResinFields1,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});
	// **************************************************
	// 牙安抚治疗&树脂充填修复
	$('#resinContext form[data-tab=resinContext2]').form({
		fields: ResinFields2,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});

	// ----------------------------------------------------------------------
	// 美容修复
	// ----------------------------------------------------------------------
	var lookFields1 = [
			new Field("tools"),
		],
		lookFields2 = [
			new Field("tools"), new Field("shape_of_hole"), 
			new Field("depth_of_hole", [EmptyInput]), new Field("shade_guide"), 
			new Field("color_of_tooth"), new Field("disinfect"),
			new Field("etching_type"),new Field("coating_time"), 
			new Field("illumination_time"), new Field("resin"),
			new Field("color_of_resin"), new Field("modification"), 
			new Field("lamp"), new Field("time_of_lamp"), 
			new Field("modulo"), new Field("polishing"), 
		];
	// **************************************************
	// 渗透树脂修复
	$('#lookContext form[data-tab=lookContext1]').form({
		fields: ResinFields1,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});

	// **************************************************
	// 微创复合树脂分层修复
	$('#lookContext form[data-tab=lookContext2]').form({
		fields: ResinFields2,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});


	// ----------------------------------------------------------------------
	// 间接修复
	// ----------------------------------------------------------------------
	var indirectContextFields = [
			new Field("tools"), new Field("shape_of_hole"),
			new Field("depth_of_hole", [EmptyInput]), new Field("is_piece"),
			new Field("modification"), new Field("color_of_tooth"), 
			new Field("disinfect"), new Field("coating_time"), 
			new Field("full_etching"), new Field("illumination_time"), 
			new Field("time_of_lamp"), new Field("observed_time"), 
			new Field("lamp"), new Field("polishing"),
		];
	$('#indirectContext').form({
		fields: indirectContextFields,
		inline: true,
		onSuccess: function(){
			submitForm($(this).serialize());
			return false;
		}
	});


	// **************************************************
	// Function: Edit
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});


	// **************************************************
	// Function: Submit
	function submitForm(vData) {
		$.ajax({
			url      : URL_CURE,
			type     : IsEditMode ? "PUT" : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + vData,
			dataType : "json",
			error    : function() {networkError();},
			success  : function(data) {
				submitImage();
				location.reload();
			}
		});
	};
	function submitImage(vImage) {
	}


	// **************************************************
	// Function: show data and set default selection
	function showData(vData) {

		if (vData.handle_type >= 0 && vData.handle_type < 5) {
  			ChangeTabActive($('#maincontext .fluid.menu a').removeClass('active'), $('#maincontext .tab.segment').removeClass('active'), vData.handle_type);
		}

		var DescriptionStr;
		switch (vData.handle_type) {
			// 牙非手术治疗
			case 0: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>";
				switch (vData.specific_method) {
					case "药物治疗": {
						ChangeTabActive($('#noSurgicalContext a').removeClass('active'), $('#noSurgicalContext .ui.tab').removeClass('active'), 0);
						setnoSurgical1DefultFormData(vData);
						DescriptionStr = shownoSurgical1(vData, DescriptionStr);
						break;
					}
					case "再矿化治疗": {
						ChangeTabActive($('#noSurgicalContext a').removeClass('active'), $('#noSurgicalContext .ui.tab').removeClass('active'), 1);
						DescriptionStr = shownoSurgical2(vData, DescriptionStr);
						break;
					}
					case "窝沟封闭": {
						ChangeTabActive($('#noSurgicalContext a').removeClass('active'), $('#noSurgicalContext .ui.tab').removeClass('active'), 2);
						setnoSurgical3DefultFormData(vData);
						DescriptionStr = shownoSurgical3(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 龋病微创修复
			case 1: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "ART修复": {
						DescriptionStr = showMinimal1(vData, DescriptionStr);
						break;
					}
					case "预防性充填": {
						DescriptionStr = showMinimal2(vData, DescriptionStr);
						break;
					}
					case "玻璃离子过渡性修复": {
						DescriptionStr = showMinimal3(vData, DescriptionStr);
						break;
					}
					case "釉质成型术": {
						DescriptionStr = showMinimal4(vData, DescriptionStr);
						break;
					}
					case "微打磨术": {
						DescriptionStr = showMinimal5(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 复合树脂修复
			case 2: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "牙树脂直接充填修复": {
						DescriptionStr = showResin1(vData, DescriptionStr);
						break;
					}
					case "牙安抚治疗&树脂充填修复": {
						DescriptionStr = showResin2(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 美容修复
			case 3: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "渗透树脂修复": {
						DescriptionStr = showLook1(vData, DescriptionStr);
						break;
					}
					case "微创复合树脂分层修复": {
						DescriptionStr = showLook2(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}
				
				break;
			};
			// 间接修复
			case 4: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				DescriptionStr = showIndirect(vData, DescriptionStr);
				break;
			};
			default: {
				showErrorInfo();
			};
		}

		$('#Describe').html(DescriptionStr);
	}
	// 非手术治疗
	function shownoSurgical1(vData, vDescription) {
		vDescription += "将" + vData.fluorination + "，" + vData.silver_nitrate + "涂布于龋损处30s";
		return vDescription;
	}
	function shownoSurgical2(vData, vDescription) {
		vDescription += "患牙清洁，干燥，将矿化液浸湿的小棉球置于患牙牙面，反复涂搽3-4次";
		return vDescription;
	}
	function shownoSurgical3(vData, vDescription) {
		vDescription  +=  "1. 清洁牙面： 在低速手机上装好" + vData.additional_device 
						+ "，蘸取适量" + vData.reagent + "于牙面，对牙面和窝沟来回刷洗1分钟，同时不断滴水保持毛刷湿润" + NewLine
						+ "2. 用棉纱球隔湿，压缩空气牙面吹干，" + vData.tools + "蘸取酸蚀剂置于牙尖斜面的2/3上。" + vData.time_of_etching + NewLine
						+ "3. 流水冲洗牙面10-15秒，去除牙釉质表面和反应沉淀物" + NewLine
						+ "4. 洗刷笔蘸取适量封闭剂沿窝沟从远中向近中涂布在酸蚀后的牙面上" + NewLine
						+ "5. " + vData.lamp + NewLine
						+ "6. 探针进行检查，调合，" + vData.check_time;
		return vDescription;
	}
	// 龋病微创修复
	function showMinimal1(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "2. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "3. 处理剂清洁窝洞，彻底冲洗，吹干" + NewLine;
		vDescription += "4. 干燥隔湿，使用玻璃离子充填龋洞" + NewLine;
		vDescription += "5. 修形，调合，涂布凡士林" + NewLine;

		return vDescription;
	}
	function showMinimal2(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "2. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "3. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "4. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom) {
			vDescription += "，" + vData.bottom;
		};
		vDescription += NewLine;

		vDescription += "5. 酸蚀，彻底冲洗，吹干" + NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.modulo + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		return vDescription;
	}
	function showMinimal3(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "无") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "5. " + vData.modulo + "玻璃离子充填" + NewLine;
		vDescription += "6. 修型，调合，涂凡士林";
		
		return vDescription;
	}
	function showMinimal4(vData, vDescription) {
		vDescription += "用火焰状金刚砂针磨去浅的沟裂，将釉质磨圆钝，形成光滑、蝶形的利于清洁的表面";
		
		return vDescription;
	}
	function showMinimal5(vData, vDescription) {
		vDescription += "1. 低速手机装上" + vData.microscope + "蘸取适量牙膏于牙面，来回刷洗无龋牙面及窝沟1min，彻底冲洗清洁" + NewLine;
		vDescription += "2. 涂抹约2～3mm厚的磨膏层于牙面，低速手机装上" + vData.modulo
			 + "蘸取6.6%盐酸及碳化硅微粒的水溶性磨砂膏剂来进行微打磨，轻微加力，在牙齿表面打磨(2-3min，4-6min)。在每次微打磨之后，使用清水冲洗干净";
		
		return vDescription;
	}
	// 复合树脂修复
	function showResin1(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.modulo + "调合" + "，";
		vDescription += vData.polishing + "抛光";
		
		return vDescription;
	}
	function showResin2(vData, vDescription) {
		// 初诊
		vDescription += "<bold>初诊：</bold>";
		vDescription += "使用"+ vData.appease_medicine + "，";
		vDescription += "观察" + vData.observed_time;
		vDescription += NewLine;

		// 复诊：1. 
		vDescription += "<bold>复诊：</bold>" + NewLine;
		
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.modulo + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		return vDescription;
	}
	// 美容修复
	function showLook1(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber + "，";
		vDescription += vData.microscope + "，";
		vDescription += vData.tools;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.depth_of_hole != "否") {
			vDescription += vData.depth_of_hole;

			if (vData.shape_of_hole != "无") {
				vDescription += "，" + vData.shape_of_hole + "保护牙龈";
			}
			if (vData.is_piece != "无") {
				vDescription += "，低速手机装上" + vData.is_piece;
			}
			if (vData.is_chock != "无") {
				vDescription += "，" + vData.is_chock + "微研磨剂打磨";
			}
			if (vData.shade_guide != "无") {
				vDescription += "，冲洗，吹干，涂布" + vData.shade_guide + "氟保护剂";
			}
			vDescription += "。";
		}
		vDescription += "酸蚀剂酸蚀病变区域及周围牙体组织" + vData.coating_time + "，";
		vDescription += "涂布干燥剂" + vData.resin + "，";
		vDescription += "涂布渗透树脂，光固化" + vData.illumination_time;
	
		return vDescription;
	}
	function showLook2(vData, vDescription) {
		vDescription += "1. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		vDescription += vData.is_piece + "，";
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.modulo + "调合" + "，";
		vDescription += vData.polishing + "抛光";
		
		return vDescription;
	}
	// 间接修复
	function showIndirect(vData, vDescription) {
		vDescription += "1. 嵌体修复材料类型：" + vData.modulo + NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "3. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm。";
		vDescription += "使用钻针" + vData.is_piece + "。";
		if (vData.is_chock == "是") {
			vDescription += "行直接充填，充填材料为：" + vData.shade_guide;
		}
		vDescription += NewLine;

		// FIXME：补充说明
		vDescription += "4. ";
		vDescription += "使用" + vData.modification + "排龈，";
		vDescription += vData.color_of_tooth + "取模";
		vDescription += NewLine;

		vDescription += "5. ";
		if (vData.disinfect == "是") {
			vDescription += "制作临时修复体，临时修复体粘接，粘接剂为" + vData.bottom;
			vDescription += NewLine;

			vDescription += "6. ";
		}

		vDescription += "复诊，去除临时修复体，试戴，调改接触点，检查有无翘动，固位好，边缘密合，";
		vDescription += vData.coating_time + "氢氟酸酸蚀修复体" + vData.illumination_time + "冲洗、干燥，";
		if (vData.resin == "是") {
			vDescription += "涂布硅烷偶联剂，";
		}
		vDescription += "磷酸酸蚀牙面" + vData.time_of_lamp + "，";
		vDescription += "涂布" + vData.full_etching + "粘接剂，";
		vDescription += "修复体就位，临时光照" + vData.observed_time + "，去除多余粘接剂，";
		vDescription += vData.lamp + "调合" + "，";
		vDescription += vData.polishing + "抛光";
		
		return vDescription;
	}
	// Handle error
	function showErrorInfo() {
		// TODO: design error UI
		alert("Network Error...");
	}


	// 非手术治疗
	function setnoSurgical1DefultFormData(vData) {
		$('select[name=fluorination]').dropdown("set selected", vData.fluorination);
		$('select[name=silver_nitrate]').dropdown("set selected", vData.silver_nitrate);
	}
	function setnoSurgical3DefultFormData(vData) {
		$('select[name=additional_device]').dropdown("set selected", vData.additional_device);
		$('select[name=reagent]').dropdown("set selected", vData.reagent);
		$('select[name=tools]').dropdown("set selected", vData.tools);
		$('select[name=time_of_etching]').dropdown("set selected", vData.time_of_etching);
		$('select[name=lamp]').dropdown("set selected", vData.lamp);
		$('select[name=check_time]').dropdown("set selected", vData.check_time);
	}


	// **************************************************
	// Function: 
	function ChangeTabActive($Context, $TabSegment, Index){
		$Context.eq(Index).addClass('active');
		$TabSegment.eq(Index).addClass('active');
	}
});