var Nav_Item = {
	medicalrecord        : "medicalrecord",
	illnesshistory       : "illnesshistory",
	mouthexamination     : "mouthexamination",
	riskevaluation       : "riskevaluation",
	diagnose             : "diagnose",
	difficultyassessment : "difficultyassessment",
	cure                 : "cure",
	manage               : "manage",
	usphs                : "usphs",
}

function Nav($Selector, CaseType, IfHandle, NavItem, Parameters) {

	// basic parameters
	this.medicalrecord        = "<a class='item' href='medicalrecord.html'><i class='chevron left icon'></i>返回病历</a>";
	this.illnesshistory       = "<a class='item' href='illnesshistory.html'><i class='history icon'></i>主诉&病史</a>";
	this.mouthexamination     = "<a class='item' href='mouthexamination.html'><i class='add square icon'></i>口腔检查</a>";
	this.riskevaluation       = "<a class='item' href='riskevaluation.html'><i class='pie chart icon'></i>风险评估</a>";
	this.diagnose             = "<a class='item' href='diagnose.html'><i class='heartbeat icon'></i>诊断及治疗计划</a>";
	this.difficultyassessment = "<a class='item' href='difficultyassessment.html'><i class='bar chart icon'></i>难度评估</a>";
	this.cure                 = "<a class='item' href='cure.html'><i class='first aid icon'></i>处置</a>";
	this.manage               = "<a class='item' href='manage.html'><i class='block layout icon'></i>预后管理</a>";
	this.usphs                = "<a class='item' href='usphs.html'><i class='area chart icon'></i>USPHS评估</a>";

	// 初诊
	if (CaseType == 0) {
		$Selector.append(this.medicalrecord);
		$Selector.append(this.illnesshistory);
		$Selector.append(this.mouthexamination);
		$Selector.append(this.riskevaluation);
		$Selector.append(this.diagnose);
		$Selector.append(this.difficultyassessment);
		$Selector.append(this.cure);
		$Selector.append(this.manage);
	} 
	// 复诊
	else if (CaseType == 1) {
		// 不处置
		if (IfHandle == 0) {
			$Selector.append(this.medicalrecord);
			$Selector.append(this.usphs);
			$Selector.append(this.riskevaluation);
			$Selector.append(this.manage);
		}
		// 处置
		else if (IfHandle == 1) {
			$Selector.append(this.medicalrecord);
			$Selector.append(this.usphs);
			$Selector.append(this.mouthexamination);
			$Selector.append(this.riskevaluation);
			$Selector.append(this.diagnose);
			$Selector.append(this.difficultyassessment);
			$Selector.append(this.cure);
			$Selector.append(this.manage);

		}
	}

	$.each($Selector.find("a"), function(){
		$(this).prop('href', $(this).prop('href') + toquerystring({
			uid : Parameters.UID,
			tid : Parameters.TID,
			cid : Parameters.CID,
		}));
	});

	$Selector.find("a[href*=" + NavItem + "]").addClass("blue active");
}