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
	// **************************************************
	// 渗透树脂修复
	// **************************************************
	// 微创复合树脂分层修复

	// ----------------------------------------------------------------------
	// 间接修复
	// ----------------------------------------------------------------------


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
				break;
			};
			// 复合树脂修复
			case 2: {
				break;
			};
			// 美容修复
			case 3: {
				break;
			};
			// 间接修复
			case 4: {
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
		vDescription  += "" + NewLine
  							+ "1. 清洁牙面： 在低速手机上装好" + vData.additional_device 
  							+ "，蘸取适量" + vData.reagent + "于牙面，对牙面和窝沟来回刷洗1分钟，同时不断滴水保持毛刷湿润" + NewLine
  							+ "2. 用棉纱球隔湿，压缩空气牙面吹干，" + vData.tools + "蘸取酸蚀剂置于牙尖斜面的2/3上。" + vData.time_of_etching + NewLine
  							+ "3. 流水冲洗牙面10-15秒，去除牙釉质表面和反应沉淀物" + NewLine
  							+ "4. 洗刷笔蘸取适量封闭剂沿窝沟从远中向近中涂布在酸蚀后的牙面上" + NewLine
  							+ "5. " + vData.lamp + NewLine
  							+ "6. 探针进行检查，调合，" + vData.check_time;
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