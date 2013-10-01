/**
 * @preserve Copyright 2013 Rob Crawford
 * https://github.com/robCrawford/poll
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
/*
Polling for async conditions

//EXAMPLE 1 - frequency and timeout specified:
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

//EXAMPLE 2 - staggered durations supplied:
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
		intervals: [
			250, 500, 1000, 2000, 5000
		]
	});


//METHODS ON RETURNED OBJECT:
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
			intervals = params.intervals,
			intervalsIndex = 0,
			frequency = params.frequency || 250,
			timeout = params.timeout || 30000,
			dur = 0,
			timer;

		if(intervals){
		//If intervals supplied, overwrite timeout with total time
			timeout = 0;
			var i = intervals.length;
			while(i--)timeout += intervals[i];
		}

		function conditionTest(){
			if(testFn()){ //If testFn evaluates
				resolve(true);
			}
			else if(dur<timeout){ //Else wait
				if(intervals)frequency = intervals[intervalsIndex++]; //If intervals supplied
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