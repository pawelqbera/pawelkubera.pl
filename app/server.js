(function(){
	/**
	 * Main server.js file
	 */

	'use strict';

	// BASE SETUP
	// ==============================================

	// Zmienna środowiskowa odblokowująca nieautoryzowany
	// przez https/ssl login przy wysyłaniu maila
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	// Set default node environment to development
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';

	// Require statements
	var express = require('express');
	//var mongoose = require('mongoose');
	var path = require('path');
	//var bCrypt = require('bcrypt-nodejs'); //authentication
	//var session = require('express-session'); //authentication
	//var passport = require('passport'); //authentication
	//var LocalStrategy = require('passport-local').Strategy; //authentication
	//var flash = require('express-flash'); // flash messages for beter UX
	//var sass = require('node-sass');
	//var config = require('./config/environment/development');
	//var Handlebars = require('handlebars'); //templating and emails
	//var EmailTemplate = require('email-templates').EmailTemplate; //templating and emails
	var nodemailer = require('nodemailer'); //templating and emails
	//var async = require('async'); //avoid dealing with nested callbacks
	//var crypto = require('crypto'); //for generating hashes

	//console.log("Config.env: " + process.env.NODE_ENV);

	var isDevelopment = (process.env.NODE_ENV === 'development') ? true : false;
	console.log('Is developemnt env?: ' + isDevelopment);

  var secret = require((isDevelopment) ? '../secret.json' : './secret.json');

	// Setup server
	var app = express();
	app.set('port', (process.env.PORT));

	//app.use(express.static(__dirname + '/.tmp'));

	app.use(express.static(path.join(__dirname, (isDevelopment) ? '../.tmp' : '/')));
	app.use(express.static(path.join(__dirname, (isDevelopment) ? '../' : '/')));
	app.use(express.static(path.join(__dirname, (isDevelopment) ? '/' : '/')));

	console.log(__dirname);

	app.get('/', function(req, res) {
		res.sendFile(path.join(__dirname + '/index.html'));
	});

	//app.set('views', path.join(__dirname, 'views'));
	//app.set('view engine', 'jade');

	//var logger = require('morgan');
	//var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser'); // accept POST requests correctly

	app.use(bodyParser.json());       // support JSON-encoded bodies
	app.use(bodyParser.urlencoded({   // support URL-encoded bodies
	  	extended: true
	}));

	//Define email templates directory
	//var templatesDir = path.join(__dirname, 'templates', 'emails');


	// ROUTES
	// ==============================================

	// if(isDevelopment) {
	// 	app.use(express.static(__dirname + '/../'));
	// 	app.use(express.static(__dirname + '/../.tmp'));
	// } else {
	// 	app.use(express.static(__dirname + '/'));
	// }

/*	app.get('/', function(req, res) {
		res.render('index', {
			user: req.user
		});
	});	*/

/*	app.get('/login', function(req, res) {
		res.render('login', {
			user: req.user
		});
	});

*/

	// CONTACT
	// ==============================================

	app.post('/contact', function (req, res) {
		var mailOpts, smtpTrans;
		//Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
		smtpTrans = nodemailer.createTransport('SMTP', {
			service: 'Gmail',
			auth: {
				user: secret.smtpTrans.gmailuser,
				pass: secret.smtpTrans.gmailpass
			}
		});
		//Mail options
		mailOpts = {
			from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
			to: 'pawelqbera@gmail.com',
			subject: 'Hello Pawelkubera.pl - new contact',
			text: req.body.message
		};
		smtpTrans.sendMail(mailOpts, function (error, response) {
			//Email not sent
			if (error) {

				console.log('nie wyslalem');
				//res.render('/', { title: 'Raging Flame Laboratory - Contact', msg: 'Error occured, message not sent.', err: true, page: '' });

				res.sendFile(path.join(__dirname + '/index.html'));

			}
			//Yay!! Email sent
			else {

				console.log('wyslalem ok');
				//res.render('/', { title: 'Raging Flame Laboratory - Contact', msg: 'Message sent! Thank you.', err: false, page: '' });

				res.sendFile(path.join(__dirname + '/index.html'));

			}
		});
	});


	// START THE SERVER
	// ==============================================

	app.listen(app.get('port'), function() {
	  console.log('Node app is running on port', app.get('port'));
	});

})();
