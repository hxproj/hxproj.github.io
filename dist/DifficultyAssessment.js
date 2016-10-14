$(document).ready(function(){

  // 其它
  $('.orange.header').text("难度评估 - " + decodeURI(requestParameter("name")));
  
  var DATA = null;
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_DIFFICULTYASSE,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      async    : false,
  		success  : function(data){
  			$('#DifficultyForm').hide();
  			DATA = data;

        // 表头
        $('#display th').text("难度评估 - " + decodeURI(requestParameter("name")));
        
  			$('#tooth_surface_and_location').text(DATA.tooth_surface_and_location);
  			$('#caries_depth').text(DATA.caries_depth);
  			$('#technology_type').text(DATA.technology_type);
  			$('#history_of_fill').text(DATA.history_of_fill);
  			$('#mouth_opening').text(DATA.mouth_opening);
  			$('#gag_reflex').text(DATA.gag_reflex);
  			$('#saliva').text(DATA.saliva);
  			$('#dental_phobia').text(DATA.dental_phobia);
  			$('#difficulty_rating').text(DATA.difficulty_rating);

  			var Level = "";
  			switch (DATA.difficulty_level) {
  				case 1:  Level = "Ⅰ级"; break;
  				case 2:  Level = "Ⅱ级"; break;
  				case 3:  Level = "Ⅲ级"; break;
  			}
  			$('#difficulty_level').text(Level);

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('#DifficultyForm').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('#DifficultyForm form').form({
    fields: {
      tooth_surface_and_location: {
        identifier: 'tooth_surface_and_location',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择累及牙面及部位'
          }
        ]
      },
      caries_depth: {
        identifier: 'caries_depth',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择龋损深度'
          }
        ]
      },
      technology_type: {
        identifier: 'technology_type',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择技术类型'
          }
        ]
      },
      history_of_fill: {
        identifier: 'history_of_fill',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择充填修复史及充填失败史'
          }
        ]
      },
      difficulty_rating: {
        identifier: 'difficulty_rating',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择龋病风险难度分级'
          }
        ]
      },
    },
    inline: true,
		onSuccess: function(){
			$.ajax({
				url      : URL_DIFFICULTYASSE,
				type     : DATA == null ? "post" : "PUT", 
				data     : toform({user_id : U_ID, tooth_id : T_ID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});

			return false;
		}
	});

  // ***************************************************************
  // FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();
    $('select[name=tooth_surface_and_location]').dropdown("set selected", DATA.tooth_surface_and_location);
    $('select[name=caries_depth]').dropdown("set selected", DATA.caries_depth);
    $('select[name=technology_type]').dropdown("set selected", DATA.technology_type);
    $('select[name=history_of_fill]').dropdown("set selected", DATA.history_of_fill);
    $('select[name=mouth_opening]').dropdown("set selected", DATA.mouth_opening);
    $('select[name=gag_reflex]').dropdown("set selected", DATA.gag_reflex);
    $('select[name=saliva]').dropdown("set selected", DATA.saliva);
    $('select[name=dental_phobia]').dropdown("set selected", DATA.dental_phobia);
    $('select[name=difficulty_rating]').dropdown("set selected", DATA.difficulty_rating);

    $('#DifficultyForm .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
		$('#DifficultyForm').show();
	});

  // ***************************************************************
  // FUNCTION: 下一项，治疗
  $('.right.labeled.button').click(function(){
    redirection("Cure.html", U_ID, T_ID, requestParameter("name"));
  });
  // ***************************************************************
  // FUNCTION: 上一项，诊断
  $('.left.labeled.button').click(function(){
    redirection("Diagnose.html", U_ID, T_ID, requestParameter("name"));
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