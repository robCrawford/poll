/*! poll.js - v0.1.0 - 2014-06-19
* Copyright (c) 2014 Rob Crawford; Licensed MIT */
(function(window, namespace){
//If an object is supplied as the second argument to the wrapping iife then `.poll()` will be attached to that namespace.  
//If no namespace is provided then `.poll()` will be added to `window`.
	"use strict";
	var allTimers = {},
		isDisabled;

	//Add to namespace
	(namespace || window).poll = poll;

	//Defaults - can be overridden from global ref i.e. `poll.timeout = 1000`
	poll.frequency = 250;
	poll.timeout = 30000;


	function poll(params){
		if(isDisabled)return;
		var testFn = params.test,
			readyFn = params.ready,
			quitFn = params.quit,
			intervals = params.intervals,
			intervalsIndex = 0,
			frequency = params.frequency || poll.frequency,
			timeout = params.timeout || poll.timeout,
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
			if(testFn(dur)){ //If testFn evaluates
				resolveReady();
			}
			else if(isResolved){ //If already resolved i.e. by testFn() call above
				return;
			}
			else if(dur<timeout){ //Else wait
				if(intervals)frequency = intervals[intervalsIndex++]; //If intervals supplied
				currTimer = setTimeout(conditionTest, frequency);
				allTimers[currTimer] = 1; //Only need currTimer ID
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
		//Timer ensures that returned object exists within callback
		currTimer = setTimeout(conditionTest, 0);
		allTimers[currTimer] = 1; //Only need id

		//Set API on return object
		return {
			quit: resolve, //Manually quit
			ready: resolveReady //Manually set to ready
		}

	}

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


})(window);