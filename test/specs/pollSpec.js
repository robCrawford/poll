
describe("Polling tests", function(){

	it("Should run ready immediately", function(done){
		
		window.conditionA = 1; //Satisfy testA condition immediately

		var testA = poll({
			test: function(){
				return window.conditionA;
			},
			ready: function(){
				expect(window.conditionA).toBe(1);
				done();
			},
			timeout: 100
		});

	});

	it("Should run ready after 500ms", function(done){

		setTimeout(function(){window.conditionB = 1}, 400); //Satisfy condition after delay

		var testB = poll({
			test: function(){
				return window.conditionB;
			},
			ready: function(){
				expect(window.conditionB).toBe(1);
				done(); 
			},
			timeout: 1000
		});
	});

	it("Should run ready after 750ms (staggered durations)", function(done){

		setTimeout(function(){window.conditionC = 1}, 700); //Satisfy condition after delay

		var testC = poll({
			test: function(){
				return window.conditionC;
			},
			ready: function(){
				expect(window.conditionC).toBe(1);
				done(); 
			},
			intervals: [
				250, 500, 1000, 1500, 3000
			]
		});
	});

	it("Should run retOb.ready() after 50ms", function(done){

		setTimeout(function(){testD.ready()}, 50); //Manually call ready() early

		var testD = poll({
			test: function(){
				return window.conditionD;
			},
			ready: function(){
				expect(window.conditionD).toBe(undefined);
				done(); 
			}
		});
	});

	it("Should run retOb.quit() after 50ms", function(done){

		setTimeout(function(){testE.quit()}, 50); //Manually call quit() early

		var testE = poll({
			test: function(){
				return window.conditionE
			},
			ready: function(){
				
			},
			quit: function(){
				expect(window.conditionE).toBe(undefined);
				done(); 
			}
		});
	});

	it("Should run testFn.ready() after 250ms", function(done){
		setTimeout(function(){
			window.readyF = 1; //Event that causes early success
		}, 100);

		window.ns = {}
		ns.scope1 = (function(){
					var testFn = function(){
						if(window.readyF){
								testFn.ready();
							}
						return false; //Continue polling
					}
					return {
						testFn: testFn
					}
				})();
		ns.scope2 = (function(){
					var testF = poll({
						test: ns.scope1.testFn,
						ready: function(){
							expect(window.conditionF).toBe(undefined);
							done();
						}
					});
					
				})();
	});

	it("Should run testFn.quit() after 250ms", function(done){
		setTimeout(function(){
			window.quitG = 1; //Event that causes early success
		}, 100);

		window.ns = {}
		ns.scope1 = (function(){
					var testFn = function(){
						if(window.quitG){
								testFn.quit();
							}
						return false; //Continue polling
					}
					return {
						testFn: testFn
					}
				})();
		ns.scope2 = (function(){
					var testF = poll({
						test: ns.scope1.testFn,
						ready: function(){
							
						},
						quit: function(){
							expect(window.conditionG).toBe(undefined);
							done();
						}
					});
					
				})();
	});

	it("Should stop all polling when poll.kill() is called", function(done){
		var counter = 0;

			//Start polling
			poll({
				test: function(){counter++}
			});
			poll({
				test: function(){counter++}
			});
			poll({
				test: function(){counter++}
			});

			setTimeout(function(){
				poll.kill(); //Kill after 2 iterations
			}, 300);

			setTimeout(function(){
				expect(counter).toEqual(6);
				done();
			}, 1000);
	});

	it("Should run quit after 500ms", function(done){

		poll({
			test: function(){
				return window.conditionH;
			},
			ready: function(){
				
			},
			quit: function(){
				expect(window.conditionH).toBe(undefined);
				done(); 
			},
			timeout: 500
		});
	});

});
