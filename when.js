/*
Set callback to run when test function evaluates as truthy. 
Optional JS/CSS file loading.
NOTE: If loading only JS files then an onload event solution is preferable to polling

EXAMPLE:
	var cssRequest = when({
		load: [
			"http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/base/jquery-ui.css"
		],
		test: function(){
			return overlayDiv.offsetWidth === 1; //Width set in CSS
		},
		ready: function(){
			console.log( 'CSS loaded' );
		},
		quit: function(){
			console.log( 'Error - CSS did not load' ); 
		},
		testInterval: 100, //How often to test in ms
		maxSecs: 20 //Seconds until quit
	});

METHODS ON RETURNED OBJECT:
	cssRequest.quit(); //Manually quit
	cssRequest.ready(); //Manually set to ready
*/
(function(window, document, undefined){

	var namespace = window, //Set namespace to attach .when()
		assetsRequested = {},  //URLs of assets to prevent duplicate requests
		headEl = document.getElementsByTagName('head')[0],
		reJS = /\.js/i,
		reCSS = /\.css/i;

	//Add when to namespace
	namespace.when = function(params){
		var testFn = params.test,
			readyFn = params.ready,
			quitFn = params.quit,
			loadArr = params.load,
			timer;

		if(loadArr){
		//If files requested load paths (if not requested already)
		//Type determined by ".js" or ".css" in path
			for(var i=0,len=loadArr.length;i<len;i++){
				var url = loadArr[i];

				if(assetsRequested[url])continue;
				assetsRequested[url] = 1; //Keep record for preventing dups

				if(reJS.test(url))loadJs(url);
				else if(reCSS.test(url))loadCss(url);
			}
		}

		if(readyFn){
		//If test provided start running periodically
		//(If returns true immediately, no timers are created)
			var testInterval = params.testInterval || 250,
				maxSecs = params.maxSecs || 30,
				dur = 0;

			function conditionTest(){
				if(testFn()){ //If testFn evaluates
					resolve(true);
				}
				else if(dur/1000<maxSecs){ //Else wait
					timer = setTimeout(conditionTest, testInterval);
					dur += testInterval;
					//console.log("trying...", dur); //Debug
				}
				else{ //Quit trying after maxSecs
					resolve(false);
				}
			}
			conditionTest();
		}

		function resolve(success){
		//Resolve/clean up
			if(timer)clearTimeout(timer);

			if(success)readyFn.call();
			else if(quitFn)quitFn.call();

			timer = conditionTest = readyFn = quitFn = null;
		}

		//Return object API
		return {
			quit: function(){ //Manually quit
				resolve(false);
			},
			ready: function(){ //Manually set to ready
				resolve(true);
			}
		}

	}

	/* UTILS */
	function loadJs(url){
	//Inject script include into HEAD
		var scriptEl = document.createElement('script');
		scriptEl.type = 'text/javascript';
		scriptEl.src = url;
		headEl.appendChild(scriptEl);
	}

	function loadCss(url){
	//Inject CSS include into HEAD
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = url;
		headEl.appendChild(cssNode);
	}

})(window, document);