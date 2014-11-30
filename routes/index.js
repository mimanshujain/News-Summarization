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

//Initial Set up for Timeline Json
var output = "{\x22timeline\x22:{\x22headline\x22:\x22\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p></p>\x22,\x22startDate\x22:\x22\"";


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
                console.log('Processing Result Set');
                result.solrData = obj;
                //result.gaurdianData = 
                //crawlGuardian(queryVal);
                
                console.log('inside1');
                var endpoint = "http://content.guardianapis.com/search";
                method = 'GET';
                console.log('inside2');
                if (method == 'GET') {
                    endpoint += '?q=' + query + "&api-key=" + key + "&sort=newest";
                }
                
                requestify.get(endpoint).then(function (resp) {
                    console.log('inside3');
                    //console(resp.getBody().response.results);
                    result.gaurdianData = resp.getBody().response.results;
                    
                    var solrLength = Object.keys(result.solrData.response.docs).length;
                    var guarLength = Object.keys(result.gaurdianData).length;
                    console.log('SolrLength::' + solrLength); console.log('GuarLength::' + guarLength);
                    if (solrLength > 0 && guarLength > 0) {
                        output += ",\x22date\x22:[";
                        start = 1; console.log('first');
                        createTimelineJSON(result.solrData.response.docs, false, 'Solr');
                        createTimelineJSON(result.gaurdianData, true, 'Guardian');
                    }
                    else if (solrLength > 0 && guarLength == 0) {
                        output += ",\x22date\x22:[";
                        console.log('second');
                        createTimelineJSON(result.solrData, true, 'Solr');
                    }
                    else if (solrLength == 0 && guarLength > 0) {
                        output += ",\x22date\x22:[";
                        console.log('third');
                        createTimelineJSON(result.gaurdianData, true, 'Guardian');
                    }
                    else {
                        console.log('fourth');
                        output += "}}";
                    }
                    
                    fs.writeFile('./timeLine.json', output, function (err) {
                        if (err)
                            console.log(err);
                        else {
                            console.log('timeLine.json saved!');
                        }
                    });
                    
                    result.timeLineData = JSON.parse(output);
                    console.log('saved Timeline');
                    //if (typeof req.body.query != 'undefined')
                    res.send(result);

        //return response.getBody().response.results;

                });
            }
        });
    }
});

//o create TimeLine Json Object
function createTimelineJSON(data, isFinish, type) {
    console.log(type);
    //var data = {};
    var title = '';
    var content = '';
    var newsDate = '';
    if (Object.keys(data).length == 0)
        return;
    
    for (var i = 0; i < Object.keys(data).length; i++) {
        
        if (type == 'Solr') {
            output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22headline\x22:\x22";
            output += replaceAllDouble(data[i].TITLE, "title") + "\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].CONTENT, "content") + "</p>\x22,";
        }
        
        if (type == 'Guardian') {
            newsDate = data[i].webPublicationDate.substring(0, 10).split("-");
            newsDate = newsDate[0] + "," + newsDate[1] + "," + newsDate[2];
            output += "{ \x22startDate\x22:\x22" + newsDate + ' \x22,\x22headline\x22:\x22<p><a href="'+data[i].webUrl.substring()+'">';
            output += replaceAllDouble(data[i].webTitle, "title") + "</a></p>\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].id, "content") + "</p>\x22,";
            output += "\"tag\":\"" + data[i].sectionName + "\",";
        }
        
        if (i == Object.keys(data).length - 1 && isFinish) {
            output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22"+type+"\x22,\x22caption\x22:\x22\x22}}]}}";
        }
        else
            output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22"+type+"\x22,\x22caption\x22:\x22\x22}},";
    }
}

function crawlGuardian(query) {
    //console.log('inside1');
    //var endpoint = "http://content.guardianapis.com/search";
    //method = 'GET';
    //console.log('inside2');    
    //if (method == 'GET') {
    //    endpoint += '?q=' + query + "&api-key=" + key + "&sort=newest";
    //}
    
    //requestify.get(endpoint).then(function (response) {
    //    console.log('inside3');
    //    console(response.getBody().response.results[0]);
    //    result.gaurdianData = response.getBody().response.results;
        
    //    var solrLength = Object.keys(result.solrData.response.docs).length;
    //    var guarLength = Object.keys(result.gaurdianData).length;
        
    //    if (solrLength > 0 && guarLength > 0) {
    //        start = 1; console.log('first');
    //        createTimelineJSON(result.solrData, false, 'solr');
    //        createTimelineJSON(result.gaurdianData, true, 'guardian');
    //    }
    //    else if (solrLength > 0 && guarLength == 0) {            console.log('second');
    //        createTimelineJSON(result.solrData, true, 'solr');
    //    }
    //    else if (solrLength == 0 && guarLength > 0) { console.log('third');
    //        createTimelineJSON(result.gaurdianData, true, 'guardian');
    //    }
    //    else {
    //        output += "}}";
    //    }
        
    //    fs.writeFile('./timeLine.json', output, function (err) {
    //        if (err)
    //            console.log(err);
    //        else {
    //            console.log('timeLine.json saved!');
    //        }
    //    });
        
    //    result.timeLineData = JSON.parse(output);
        
    //    if (typeof req.body.query != 'undefined')
    //        res.send(result);

    //    //return response.getBody().response.results;

    //});
}

function performRequest(endpoint, method, query) {

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

module.exports = router;


//fs.writeFile('./timeLine.json', output, function (err) {
//    if (err)
//        console.log(err);
//    else {
//        console.log('timeLine.json saved!');
//    }
//});

////Initial Set up for Solr result
//if (type == 'solr' ) {
//    data = result.response.docs;
//    title = replaceAllDouble(data[0].TITLE, "title");
//    content = replaceAllDouble(data[0].CONTENT, "content");
//    output += title + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p>";
//    output += content + "</p>\x22,\x22startDate\x22:\x22" + getDate() + "\x22";
//}

////Initial Set up if it is guardian, given solr didnt have anything.
//if (type == 'guardian' && start == 0) {
//    data = result;
//    title = replaceAllDouble(data[0].webTitle, "title");
//    content = replaceAllDouble(data[0].id, "content");
//    newsDate = data[0].webPublicationDate.substring(0, 10).split("-");
//    newsDate = newsDate[0] + "," + newsDate[1] + "," + newsDate[2];

//    output += title + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p>";
//    output += content + "</p>\x22,\x22startDate\x22:\x22" + newsDate + "\x22,";
//    output += "\"tag\":\"" + data[0].sectionName + "\"";
//    start = 1;
//}

////In case we only have one record, so we have to close the output here and send.
//if (Object.keys(data).length == 1) {
//    output += "}}";
//    return;
//}