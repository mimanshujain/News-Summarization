/**
 * 
 */
function calc(numA, numB) {
	return numA + numB;
}

function crawl() {
	var NYTApi = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
	NYTApi = NYTApi + $("input").val() + "&sort=newest&api-key=0eadf8a8e685079f3f53202a194920f6:10:70223982";
	
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