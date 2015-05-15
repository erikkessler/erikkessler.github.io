var tables = [$('#monday'), $('#tues'), $('#wed'), $('#thurs'), $('#fri'), $('#sat'), $('#sun'), $('#overall')];
var weekstart = 1430107200000;
var d = 0;

$(function () {
    loadData(0);
    getWeek(0);
});

function changeWeek(change) {
    d += change;
    loadData(d);
    getWeek(d);
}
function getWeek(delta) {
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay() + 1 - (delta * 7);
    var firstday = new Date(curr.setDate(first));
    $("#week").text(firstday.toLocaleString("en-US", {month: 'long', day: 'numeric' }));

    var firstWeek = firstday - weekstart < 86400000;
    var lastWeek = delta === 0;
    
    if (firstWeek) {
	// disable prev
	$("#prev-week").addClass("disabled");
    } else {
	// enable prev
	$("#prev-week").removeClass("disabled");
    }

    if (lastWeek) {
	// disable next
	$("#next-week").addClass("disabled");
    } else {
	$("#next-week").removeClass("disabled");
    }
}

function loadData(delta) {
    for (var t = 0; t < tables.length; t++) {
	tables[t].bootstrapTable('showLoading');
    }
    $.ajax({
	type: 'GET',
	url: "https://script.google.com/macros/s/AKfycbyWGsn_xSunqEGc3POZGfwNApb5gLLtwwQO25SGcByW720EkAFD/exec?delta=" + delta,
	success: function (data) {

	    var students = Object.keys(data);

	    for (var t = 0; t < tables.length - 1; t++) {
		var sData = [];
		for (var s = 0; s < students.length; s++) {
		    var daily = data[students[s]]["daily"];
		    var index = t * 7;
		    sData.push({name: students[s], sleep:  getInd(daily[index + 0]), vocab: getInd(daily[index + 1]), muse: getInd(daily[index + 2]), app: getInd(daily[index + 3]), sat: getInd(daily[index + 4]), daily: getInd(daily[index + 5]), total: daily[index + 6]});
		}
		tables[t].bootstrapTable('load',sData);
	    }

	    var over = [];
	    for (var s = 0; s < students.length; s++) {
		var totals = data[students[s]]["totals"];
		var index = t * 7;
		over.push({student: students[s], earn: totals[0], lost: totals[1], bonus: totals[2], total: totals[3]});
	    }

	    tables[t].bootstrapTable('load', over);

	    for (var t = 0; t < tables.length; t++) {
		tables[t].bootstrapTable('hideLoading');
	    }


	},
    });
}
    
function getInd(value) {
    if (value == 1) {
	return "<span style=\"color: green;\">✓</span>";
    } else if (value == "x") {
	return "<span style=\"color: red;\">✗</span>";
    } else {
	return "";
    }
}

