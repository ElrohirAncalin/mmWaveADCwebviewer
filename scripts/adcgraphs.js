
//This can be made much more versatile with a checkbox for all SNR values
var ABF_cap_0dB =  [1.119, 1.943,  3.005, 3.939,4.472,4.718,4.813]
var ABF_cap_20dB = [1.091, 2.259,  3.610, 5.255,6.643,8.340,9.770]
var HBF_cap_0dB =  [7.946, 13.730, 19.952,24.926,27.765,29.550,31.271]
var HBF_cap_20dB = [9.014, 16.190, 24.711,33.512,44.528,55.468,63.750]
var DBF_cap_0dB =  [8.610, 15.440, 22.198,28.153,31.567,33.954,33.954]
var DBF_cap_20dB = [8.901, 16.622, 24.859,34.063,44.906,56.676,65.984]

function updateCapacityValues(){
	var fileurl="capacityResults/"+"Nt"+$("#Nant").val()+"Nr"+$("#Nrf").val()+"Nc"+$("#Nc").val()+"Np"+$("#Np").val()+".txt";
	$.ajax({ 
		url: fileurl, 
		data: null,
		success: function( data ) {
			var matrix=data.split("\n").map(function(a){ return a.split(" ").map(parseFloat)});
			ABF_cap_0dB =  matrix[0]
			ABF_cap_20dB = matrix[1]
			HBF_cap_0dB =  matrix[2]
			HBF_cap_20dB = matrix[3]
			DBF_cap_0dB =  matrix[4]
			DBF_cap_20dB = matrix[5]
			updatePlot();
		},
		dataType: "text"
	});
	//modify global variables above
}

var ABF_P_const =  16; //Plna+Posc+Pbpf+...
var ABF_P_bits =  1;   //cB of the ADC
var HBF_P_const =  64;
var HBF_P_bits =  4;
var DBF_P_const =  1;
var DBF_P_bits =  16;

function updatePowerValues(){
	var cadc=parseFloat($("#cadc").val());
	var B=parseFloat($("#bandwidth").val());
	var Pm=parseFloat($("#Pm").val());
	var Pc=parseFloat($("#Pc").val());
	var Plo=parseFloat($("#Plo").val());
	var Plpf=parseFloat($("#Plpf").val());
	var Pbba=parseFloat($("#Pbba").val());
	var Pps=parseFloat($("#Pps").val());
	var Psp=parseFloat($("#Psp").val());
	var Plna=parseFloat($("#Plna").val());
	var Nant=parseFloat($("#Nant").val());
	var Nr=parseFloat($("#Nrf").val());

	var Prf=Pm+Plo+Plpf+Pbba;
	ABF_P_const=(Nant*(Plna+Pps)+Prf+Pc)*1e-3;
	ABF_P_bits=2*cadc*1e-6*B;
	HBF_P_const=(Nant*(Plna+Psp+Pps*Nr)+Nr*Pc+Nr*Prf)*1e-3;
	HBF_P_bits=2*Nr*cadc*1e-6*B;
	DBF_P_const=(Nant*(Plna+Prf))*1e-3;
	DBF_P_bits=2*Nant*cadc*1e-6*B;
	//modify global variables above
}

function drawTriangle(ctx, x, y, radius, shadow) {
    ctx.moveTo(x , y + 1.3*radius);
    ctx.lineTo(x + 1.3*radius*Math.cos(Math.PI/6), y -1.3*radius*(1-Math.sin(Math.PI/6)));
    ctx.lineTo(x - 1.3*radius*Math.cos(Math.PI/6), y -1.3*radius*(1-Math.sin(Math.PI/6)));
    ctx.lineTo(x , y +1.3*radius);
}

