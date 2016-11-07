$(document).ready(function(){

	$('.modal .ui.label').click(function(){ $(this).toggleClass('teal'); });
	$('#context .menu .item').tab({ context: $('#context') });

  var DATA       = null,
      U_ID       = Number(requestParameter("uid")),
      T_ID       = Number(requestParameter("tid"));
      Image_type = 0;

	// ******************************************************
	// 检查数据是否已经提交
	$.ajax({
  		url      : URL_MOUTHEXAM,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      async    : false,
  		success  : function(data){
  			$('#submit').hide();
  			$('#display').show();

  			DATA = data;

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
        $('#ME_Loss').text(DATA.loss_caries_index_up);
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
          data     : {tooth_id : T_ID, type : Image_type},
          dataType : "json",
          success  : function(FileData) {
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
        });
  		}
	});

	if (DATA == null) {$('#submit').show();};

	// ******************************************************
	// 提交表单数据
	$('form').form({
    fields : {
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
            prompt : '请选择BOP'
          }
        ]
      },
    },
    inline   : true,
		onSuccess: function() {

      var caries_tired = $(this).form('get value', 'caries_tired_display'),
          AdditionFormData = toform({
            user_id      : U_ID,
            tooth_id     : T_ID,
            caries_tired : caries_tired,
          });

	    $.ajax({
      		url      : URL_MOUTHEXAM,
      		type     : DATA == null ? "post" : "PUT", 
      		data     : AdditionFormData + $(this).serialize(),
      		dataType : "json",
      		error    : function() {networkError();},
      		success  : function(data){
            // 上传图片
            $.ajaxFile({
              url           : URL_IMAGEUPLOAD, 
              type          : 'POST',  
              fileElementId : 'imageupload',
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

	// ******************************************************
	// 修改口腔检查
	$('.edit.button').click(function(){
		$('#display').hide();

    $('input[name=tooth_location]').val(DATA.tooth_location);
    $('input[name=tooth_type]').val(DATA.tooth_type);

    // 龋坏累及牙面去掉逗号
    $.each(DATA.caries_tired.split(","), function(){
      $('select[name=caries_tired_display]').dropdown("set selected", this);
    });

    $('select[name=secondary]').dropdown("set selected", DATA.secondary);
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
    $('select[name=gingival_color]').dropdown("set selected", DATA.gingival_color);
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
    
    $('#submit .submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
	  $('#submit').show();
	});

	// ******************************************************
	// 添加牙位
	$('#addLocation').click(function(){

    // 设置当前默认选项值
    var ThisInput = $(this).find('input').val();
    if (ThisInput) {
      $.each(ThisInput.split(","), function(){
        $('#addLocationModal').find(".ui.label[val=" + this + "]").addClass('teal');
      });
    };

    if (DATA != null && DATA.tooth_type != undefined) {
      $('#context .menu .active').removeClass("active");
      $('#context .segment.active').removeClass("active");
      $('#context .menu a[data-tab=' + DATA.tooth_type + ']').addClass("active");
      $('#context .segment[data-tab=' + DATA.tooth_type + ']').addClass("active");
    }

		$('#addLocationModal').modal({
			onApprove: function(){
				var $AddLocation   = $('#addLocation'),
            $ToothType     = $('.modal .item.active'),
				    ToothTypeValue = $ToothType.attr('data-tab'),
				    ToothTypeName  = $ToothType.text();

				var FormData = "";
				$('.modal .segment.active .teal.label').each(function(){
					FormData += $(this).text() + ",";
				});

        if (FormData.length > 0) {FormData = FormData.substring(0, FormData.length - 1);} 

				$('input[name=tooth_location]').val(FormData);
        $('input[name=tooth_type]').val(ToothTypeValue);
			}
		}).modal('show');
	});

  // ***************************************************************
  // FUNCTION: 下一项，诊断
  $('#display .right.labeled.button').click(function(){
    redirection("Diagnose.html", U_ID, T_ID, requestParameter("name"));
  });

  // ***************************************************************
  // FUNCTION: 上一项，现病史
  $('#display .left.labeled.button').click(function(){
    redirection("PresentIllness.html", U_ID, T_ID, requestParameter("name"));
  });

  // ***************************************************************
  // FUNCTION: 删除图片
  $('#ME_IMAGE .corner.label').click(function(){
    
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
});