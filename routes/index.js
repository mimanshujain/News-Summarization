var express = require('express');
var router = express.Router();

var solr = require('solr-client');
var querystring = require('querystring');
var JSONStream = require('JSONStream');
var fs = require('fs');

// Create a client 
//Signature :: function createClient(host, port, core, path, agent, secure, bigint)
var client = solr.createClient('98.118.151.224', 8983, 'newscollection', '/solr', false,false);
var queryVal = '';
var result = {};
/* GET home page. */
router.get('/', function (req, res) {
    if (req.method == 'GET')
        console.log('GET');
    res.render('index', { title: 'Mimanshu Shisodia', query: 'Random Query' });
});

router.post('/', function (req, res) {
    console.log(req.method);   
    if (typeof req.body.query != 'undefined') {
        //console.log('Query: ' + req.body.query.toString());
        queryVal = req.body.query.toString();
        var resultSet;
        result = processQuery(resultSet, callback(queryVal))
        {
            return resultSet;
        };
    }
    console.log(result);
    if (typeof req.body.query != 'undefined')
        res.render('index', { title: 'Shisodia Mimanshu', query: 'Random Query', text: 'Success ' + req.body.query });
});

var callback = function (queryVal) {
    var query = client.createQuery()
				   .q(queryVal)
				   .start(0)
				   .rows(10);
    client.search(query, function (err, obj) {
        if (err) {
            console.log(err);
        } else {
            console.log('Mimanshu');
            console.log(obj);
            resultSet = obj;
            fs.writeFile('./message.json', JSON.stringify(resultSet), function (err) {
                if (err)
                    console.log(err);
                else
                    console.log('message.json saved!');
            });
        }
    });
    return resultSet;
}

//function processQuery(result) {
    
//    // DixMax query
//    //var query = client.createQuery()
//				//  .q(queryVal)
//				//  .dismax()
//				//  .mm(2)
//				//  .start(0)
//				//  .rows(10)
//    fs.writeFile('./message.txt', JSON.stringify(result), function (err) {
//        if (err)
//            console.log(err);
//        else
//            console.log('It\'s saved!');
//    });
//}
module.exports = router;