function updatePlot(){
	var maxX=0;
	var maxY=0;
	var d1=[];
	for (var b=0;b<8;b++){
		d1.push([ABF_cap_0dB[b]/(ABF_P_const+ABF_P_bits*Math.pow(2.0,b+1)),ABF_cap_0dB[b]])		
	maxX=Math.max(maxX,d1[b][0]);
	}
	maxY=Math.max(maxY,d1[7][1]);
	var d2=[];
	for (var b=0;b<8;b++){
		d2.push([ABF_cap_20dB[b]/(ABF_P_const+ABF_P_bits*Math.pow(2.0,b+1)),ABF_cap_20dB[b]])
	maxX=Math.max(maxX,d2[b][0]);
	}
	maxY=Math.max(maxY,d2[7][1]);
	var d3=[];
	for (var b=0;b<8;b++){
		d3.push([HBF_cap_0dB[b]/(HBF_P_const+HBF_P_bits*Math.pow(2.0,b+1)),HBF_cap_0dB[b]])
	maxX=Math.max(maxX,d3[b][0]);
	}
	maxY=Math.max(maxY,d3[7][1]);
	var d4=[];
	for (var b=0;b<8;b++){
		d4.push([HBF_cap_20dB[b]/(HBF_P_const+HBF_P_bits*Math.pow(2.0,b+1)),HBF_cap_20dB[b]])		
		maxX=Math.max(maxX,d4[b][0]);
	}
	maxY=Math.max(maxY,d4[7][1]);
	var d5=[];
	for (var b=0;b<8;b++){
		d5.push([DBF_cap_0dB[b]/(DBF_P_const+DBF_P_bits*Math.pow(2.0,b+1)),DBF_cap_0dB[b]])
	maxX=Math.max(maxX,d5[b][0]);
	}
	maxY=Math.max(maxY,d5[7][1]);
	var d6=[];
	for (var b=0;b<8;b++){
		d6.push([DBF_cap_20dB[b]/(DBF_P_const+DBF_P_bits*Math.pow(2.0,b+1)),DBF_cap_20dB[b]])
	maxX=Math.max(maxX,d6[b][0]);
	}
	maxY=Math.max(maxY,d6[7][1]);

	plots=[
		{color: "#008141",  label:"\u25CF Analog Combining SNR=-20dB", data:d1},
		{color: "#008141", points: {symbol:"cross"}, label:"<span style=\"font-family: Courier, monospace;font-size:20;\">X</span> Analong Combining SNR=0dB", data:d2},
		{color: "#a10000", points: {symbol:"square"}, label:"\u25A0 Hybrid Combining SNR=-20dB", data:d3},
		{color: "#a10000", points: {symbol:"diamond"}, label:"\u25C6 Hybrid Combining SNR=0dB", data:d4},
		{color: "#005682", points: {symbol:drawTriangle}, label:"\u25B2 Digital Combining SNR=-20dB", data:d5},
		{color: "#005682", points: {symbol:"triangle"}, label:"\u25BC Digital Combining SNR=0dB", data:d6},
	];
	if ($("#Plim").is(':checked')){
		maxX=1.02*maxX;		
		maxY=1.02*maxY;
		var d7=[]
		var slope=parseFloat($("#Pconst").val());
		for (var t=0;t<1.05;t+=0.05){
			if (slope<maxY/maxX){
				d7.push([t*maxX,slope*maxX*t,maxY]);
			}else{
				d7.push([t*maxY/slope,maxY*t,maxY]);
			}
		}
		plots.push({color: "#505050", lines: {fill:0.9} ,points: {show:false}, label: ">"+$("#Pconst").val()+"W power region", data:d7});
	}
	$.plot("#chart1",plots,{
		lines: {show:true},
		points: {show:true, radius:4},		
		legend:{container:"#chart1legend"},
		axisLabels: {
			    show: true
			},
		xaxes: [{
		    axisLabel: 'Energy Efficiency (Gb/J)',
		}],
		yaxes: [{
		    position: 'left',
		    axisLabel: 'Spectral Efficiency (bps/Hz)',
		}, {
		    position: 'right',
		    axisLabel: 'bleem'
		}]
	})
}

$(document).ready(function(){
	//JQUERY UI INITIALIZERS
	$( "#Plim,#helpbt" ).button();
	$( "#helpdg" ).dialog({width: 960, autoOpen:false});
	$("#helpbt").click(function(){
		$( "#helpdg" ).dialog( "open" );
	});
	$( "#helptb" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	$( "#helptb li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );;
	$("#Nc,#Np,#Nant,#Nrf,#adcmodsel").selectmenu();
	$("#Plim,#Pconst").change(function(){
		updatePlot();
	});
	$("#menu").accordion({
      collapsible: true,
      heightStyle: "content"
    });
	//response to inputs
	$("#Nc,#Np").on("selectmenuchange",function(){
		updateCapacityValues();//has updateplot in it after ajax success
	});
	$("#Nrf,#Nant").on("selectmenuchange",function(){
		updatePowerValues();
		updateCapacityValues();//has updateplot in it after ajax success
	});
	$("#adcmodsel").on("selectmenuchange",function(){
		switch ($("#adcmodsel").val()){
		case "custom":
			$("#powermenu input").removeAttr("disabled");
			break;
		case "PHPADC":
			$("#cadc").val("12500").attr("disabled",true);
			break;
		case "HPADC":
			$("#cadc").val("494").attr("disabled",true);
			break;
		case "LPADC":
			$("#cadc").val("5").attr("disabled",true);
			break;
		}
		if ($("#adcmodsel").val()!="custom"){
			$("#Pm").val("16.5").attr("disabled",true);
			$("#Pc").val("19.5").attr("disabled",true);
			$("#Plo").val("5").attr("disabled",true);
			$("#Plpf").val("14").attr("disabled",true);
			$("#Pbba").val("5").attr("disabled",true);
			$("#Pps").val("19.5").attr("disabled",true);
			$("#Psp").val("19.5").attr("disabled",true);
			$("#Plna").val("39").attr("disabled",true);
		}
		updatePowerValues();
		updatePlot();
	});

	$("#cadc,#bandwidth,#Plna,#Psp,#Pps,#Plo,#Plpf,#Pbba,#Pm,#Pc").change(function(){
		updatePowerValues();
		updatePlot();
	});
	updatePowerValues();
	updateCapacityValues();
});


