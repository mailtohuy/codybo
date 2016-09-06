var expect = require('chai').expect;
var tools = require('../dispatcher.js');

describe("dispatcher", function() {
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
	it ("dispatch 'add 2 and 3' should return 5", function(){

		/* set up keywords */
		var keywords = ['add', 'and'];
		tools.addKeywords(keywords);

		/* register handler */
		tools.registerHandler(keywords, function(x,y) {return parseInt(x)+parseInt(y);});

		/* invoke handler */
		var output = tools.dispatch('add 2 and 3');
		expect(output).to.equal(5);

	});
});