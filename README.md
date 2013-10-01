poll.js
=======

*(No dependencies, 0.5kB minified)*  

Run a `test()` function at intervals until `ready()` or `quit()`.  
State of returned object can also be set manually i.e. `cssTest.quit()`.  
Test frequency can be uniform or a set of durations, see examples below.  


```javascript

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

```


*NOTE:*  
The namespace to attach .poll() to can easily be changed by supplying a second argument into the wrapping iife.