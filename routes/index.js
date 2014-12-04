var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var requestify = require('requestify');
var solr = require('solr-client');
var querystring = require('querystring');
var JSONStream = require('JSONStream');
var fs = require('fs');
var webshot = require('webshot');
var Lexrank = require('lexrank');
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
var allContent = '';
//Initial Set up for Timeline Json
var output = {};

/* GET home page. */
router.get('/', function (req, res) {
    if (req.method == 'GET')
        //console.log('GET');
    res.render('index', { title: 'News Summarization' });
});

router.post('/', function (req, res) {
    output = "{\x22timeline\x22:{\x22headline\x22:\x22\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p></p>\x22,\x22startDate\x22:\x22\"";
    allContent = '';
    //console.log('Method: ' + req.method);
    if (typeof req.body.query != 'undefined') {
        //console.log('Query: ' + req.body.query.toString());
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
                //console.log('Processing Result Set');
                result.solrData = obj;
                //result.gaurdianData = 
                //crawlGuardian(queryVal);
                
                //console.log(queryVal);
                var endpoint = "http://content.guardianapis.com/search";
                http://content.guardianapis.com/search?api-key=test&show-fields=all&show-tags=all&show-elements=all
                endpoint += '?q=' + queryVal + "&api-key=" + key + "&sort=newest&show-fields=all&show-tags=all&show-elements=all";
                
                requestify.get(endpoint).then(function (resp) {
                    //console.log('inside3');
                    //console(resp.getBody().response.results);
                    result.gaurdianData = resp.getBody().response.results;
                    
                    var solrLength = Object.keys(result.solrData.response.docs).length;
                    var guarLength = Object.keys(result.gaurdianData).length;
                    //console.log('SolrLength::' + solrLength); console.log('GuarLength::' + guarLength);
                    if (solrLength > 0 && guarLength > 0) {
                        output += ",\x22date\x22:[";
                        start = 1; //console.log('first');
                        createTimelineJSON(result.solrData.response.docs, false, 'Solr');
                        createTimelineJSON(result.gaurdianData, true, 'Guardian');
                    }
                    else if (solrLength > 0 && guarLength == 0) {
                        output += ",\x22date\x22:[";
                        //console.log('second');
                        createTimelineJSON(result.solrData, true, 'Solr');
                    }
                    else if (solrLength == 0 && guarLength > 0) {
                        output += ",\x22date\x22:[";
                        //console.log('third');
                        createTimelineJSON(result.gaurdianData, true, 'Guardian');
                    }
                    else {
                        //console.log('fourth');
                        output += "}}";
                    }

                    try 
                    {
                    	result.timeLineData = JSON.parse(output);
                    } catch (ex) {
                    	//do nothing is JsON is not properly formatted;
                    }
                    //extracting summary from guardian data 
                    //upto 6 top sentences......
                    var lex = new Lexrank(allContent);
                    result.summary = lex.summarize(6);
                    //console.log('saved Timeline');
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
    //console.log(type);
    //var data = {};
    var title = '';
    var content = '';
    var newsDate = '';
    if (Object.keys(data).length == 0)
        return;
    for (var i = 0; i < Object.keys(data).length; i++) {
        
        if (type == 'Solr') {            
            //if (typeof data[i].NEWSDATE == 'undefined')
            //    console.log('Inside D');
            //console.log(data[i].NEWSDATE);
            newsDate = data[i].NEWSDATE.substring(0, 10).split("-");
            newsDate = newsDate[0] + "," + newsDate[1] + "," + newsDate[2];
            //console.log(newsDate);
            output += "{ \x22startDate\x22:\x22" + newsDate + " \x22,\x22headline\x22:\x22";
            output += replaceAllDouble(data[i].TITLE, "title", '') + "\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].CONTENT, "content", '') + "</p>\x22,";
            //allContent += " " + data[i].TITLE + " " + data[i].CONTENT; 
            if (typeof data[i].NEWSCATEGORY != 'undefined') {
                //console.log(data[i].NEWSCATEGORY[0].indexOf(";"))
                if (data[i].NEWSCATEGORY[0].indexOf(";") > -1) {
                    //console.log(data[i].NEWSCATEGORY[0].split(";")[0]);
                    output += "\"tag\":\"" + data[i].NEWSCATEGORY[0].split(";")[0] + "\",";
                }
                else
                    output += "\"tag\":\"" + data[i].NEWSCATEGORY[0] + "\",";
            }
                

            if (i == Object.keys(data).length - 1 && isFinish) {
                output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22" + type + "\x22,\x22caption\x22:\x22\x22}}]}}";
            }
            else
                output += "\x22asset\x22:{\x22media\x22:\x22\x22,\x22credit\x22:\x22" + type + "\x22,\x22caption\x22:\x22\x22}},";
        }
        
        if (type == 'Guardian') {
            newsDate = data[i].webPublicationDate.substring(0, 10).split("-");
            newsDate = newsDate[0] + "," + newsDate[1] + "," + newsDate[2];
            var url = data[i].webUrl.substring(7);
            output += "{ \x22startDate\x22:\x22" + newsDate + " \x22,\x22headline\x22:\x22";//<a href="+url+" >
            output += replaceAllDouble(data[i].webTitle, "title",'') + "\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].fields.body, "content",'') + "</p>\x22,";
            output += "\"tag\":\"" + data[i].sectionName + "\",";
            allContent += " " + data[i].webTitle + " " + data[i].fields.body;
            //output += '{ "startDate":"' + newsDate + '","headline":""';//<a href="+url+' >
            //output += replaceAllDouble(data[i].webTitle, "title", '') + '","text":"<p>"' + replaceAllDouble(data[i].fields.body, "content", '"') + '</p>",';
            //output += '"tag":"' + data[i].sectionName + '",';
            
            if (i == Object.keys(data).length - 1 && isFinish) {
                output += "\"asset\":{\"media\":\""+ replaceAllDouble(data[i].fields.thumbnail,"image","")+"\",\"credit\":\"" + type + "\",\"caption\":\"\"}}]}}";//<a href=" + url + " ></a>                
            }
            else {
                output += "\"asset\":{\"media\":\"" + replaceAllDouble(data[i].fields.thumbnail,'image','') + "\",\"credit\":\"" + type + "\",\"caption\":\"\"}},";
            }
        }

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

function replaceAllDouble(msg, type, repl) {
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
        msg = msg.replace(re, repl);
        re = new RegExp("'", "g");
        msg = msg.replace(re, repl);
        //re = new RegExp(/ {2,}/g, "g");
        msg = msg.replace(/(\r\n|\n|\r)/gm, "");
        msg = msg.replace(/ {2,}/g, " ");
        
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