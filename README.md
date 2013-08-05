poll.js
=======

*(No dependencies, 0.4kB)*  

Set up a test function to run periodically until timeout duration, with ready and quit actions.  
This is useful for async conditions like loading a CSS file, when no callback is available.  


```javascript

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

	cssTest.quit(); //Manually quit
	cssTest.ready(); //Manually set to ready

```


*NOTE:*  
The namespace to attach .poll() to can easily be changed by supplying a second argument into the wrapping iife.