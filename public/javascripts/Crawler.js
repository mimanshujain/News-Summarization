/**
 * 
 */
function calc(numA, numB) {
    return numA + numB;
}

function callSolr() {
    //98.118.151.224
    var solrApi = "http://98.118.151.224:8983/solr/newscollection/select";//?q=";
//    sentences[0] = "";
    $("#results").empty();
    $.ajax({
        'url': solrApi,
        'data': { 'wt': 'json', 'q': $("input").val() },
        'success': function (data) {
            $("#result").empty();
            $.each(data.response.docs, function (i, doc) {
                var html = '<li> Date: ' + this.NEWSDATE + '</br>';
                html += ' Place: ' + this.PLACE + '</br>';;
                html += ' <b>TITLE: ' + this.TITLE + '</b>' + '</br>';
                html += ' Content: ' + this.CONTENT + '</br>';
                html += ' <a href=\"' + this.CATEGORY + '\">Category</a></li></br></br>';
                $("#results").append(html);
               // sentences[0] = sentences[0].concat(this.TITLE, " ");
               // sentences[0] = sentences[0].concat(this.CONTENT, " ");
                sentences.push(this.TITLE + " " + this.CONTENT);
            });
            topicise();
        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });
//	$.getJSON(solrApi).
//		done(function(data) {
//			$("#result").empty();
//			$.each(data.response.docs, function(i, doc){
//				var html = '<li> Date: ' + this.NEWSDATE + '</br>';
//				html += ' Place: '+ this.PLACE + '</br>';;
//				html += ' <b>TITLE: ' + this.TITLE + '</b>'+ '</br>';
//				html += ' Content: ' + this.CONTENT + '</br>';
//				html += ' <a href=\"' + this.CATEGORY + '\">Category</a></li></br></br>';
//				$("#results").append(html);
//			});
//		})
//	  .fail(function(data, d) {
//		    console.log( "error" );
//		  })
//	  .always(function(data) {
//		    console.log( "complete" );
//		 });
}

function crawlNYTimes() {
    var NYTApi = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
    NYTApi = NYTApi + $("input").val() + "&sort=newest&api-key=0eadf8a8e685079f3f53202a194920f6:10:70223982";
    //sentences[0] = "";
    $.getJSON(NYTApi).
		done(function (data) {
        $("#results").empty();
        $.each(data.response.docs, function (i, doc) {
            var html = '<li> Date: ' + this.pub_date + '</br>';
            html += ' abstract: ' + this.abstract + '</br>';;
            html += ' <b>headlines: ' + this.headline.main + '</b>' + '</br>';
            html += ' leadparagraph: ' + this.lead_paragraph + '</br>';
            html += ' <a href=\"' + this.web_url + '\">Click here</a></li></br></br>';
            $("#results").append(html);
            //sentences[0] = sentences[0].concat(this.headline.main, " ");
            //sentences[0] = sentences[0].concat(this.lead_paragraph, " ");
            sentences.push(this.headline.main + " " + this.lead_paragraph);
        });
        topicise();
    });
}

function crawlGuardian() {
    
    //$('#search_field').click(function ()
        var data = {};
        data.query = $('#search_field').val(); 
        $("#btnSubmit").addClass("ui loading button");
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/',
            
            success: function (nodeData) {
                var data = nodeData.solrData;
                $('#lblMessage').text('Total ' + Object.keys(nodeData.timeLineData.timeline.date).length + ' result found.');
                $('#txtQuery').val('');
                
                $("#my-timeline").html('');
                if (Object.keys(nodeData.timeLineData.timeline).length > 1) {
                    
                    createStoryJS({
                        type: 'timeline',
                        width: '100%',
                        height: '600',
                        source: nodeData.timeLineData,
                        maptype: 'watercolor',
                        embed_id: 'my-timeline'
                    });//TimeLine.js          
                }

                $("#results").empty();
                $.each(nodeData.gaurdianData, function () {
					
					bodstr = this.fields.body;
					if (bodstr){
					bodstr = bodstr.substring(4,600);
					}
					else {
					bodstr = "Read full story....";
					}
					
					
					gdntmbnl = this.fields.thumbnail;
					if (gdntmbnl){
					}
					else {
					gdntmbnl = "http://next.theguardian.com/assets/images/gravatar.png";
					}
					
                    var html = '<li><b>Title: ' + this.webTitle + '</b></br>';
                    html += ' Date:' + this.fields.firstPublicationDate + '</br>';;
                    html += '<div class="ui raised segment" style="width:100%;"><div style="display:inline-block; vertical-align:top;"><img src=\"' + gdntmbnl+"\"width=\"150\" height=\"150\"></div>";
                    html += '<div style="width: 600px; margin-left:20px; display:inline-block; vertical-align:top;">' +bodstr + '...';
                    html += ' <a href=\"' + this.webUrl + '\">Full Story...</a></div></div></li><br/><br/><br/>';
                    $("#results").append(html);
                   // sentences[0] = sentences[0].concat(this.webTitle, " ");
                    //sentences[0] = sentences[0].concat(this.standfirst, " ");
                    sentences.push(this.webTitle + " " + this.standfirst);
                });
            TopicListing();           
            $("#btnSubmit").removeClass("ui loading button");
            }
    });//Ajax Call

    
    
    //var GApi = "http://content.guardianapis.com/search?q=";
    //GApi = GApi + $("input").val() + "&sort=newest&api-key=neukrcw8u9xm4ks5zejvx3uj";
    //sentences[0] = "";
    //$.getJSON(GApi, function (data) {

    //});
}

