$(document).ready(function(){
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_DIFFICULTYASSE,
  		type    : "get",
  		data    : addParameter("tooth_id", T_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#DifficultyForm').hide();

  			DATA = data;

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
	$('#DifficultyForm').form({
		onSuccess: function(){
			var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

			$.ajax({
				url      : URL_DIFFICULTYASSE,
				type     : DATA == null ? "post" : "PUT", 
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

		$('#DifficultyForm').show();
	});
});