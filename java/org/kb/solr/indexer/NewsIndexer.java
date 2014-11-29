/**
 * 
 */
package org.kb.solr.indexer;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.client.solrj.response.UpdateResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;
import org.apache.solr.common.SolrInputDocument;
import org.kb.documentParser.document.XMLTags;

/**
 * @author avinav
 *
 */
public class NewsIndexer {
	private String urlString;
	private SolrServer solr;
	private Long id = (long) 0;
	
	public NewsIndexer(String urlString) {
		this.urlString = urlString;
		try {
			this.solr = new HttpSolrServer(this.urlString);
		} 
		catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	/**
	 * Index documents present in path corpusPath
	 * @param corpusPath
	 */
	public void index(List<XMLTags> tagList) {
		SolrInputDocument document = new SolrInputDocument();
		++this.id;
		document.addField("id", this.id.toString());
		for (XMLTags tag : tagList) {
			document.addField(tag.getTagName(), tag.getText().toString());
		}
		try {
			UpdateResponse response = solr.add(document);
		} catch (SolrServerException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void commit() {
		try {
			solr.commit();
		} catch (SolrServerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
