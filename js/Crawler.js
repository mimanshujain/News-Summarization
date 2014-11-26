/**
 * 
 */
function calc(numA, numB) {
	return numA + numB;
}

function callSolr() {
	http://98.118.151.224:8983/solr/newscollection/select?q=abc&sort=NEWSDATE+desc&wt=json&indent=true
	var solrApi = "http://98.118.151.224:8983/solr/collection1/select?q=";
	solrApi = solrApi + $("input").val() + "&wt=json&indent=true";
	sentences[0] = "";
	$.getJSON(solrApi).
		done(function(data) {
			$("#result").empty();
			$.each(data.response.docs, function(i, doc){
				var html = '<li> Date: ' + this.NEWSDATE + '</br>';
				html += ' Place: '+ this.PLACE + '</br>';;
				html += ' <b>TITLE: ' + this.TITLE + '</b>'+ '</br>';
				html += ' Content: ' + this.Content + '</br>';
				html += ' <a href=\"' + this.Category + '\">Category</a></li></br></br>';
				$("#results").append(html);
				sentences[0] = sentences[0].concat(this.lead_paragraph, " ");
				sentences[0] = sentences[0].concat(this.headline.main, " ");
			});
		});
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