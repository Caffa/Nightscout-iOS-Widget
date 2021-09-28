// Nightscout Widget
//
// Copyright (C) 2020 by niepi <niepi@niepi.org>
//
// Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
// IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE
// OF THIS SOFTWARE.

const nsUrl =`https://personOne.herokuapp.com/`; // your nightscout url
const nsUrlTwo = 'https://personTwo.herokuapp.com/'

const nameOne = "personOne"
const nameTwo = "personTwo"

// const glucoseDisplay = `mgdl`;
// const glucoseDisplay = `mmoll`; // currently takes on whatever the nightscout gives
const dateFormat  = `en-US`;

// Initialize Widget
let widget = await createWidget();
if (!config.runsInWidget) {
	await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

// Build Widget
async function createWidget(items) {
	const list = new ListWidget();
	
	let header, glucose, secGlucose, secDirection, updated;
	
	let nsDataV2 = await getNsDataV2();

	let directionString = await getDirectionString(nsDataV2.direction);
	
	header = list.addText(nameOne.toUpperCase());
	header.font = Font.mediumSystemFont(10);
  
	let glucoseValue = nsDataV2.bg;		
	
	
	glucose = list.addText("" + glucoseValue + " " + directionString);
	glucose.font = Font.mediumSystemFont(30);

	
	let updateTime = new Date(nsDataV2.mills).toLocaleTimeString(dateFormat, { hour: "numeric", minute: "numeric" })


	infoDeltaTime = list.addText("" + nsDataV2.delta + "  " + updateTime);
	infoDeltaTime.font = Font.mediumSystemFont(10);

	//////////////
	list.addSpacer();
	
	let nsDataV3 = await getNsDataV3();
   	let directionStringTwo = await getDirectionString(nsDataV3.direction);
	headerTwo = list.addText(nameTwo.toUpperCase());
	headerTwo.font = Font.mediumSystemFont(10);

	let glucoseValueTwo = nsDataV3.bg;	

	glucoseTwo = list.addText("" + glucoseValueTwo + " " + directionStringTwo);
	glucoseTwo.font = Font.mediumSystemFont(30);

	
	let updateTimeTwo = new Date(nsDataV3.mills).toLocaleTimeString(dateFormat, { hour: "numeric", minute: "numeric" })

	infoDeltaTimeTwo = list.addText("" + nsDataV3.delta + "  " + updateTimeTwo);
	infoDeltaTimeTwo.font = Font.mediumSystemFont(10);
	
	list.refreshAfterDate = new Date(Date.now() + 60);
	return list;
}

async function getNsDataV2() {
	// let url = nsUrl + "/api/v2/properties?&token=" + nsToken;
	let url = nsUrl + "pebble"
	let data = await new Request(url).loadJSON();
	let MyData = {
		bg: data.bgs[0].sgv,
		direction: data.bgs[0].direction,
		delta: data.bgs[0].bgdelta,
		mills: data.bgs[0].datetime
	};

	if (MyData.delta.charAt(0) != "-" && !MyData.delta.startsWith("0.0") ){
		MyData.delta = "+" + MyData.delta
	}

	return MyData
}

async function getNsDataV3() {
	// let url = nsUrl + "/api/v2/properties?&token=" + nsToken;
	let url = nsUrlTwo + "pebble"
	let data = await new Request(url).loadJSON();
	let MyData = {
		bg: data.bgs[0].sgv,
		direction: data.bgs[0].direction,
		delta: data.bgs[0].bgdelta,
		mills: data.bgs[0].datetime
	};

	if (MyData.delta.charAt(0) != "-" && !MyData.delta.startsWith("0.0")){
		MyData.delta = "+" + MyData.delta
	}

	  return MyData
}



async function getDirectionString(direction) {
	
	let directionString
	switch(direction) {
		case 'NONE':
		directionString = '⇼';
		break;
		case 'DoubleUp':
		directionString = '⇈';
		break;
		case 'SingleUp':
		directionString = '↑';
		break;          
		case 'FortyFiveUp':
		directionString = '↗';
		break;                  
		case 'Flat':
		directionString = '→';
		break;                      
		case 'FortyFiveDown':
		directionString = '↘';
		break;
		case 'SingleDown':
		directionString = '↓';
		break;  
		case 'DoubleDown':
		directionString = '⇊';
		break;
		case 'NOT COMPUTABLE':
		directionString = '-';
		break;  
		case 'RATE OUT OF RANGE':
		directionString = '⇕';
		break;
		default:
		directionString = '⇼';
	}
	return directionString;
}
