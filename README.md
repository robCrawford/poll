poll.js
=======

*(No dependencies, 0.7kB minified)*  

A javascript polling utility.  
Runs `test` every `frequency` until it either returns a truthy value `ready()`, or `timeout` is reached `quit()`.  
The state can also be set manually at any time,  `myTest.ready()` or `myTest.quit()`.  


Params
------
- `test`  
Function to call each iteration.  
The `test` function receives one argument, the total polling duration so far in ms.  

- `ready`  
Function to call when `test` returns a truthy value.

- `quit`  
Function to call when `timeout` is reached.

- `frequency`  
How often to call `test` in ms.

- `intervals`  
An array of durations in ms. `test` will run immediately and then after each duration.  
This overrides `frequency` if both are supplied.  

- `timeout`  
Total time in ms after which `quit` will be called.

Examples
--------
```javascript

//Minimum required
poll({
	test: function(){
		return testDiv.offsetWidth === 10;
	},
	ready: function(){
		console.log( 'CSS loaded' );
	}
});

//Frequency and timeout specified:
var myTest = poll({
	test: function(dur){
		console.log( 'test: '+dur );
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
```

Notes
-----
- Override poll defaults
	```javascript
	poll.timeout = 1000; //Override default timeout
	poll.frequency = 100; //Override default frequency
	```

- Methods on poll()
	```javascript
	poll.kill(); //Kill all existing timers
	poll.kill(true); //Kill and completely disable poll()
	```

- Methods on returned object
	```javascript
	var myTest = poll({...});
	myTest.quit(); //Manually quit
	myTest.ready(); //Manually set to ready
	```

- The function object supplied to the param `test` also has the methods `.ready()` and `.quit()` attached, useful when it is defined somewhere else in your code.  

	```javascript
	(function(){
		util.myTest = function(){
			if(!testDiv)util.myTest.quit();
			else return testDiv.offsetWidth === 10;
		};
	})();

	(function(){
		poll({
			test: util.myTest,
			ready: function(){
				console.log( 'CSS loaded' );
			},
			quit: function(){
				console.log( 'CSS error' ); 
			}
		});
	})();
	```

- In a browser environment the namespace for `.poll()` can be supplied as the third argument to the wrapping iife.  
i.e. `}, myLib.util);` will result in `myLib.util.poll`.  
