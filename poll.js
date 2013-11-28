/**
 * Copyright 2013 Rob Crawford
 * https://github.com/robCrawford/poll
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window, namespace){
//The namespace where `.poll()` is attached should be supplied as the second argument.
//If no namespace is provided then `.poll()` will be added to `window`.

	var allTimers = {},
		isDisabled;
	(namespace || window).poll = poll;

	poll.kill = function(isPermanent){
	//Quit all existing timers
	//Optionally also disable poll() completely
		for(var p in allTimers)clearTimer(p);
		isDisabled = isPermanent;
	}

	function clearTimer(id){
		clearTimeout(id);
		delete allTimers[id];
	}

	function poll(params){
	//If test fn returns true immediately, no timers are created
		if(isDisabled)return;
		var testFn = params.test,
			readyFn = params.ready,
			quitFn = params.quit,
			intervals = params.intervals,
			intervalsIndex = 0,
			frequency = params.frequency || 250,
			timeout = params.timeout || 30000,
			dur = 0,
			isResolved,
			currTimer;

		if(intervals){
		//If intervals supplied, overwrite timeout with total time
			timeout = 0;
			var i = intervals.length;
			while(i--)timeout += intervals[i];
		}

		function conditionTest(){
			clearTimer(currTimer); //To remove allTimers entry
			if(testFn()){ //If testFn evaluates
				resolveReady();
			}
			else if(isResolved){ //If already resolved i.e. by testFn() call above
				return;
			}
			else if(dur<timeout){ //Else wait
				if(intervals)frequency = intervals[intervalsIndex++]; //If intervals supplied
				currTimer = setTimeout(conditionTest, frequency);
				allTimers[currTimer] = 0; //Only need currTimer ID
				dur += frequency;
				//console.log("trying...", dur); //Debug
			}
			else{ //Quit trying after timeout duration
				resolve();
			}
		}

		function resolve(success){
		//Resolve/clean up
			isResolved = true;
			clearTimer(currTimer);

			if(success)readyFn && readyFn.call();
			else quitFn && quitFn.call();

			readyFn = quitFn = currTimer = null; //i.e. calling quit() or ready() once resolved has no effect
		}

		function resolveReady(){
			resolve(true);
		}

		//Set API on testFn
		testFn.quit = resolve;
		testFn.ready = resolveReady;

		//Run first test
		conditionTest();

		//Set API on return object
		return {
			quit: resolve, //Manually quit
			ready: resolveReady //Manually set to ready
		}

	}

})(window);