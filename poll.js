/**
 * Copyright 2013 Rob Crawford
 * https://github.com/robCrawford/poll
 * Released under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(window, namespace){
//The namespace where `.poll()` is attached should be supplied as the second argument.
//If no namespace is provided then `.poll()` will be added to `window`.

	var allTimers = {};
	(namespace || window).poll = poll;

	poll.kill = function(){
	//Quit all existing timers
		for(var p in allTimers)clearTimer(p);
	}

	function clearTimer(id){
		clearTimeout(id);
		delete allTimers[id];
	}

	function poll(params){
	//If test fn returns true immediately, no timers are created
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
				resolveQuit();
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

		function resolveQuit(){
			resolve();
		}

		function resolveReady(){
			resolve(true);
		}

		//Set API on testFn
		testFn.quit = resolveQuit;
		testFn.ready = resolveReady;

		//Run first test
		conditionTest();

		//Set API on return object
		return {
			quit: resolveQuit, //Manually quit
			ready: resolveReady //Manually set to ready
		}

	}

})(window);