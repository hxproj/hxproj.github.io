$(document).ready(function(){

  var U_ID = Number(requestParameter("uid")),
      T_ID = Number(requestParameter("tid"));

  // ***************************************************************
  // FUNCTION: 病人基本信息
  $.ajax({
    url      : URL_USER,
    type     : "get",
    data     : {user_id : U_ID},
    dataType : "json",
    success  : function(DATA){
      var BasicInfo = "患者" + DATA.name + "，";
      BasicInfo += (!DATA.gender ? "男" : "女") + "，"; 
      BasicInfo += DATA.age + "岁，"; 
      BasicInfo += DATA.occupation + "，"; 
      BasicInfo += "联系方式：" + DATA.contact + "。"; 
      $('#User_Description').text(BasicInfo);

      $('#User').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 主诉
  $.ajax({
    url      : URL_TOOTH,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){
      var ChiefComplaint = DATA.tooth_location;
      ChiefComplaint += DATA.is_fill_tooth ? "要求补牙" : DATA.symptom + DATA.time_of_occurrence;
      ChiefComplaint += "。";
      $('#ChiefComplaint').text(ChiefComplaint);
      
      $('#ToothLocation').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 现病史
  $.ajax({
    url      : URL_PRESENTILLNESS,
    type     : "GET",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){
      // 设置描述（需提前获取牙位信息）
      $.get(URL_TOOTH, {tooth_id : DATA.tooth_id}, function(ToothData){

        var DescribeText = !DATA.is_primary ? "<span>原发性龋病：</span>" : "<span>有治疗史龋病：</span>";
        DescribeText += ToothData.tooth_location;
        DescribeText += ToothData.is_fill_tooth ? "要求补牙，" : ToothData.time_of_occurrence + "前发现" + ToothData.symptom + "，";
       
        if (!DATA.is_primary) {
          DescribeText += DATA.is_very_bad + "，";
          DescribeText += DATA.is_night_pain_self_pain + "，";
          DescribeText += DATA.is_hypnalgia + "，";
          DescribeText += DATA.is_sensitive_cold_heat + "，";
          DescribeText += DATA.is_cold_hot_stimulationpain + "，";
          DescribeText += DATA.is_delayed_pain + "，";
          DescribeText += DATA.medicine_name + "，";
          DescribeText += DATA.is_relief;
        } else {
          DescribeText += "在" + DATA.cure_time + "曾进行充填修复治疗，";
          DescribeText += "为" + DATA.fill_type + "，";
          DescribeText += DATA.fill_state + "，";
          DescribeText += DATA.is_night_pain_self_pain + "，";
          DescribeText += DATA.is_hypnalgia + "，";
          DescribeText += DATA.is_sensitive_cold_heat + "，";
          DescribeText += DATA.is_cold_hot_stimulationpain + "，";
          DescribeText += DATA.is_delayed_pain + "，";
          DescribeText += DATA.medicine_name + "，";
          DescribeText += DATA.is_relief;
        }
        DescribeText += "。";

        $('#PI_Description').html(DescribeText);
      }, "json");
      
      $('#PresentIllness').removeClass('invisible');
    }
  });

	// ***************************************************************
	// FUNCTION: 个人史
  $.ajax({
		url      : URL_PERSONAL_HISTORY,
		type     : "get",
		data     : {user_id : U_ID},
		dataType : "json",
		success  : function(DATA){
      // 饮食习惯
      var ID_Eating_Habits = "<span>饮食习惯：</span>";
      ID_Eating_Habits += DATA.consumption_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_meal + "，";
      ID_Eating_Habits += DATA.is_carbonic_acid;
      ID_Eating_Habits += "。";
      $('#PH_Eating_Habits').html(ID_Eating_Habits);

     	// 口腔卫生维护
      var ID_Oral_Maintenance = "<span>口腔卫生维护：</span>";
      ID_Oral_Maintenance += DATA.is_floss + "，";
      ID_Oral_Maintenance += DATA.times_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.time_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.long_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.electric_tooth_brush + "，";
      ID_Oral_Maintenance += DATA.is_fluorine + "，";
      ID_Oral_Maintenance += DATA.is_cavity_examination + "，";
      ID_Oral_Maintenance += DATA.is_periodontal_treatment;
      ID_Oral_Maintenance += "。";
      $('#PH_Oral_Maintenance').html(ID_Oral_Maintenance);

      // 宿主易感性
      var ID_Sensitive = "<span>宿主易感性：</span>";
      ID_Sensitive += DATA.salivary_gland_disease + "，";
      ID_Sensitive += DATA.sjogren_syndrome + "，";
      ID_Sensitive += DATA.consciously_reduce_salivary_flow;
      ID_Sensitive += "。";
      $('#PH_Sensitive').html(ID_Sensitive);
      
      $('#PersonalHistory').removeClass('invisible');
		}
	});

  // ***************************************************************
  // FUNCTION: 口腔检查
  $.ajax({
    url      : URL_MOUTHEXAM,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){

      // 牙体情况
      var ME_Body_Text = "<span>牙体情况：</span>";
      ME_Body_Text += DATA.tooth_location + "牙";

      // 累及面以逗号隔开，显示时需去除逗号
      ME_Body_Text += "龋坏累及";
      $.each(DATA.caries_tired.split(","), function(){
        ME_Body_Text += this;
      });
      ME_Body_Text += "面，";

      ME_Body_Text += "为" + DATA.depth + "，";

      // 当原充填体选择“无”时，不进行任何语言描述，且不描述有无继发龋
      if (DATA.fill != "无") {
        ME_Body_Text += "原充填体为" + DATA.fill + "，";
        ME_Body_Text += DATA.secondary + "，";
      };

      ME_Body_Text += DATA.color_of_caries + "，";
      ME_Body_Text += DATA.flex_of_caries + "，";
      ME_Body_Text += DATA.cold + "，";
      ME_Body_Text += DATA.hot + "，";
      ME_Body_Text += DATA.touch + "，";
      ME_Body_Text += DATA.bite;

      // 如果牙齿活力值为空，则不显示
      if (DATA.vitality_value_of_teeth != "") {
        ME_Body_Text += "，牙齿活力值：" + DATA.vitality_value_of_teeth;
      };
      ME_Body_Text += "。";
      $('#ME_Body').html(ME_Body_Text);

      // 牙周情况
      var ME_Around_Text = "<span>牙周情况：</span>";
      ME_Around_Text += DATA.gingival_hyperemia + "，";
      ME_Around_Text += DATA.gingival_color + "，";
      ME_Around_Text += DATA.tartar_up + "，";
      ME_Around_Text += DATA.tartar_down + "，";
      ME_Around_Text += DATA.bop + "，";
      ME_Around_Text += DATA.periodontal_pocket_depth + "，";

      // 当选根分叉病变无时则不显示位置
      if (DATA.furcation != "根分叉病变无") {
        ME_Around_Text += DATA.furcation + "，";
        ME_Around_Text += DATA.location + "，";
      }

      ME_Around_Text += DATA.fistula + "，";
      ME_Around_Text += DATA.overflow_pus + "，";
      ME_Around_Text += DATA.mobility;
      ME_Around_Text += "。";
      $('#ME_Around').html(ME_Around_Text);

      // 龋失补指数
      var ME_Loss_Text = "<span>DMFT/DMFS：</span>";
      if (DATA.loss_caries_index_up != "") {
        ME_Loss_Text += "DMFT：" + DATA.loss_caries_index_up;
      }
      if (DATA.loss_caries_surface_index_up != "") {
        if (DATA.loss_caries_index_up != "") {
          ME_Loss_Text += "，";
        }
        ME_Loss_Text += "DMFS：" + DATA.loss_caries_surface_index_up;
      }
      ME_Loss_Text += "。";
      $('#ME_Loss').html(ME_Loss_Text);

      // 牙齿发育情况
      $('#ME_Condition').html("<span>牙齿发育情况：</span>" + DATA.development_of_the_situation + "。");

      // 患牙与邻牙接触关系
      var ME_Neighbor_Text = "<span>患牙与邻牙接触关系：</span>";
      ME_Neighbor_Text += DATA.relations_between_teeth + "，";
      ME_Neighbor_Text += DATA.is_teeth_crowd + "，";
      ME_Neighbor_Text += DATA.involution_teeth + "，";
      ME_Neighbor_Text += DATA.tooth_shape;
      ME_Neighbor_Text += "。";
      $('#ME_Neighbor').html(ME_Neighbor_Text);

      // 患牙修复治疗情况
      var ME_Cure_Text = "<span>患牙修复治疗情况：</span>";
      ME_Cure_Text += DATA.treatment + "，";
      ME_Cure_Text += DATA.orthodontic;
      ME_Cure_Text += "。";
      $('#ME_Cure').html(ME_Cure_Text);

      // X线片表现
      var ME_X_Text = "<span>X线片表现：</span>";
      ME_X_Text += DATA.tooth_location + "牙";
      ME_X_Text += DATA.X_Ray_location;
      ME_X_Text += DATA.X_Ray_depth;
      ME_X_Text += DATA.X_Ray_fill_quality + "，根尖周组织无明显异常。";

      // 如果CT表现和咬翼片表现为空时，则不显示
      if (DATA.CT_shows != "") {
        ME_X_Text += "CT表现：" + DATA.CT_shows;
        ME_X_Text += DATA.piece != "" ? "，" : "。";
      }
      if (DATA.piece != "") {
        ME_X_Text += "咬翼片表现：" + DATA.piece + "。";
      }
      $('#ME_X').html(ME_X_Text);

      // 显示口腔检查图片
      $.ajax({
        url      : URL_IMAGEUPLOAD,
        type     : "GET",
        data     : {tooth_id : T_ID, type : 0},
        dataType : "json",
        success  : function(FileData) {
          $.each(FileData, function(){
            var $ClonedImage = $('#ME_IMAGE .hidden.image').clone().removeClass('hidden');
            $ClonedImage.attr("value", this.img_id);

            var ImagePath = this.path;
            ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
            window.loadImage(ImagePath, function(){
              $ClonedImage.attr('src', ImagePath);
            });

            $('#ME_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
          });
        }
      });
      
      $('#MouthExamination').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 诊断
  $.ajax({
    url      : URL_DIAGNOSE,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){
      // 获取牙位信息
      var MouthData = null;
      $.ajax({
        url      : URL_MOUTHEXAM,
        type     : "get",
        data     : {tooth_id : DATA.tooth_id},
        dataType : "json",
        async    : false,
        success  : function(data) { MouthData = data; }
      })

      var ToothLocation = "<span>注：还未设置病人“牙位”和“累及牙面”，请到“口腔检查”功能项中完善相关信息</span>",
          Description   = "";
        
      if (MouthData != null) {
        ToothLocation = MouthData.tooth_location + "牙";
        Description   = ToothLocation;

        $.each(MouthData.caries_tired.split(","), function(){
          Description += this;
        });
        Description += "面" + DATA.caries_degree + "。";

        if (DATA.caries_type != "无") {
            Description += "<br/><br/>" + ToothLocation + DATA.caries_type + "。";
        } 
      } else {
        Description += DATA.caries_degree + "。";

        if (DATA.caries_type != "无") {
            Description += "<br/><br/>" + DATA.caries_type + "。";
        } 
        Description += "<br/><br/>" + ToothLocation;
      }
      $('#Diagnose_Description').html(Description);

      // 显示图片
      $.ajax({
        url      : URL_IMAGEUPLOAD,
        type     : "GET",
        data     : {tooth_id : T_ID, type : 1},
        dataType : "json",
        success  : function(FileData) {
          $.each(FileData, function(){
            var $ClonedImage = $('#Diagnose_IMAGE .hidden.image').clone().removeClass('hidden');
            $ClonedImage.attr("value", this.img_id);

            var ImagePath = this.path;
            ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
            window.loadImage(ImagePath, function(){
              $ClonedImage.attr('src', ImagePath);
            });
            
            $('#Diagnose_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
          });
        }
      });
      
      $('#Diagnose').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 难度评估
  $.ajax({
    url      : URL_DIFFICULTYASSE,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){
      $('#DA_tooth_surface_and_location').text("累及牙面及部位：" + DATA.tooth_surface_and_location);
      $('#DA_caries_depth').text("龋损深度：" + DATA.caries_depth);
      $('#DA_technology_type').text("技术类型：" + DATA.technology_type);
      $('#DA_history_of_fill').text("充填修复史及充填失败史：" + DATA.history_of_fill);
      $('#DA_mouth_opening').text("张口度：" + DATA.mouth_opening);
      $('#DA_gag_reflex').text("咽反射：" + DATA.gag_reflex);
      $('#DA_saliva').text("唾液分泌量：" + DATA.saliva);
      $('#DA_dental_phobia').text("牙科恐惧症：" + DATA.dental_phobia);
      $('#DA_difficulty_rating').text("龋病风险难度分级：" + DATA.difficulty_rating);

      var Level  = "",
          Advice = "";
      switch (DATA.difficulty_level) {
        case 1:  {
          Level  = "Ⅰ级"; 
          Advice = "建议转诊到Ⅲ级医师进行处理";
          break;
        }
        case 2:  {
          Level  = "Ⅱ级"; 
          Advice = "建议转诊到Ⅱ级医师进行处理";
          break;
        }
        case 3:  {
          Level  = "Ⅲ级"; 
          Advice = "建议转诊到Ⅰ级医师进行处理";
          break;
        }
      }

      $('#DA_difficulty_level').html("<span>评估等级：</span>" + Level);
      $('#DA_id_advice').html("<span>转诊意见：</span>" + Advice);
      
      $('#DifficultyAssessment').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 处置
  $.ajax({
    url      : URL_CURE,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){

      var NewLine = "<br/><br/>";

      // 牙非手术治疗
      if (DATA.handle_type == 0) {
        var Describe_Text = "<span>" + DATA.specific_method + "：</span>";
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
        $('#Cure_Describe').html(Describe_Text);
      }
      // 手术治疗
      else if (DATA.handle_type == 1) {
        var Describe_Text = "<span>" + DATA.specific_method + "：</span>";
            Describe_Text += NewLine;
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
        Anesthesia += "<span>（注：还未设置病人“牙位”，请到“口腔检查”功能项中完善相关信息）</span>";
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
          Describe_Text += "7. ";
          Describe_Text += "树脂：" + DATA.resin + "，";
          Describe_Text += "颜色：" + DATA.color_of_resin;
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
            Describe_Text += "<span>初诊：</span>";
          Describe_Text += "使用"+ DATA.appease_medicine + "，";
          Describe_Text += "观察" + DATA.observed_time;
          Describe_Text += NewLine;

            // 复诊：1. 
            Describe_Text += "<span>复诊：</span>";
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
          Describe_Text += "7. ";
          Describe_Text += "树脂：" + DATA.resin + "，";
          Describe_Text += "颜色：" + DATA.color_of_resin;
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
        $('#Cure_Describe').html(Describe_Text);
      }

      // 显示图片
      $.ajax({
        url      : URL_IMAGEUPLOAD,
        type     : "GET",
        data     : {tooth_id : T_ID, type : 2},
        dataType : "json",
        success  : function(FileData) {
          $.each(FileData, function(){
            var $ClonedImage = $('#Cure_IMAGE .hidden.image').clone().removeClass('hidden');
            $ClonedImage.attr("value", this.img_id);

            var ImagePath = this.path;
            ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
            window.loadImage(ImagePath, function(){
              $ClonedImage.attr('src', ImagePath);
            });
            
            $('#Cure_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
          });
        }
      });
      
      $('#Cure').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: USPHS
  $.ajax({
    url      : URL_USPHS,
    type     : "get",
    data     : {tooth_id : T_ID},
    dataType : "json",
    success  : function(DATA){
      $('#USPHS_color').html("<span>颜色匹配：</span>" + DATA.color);
      $('#USPHS_marginal_accuracy').html("<span>边缘适合性：</span>" + DATA.marginal_accuracy);
      $('#USPHS_anatomic_form').html("<span>解剖形态：</span>" + DATA.anatomic_form);
      $('#USPHS_surfaceness').html("<span>表面粗糙度：</span>" + DATA.surfaceness);
      $('#USPHS_edge_color').html("<span>边缘着色：</span>" + DATA.edge_color);
      $('#USPHS_occlusal_contact').html("<span>咬合接触：</span>" + DATA.occlusal_contact);
      $('#USPHS_sensitivity_of_tooth').html("<span>牙齿敏感：</span>" + DATA.sensitivity_of_tooth);
      $('#USPHS_secondary_caries').html("<span>继发龋：</span>" + DATA.secondary_caries);
      $('#USPHS_integrity').html("<span>修复体完整性：</span>" + DATA.integrity);
      $('#USPHS_usphs_level').html("<span>评估等级：</span>" + DATA.level);
      
      $('#USPHS').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 龋病风险评估
  $.ajax({
    url      : URL_RISKEVALUATION,
    type     : "get",
    data     : {user_id : U_ID},
    dataType : "json",
    success  : function(DATA){
      $('#RE_early_carie').text("早期龋（尚未形成龋洞）：" + DATA.early_carie);
      $('#RE_can_see').text("无肉眼可见/影像学可见的充填体或龋损：" + DATA.can_see);
      $('#RE_lost_tooth').text("因龋缺失牙：" + DATA.lost_tooth);
      $('#RE_system_illness').text("系统性疾病：" + DATA.system_illness);

      var illness_name = DATA.illness_name == "" ? "无" : DATA.illness_name;
      $('#RE_illness_name').text("具体疾病：" + illness_name);
      
      $('#RE_times_of_carbohydrate').text("进食碳水化合物次数（可降解碳水化合物）：" + DATA.times_of_carbohydrate);
      $('#RE_consumption_of_carbohydrate').text("每天摄入的碳水化合物的量：" + DATA.consumption_of_carbohydrate);
      $('#RE_times_of_meal').text("进食零食频率：" + DATA.times_of_meal);
      $('#RE_speed_of_saliva').text("唾液流速（刺激性唾液）：" + DATA.speed_of_saliva);
      $('#RE_ablity_saliva').text("唾液缓冲能力（Dentobuff试纸检测）：" + DATA.ablity_saliva);
      $('#RE_bacteria').text("菌斑：" + DATA.bacteria);
      $('#RE_consumption').text("变链检出量：" + DATA.consumption);
      $('#RE_fluorine_with_water').text("饮用水加氟：" + DATA.fluorine_with_water);
      $('#RE_fluorine').text("定期涂氟：" + DATA.fluorine);
      $('#RE_seal').text("窝沟封闭：" + DATA.seal);
      $('#RE_times_of_tooth_brush').text("刷牙次数：" + DATA.times_of_tooth_brush);
      $('#RE_long_of_tooth_brush').text("刷牙时间：" + DATA.long_of_tooth_brush);
      $('#RE_health_care').text("吃完甜食后口腔保健：" + DATA.health_care);
      
      $('#RiskEvaluation').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 龋病预后管理
  var Level1 = "1. 复诊检查周期：每6-12个月<br/><br/>"
         + "2. 影像学检查频率：每24-36个月<br/><br/>"
         + "3. 氯己定：不需要或仅唾液检测细菌培养计数高者使用<br/><br/>"
         + "4. 木糖醇：仅唾液检测细菌培养计数高者使用<br/><br/>"
         + "5. 氟制剂：普通非处方含氟牙膏（每天两次，早饭后及睡觉前），当存在牙根暴露或者敏感时可进行涂氟治疗<br/><br/>"
         + "6. 再矿化制剂：不需要，当存在牙根暴露或者敏感时可使用<br/><br/>"
         + "7. 窝沟封闭：可选择<br/><br/>";

  var Level2 = "1. 复诊检查周期：每4-6个月<br/><br/>"
         + "2. 影像学检查频率：每18-24个月<br/><br/>"
         + "3. 氯己定：仅唾液检测细菌培养计数高者使用<br/><br/>"
         + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
         + "5. 氟制剂：普通非处方含氟牙膏（每天两次，早饭后及睡觉前）、可补充0.05%NaF漱口水每天漱口、可补充涂氟治疗<br/><br/>"
         + "6. 再矿化制剂：不需要，当存在牙根暴露或者敏感时可使用<br/><br/>"
         + "7. 窝沟封闭<br/><br/>";

  var Level3 = "1. 复诊检查周期：每3-4个月（同时补充涂氟）<br/><br/>"
         + "2. 影像学检查频率：每6-18个月或直到无成洞性龋损<br/><br/>"
         + "3. 氯己定：每个月连续1周每天使用10ml 0.12%葡萄糖酸氯己定漱口1分钟，直到下一次复诊再评估<br/><br/>"
         + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
         + "5. 氟制剂：高含氟(1.1%NaF)牙膏（每天两次，早饭后及睡觉前）； 可补充0.2%NaF含氟漱口水每天漱口，使用1瓶之后换成0.05% NaF漱口水每天漱口2次；补充涂氟治疗<br/><br/>"
         + "6. 再矿化制剂：可选择<br/><br/>"
         + "7. 窝沟封闭<br/><br/>";

  var Level4 = "1. 复诊检查周期：每3个月（同时补充涂氟）<br/><br/>"
         + "2. 影像学检查频率：每6个月或直到无成洞性龋损<br/><br/>"
         + "3. 氯己定：每个月连续1周每天使用10ml0.12%葡萄糖酸氯己定漱口1分钟。直到下一次复诊再评估<br/><br/>"
         + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
         + "5. 氟制剂：高含氟(1.1%NaF)牙膏（每天两次，早饭后及睡觉前）； 0.05% NaF漱口水漱口（当感觉口干时，饭后及吃零食后）；补充涂氟治疗<br/><br/>"
         + "6. 再矿化制剂：要求每天使用磷酸钙2次<br/><br/>"
         + "7. 窝沟封闭<br/><br/>";
         + "6. 当感觉口干时，饭后及吃零食后使用小苏打水漱口<br/><br/>";
         
  $.ajax({
    url      : URL_MANAGE,
    type     : "get",
    data     : {user_id : U_ID},
    dataType : "json",
    success  : function(DATA){
      var Level   = "",
          NewLine = "</br></br>";
      switch (DATA.patient_type) {
        case 1: {
          Level = "<span>低风险患者：</span>";
          Level += NewLine;
          Level += Level1;
          break;
        }
        case 2: {
          Level = "<span>中风险患者：</span>";
          Level += NewLine;
          Level += Level2;
          break;
        }
        case 3: {
          Level = "<span>中高风险患者：</span>";
          Level += NewLine;
          Level += Level3;
          break;
        }
        case 4: {
          Level = "<span>极高风险患者：</span>";
          Level += NewLine;
          Level += Level4;
          break;
        }
      }
      $('#Manage_Describe').html(Level);

      $('#Manage').removeClass('invisible');
    }
  });

  // ***************************************************************
  // FUNCTION: 返回病人病历概述
  $('.returnMedical.button').click(function(){
    window.location = "MedicalRecordDetail.html" + toquerystring({uid  : U_ID});
  });
});