var express = require('express');
var router = express.Router();

var solr = require('solr-client');
var querystring = require('querystring');
var JSONStream = require('JSONStream');
var fs = require('fs');

var myData = require('../timeLine.json');

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
                result.data1 = obj;
                
                fs.writeFile('./message.json', JSON.stringify(result), function (err) {
                    if (err)
                        console.log(err);
                    else {
                        //result.data2 = myData;
                        result.data2 = createTimelineJSON(obj);
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

//o create TimeLine Json Object
function createTimelineJSON(result) {
    var output = "{\x22timeline\x22:{\x22headline\x22:\x22";
    var data = result.response.docs;

    var title = replaceAllDouble(data[0].TITLE, "title");
    var content = replaceAllDouble(data[0].CONTENT,"content");
    

    output += title + "\x22,\x22type\x22:\x22default\x22,\x22text\x22:\x22<p>";
    output += content + "</p>\x22,\x22startDate\x22:\x22" + getDate() + "\x22,";
    output += "\x22date\x22:[";
    
    for (var i = 1; i < Object.keys(data).length; i++) {
       
        //output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22endDate\x22:\x22" + getDate() + "\x22,\x22headline\x22:\x22";
        output += "{ \x22startDate\x22:\x22" + getDate() + " \x22,\x22headline\x22:\x22";
        output += replaceAllDouble(data[i].TITLE, "title") + "\x22,\x22text\x22:\x22<p>" + replaceAllDouble(data[i].CONTENT, "content") + "</p>\x22,";
        
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

    return JSON.parse(output);
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

function replaceAllDouble(msg, type)
{
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

function crawlGuardian() {
    var GApi = "http://content.guardianapis.com/search?q=";
    GApi = GApi + $("input").val() + "&sort=newest&api-key=neukrcw8u9xm4ks5zejvx3uj";
    sentences[0] = "";
    $.getJSON(GApi, function (data) {
        $("#results").empty();
        $.each(data.response.results, function () {
            var html = '<li> Date: ' + this.webPublicationDate + '</br>';
            html += ' abstract: ' + this.sectionName + '</br>';;
            html += ' <b>headlines: ' + this.webTitle + '</b>' + '</br>';
            html += ' leadparagraph: ' + this.sectionName + '</br>';
            html += ' <a href=\"' + this.webUrl + '\">Click here</a></li></br></br>';
            $("#results").append(html);
            sentences[0] = sentences[0].concat(this.webTitle, " ");
            sentences[0] = sentences[0].concat(this.sectionName, " ");
				
        });
        topicise();
    });
}

module.exports = router;