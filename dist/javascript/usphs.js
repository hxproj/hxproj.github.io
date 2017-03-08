$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		Image_type = IMAGE_TYPE.USPHS,
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');
	// INIT Basic info
	getBasicInfo(Nav_Item.usphs, UID, CID, TID);


	// **************************************************
	// GET
	$.ajax({
		url      : URL_USPHS,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "JSON",
		error    : function() {
			// network error
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showData(vData);
			setDefultFormData(vData);
			$FormSegement.hide();
		}
	});


	// **************************************************
	// POST | PUT
	$('form').form({
		onSuccess: function(){
			$.ajax({
				url      : URL_USPHS,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {
					
					$.ajaxFile({
						url           : URL_IMAGE, 
						type          : 'POST',  
						fileElementId : 'imageupload',
						dataType      : 'text',
						data          : {case_id : CID, picture_type : Image_type},
						async         : false,  
						cache         : false,  
						contentType   : false,  
						processData   : false,
						success       : function() {},
						error         : function() {alert("文件上传失败");}
					});
					
					location.reload();
				}
			});
			
			return false;
		}
	});


	// **************************************************
	// Other Envent
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});


	// **************************************************
	// Function
	function showData(vData) {
		$('#color').text(vData.color);
		$('#marginal_accuracy').text(vData.marginal_accuracy);
		$('#anatomic_form').text(vData.anatomic_form);
		$('#edge_color').text(vData.edge_color);
		$('#secondary_caries').text(vData.secondary_caries);

		switch (vData.level) {
			case 'A': {
				$('#usphs_level').text("A(临床可接受)");
				break;
			}
			case 'B': {
				$('#usphs_level').text("B(临床可接受)");
				break;
			}
			case 'C': {
				$('#usphs_level').text("C(临床不可接受)");
				break;
			}
			case 'D': {
				$('#usphs_level').text("D(临床不可接受)");
				break;
			}
		}

		// show image
		$.ajax({
			url      : URL_IMAGE,
			type     : "GET",
			data     : {case_id : CID, type : Image_type},
			dataType : "json",
			success  : function(FileData) {showImage(FileData);}
		});
	}

	function setDefultFormData(vData) {
		$('input[value=' + vData.color + ']').parent().checkbox('check'); 
		$('input[value=' + vData.marginal_accuracy + ']').parent().checkbox('check'); 
		$('input[value=' + vData.anatomic_form + ']').parent().checkbox('check'); 
		$('input[value=' + vData.edge_color + ']').parent().checkbox('check'); 
		$('input[value=' + vData.secondary_caries + ']').parent().checkbox('check'); 
	}
});