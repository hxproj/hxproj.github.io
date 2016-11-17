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
      $('#User_Name').text(DATA.name);
      !DATA.gender ? $('#User_Gender').text("男") : $('#User_Gender').text("女");
      $('#User_Age').text(DATA.age);
      $('#User_Occupation').text(DATA.occupation);
      $('#User_Contact').text(DATA.contact);
      
      $('#User').show();
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
      $('#ChiefComplaint').text(ChiefComplaint);
      
      $('#ToothLocation').show();
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
      var ID_Eating_Habits = "";
      ID_Eating_Habits += DATA.consumption_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_meal + "，";
      ID_Eating_Habits += DATA.is_carbonic_acid;
      $('#PH_Eating_Habits').text(ID_Eating_Habits);

     	// 口腔卫生维护
      var ID_Oral_Maintenance = "";
      ID_Oral_Maintenance += DATA.is_floss + "，";
      ID_Oral_Maintenance += DATA.times_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.time_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.long_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.electric_tooth_brush + "，";
      ID_Oral_Maintenance += DATA.is_fluorine + "，";
      ID_Oral_Maintenance += DATA.is_cavity_examination + "，";
      ID_Oral_Maintenance += DATA.is_periodontal_treatment;
      $('#PH_Oral_Maintenance').text(ID_Oral_Maintenance);

      // 宿主易感性
      var ID_Sensitive = "";
      ID_Sensitive += DATA.salivary_gland_disease + "，";
      ID_Sensitive += DATA.sjogren_syndrome + "，";
      ID_Sensitive += DATA.consciously_reduce_salivary_flow;
      $('#PH_Sensitive').text(ID_Sensitive);
      
      $('#PersonalHistory').show();
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

        var DescribeText = !DATA.is_primary ? "<bold>原发性龋病：</bold>" : "<bold>有治疗史龋病：</bold>";
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

        $('#PI_Description').html(DescribeText);
      }, "json");
      
      $('#PresentIllness').show();
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

      // 表头
      $('#display th').text("口腔检查 - " + decodeURI(requestParameter("name")));

      // 牙体情况
      var ME_Body_Text = DATA.tooth_location + "牙";

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
      $('#ME_Body').text(ME_Body_Text);

      // 牙周情况
      var ME_Around_Text = DATA.gingival_hyperemia + "，";
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
      $('#ME_Around').text(ME_Around_Text);

      // 龋失补指数
      var ME_Loss_Text = "";
      if (DATA.loss_caries_index_up != "") {
        ME_Loss_Text += "DMFT：" + DATA.loss_caries_index_up;
      }
      if (DATA.loss_caries_surface_index_up != "") {
        if (DATA.loss_caries_index_up != "") {
          ME_Loss_Text += "，";
        }
        ME_Loss_Text += "DMFS：" + DATA.loss_caries_surface_index_up;
      }
      $('#ME_Loss').text(ME_Loss_Text);

      // 牙齿发育情况
      $('#ME_Condition').text(DATA.development_of_the_situation);

      // 患牙与邻牙接触关系
      var ME_Neighbor_Text = "";
      ME_Neighbor_Text += DATA.relations_between_teeth + "，";
      ME_Neighbor_Text += DATA.is_teeth_crowd + "，";
      ME_Neighbor_Text += DATA.involution_teeth + "，";
      ME_Neighbor_Text += DATA.tooth_shape;
      $('#ME_Neighbor').text(ME_Neighbor_Text);


      // 患牙修复治疗情况
      var ME_Cure_Text = "";
      ME_Cure_Text += DATA.treatment + "，";
      ME_Cure_Text += DATA.orthodontic;
      $('#ME_Cure').text(ME_Cure_Text);


      // X线片表现
      var ME_X_Text = "";
      ME_X_Text += DATA.tooth_location + "牙";
      ME_X_Text += DATA.X_Ray_location;
      ME_X_Text += DATA.X_Ray_depth;
      ME_X_Text += DATA.X_Ray_fill_quality + "，根尖周组织无明显异常。";

      // 如果CT表现和咬翼片表现为空时，则不显示
      if (DATA.CT_shows != "") {
        ME_X_Text += "CT表现：" + DATA.CT_shows;
        if (DATA.piece != "") {
          ME_X_Text += "，";
        };
      }
      if (DATA.piece != "") {
        ME_X_Text += "咬翼片表现：" + DATA.piece;
      }
      $('#ME_X').text(ME_X_Text);

      // 显示口腔检查图片
      $.ajax({
        url      : URL_IMAGEUPLOAD,
        type     : "GET",
        data     : {tooth_id : T_ID, type : 0},
        dataType : "json",
        success  : function(FileData) {

          if (FileData.length == 0) {
            $('#ME_IMAGE').text("未添加任何图片");
          } else {
            $.each(FileData, function(){
              var $ClonedImage = $('#ME_IMAGE .hidden.image').clone().removeClass('hidden');
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

              $('#ME_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
            });
          }
        }
      });
      
      $('#MouthExamination').show();
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

      var ToothLocation = "<bold>注：还未设置病人“牙位”和“累及牙面”，请到“口腔检查”功能项中完善相关信息</bold>",
          Description   = "";
        
      if (MouthData != null) {
          ToothLocation = MouthData.tooth_location + "牙";
        Description   = ToothLocation;

          $.each(MouthData.caries_tired.split(","), function(){
            Description += this;
          });
          Description += "面" + DATA.caries_degree;

        if (DATA.caries_type != "无") {
            Description += "<br/><br/>" + ToothLocation + DATA.caries_type;
        } 
      } else {
        Description += DATA.caries_degree;

        if (DATA.caries_type != "无") {
            Description += "<br/><br/>" + DATA.caries_type;
        } 
        Description += "<br/><br/>" + ToothLocation;
      }
        $('#Diagnose_Description').html(Description);

      // 显示诊断图片
      $.ajax({
        url      : URL_IMAGEUPLOAD,
        type     : "GET",
        data     : {tooth_id : T_ID, type : 1},
        dataType : "json",
        success  : function(FileData) {

          if (FileData.length == 0) {
            $('#Diagnose_IMAGE').text("未添加任何图片");
          } else {
            $.each(FileData, function(){
              var $ClonedImage = $('#Diagnose_IMAGE .hidden.image').clone().removeClass('hidden');
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

              $('#Diagnose_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
            });
          }
        }
      });
      
      $('#Diagnose').show();
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
      $('#DA_tooth_surface_and_location').text(DATA.tooth_surface_and_location);
      $('#DA_caries_depth').text(DATA.caries_depth);
      $('#DA_technology_type').text(DATA.technology_type);
      $('#DA_history_of_fill').text(DATA.history_of_fill);
      $('#DA_mouth_opening').text(DATA.mouth_opening);
      $('#DA_gag_reflex').text(DATA.gag_reflex);
      $('#DA_saliva').text(DATA.saliva);
      $('#DA_dental_phobia').text(DATA.dental_phobia);
      $('#DA_difficulty_rating').text(DATA.difficulty_rating);

      var Level = "";
      switch (DATA.difficulty_level) {
        case 1:  {
          Level = "Ⅰ级"; 
          $('#DA_id_advice').text("建议转诊到Ⅲ级医师进行处理");
          break;
        }
        case 2:  {
          Level = "Ⅱ级"; 
          $('#DA_id_advice').text("建议转诊到Ⅱ级医师进行处理");
          break;
        }
        case 3:  {
          Level = "Ⅲ级"; 
          $('#DA_id_advice').text("建议转诊到Ⅰ级医师进行处理");
          break;
        }
      }
      $('#DA_difficulty_level').text(Level);
      
      $('#DifficultyAssessment').show();
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
        $('#Cure_Describe').html(Describe_Text);
      }
      // 手术治疗
      else if (DATA.handle_type == 1) {
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

          if (FileData.length == 0) {
            $('#Cure_IMAGE').text("未添加任何图片");
          } else {
            $.each(FileData, function(){
              var $ClonedImage = $('#Cure_IMAGE .hidden.image').clone().removeClass('hidden');
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

              $('#Cure_IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
            });
          }
        }
      });
      
      $('#Cure').show();
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
      $('#USPHS_color').text(DATA.color);
      $('#USPHS_marginal_accuracy').text(DATA.marginal_accuracy);
      $('#USPHS_anatomic_form').text(DATA.anatomic_form);
      $('#USPHS_surfaceness').text(DATA.surfaceness);
      $('#USPHS_edge_color').text(DATA.edge_color);
      $('#USPHS_occlusal_contact').text(DATA.occlusal_contact);
      $('#USPHS_sensitivity_of_tooth').text(DATA.sensitivity_of_tooth);
      $('#USPHS_secondary_caries').text(DATA.secondary_caries);
      $('#USPHS_integrity').text(DATA.integrity);
      $('#USPHS_usphs_level').text(DATA.level);
      
      $('#USPHS').show();
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
      $('#RE_early_carie').text(DATA.early_carie);
      $('#RE_can_see').text(DATA.can_see);
      $('#RE_lost_tooth').text(DATA.lost_tooth);
      $('#RE_system_illness').text(DATA.system_illness);
      $('#RE_illness_name').text(DATA.illness_name);
      $('#RE_times_of_carbohydrate').text(DATA.times_of_carbohydrate);
      $('#RE_consumption_of_carbohydrate').text(DATA.consumption_of_carbohydrate);
      $('#RE_times_of_meal').text(DATA.times_of_meal);
      $('#RE_speed_of_saliva').text(DATA.speed_of_saliva);
      $('#RE_ablity_saliva').text(DATA.ablity_saliva);
      $('#RE_bacteria').text(DATA.bacteria);
      $('#RE_consumption').text(DATA.consumption);
      $('#RE_fluorine_with_water').text(DATA.fluorine_with_water);
      $('#RE_fluorine').text(DATA.fluorine);
      $('#RE_seal').text(DATA.seal);
      $('#RE_times_of_tooth_brush').text(DATA.times_of_tooth_brush);
      $('#RE_long_of_tooth_brush').text(DATA.long_of_tooth_brush);
      $('#RE_health_care').text(DATA.health_care);
      
      $('#RiskEvaluation').show();
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
      switch (DATA.patient_type) {
        case 1: {
          $('#Manage_Level').text("低风险患者");
          $('#Manage_Describe').html(Level1);
          break;
        }
        case 2: {
          $('#Manage_Level').text("中风险患者");
          $('#Manage_Describe').html(Level2);
          break;
        }
        case 3: {
          $('#Manage_Level').text("高风险患者");
          $('#Manage_Describe').html(Level3);
          break;
        }
        case 4: {
          $('#Manage_Level').text("极高风险患者");
          $('#Manage_Describe').html(Level4);
          break;
        }
      }
      
      $('#Manage').show();
    }
  });

  // ***************************************************************
  // FUNCTION: 返回病人病历概述
  $('.returnMedical.button').click(function(){
    window.location = "MedicalRecordDetail.html" + toquerystring({uid  : U_ID});
  });
});