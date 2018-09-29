

// background.js
require(["./scripts/neural_network", "./scripts/jquery"], function(neural_network) {

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

		console.log("message received")
		message = JSON.parse(message);
		imageData = message.data;

		var views = chrome.extension.getViews({
	    		type: "popup"
	    });

		if (imageData == "false") {
	    	views[0].document.getElementById("code").innerHTML = "<br>No image<br>";
		} else {
			imageData = Object.values(imageData)
			console.log(imageData.length);
			var return_data = neural_network.forward_propagate(imageData);
			// Index 0 returns the predictions
			var answer = return_data[0];
			// Index 1 returns the position of separation between the two numbers
			var from_left = return_data[1];
			//var split = neural_network.split(imageData)[1];

			console.log(answer);
			console.log(from_left);
			if (from_left == 0){
				from_left = 1;
			}
			answer.splice(from_left, 0, "|");
			answer = answer.join("");

			var left = answer.slice(0,from_left);
			var right = answer.slice(from_left+1); 
			var card_data;

			Object.prototype.isEmpty = function () {
			for (var key in this) {
					if (this.hasOwnProperty(key)) {
						return false;
					};
				} return true;
			};
			card_data = {}
			chrome.storage.local.get("data", function(carddata) {
				// for the first installation
				if (carddata.isEmpty() || typeof carddata === "undefined") {
					data = {};
					card_data = {};
					for (var i = 1; i < 225; i++) {
						data[i] = "";
					}
					card_data["data"] = data;
				} else {
					card_data["data"] = carddata.data;
				};
				var left_code = card_data["data"][left];
				if (left_code == "" || typeof left_code === "undefined") {
					left_code = "--";
				}

				var right_code = card_data["data"][right];
				if (right_code == "" || typeof right_code === "undefined") {
					right_code = "--";
				}
		    	// Change text on the pop-up document 
		    	views[0].document.getElementById("prediction").innerHTML = "Numbers: <br>" + "<b>"+answer+ "</b><br>";
		    	views[0].document.getElementById("code").innerHTML = "Codes: <br>" + "<b>" + left_code + "</b>" + "|" + "<b>"+right_code+ "</b>";
		    	sendResponse(answer);
		    	//document.getElementById('chlginput').value = left_code+right_code
				return true;	
			});
		}
	});
});
// When the browser-action button is clicked...
