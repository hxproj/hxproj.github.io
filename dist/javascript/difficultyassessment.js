$(document).ready(function(){

	// **************************************************
	// POST
	$('form').form({
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
			}
		},
		inline: true,
		onSuccess: function(){

			$.ajax({
				url      : URL_DIFFICULTYASSE,
				type     : "POST", 
				data     : toform({user_id : U_ID, tooth_id : T_ID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});
			
			return false;
		}
	});
	

	// **************************************************
	// Function
});