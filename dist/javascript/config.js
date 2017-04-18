$(document).ready(function(){

	// ***************************************************************
	// FUNCTION: Server Application Interface
	window.URL_SERVER           = "http://127.0.0.1:9000"; //192.168.191.1
	window.URL_USER             = URL_SERVER + "/medical-case-of-illness/user";
	window.URL_USERALLTOOTHINFO = URL_SERVER + "/medical-case-of-illness/user-all-tooth-info";
	window.URL_USERTOOTHINFO    = URL_SERVER + "/medical-case-of-illness/user-tooth-info";
	window.URL_GETALLUSER       = URL_SERVER + "/medical-case-of-illness/all-user";
	window.URL_TOOTH            = URL_SERVER + "/medical-case-of-illness/tooth-location-record";
	window.URL_CASE             = URL_SERVER + "/medical-case-of-illness/case";
	window.URL_MOUTHEXAM        = URL_SERVER + "/medical-case-of-illness/oral-examination";  // TODO
	window.URL_RISKEVALUATION   = URL_SERVER + "/medical-case-of-illness/risk-assessment";   // TODO
	window.URL_DIAGNOSE			= URL_SERVER + "/medical-case-of-illness/diagnose";          // TODO
	window.URL_DIFFICULTYASSE   = URL_SERVER + "/medical-case-of-illness/difficulty-assessment";
	window.URL_PRESENTILLNESS   = URL_SERVER + "/medical-case-of-illness/illness-history";
	window.URL_PERSONALHISTORY  = URL_SERVER + "/medical-case-of-illness/personal-history";
	window.URL_MANAGE           = URL_SERVER + "/medical-case-of-illness/prognosis";
	window.URL_USPHS            = URL_SERVER + "/medical-case-of-illness/usphs";
	window.URL_IMAGE            = URL_SERVER + "/medical-case-of-illness/img";
	window.URL_File             = URL_SERVER + "/medical-case-of-illness/file";
	window.URL_CURE             = URL_SERVER + "/medical-case-of-illness/handle";
	window.URL_SEARCH           = URL_SERVER + "/medical-case-of-illness/search-by-conditons";
	window.URL_ILLNESSHISTORY   = URL_SERVER + "/medical-case-of-illness/self-say-history";
	window.URL_PASTHISTORY      = URL_SERVER + "/medical-case-of-illness/past-history";
	window.URL_SELECTION        = URL_SERVER + "/medical-case-of-illness/selections";


	// ***************************************************************
	// FUNCTION: System Common Functions
	window.requestParameter = function(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return "";
	};

	window.networkError = function() { $('#networkerror').modal('show'); }
	window.redirection  = function(URL, Parameters) {
		window.location.href = URL + window.toquerystring(Parameters);
	}
	
	window.toform = function(parameters) {
		var form = "";
		$.each(parameters, function(key, value) {form += key + "=" + value + "&";});
		return form;
	};

	window.toquerystring = function(parameters) {
		var querystring = "?" + window.toform(parameters);
		// Delete the last charactor '&' if exist
		return querystring.length > 0 ? querystring.substring(0, querystring.length - 1) : querystring;
	};


	// ***************************************************************
	// FUNCTION: data_table
	window.TABLE = {
		CHIEF_COMPLAINT  : "chief_complaint",
		PERSONAL_HISTORY : "personal_history",
		DIAGNOSE         : "diagnose",
		MOUTHEXAM        : "oral-examination",
		CURE_SURGICAL    : "surgical",
		CURE_NONSURGICAL : "non_surgical"
	};


	// ***************************************************************
	// FUNCTION: IMAGE_TYPE
	window.IMAGE_TYPE = {
		MOUTHEXAM : 1,
		DIAGNOSE  : 2,
		CURE      : 3,
		USPHS     : 4,
	};
	window.loadImage = function(url, callback){
		var Img = new Image();
		Img.src = url;
		// If the image is aready in the brower cache, then load it
		if (Img.complete) {
			callback(Img);
			return;
		}

		Img.onload = function() {
			callback(Img);
		};
	}
	window.showImage = function(FileData) {

		var $ImageSelector = $('#ID_IMAGE');

		if (FileData.length == 0) {
			$ImageSelector.text("未添加任何图片，请点击右下角修改按钮添加");
		} else {
			$.each(FileData, function(){
				var $ClonedImage = $ImageSelector.find(".hidden.image").clone().removeClass('hidden');
				$ClonedImage.attr("value", this.img_id);

				var ImagePath = this.path;
				//ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
				window.loadImage(ImagePath, function(){
					$ClonedImage.find('img').attr('src', ImagePath);
					$ClonedImage.find('.corner').removeClass('hidden');
				});
				
				$ClonedImage.find('.corner').bind('click', function(){
					var $Image = $(this).parent();

					$('#deletemodal').modal({
						onApprove: function() {
							$.ajax({
								url      : URL_IMAGE + toquerystring({picture_id : $Image.attr("value")}),
								type     : "DELETE",
								data     : {},
								dataType : "text",
								error    : function(data) {
									alert("删除文件失败，请检查网络设置。");
								},
								success  : function() {location.reload();}
							});
						}
					}).modal('show');
				});

				$ImageSelector.append($ClonedImage).append('<div class="ui hidden divider"></div>');
			});
		}
	}
	window.showPreviewImage = function(FileData, $ImageSelector) {

		if ($ImageSelector.length == 0) {
			return;
		}

		$.each(FileData, function(){
			var $ClonedImage = $ImageSelector.find(".hidden.image").clone().removeClass('hidden');
			$ClonedImage.attr("value", this.img_id);

			var ImagePath = this.path;
			//ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
			window.loadImage(ImagePath, function(){
				$ClonedImage.attr('src', ImagePath);
			});

			$ImageSelector.append($ClonedImage).append('<div class="ui hidden divider"></div>');
		});
	}

	// ***************************************************************
	// FUNCTION: Page Common Settings
	$('.ui.dropdown').dropdown();


	// ***************************************************************
	// FUNCTION: 处理jquery的一些特殊选择器符号，jquery不支持的特殊符号
	window.escapeJquery = function(srcString) {
		// 转义之后的结果
		var escapseResult = srcString;

		// javascript正则表达式中的特殊字符
		var jsSpecialChars = ["\\", "^", "$", "*", "?", ".", "+", "(", ")", "[", " ", 
		"]", "|", "{", "}"];

		// jquery中的特殊字符,不是正则表达式中的特殊字符
		var jquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"",
		":", ";", "<", ">", ",", "/"];

		for (var i = 0; i < jsSpecialChars.length; i++) {
			escapseResult = escapseResult.replace(new RegExp("\\" + jsSpecialChars[i], "g"), "\\" + jsSpecialChars[i]);
		}

		for (var i = 0; i < jquerySpecialChars.length; i++) {
			escapseResult = escapseResult.replace(new RegExp(jquerySpecialChars[i], "g"), "\\" + jquerySpecialChars[i]);
		}

		return escapseResult;
	}
});

jQuery.extend({
	ajaxFile: function(Parameters) {

		// 设置form数据:添加文件
		var formData       = new FormData(),
			$FilesSelector = $("#" + Parameters.fileElementId),
			FilesName      = $FilesSelector.attr('name'),
			Files          = $FilesSelector[0].files;

		$.each(Files, function() {formData.append(FilesName, this);});
		$.each(Parameters.data, function(name, value) {formData.append(name, value);});
		Parameters.data = formData;

  		$.ajax(Parameters);
	}
})
