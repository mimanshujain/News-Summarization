var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var requestify = require('requestify');
var solr = require('solr-client');
var querystring = require('querystring');
var JSONStream = require('JSONStream');
var fs = require('fs');

//Api call parameters
var requestify = require('requestify');
var host = 'www.theguardian.com';
var key = 'neukrcw8u9xm4ks5zejvx3uj';
var querystring = require('querystring');

// Create a client 
//Signature :: function createClient(host, port, core, path, agent, secure, bigint)
var client = solr.createClient('98.118.151.224', 8983, 'newscollection', '/solr', false, false);
var queryVal = '';
var result = {};
var output = "{\x22timeline\x22:{\x22headline\x22:\x22";

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
        //var resultSet = {};
        
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
                result.solrData = obj;
                result.gaurdianData = crawlGuardian(queryVal);

                var start = 0;
                if (Object.keys(result.solrData.response.docs).length > 1) {
                    start = 1;
                    createTimelineJSON(result.solrData, false, start);
                }
                if (Object.keys(result.gaurdianData).length > 1) {
                    createTimelineJSON(result.gaurdianData, true, start);
                }
                
                
                
                result.timeLineData = JSON.parse(output);
                                
                if (typeof req.body.query != 'undefined')
                    res.send(result);
                //
                //console.log("Guardian : " +result.data3);
                //fs.writeFile('./message.json', JSON.stringify(result), function (err) {
                //    if (err)
                //        console.log(err);
                //    else {
                //        result.data2 = createTimelineJSON(obj);
                //        console.log('message.json saved!');
                //        if (typeof req.body.query != 'undefined')                            
                //            res.send(result);
                //    }            
                //});
            }
        });
    }
});

//o create TimeLine Json Object
function createTimelineJSON(result, isFinish, type, start) {
    
    var data = {};
    var title = '';
    var content = '';
    var newsDate = '';
    if (Object.keys(data).length == 0)
        return;

    if (type == 'solr' ) {
        data = result.response.docs;
        title = replaceAllDouble(data[0].TITLE, "title");
        content = replaceAllDouble(data[0].CONTENT, "content");
        output += title + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p>";
        output += content + "</p>\x22,\x22startDate\x22:\x22" + getDate() + "\x22,";
    }
    if (type == 'guardian' && start == 0) {
        data = result;
        title = replaceAllDouble(data[0].webTitle, "title");
        content = replaceAllDouble(data[0].id, "content");
        newsDate = data[0].webPublicationDate.substring(0, 10).split("-");
        output += title + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p>";
        output += content + "</p>\x22,\x22startDate\x22:\x22" + newsDate + "\x22,";
        output += "\"tag\":\"" + data[0].sectionName + "\"";
        start = 1;
    }

    output += "\x22date\x22:[";
    
    for (var i = start; i < Object.keys(data).length; i++) {
        
        //output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22endDate\x22:\x22" + getDate() + "\x22,\x22headline\x22:\x22";
        output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22headline\x22:\x22";
        output += replaceAllDouble(data[i].TITLE, "title") + "\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].CONTENT, "content") + "</p>\x22,";
        
        if (i == Object.keys(data).length - 1 && isFinish) {
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
    
    //return JSON.parse(output);
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
    dateOut += year + "," + mon + "," + day;
    day += 1;
    mon += 1;
    count += 1;
    if (count > 5) {
        year += 1;
        count = 0;
    }
    
    return dateOut.trim();
}

function replaceAllDouble(msg, type) {
    if (typeof msg == 'undefined') {
        if (type == "title") {
            msg = "No Title Present";
        }
        else {
            msg = "No Content Present";
        }
    }
        
    else {
        var re = new RegExp('\"', 'g');
        msg = msg.replace(re, '');
    }
    return msg;
}

function crawlGuardian(query) {
    
    return performRequest('http://content.guardianapis.com/search', 'GET', query)

    //var GApi = "http://content.guardianapis.com/search?q=";
    //GApi = GApi + query + "&sort=newest&api-key=neukrcw8u9xm4ks5zejvx3uj";
    //exports.getJSON(GApi, function (data) {
    //    $.each(data.response.results, function () {
    //        var html = 'Date: ' + this.webPublicationDate;
    //        html += ' abstract: ' + this.sectionName;
    //        html += ' headlines: ' + this.webTitle;
    //        html += ' leadparagraph: ' + this.sectionName;
    //        html += this.webUrl;
    //       return html				
    //    });
    //});
}

function performRequest(endpoint, method, query) {
    //var headers = {};
    //console.log('inside1');
    if (method == 'GET') {
        endpoint += '?q=' + query + "&api-key=" + key + "&sort=newest";
    }
    //else {
    //    headers = {
    //        'Content-Type': 'application/json',
    //        'Content-Length': dataString.length
    //    };
    //}
    //console.log('inside2');
    //var options = {
    //    host: host,
    //    path: endpoint,
    //    method: method,
    //    headers: headers
    //};
    //console.log('inside3');
    
    
    requestify.get(endpoint).then(function (response) {
        return response.getBody().response.results;
    });
}

module.exports = router;