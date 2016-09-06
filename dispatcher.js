
var keywords = [];
var handlers = {};

function generateHandlerName(keywords) {
	/* generate a handler name from its command keywords */
	return keywords.sort().join('.');
}

module.exports.registerHandler = function (keywords, handlerFn) {
	var name = generateHandlerName(keywords);

	if (handlers[name] != undefined) {
		throw new Error(`registerHandle: handler '${name}' already exists!`);
	}

	handlers[name] = {'keys' : keywords, 'handler': handlerFn};
}

module.exports.addKeywords = function(words) {
	words.map(function (word) {
		if (keywords.indexOf(word) < 0) {
			/* add keywords if not already exists */
			keywords.push(word);
		}
	});
};

module.exports.getKeywords = function() {
	return keywords;
};

module.exports.parseCmd = function (cmd) {
	keywords.map(function(key) {
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

module.exports.dispatch = function (cmd) {

	var command = this.parseCmd(cmd);

	var keywords = Object.keys(command);

	var arguments = keywords.map(e => command[e]);

	var handlerName = generateHandlerName(keywords);

	if (handlers[handlerName] == undefined) {
		throw Error(`handlerName: no function registered to handle command '${cmd}'. Keywords: ${JSON.stringify(keywords)} `);
	}
	// console.log(handlerName, handlers[handlerName]);
	return handlers[handlerName].handler.apply(null, arguments);
};
