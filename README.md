poll.js
=======

*(No dependencies, 0.6kB minified)*  

Runs `test` function at specified intervals.  
If `test` returns a truthy value then `ready` is called and polling quits.  
If `timeout` is reached then `quit` is called instead.  

The state can be set manually at any time via the returned object i.e. `cssTest.ready()` or `cssTest.quit()`.  

The function object supplied to the param `test` also has the methods `.ready()` and `.quit()` attached.  
This is useful for stopping polling from within that function, i.e. when defined in a different scope.  

Test frequency can be uniform or a set of durations, see examples below.  


```javascript

//MINIMUM REQUIRED
	poll({
		test: function(){
			return testDiv.offsetWidth === 10;
		},
		ready: function(){
			console.log( 'CSS loaded' );
		}
	});

//EXAMPLE 1 - frequency and timeout specified:
	var cssTest = poll({
		test: function(){
			return testDiv.offsetWidth === 10;
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
			return testDiv.offsetWidth === 10;
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

//EXAMPLE 3 - quit from within test function:
	(function(){
		util.cssTest = function(){
			if(!testDiv)util.cssTest.quit();
			else return testDiv.offsetWidth === 10;
		};
	})();

	(function(){
		poll({
			test: util.cssTest,
			ready: function(){
				console.log( 'CSS loaded' );
			},
			quit: function(){
				console.log( 'CSS error' ); 
			}
		});
	})();


//METHODS ON RETURNED OBJECT:
	cssTest.quit(); //Manually quit
	cssTest.ready(); //Manually set to ready

//METHODS ADDED TO TEST FUNCTION:
	testFn.quit(); //Manually quit from test function ref
	testFn.ready(); //Manually set to ready from test function ref

//METHODS ON poll()
	poll.kill(); //Kill all existing timers
	poll.kill(true); //Kill and completely disable poll()

//OVERRIDING DEFAULTS
	poll.timeout = 1000; //Override default timeout
	poll.frequency = 100; //Override default frequency

```

*NOTE:*  
If an object is supplied as the second argument to the wrapping iife then `.poll()` will be attached to that namespace.  
If no namespace is provided then `.poll()` will be added to `window`.