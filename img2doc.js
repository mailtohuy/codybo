/*
 *  Usage: 
 *
 *  var img2doc = require('/path/to/img2doc.js');
 *  var tool = new img2doc();
 *  tool.save( [ '/path/to/img1.png' ,'/path/to/img2.png' ] , '/path/to/file.docx' );
*/	


var officegen = require('officegen');
var fs = require('fs');

var Img2Doc = function() { 
	/* */
};

Img2Doc.prototype.save = function(imagePaths, docFilename) {

	if (!imagePaths.hasOwnProperty('length')) { 
		console.log ( 'imgPaths is not an array' );
		return false;
	}

	if (imagePaths.length < 1) {
		console.log ( 'imgPaths is empty' );
		return false;
	} 

	if (!docFilename) { 
		console.log ( 'missing docFilename' );
		return false;
	}

	var docx = officegen ({ 
		type: 'docx' ,
		author: 'hb' ,
		orientation: 'portrait' });

	// Remove this comment in case of debugging Officegen:
	// officegen.setVerboseMode ( true );

	docx.on ('error', function ( err ) {
		return false;
	});

	imagePaths.forEach( function(path) {
		var pObj = docx.createP ( { align: 'center' } );
		pObj.addImage ( path );	
		// docx.putPageBreak ();	
	});

	var out = fs.createWriteStream ( docFilename );

	out.on ( 'error', function ( err ) {
		console.log ( err );
		return false;
	});

	docx.generate ( out );
	return true;
};

module.exports = Img2Doc;