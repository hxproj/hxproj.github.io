// ***************************************************************
// FUNCTION: 设置各表单规则
// 牙非手术治疗 - 药物治疗
var vForm1Rules = {
fluorination: {
	identifier: 'fluorination',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择药物氟化物'
		}
	]
},
silver_nitrate: {
	identifier: 'silver_nitrate',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择硝酸银种类'
		}
	]
}
}
// 牙非手术治疗 - 窝沟封闭
var vForm3Rules = {
additional_device: {
	identifier: 'additional_device',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择低速手机额外装置'
		}
	]
},
reagent: {
	identifier: 'reagent',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择蘸取试剂类型'
		}
	]
},
tools: {
	identifier: 'tools',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择蘸取工具类型'
		}
	]
},
lamp: {
	identifier: 'lamp',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择固化灯类型类型'
		}
	]
},
check_time: {
	identifier: 'check_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择定期复查时间'
		}
	]
}
}
// 手术治疗 - 牙树脂直接充填修复
var vForm4Rules = {
anesthesia_medicine: {
	identifier: 'anesthesia_medicine',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择麻醉药物类型'
		}
	]
},
part_anesthesia: {
	identifier: 'part_anesthesia',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择局部麻醉方法'
		}
	]
},
tools: {
	identifier: 'tools',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择去龋工具类型'
		}
	]
},
shape_of_hole: {
	identifier: 'shape_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择制备洞形'
		}
	]
},
depth_of_hole: {
	identifier: 'depth_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请输入洞形深度'
		}
	]
},
shade_guide: {
	identifier: 'shade_guide',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择比色板类型'
		}
	]
},
color_of_tooth: {
	identifier: 'color_of_tooth',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择牙色'
		}
	]
},
disinfect: {
	identifier: 'disinfect',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择窝洞消毒方法'
		}
	]
},
bottom: {
	identifier: 'bottom',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择垫底'
		}
	]
},
full_etching: {
	identifier: 'full_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择全酸蚀粘接系统'
		}
	]
},
self_etching: {
	identifier: 'self_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择自酸蚀粘接系统'
		}
	]
},
coating_time: {
	identifier: 'coating_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择涂布时间'
		}
	]
},
illumination_time: {
	identifier: 'illumination_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光照时间'
		}
	]
},
resin: {
	identifier: 'resin',
	rules: [
		{
			type   : 'empty',
			prompt : '请选树脂'
		}
	]
},
modification: {
	identifier: 'modification',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择修型工具'
		}
	]
},
lamp: {
	identifier: 'lamp',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光固化灯类型'
		}
	]
},
time_of_lamp: {
	identifier: 'time_of_lamp',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光固化灯光照时间'
		}
	]
},
polishing: {
	identifier: 'polishing',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择打磨抛光方式'
		}
	]
}
}
// 手术治疗 - 牙安抚治疗&树脂充填修复
var vForm5Rules = {
appease_medicine: {
	identifier: 'appease_medicine',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择安抚药物类型'
		}
	]
},
observed_time: {
	identifier: 'observed_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择观察时间'
		}
	]
},
anesthesia_medicine: {
	identifier: 'anesthesia_medicine',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择麻醉药物类型'
		}
	]
},
part_anesthesia: {
	identifier: 'part_anesthesia',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择局部麻醉方法'
		}
	]
},
tools: {
	identifier: 'tools',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择去龋工具类型'
		}
	]
},
shape_of_hole: {
	identifier: 'shape_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择制备洞形'
		}
	]
},
depth_of_hole: {
	identifier: 'depth_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请输入洞形深度'
		}
	]
},
shade_guide: {
	identifier: 'shade_guide',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择比色板类型'
		}
	]
},
color_of_tooth: {
	identifier: 'color_of_tooth',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择牙色'
		}
	]
},
disinfect: {
	identifier: 'disinfect',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择窝洞消毒方法'
		}
	]
},
bottom: {
	identifier: 'bottom',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择垫底'
		}
	]
},
full_etching: {
	identifier: 'full_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择全酸蚀粘接系统'
		}
	]
},
self_etching: {
	identifier: 'self_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择自酸蚀粘接系统'
		}
	]
},
coating_time: {
	identifier: 'coating_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择涂布时间'
		}
	]
},
illumination_time: {
	identifier: 'illumination_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光照时间'
		}
	]
},
resin: {
	identifier: 'resin',
	rules: [
		{
			type   : 'empty',
			prompt : '请选树脂'
		}
	]
},
modification: {
	identifier: 'modification',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择修型工具'
		}
	]
},
lamp: {
	identifier: 'lamp',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光固化灯类型'
		}
	]
},
time_of_lamp: {
	identifier: 'time_of_lamp',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光固化灯光照时间'
		}
	]
},
polishing: {
	identifier: 'polishing',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择打磨抛光方式'
		}
	]
}
}
// 手术治疗 - 嵌体修复/贴面修复 
var vForm67Rules = {
anesthesia_medicine: {
	identifier: 'anesthesia_medicine',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择麻醉药物类型'
		}
	]
},
part_anesthesia: {
	identifier: 'part_anesthesia',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择局部麻醉方法'
		}
	]
},
tools: {
	identifier: 'tools',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择去龋工具类型'
		}
	]
},
shape_of_hole: {
	identifier: 'shape_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择制备洞形'
		}
	]
},
depth_of_hole: {
	identifier: 'depth_of_hole',
	rules: [
		{
			type   : 'empty',
			prompt : '请输入洞形深度'
		}
	]
},
is_piece: {
	identifier: 'is_piece',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择干燥方法'
		}
	]
},
shade_guide: {
	identifier: 'shade_guide',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择比色板类型'
		}
	]
},
color_of_tooth: {
	identifier: 'color_of_tooth',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择牙色'
		}
	]
},
modulo: {
	identifier: 'modulo',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择取模材料'
		}
	]
},
inlay: {
	identifier: 'inlay',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择嵌体材料'
		}
	]
},
disinfect: {
	identifier: 'disinfect',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择窝洞消毒方法'
		}
	]
},
bottom: {
	identifier: 'bottom',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择垫底'
		}
	]
},
full_etching: {
	identifier: 'full_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择全酸蚀粘接系统'
		}
	]
},
self_etching: {
	identifier: 'self_etching',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择自酸蚀粘接系统'
		}
	]
},
coating_time: {
	identifier: 'coating_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择涂布时间'
		}
	]
},
illumination_time: {
	identifier: 'illumination_time',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择光照时间'
		}
	]
},
polishing: {
	identifier: 'polishing',
	rules: [
		{
			type   : 'empty',
			prompt : '请选择打磨抛光方式'
		}
	]
}
}