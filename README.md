poll.js
=======

*(No dependencies, 0.5kB minified)*  

Runs `test` function at specified intervals.  
If `test` function returns `true` then `ready` is called and polling quits. If `timeout` is reached then `quit` is called instead.   

The state can be set manually at any time via the returned object i.e. `cssTest.ready()` or `cssTest.quit()`.  
The function supplied to the param `test` is also given the methods `.ready()` and `.quit()`, useful if it needs to manage state and is not within scope of the returned object.  

Test frequency can be uniform or a set of durations, see examples below.  


```javascript

//MINIMUM REQUIRED
	poll({
		test: function(){
			return overlayDiv.offsetWidth === 1; //Width set in CSS
		},
		ready: function(){
			console.log( 'CSS loaded' );
		}
	});

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

//METHODS ADDED TO TEST FUNCTION:
	testFn.quit(); //Manually quit from test function ref
	testFn.ready(); //Manually set to ready from test function ref

//METHODS ON poll()
	poll.kill(); //Kill all existing timers
	poll.kill(true); //Kill and completely disable poll()

```

*NOTE:*  
The namespace where `.poll()` is attached should be supplied as the second argument of the wrapping iife (the final parentheses at the end of the file).   
If no namespace is provided then `.poll()` will be added to `window`.