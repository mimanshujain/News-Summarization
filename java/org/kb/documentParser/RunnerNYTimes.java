/**
 * 
 */
package org.kb.documentParser;

import java.io.File;
import java.util.Hashtable;
import java.util.List;

import org.kb.documentParser.document.ParserException;
import org.kb.documentParser.document.XMLTags;
import org.kb.documentParser.parser.NYTimesParser;
import org.kb.documentParser.parser.ToXml;

/**
 * @author avinav
 *
 */
public class RunnerNYTimes {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		NYTimesParser nParser = new NYTimesParser();
		try {
			Hashtable<String, List<XMLTags>> tagTable = nParser.parseGeneric("/home/avinav/applications/Reuters/test/1815722.xml");
			for (String key : tagTable.keySet()) {
				List<XMLTags> tagList = tagTable.get(key);
				for (XMLTags tag : tagList) {
					System.out.println(key + ": " + tag.getText());
				}
			}
			File fOut = new File("/home/avinav/applications/Reuters/test/test.xml");
			ToXml.writeXML(fOut, ToXml.createDocument(tagTable));
		} catch (ParserException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}

	}

}
