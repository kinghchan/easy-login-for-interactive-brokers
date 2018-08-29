document.getElementById("modify").onclick = function() {

	var show = function() {

		table_array = []
		for (var i = 0; i < 16; i++) {
			var row = [];
			for (var j = 1; j <= i+209; j+=16) {
				row.push(j+i);
			}; table_array.push(row);
		};

		function createTable(table_outline, card_data) {
			var table = document.createElement("table");
			var tableBody = document.createElement("tbody");
			table_outline.forEach(function(rowData) {
				var row = document.createElement("tr");
				rowData.forEach(function(colData) {
					var col = document.createElement("td")
					col.appendChild(document.createTextNode(colData));
					var input = document.createElement("input")
					input.type = "text"
					input.id = colData;
					input.setAttribute("maxlength", "3");
					input.style.width = "25px";
					if (card_data[colData] !== null) {
						input.value = card_data[colData];
					} 
					col.appendChild(input);
					row.appendChild(col);
				}); tableBody.appendChild(row);
			});

	    	table.appendChild(tableBody);
			document.body.appendChild(table);
		};

		Object.prototype.isEmpty = function () {
			for (var key in this) {
				if (this.hasOwnProperty(key)) {
					return false;
				};
			} return true;
		};

		chrome.storage.local.get("data", function(card_data) {
			if (card_data.isEmpty()) {
				data = {};
				card_data = {};
				for (var i = 1; i < 225; i++) {
					data[i] = "";
				}
				card_data["data"] = data;
			};

				var card_data = card_data.data;

				createTable(table_array, card_data)
				var inputs_array = document.querySelectorAll("input");
				inputs_array.forEach(function(input) {
					input.addEventListener("input", function(event) {
						// accept alphanumeric values only
						input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
				});
			}); document.getElementById("modify").innerHTML = "Save and close";
		});		
	};

	var hide = function () {
		var dict = {};
		var inputs_array = document.querySelectorAll("input");
		inputs_array.forEach(function(input) {
			dict[input.id] = input.value;
		});

		chrome.storage.local.set({"data": dict})
		var table = document.querySelectorAll("table");
		table[0].parentNode.removeChild(table[0]);
		document.getElementById("modify").innerHTML = "Card";
	};	

	if (document.getElementById("modify").innerHTML == "Card") {
		return show();
	} else {
		return hide();
	}
}



	
