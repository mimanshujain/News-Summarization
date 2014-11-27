/**
 * 
 */
package org.kb.solr.query;

import java.util.Iterator;
import java.util.Set;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrServer;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.apache.solr.common.SolrDocument;
import org.apache.solr.common.SolrDocumentList;

/**
 * @author avinav
 *
 */
public class SampleQuery {
	private String urlString;
	private SolrServer solr;
	
	public SampleQuery(String urlString) {
		this.urlString = urlString;
		try {
			this.solr = new HttpSolrServer(this.urlString);
		} 
		catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	/**
	 * Executes query without setting any parameters. Prints top 5 results.
	 * @param query
	 */
	public void executeSimpleQuery(String query) {
		SolrQuery params = new SolrQuery();
		StringBuilder out = new StringBuilder("");
		QueryResponse res = null;
		SolrDocumentList list = null;
		params.set("q",query);
		params.set("rows", 5);
		try {
			res = solr.query(params);
		} catch (SolrServerException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}
		if (res != null) {
			list = res.getResults();
			SolrDocument sDoc = list.get(0);
			Set<String> fieldNames = (Set<String>) sDoc.getFieldNames();
			Iterator<SolrDocument> itr = list.iterator();
			int i = 0;
			while(itr.hasNext()) {
				sDoc = itr.next();
				out.append("\nResult " + (++i) + "\n");
				for(String fName : fieldNames) {
					if (sDoc.getFieldValues(fName) != null) {
						Object[] values = sDoc.getFieldValues(fName).toArray();
						for (Object value : values) {
							out.append(fName + ": " + value.toString() + "\n");
						}
					}
				}
			}
		}
		System.out.println(out);
	}
}
