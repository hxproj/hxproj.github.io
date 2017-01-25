$(document).ready(function(){

	$('#PresentIllnessContext .menu .item').tab({ context: $('#PresentIllnessContext') });

	
	// **************************************************
	// INIT
	// INIT PARAMENTERS
	// TODO: Request Parameters From URL
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');


	// **************************************************
	// POST | PUT
	$('#ID_mainform').form({
		fields: {
			tooth_surface_and_location: {
				identifier: 'tooth_location',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择患牙位置'
					}
				]
			},
			symptom: {
				identifier: 'symptom',
				rules: [
					{
						type   : 'empty',
						prompt : '症状'
					}
				]
			},
			time_of_occurrence: {
				identifier: 'time_of_occurrence',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择病程时间'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){
			$.ajax({
				url      : URL_DIFFICULTYASSE,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});
			
			return false;
		}
	});


	// **************************************************
	// Function
	var $TimeofOccurrence = $('#ChiefComplaint input[name=time_of_occurrence]');
	$TimeofOccurrence.parent().click(function(){
		$('#ID_TimeModal').modal({

		}).modal('show');
	});
	$('#ID_TimeModal a.label').click(function(){
		$TimeofOccurrence.val($(this).text() + $(this).prevAll('div.label').text());
		$('#ID_TimeModal').modal('hide');
	});

	// **************************************************
	// Function
});