/**
 * @preserve Copyright 2013 Rob Crawford
 * https://github.com/robCrawford/poll
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
/*
Polling for async conditions

EXAMPLE:
	var cssTest = poll({
		test: function(){
			return overlayDiv.offsetWidth === 1; //Width set in CSS
		},
		ready: function(){
			console.log( 'CSS loaded' );
		},
		quit: function(){
			console.log( 'Error - CSS did not load' ); 
		},
		frequency: 100, //How often to poll in ms (default: 250)
		timeout: 10000 //ms until quit (default: 30000)
	});

METHODS ON RETURNED OBJECT:
	cssTest.quit(); //Manually quit
	cssTest.ready(); //Manually set to ready

NOTE:
	The namespace to attach .poll() to can easily be changed by supplying a second argument into the wrapping iife
*/
(function(window, namespace){ //Optionally supply namespace to attach .poll()

	(namespace || window).poll = function(params){
	//If test fn returns true immediately, no timers are created
		var testFn = params.test,
			readyFn = params.ready,
			quitFn = params.quit,
			frequency = params.frequency || 250,
			timeout = params.timeout || 30000,
			dur = 0,
			timer;

		function conditionTest(){
			if(testFn()){ //If testFn evaluates
				resolve(true);
			}
			else if(dur<timeout){ //Else wait
				timer = setTimeout(conditionTest, frequency);
				dur += frequency;
				//console.log("trying...", dur); //Debug
			}
			else{ //Quit trying after timeout duration
				resolve(false);
			}
		}
		conditionTest();

		function resolve(success){
		//Resolve/clean up
			if(timer)clearTimeout(timer);

			if(success)readyFn && readyFn.call();
			else quitFn && quitFn.call();

			readyFn = quitFn = timer = null; //i.e. calling quit() or ready() once resolved has no effect
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

})(window);