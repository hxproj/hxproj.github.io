$(document).ready(function(){

	// **************************************************
	// GET
	$.ajax({
		url      : URL_File,
		type     : "GET", 
		dataType : "json",
		error    : function() {
		},
		success  : function(vData) {
			if (vData.length != 0) {
				$.each(vData, function(){
					showFile(this);
				});
				$('#helpfiles').show();
			} else {
				$('.info.message').show();
			}
		}
	});

	var $InvisibleFile = $('.invisible.file'),
		$Tbody = $('tbody');
	function showFile(vData) {
		$File = $InvisibleFile.clone(true).removeClass('invisible');

		$File.attr("id", vData.file_id);
		$File.find('td[type=file_name] span').text(vData.name);
		$File.find('td[type=file_in_date]').text(vData.in_date);

		var href = vData.path;
		href = href.substring(href.lastIndexOf("Medical_Case\\"), href.length);
		$File.find('td[type=file_name] a').attr("href", href);

		$Tbody.append($File);
	}

	// **************************************************
	// upload file
	$('div[type=upload]').click(function(){
		$('#id_uploadmodal').modal({
			closable  : false,
			onApprove : function() {

				$.ajaxFile({
					url           : URL_File, 
					type          : 'POST',  
					fileElementId : 'uploadfile',
					dataType      : 'text',
					data          : {},
					async         : false,  
					cache         : false,  
					contentType   : false,  
					processData   : false,
					success       : function() {
						location.reload();
					},
					error         : function() {
						alert("文件上传失败");
					}
				});

				return false;
			}
		}).modal('show');
	});


	// **************************************************
	// edit file
	$('.edit.button').click(function(){
		var file_id = $(this).parents('tr').attr("id");
		$('#id_editmodal').modal({
			closable  : false,
			onApprove : function() {
				$.ajax({
					url      : URL_File,
					type     : "PUT",
					data     : {file_id : file_id, name : $(this).find('input').val()},
					success  : function(vData) { location.reload(); },
					error    : function() { networkError(); }
				});

				return false;
			}
		}).modal('show');
	});


	// **************************************************
	// delete file
	$('.delete.button').click(function(){
		var file_id = $(this).parents('tr').attr("id");
		$('#ID_DeleteModal').modal({
			closable  : false,
			onApprove : function() {
				$.ajax({
					url      : URL_File + toquerystring({file_id : file_id}),
					type     : "DELETE", 
					success  : function(vData) {
						location.reload();
					},
					error    : function() {
						alert("文件删除失败");
					}
				});
			}
		}).modal('show');
	});
});