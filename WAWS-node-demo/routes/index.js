var azure = require('azure'), 
    request = require('request'),
    nconf = require('nconf'),
    step = require('step');

nconf.argv().env().file({ file: 'config.json'});

var accountName = nconf.get("STORAGE_NAME"), accountKey = nconf.get("STORAGE_KEY");
var tableService = azure.createTableService(accountName, accountKey, accountName + '.table.core.windows.net');
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'stats' });
};