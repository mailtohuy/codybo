var expect = require('chai').expect;
var Dispatcher = require('../dispatcher.js');
var tools = new Dispatcher();

describe("dispatcher-specs.js", function() {
	var defaultKeywords = [];
	var testKeywords = ['find', 'info', 'near'];

	/******* getKeywords *******/
	it("getKeywords() should return [] by default", function() {
		expect(tools.getKeywords()).to.eql(defaultKeywords);
	});

	/******* addKeywords *******/
	it("addKeywords() should not create duplicate key words", function() {
		tools.addKeywords(testKeywords);
		tools.addKeywords(testKeywords); // add them twice
		expect(testKeywords).to.eql(tools.getKeywords());
	});

	/******* parseCmd *******/
	it("parseCmd() should parse string into an object", function () {
						 
		/* set up keywords */
		tools.addKeywords(testKeywords);

		/* run tests */
		expect(tools.parseCmd('find product')).to.deep.equal({'find': 'product'});
		expect(tools.parseCmd('info')).to.deep.equal({'info':''});
		expect(tools.parseCmd('find product near address')).to.deep.equal({'find': 'product', 'near': 'address'});
		expect(function(){tools.parseCmd('notAKeyWord')}).to.throw('invalid command : notAKeyWord');
	});

	/******* dispatch *******/
	describe("dispatch()", function() {

		it ("'add 2 and 3' should return 5", function(){

			/* set up keywords */
			var keywords = ['add', 'and'];

			/* register handler */
			tools.registerHandler(keywords, function(x,y) {return parseInt(x)+parseInt(y);});

			/* invoke handler */
			var output = tools.dispatch('add 2 and 3');
			expect(output).to.equal(5);

		});

		it ("should allow re-register handler for keywords", function(){
			// re-register command handler
			tools.registerHandler(['add', 'and'], function(/*pass no arg*/) {/*do nothing*/});
			expect(tools.dispatch('add 2 and 3')).to.be.a('undefined');
		});

		it ("should not mind extra spaces in a command", function(){
			tools.registerHandler(['a','b','c'], function(a,b,c) {
				return a+b+c;
			});
			expect(tools.dispatch('a b c')).to.equal('');
			expect(tools.dispatch('a    b     c')).to.equal('');
			expect(tools.dispatch('a b  c    ')).to.equal('');
			expect(tools.dispatch('   a b  c')).to.equal('');
			expect(tools.dispatch('   a b  c    ')).to.equal('');
		});

	});


});