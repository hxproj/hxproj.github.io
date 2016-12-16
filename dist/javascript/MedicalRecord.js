$(document).ready(function(){

	$('table tbody tr').hover(
		function(){
			$(this).addClass('active');
		},
		function(){
			$(this).removeClass('active');
		}
	);
});