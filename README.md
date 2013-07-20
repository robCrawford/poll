when
====

*(No dependencies, <1kB)*  

Polling solution for async conditions, supports requests for JS and CSS files.  
*NOTE: If loading only JS files then an onload event solution is preferable to polling.*  

```javascript

	var cssRequest = when({
		load: [
			"http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/base/jquery-ui.css"
		],
		test: function(){
			return overlayDiv.offsetWidth === 1; //Width set in CSS
		},
		ready: function(){
			console.log( 'CSS loaded' );
		},
		quit: function(){
			console.log( 'Error - CSS did not load' ); 
		},
		testInterval: 100, //How often to test in ms
		maxSecs: 20 //Seconds until quit
	});

	cssRequest.quit(); //Manually quit
	cssRequest.ready(); //Manually set to ready

```