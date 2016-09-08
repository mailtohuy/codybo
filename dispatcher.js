var Dispatcher = function() {
	this.keywords = [];
	this.handlers = {};
}

Dispatcher.prototype.generateHandlerName = function (words) {
	/* generate a handler name from its command keywords */
	return words.sort().join('.');
}

Dispatcher.prototype.registerHandler = function (keywords, handlerFn) {
	var key = this.generateHandlerName(keywords);

	if (handlerFn === undefined) {
		console.log(`registerHandle: must specify a handler for '${key}'`);
		throw new Error('no handler specified');
	}

	/* add key words */ 
	this.addKeywords(keywords);

	/* register handler */
	this.handlers[key] = {'keys' : keywords, 'handler': handlerFn};
}

Dispatcher.prototype.addKeywords = function(words) {
	var keywords = this.keywords;
	words.map(function (word) {
		if (keywords.indexOf(word) < 0) {
			/* add keywords if not already exists */
			keywords.push(word);
		}
	});
};

Dispatcher.prototype.getKeywords = function() {
	return this.keywords;
};

Dispatcher.prototype.parseCmd = function (cmd) {

	cmd = cmd.trim();

	this.keywords.map(function(key) {
		cmd = cmd.replace(key, '|' + key + '|');
	})
	
	if (!cmd.startsWith('|')) {
		/* valid command starts with '|' */
		throw new Error('invalid command : ' + cmd );
	}

	var array = cmd.substring(1) /* remove the '|' */ 
		.split('|') /* split into chunks */
		.map(e =>e.trim()) /* trim each chunk */ ;
	var chunk = 2;
	var temparray;
	var result = {};

	for (i=0,j=array.length; i<j; i+=chunk) {
	    temparray = array.slice(i,i+chunk);
	    result[temparray[0]] = temparray[1];
	}

	return result;
};

Dispatcher.prototype.dispatch = function (cmd) {

	var command = this.parseCmd(cmd);
	var keys = Object.keys(command);
	var arguments = keys.map(e => command[e]);
	var handlers = this.handlers;
	var handlerName = this.generateHandlerName(keys);

	if (handlers[handlerName] == undefined) {
		console.error(`handlerName: no handler for key: ${JSON.stringify(handlerName)} `)
		throw Error('no handler');
	}
	// console.log(handlerName, handlers[handlerName]);
	return handlers[handlerName].handler.apply(null, arguments);
};

module.exports = Dispatcher;
