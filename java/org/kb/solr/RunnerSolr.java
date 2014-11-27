/**
 * 
 */
package org.kb.solr;


import org.kb.solr.query.SampleQuery;

/**
 * @author avinav
 *
 */
public class RunnerSolr {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		SampleQuery sQ = new SampleQuery("http://localhost:8983/solr/newscollection");
		sQ.executeSimpleQuery("control interest");
		 
	}

}
