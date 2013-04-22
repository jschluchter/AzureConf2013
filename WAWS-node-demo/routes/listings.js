var azure = require('azure'), 
    request = require('request'),
    async = require('async'),
    nconf = require('nconf'), 
    step = require('step'),
    accounting = require('../public/javascripts/accounting.js');

nconf.argv().env().file({ file: 'config.json'});

var accountName = nconf.get("STORAGE_NAME"), accountKey = nconf.get("STORAGE_KEY");
var tableService = azure.createTableService(accountName, accountKey, accountName + '.table.core.windows.net');



function getListingsForAccountId(accountId, sort, callback){
    //hardcoded for demo
    //you can go directly against the API 
    request.get({ url : '[YOUR BLOB JSON HERE]', json : true } , function (error, response, body) {
        if (!error && response.statusCode == 200) {
            async.sortBy(body, function(item, cb){
                cb(null, item.Price);
            }, function(err, results){
                callback(null, results);
            });
        }
    });
}

exports.getListings = function(req, res){
    var fbPageId = req.params.pageId;
    step(
        function(){
            var pageToAccountQuery = azure.TableQuery
            .select('RowKey')
            .from('facebookshowcase')
            .where('PartitionKey eq ?', fbPageId);
            tableService.queryEntities(pageToAccountQuery, this)
        },
        function(err,val){
            var accountId = val[0].RowKey;
            getListingsForAccountId(accountId, null, this);
        },
        function(err,val){
            var opts = { precision : 0 };
            val.forEach( function(element, index, array){
                element.Price = accounting.formatMoney(element.Price, opts);
            });
            res.render('listings', { title: 'nukleus', listings : val, pageId : fbPageId } );
        });
};



