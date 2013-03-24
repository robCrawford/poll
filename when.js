/*
Set callback to run when test function evaluates as truthy. 
Optional JS/CSS file loading.

EXAMPLE:
	when({
		load: [
			"http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.js"
		],
		test: function(){
			return !!window.$;
		},
		ready: function(){
			console.log( 'Loaded' ); 
		},
		quit: function(){
			console.log( 'Error' ); 
		},
		testInterval: 100, //How often to test in ms
		maxSecs: 20 //Seconds until quit
	});
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
			loadArr = params.load;

		if(loadArr){
		//Request loadArr paths, if not requested already
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
			//If testFn is already true readyFn will run immediately - no timer will be created
			var quitFn = params.quit,
				testInterval = params.testInterval || 250,
				maxSecs = params.maxSecs || 30,
				dur = 0;

			function conditionTest(){
				if(testFn()){ //If testFn evaluates
					readyFn.call();
				}
				else if(dur/1000<maxSecs){ //Else wait
					setTimeout(conditionTest, testInterval);
					dur += testInterval;
					//console.log("trying...", dur); //Debug
				}
				else{ //Quit trying after maxSecs
					if(quitFn)quitFn.call();
					conditionTest = null;
				}
			}
			conditionTest();
		}

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
	}

})(window, document);