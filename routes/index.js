var express = require('express');
var router = express.Router();

var solr = require('solr-client');
var querystring = require('querystring');
var JSONStream = require('JSONStream');
var fs = require('fs');

// Create a client 
//Signature :: function createClient(host, port, core, path, agent, secure, bigint)
var client = solr.createClient('98.118.151.224', 8983, 'newscollection', '/solr', false, false);
var queryVal = '';
var result = {};
/* GET home page. */
router.get('/', function (req, res) {
    if (req.method == 'GET')
        console.log('GET');
    res.render('index', { title: 'Mimanshu Shisodia', query: 'Random Query' });
});

router.post('/', function (req, res) {
    console.log('Method: ' + req.method);
    if (typeof req.body.query != 'undefined') {
        console.log('Query: ' + req.body.query.toString());
        queryVal = req.body.query.toString();
        var resultSet = {};
        
        //Designing Query
        var query = client.createQuery()
				   .q(queryVal)
				   .start(0)
				   .rows(10);
        
        //Search in Solr
        client.search(query, function (err, obj) {
            if (err) {
                console.log(err);
            } else {
                console.log('Saving Result Set');
                //console.log(obj);
                result = obj;
                fs.writeFile('./message.json', JSON.stringify(result), function (err) {
                    if (err)
                        console.log(err);
                    else {
                        //createTimelineJSON(result);
                        //console.log(result.response.docs[0].TITLE);
                        console.log('message.json saved!');
                        if (typeof req.body.query != 'undefined')
                            //res.render('index', { title: 'Shisodia Mimanshu', query: 'Random Query', text: 'Success ' + req.body.query });
                            res.send(result);
                    }
                       
                });
            }
        });
    }
});

function createTimelineJSON(result) {
    var output = "{\x22timeline\x22:{\x22headline\x22:\x22";
    var data = result.response.docs;
    output += data[0].TITLE + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22";
    output += data[0].CONTENT + "\x22,\x22startDate\x22:\x22" + getDate() + "\x22,";
    output += "\x22date\x22:[";
    
    for (var i = 1; i < Object.keys(data).length; i++) {
        
        output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22endDate\x22:\x22" + getDate() + "\x22,\x22headline\x22:\x22";
        output += data[i].TITLE + "\x22,\x22text\x22:\x22" + data[i].CONTENT + "\x22,";
        
        if (i == Object.keys(data).length - 1) {
            output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22\x22,\x22caption\x22:\x22\x22}}]}}";
        }
        else
            output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22\x22,\x22caption\x22:\x22\x22}},";

    //},";
    }
    
    //fs.writeFile('./timeLine.json', output, function (err) {
    //    if (err)
    //        console.log(err);
    //    else {
    //        console.log('timeLine.json saved!');
    //    }
    //});
}

var day = 1, mon = 1, year = 2000, count = 0;
function getDate() {
    var dateOut = '';
    if (day > 30)
        day = 1;
    if (mon > 12)
        mon = 1;
    if (year > 2014)
        year = 2000;
    dateOut += year + "," + day + "," + mon;
    day += 1;
    mon += 1;
    count += 1;
    if (count > 5) {
        year += 1;
        count = 0;
    }
    
    return dateOut.trim();
}
module.exports = router;


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


//$.getJSON('/timeLine.json', function (timeData) {
//    timeJsonData = timeData
//    createStoryJS({
//        type: 'timeline',
//        width: '800',
//        height: '600',
//        source: 'timeData',
//        embed_id: 'my-timeline'
//    });//TimeLine.js
//});

//var req = $.ajax({
//    url : 'timeLine.json',
//    dataType : "jsonp",
//    timeout : 10000
//});

//req.success(function (data) {
//    alert('load data');
//    createStoryJS({
//        type: 'timeline',
//        width: '800',
//        height: '600',
//        source: 'data',
//        embed_id: 'my-timeline'
//    });//TimeLine.js
//});   


