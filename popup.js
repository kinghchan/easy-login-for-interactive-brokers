chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
	console.log(tabs)
	if (tabs[0].url.includes("interactivebrokers")) {//https://www.interactivebrokers.com.hk/sso/Login" || tabs[0].url == "https://zh.wgw.interactivebrokers.com/webtrader/servlet/login") {
		document.getElementById("test").disabled = false;
		var status = document.getElementById("status")
		status.innerHTML = "Status: <b>Active<b>"
		status.style.color = "green";

		document.getElementById("test").onclick = function() {
		
			function modifyDOM() {
				
				var images = document.getElementsByTagName("img");
				console.log(images);
					
				for (var index = 0; index < images.length; index++) {
					if (typeof images[index] === "undefined") {
						continue;
					} else if (images[index].src.includes("GET_BINGO") != true && images[index].src.includes("Generic") != true) {
						continue;
					} else {
						console.log(images[index]);
						var canvas = document.createElement('canvas');
				        var context = canvas.getContext('2d')
				        canvas.width = 228;
				        canvas.height = 28;
				        context.drawImage(images[index], 0,0);
				        var imgData = context.getImageData(0,0,228,28)
				        imgData = Array.from(imgData.data);

				        imgData_gray = [];
				        for (var i = 0; i < imgData.length; i+=4) {
				        	imgData_gray.push(0.114*imgData[i]+0.587*imgData[i+1]+0.299*imgData[i+2])
				        };

				        for (i = 0; i < imgData_gray.length; i++) {
				        	imgData_gray[i] = imgData_gray[i]/255;
				        };

				        d = JSON.stringify({data: imgData_gray});
						console.log(d)
						chrome.runtime.sendMessage(d, function(response) {
							console.log(response.length);
							console.log("response received");
						});

						return true;
						
					};
				} 

				var message = JSON.stringify({data: "false"});
			    chrome.runtime.sendMessage(message, function(response) {
					console.log("image not present")
				});

				return false;
				
			};

			chrome.tabs.executeScript({
		        code: '(' + modifyDOM + ')();' 
		    });	
		};
	} else {
		document.getElementById("test").disabled = true;
		var status = document.getElementById("status")
		status.innerHTML = "Status: <b>Inactive<b>"
		status.style.color = "red";
	}
});





