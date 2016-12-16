$(document).ready(function(){

	// Table active animate
	$('table tbody tr').hover(
		function(){
			$(this).addClass('active');
		},
		function(){
			$(this).removeClass('active');
		}
	);

	// Detail button
	$('.detail.button').click(function(){
		// TODO: Set parameters
		redirection("medicalrecord.html", {uid : 1});
	});

	// ***************************************************************
	// Add Medical Record
	$('.AddMedicalRecordButton').click(function(){
		$('#MedicalRecordAddModal').modal({
			closable  : false,
  			onApprove : function() {
  				$("#basicinfoform").submit();
				return false;
			}
		}).modal('show');
	});
	$("#basicinfoform").form({
		fields: {
			name: {
				identifier: 'name',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的姓名'
					}
				]
			},
			gender: {
				identifier: 'gender',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的性别'
					}
				]
			},
			age: {
				identifier: 'ID',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人身份证号'
					}
				]
			},
			occupation: {
				identifier: 'occupation',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的职业'
					}
				]
			},
			contact: {
				identifier: 'contact',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写病人的联系方式'
					}
				]
			},
			doctor: {
				identifier: 'doctor',
				rules: [
					{
						type   : 'empty',
            			prompt : '请填写医生姓名'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){
			$.ajax({
  				url      : URL_USER,
				type     : "post",
				async    : false, 
				data     : $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});

			return false;
		}
	});
});