/**
 * 
 */
function calc(numA, numB) {
	return numA + numB;
}

function callSolr() {
	//98.118.151.224
	var solrApi = "http://98.118.151.224:8983/solr/newscollection/select";//?q=";
	sentences[0] = "";
	$("#results").empty();
	$.ajax({
		  'url': solrApi,
		  'data': {'wt':'json', 'q': $("input").val()},
		  'success': function(data) { 
					$("#result").empty();
					$.each(data.response.docs, function(i, doc){
						var html = '<li> Date: ' + this.NEWSDATE + '</br>';
						html += ' Place: '+ this.PLACE + '</br>';;
						html += ' <b>TITLE: ' + this.TITLE + '</b>'+ '</br>';
						html += ' Content: ' + this.CONTENT + '</br>';
						html += ' <a href=\"' + this.CATEGORY + '\">Category</a></li></br></br>';
						$("#results").append(html);
						sentences[0] = sentences[0].concat(this.TITLE, " ");
						sentences[0] = sentences[0].concat(this.CONTENT, " ");
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
	sentences[0] = "";
	$.getJSON(NYTApi).
		done(function(data) {
			$("#results").empty();
			$.each(data.response.docs, function(i, doc){
				var html = '<li> Date: ' + this.pub_date + '</br>';
				html += ' abstract: '+ this.abstract + '</br>';;
				html += ' <b>headlines: ' + this.headline.main + '</b>'+ '</br>';
				html += ' leadparagraph: ' + this.lead_paragraph + '</br>';
				html += ' <a href=\"' + this.web_url + '\">Click here</a></li></br></br>';
				$("#results").append(html);
				sentences[0] = sentences[0].concat(this.headline.main, " ");
				sentences[0] = sentences[0].concat(this.lead_paragraph, " ");
			});
			topicise();
		});
}