function crawlGuardian2() {
    var valnew = document.getElementById(idClicked).value;
    var GApi = "http://content.guardianapis.com/search?q=";
    GApi = GApi + $("input").val() + " " + valnew + "&sort=newest&api-key=neukrcw8u9xm4ks5zejvx3uj";
    //sentences[0] = "";
    $.getJSON(GApi, function (data) {
        $("#results").empty();
        $.each(data.response.results, function () {
            var html = '<li> Date: ' + this.webPublicationDate + '</br>';
            html += ' abstract: ' + this.sectionName + '</br>';;
            html += ' <b>headlines: ' + this.webTitle + '</b>' + '</br>';
            html += ' leadparagraph: ' + this.sectionName + '</br>';
            html += ' <a href=\"' + this.webUrl + '\">Click here</a></li></br></br>';
            $("#results").append(html);
            //sentences[0] = sentences[0].concat(this.webTitle, " ");
            //sentences[0] = sentences[0].concat(this.sectionName, " ");
            sentences.push(this.webTitle + " " + this.sectionName);
				
        });
			//topicise();
    });
}

var sentencesmod = "";
var AllTopics = new Array();
var TenTopics = new Array();

function TopicListing() {
    
    
    
    //sentences[0] = "";
    
    
    var NYTApi = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
    NYTApi = NYTApi + $("input").val() + "&sort=newest&api-key=0eadf8a8e685079f3f53202a194920f6:10:70223982";
    $.getJSON(NYTApi).
			done(function (data) {
        $.each(data.response.docs, function (i, doc) {
           // sentences[0] = sentences[0].concat(this.headline.main, " ");
           // sentences[0] = sentences[0].concat(this.lead_paragraph, " ");
        	sentences.push(this.headline.main + " " + this.lead_paragraph);
        });
        
        sentencesmod = sentences;
        gnext();
    });
}

function gnext() {
    
    var GApi = "http://content.guardianapis.com/search?q=";
    GApi = GApi + $("input").val() + "&sort=newest&api-key=neukrcw8u9xm4ks5zejvx3uj";
    $.getJSON(GApi, function (data) {
        $.each(data.response.results, function () {
           // sentences[0] = sentences[0].concat(this.webTitle, " ");
           // sentences[0] = sentences[0].concat(this.sectionName, " ");
        	sentences.push(this.webTitle + " " + this.sectionName);
        });
        sentencesmod = sentences;
        solrnext();
    });
		


}

function solrnext() {
    
    var solrApi = "http://98.118.151.224:8983/solr/newscollection/select";//?q=";
    $.ajax({
        'url': solrApi,
        'data': { 'wt': 'json', 'q': $("input").val() },
        'success': function (data) {
            $.each(data.response.docs, function (i, doc) {
                //sentences[0] = sentences[0].concat(this.TITLE, " ");
                //sentences[0] = sentences[0].concat(this.CONTENT, " ");
            	sentences.push(this.TITLE + " " + this.CONTENT);
            });
            sentencesmod = sentences;
            topicise();
            displayTopics();
        },
        'dataType': 'jsonp',
        'jsonp': 'json.wrf'
    });

}

function displayTopics() {
    
    var result = topiciseAll();
    //AllTopics = topiciseAll();
    AllTopics = result.tempArrayDisp;
    for (k = 0; k < 10; k++) {
        TenTopics[k] = AllTopics[k];
        j = k + 1;
        var btn = "btn_topic[" + j + "]"
        document.getElementById(btn).value = AllTopics[k];
        if (k == 9) {
            $(topicaldivback1).show();
            $(divResult).show();
        }
    }
    		
			
}
