$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var table    = requestParameter("type"),
		field    = requestParameter("name"),
		value    = requestParameter("value"),
		itemName = requestParameter("itemName");

	var QueryString = URL_SEARCH + toquerystring({table : table, page : 1}) + "&" + field + "=" + value;

	var $InvisibleItem         = $('.invisible.item'),
		$InvisibleFirstCase    = $('.invisible.labels[type=case_firstvisit]'),
		$InvisibleHandleCase   = $('.invisible.labels[type=case_handle]'),
		$InvisibleNoHandleCase = $('.invisible.labels[type=case_nohandle]');

	// ***************************************************************
	// Search
	$.ajax({
		url      : QueryString,
		type     : "get",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(vData){
			if (vData.searched == "ok") {
				$('.search.label').text(decodeURI(itemName + ": " + value));
	 			
	 			// 显示当前页所有病历
	 			showAllCase(vData.info_list);
			} else {
				$('.search.label').text("未搜索到“" + decodeURI(itemName+ "(" + value + ")") + "”相关病历");
			}
		}
	});


	// ***************************************************************
	// Show
	function showAllCase(vData) {
		$.each(vData, function(){
			showCase(this);
		});
	}
	function showCase(vCase) {
		var $Item = $InvisibleItem.clone(false).removeClass('invisible');

		if (vCase.case_type) {
			var $ReExamination;
			vCase.if_handle ? $ReExamination = $InvisibleHandleCase.clone(false).removeClass('invisible') : 
				$ReExamination = $InvisibleNoHandleCase.clone(false).removeClass('invisible');

			$ReExamination.attr("case_id", vCase.case_id);
			$ReExamination.find('span[type=doctor]').text(vCase.judge_doctor);
			$ReExamination.find("div.time span").text(vCase.date);

			setHref($ReExamination.find('a.label'), vCase.user_id, vCase.tooth_id, vCase.case_id);
			activeReExaminationStep($ReExamination.find('a.label'), vCase.step, vCase.if_handle);

			$Item.find('div.description').append($ReExamination);
		} else {
			var $FirstVisit = $InvisibleFirstCase.clone(false).removeClass('invisible');

			$FirstVisit.attr("case_id", vCase.case_id);
			$FirstVisit.find("span[type=doctor]").text(vCase.judge_doctor);
			$FirstVisit.find("div.time span").text(vCase.date);

			setHref($FirstVisit.find('a.label'), vCase.user_id, vCase.tooth_id, vCase.case_id);
			activeFirstVisitStep($FirstVisit.find('a.label'), vCase.step);

			$Item.find('div.description').append($FirstVisit);
		}

		var $medicalrecord = $Item.find('.extra a');
		$medicalrecord.prop('href', $medicalrecord.prop('href') + toquerystring({
			uid : vCase.user_id,
			tid : vCase.tooth_id,
			cid : vCase.case_id,
		}));	

		$('.items').append($Item);
	}

	function setHref($Items, UID, TID, CID) {
		$.each($Items, function(){
			$(this).prop('href', $(this).prop('href') + toquerystring({
				uid : UID,
				tid : TID,
				cid : CID,
			}));
		});
	}
	function activeFirstVisitStep($Items, Steps) {
		if ($Items != undefined) {
			$.each(Steps, function(){
				$Items.eq(this - 1).addClass("blue");
			});
		}
	}
	function activeReExaminationStep($Items, Steps, IfHandle) {
		if ($Items != undefined) {
			$.each(Steps, function(){
				if (this == 8) {
					$Items.eq(0).addClass("blue");
				} else {
					if (IfHandle) {
						$Items.eq(this - 1).addClass("blue");
					} else {
						if (this == 3) {
							$Items.eq(1).addClass("blue");
						}
						if (this == 7) {
							$Items.eq(2).addClass("blue");
						}
					}
				}
			});
		}
	}

})