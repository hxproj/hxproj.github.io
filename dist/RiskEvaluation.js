$(document).ready(function(){
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));

	var U_ID = Number(requestParameter("uid"));
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_RISKEVALUATION,
  		type    : "get",
  		data    : addParameter("user_id", U_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#RiskForm').hide();

  			DATA = data;
  			$('#early_carie').text(DATA.early_carie);
  			$('#can_see').text(DATA.can_see);
  			$('#lost_tooth').text(DATA.lost_tooth);
        $('#system_illness').text(DATA.system_illness);
  			$('#illness_name').text(DATA.illness_name);
  			$('#times_of_carbohydrate').text(DATA.times_of_carbohydrate);
  			$('#consumption_of_carbohydrate').text(DATA.consumption_of_carbohydrate);
  			$('#times_of_meal').text(DATA.times_of_meal);
  			$('#speed_of_saliva').text(DATA.speed_of_saliva);
  			$('#ablity_saliva').text(DATA.ablity_saliva);
  			$('#bacteria').text(DATA.bacteria);
  			$('#consumption').text(DATA.consumption);
  			$('#fluorine_with_water').text(DATA.fluorine_with_water);
  			$('#fluorine').text(DATA.fluorine);
  			$('#seal').text(DATA.seal);
  			$('#times_of_tooth_brush').text(DATA.times_of_tooth_brush);
  			$('#long_of_tooth_brush').text(DATA.long_of_tooth_brush);
  			$('#health_care').text(DATA.health_care);

  			$('#display').show();
  		}
	});

	if (DATA == null) { $('#RiskForm').show(); };

	// ***************************************************************
	// FUNCTION: 提交
	$('#RiskForm').form({
		onSuccess: function(){
			var AddtionParameter = addParameter("user_id", U_ID) + "&";

			$.ajax({
				url      : URL_RISKEVALUATION,
				type     : DATA == null ? "post" : "PUT", 
				data     : AddtionParameter + $(this).serialize(),
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

        $('select[name=early_carie]').dropdown("set selected", DATA.early_carie);
        $('select[name=can_see]').dropdown("set selected", DATA.can_see);
        $('select[name=lost_tooth]').dropdown("set selected", DATA.lost_tooth);
        $('select[name=system_illness]').dropdown("set selected", DATA.system_illness);

        $('input[name=illness_name]').val(DATA.illness_name);
        
        $('select[name=times_of_carbohydrate]').dropdown("set selected", DATA.times_of_carbohydrate);
        $('select[name=consumption_of_carbohydrate]').dropdown("set selected", DATA.consumption_of_carbohydrate);
        $('select[name=times_of_meal]').dropdown("set selected", DATA.times_of_meal);
        $('select[name=speed_of_saliva]').dropdown("set selected", DATA.speed_of_saliva);
        $('select[name=ablity_saliva]').dropdown("set selected", DATA.ablity_saliva);
        $('select[name=bacteria]').dropdown("set selected", DATA.bacteria);
        $('select[name=consumption]').dropdown("set selected", DATA.consumption);
        $('select[name=fluorine_with_water]').dropdown("set selected", DATA.fluorine_with_water);
        $('select[name=fluorine]').dropdown("set selected", DATA.fluorine);
        $('select[name=seal]').dropdown("set selected", DATA.seal);
        $('select[name=times_of_tooth_brush]').dropdown("set selected", DATA.times_of_tooth_brush);
        $('select[name=long_of_tooth_brush]').dropdown("set selected", DATA.long_of_tooth_brush);
        $('select[name=health_care]').dropdown("set selected", DATA.health_care);

		$('#RiskForm').show();
	});
});