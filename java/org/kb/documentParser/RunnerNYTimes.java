/**
 * 
 */
package org.kb.documentParser;

import java.io.File;
import java.util.List;

import org.kb.documentParser.document.ParserException;
import org.kb.documentParser.document.XMLTags;
import org.kb.documentParser.parser.NYTimesParser;
import org.kb.solr.indexer.NewsIndexer;

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
		NewsIndexer nx = new NewsIndexer("http://localhost:8983/solr/tnews");
		try {
			/*			Hashtable<String, List<XMLTags>> tagTable = nParser.parseGeneric("/home/avinav/applications/Reuters/test/1815722.xml");

			for (String key : tagTable.keySet()) {
				List<XMLTags> tagList = tagTable.get(key);
				for (XMLTags tag : tagList) {
					System.out.println(key + ": " + tag.getText());
				}
			}
			 */		
			/*
			File file = new File("/home/avinav/applications/NY_news_corpus/01/25/1821362.xml");
			List<XMLTags> tagList = nParser.parseNYCorpus(file);
			for (XMLTags tag : tagList) {
				System.out.println(tag.getTagName() + ": " + tag.getText());
			}
			File fOut = new File("/home/avinav/applications/Reuters/test/test.xml");
			 */
			String ipDir = args[0];
			String xmlDir = args[1];

			//more? idk!
			if (!xmlDir.endsWith(File.separator)) {
				xmlDir = xmlDir + File.separator;
			}
			File ipDirectory = new File(ipDir);
			String[] catDirectories = ipDirectory.list();
			String[] files;
			File dir, xmlOut, xmlIn;
			String outDir;

			for (String cat : catDirectories) {
				File ipDirectory1 = new File(ipDir + File.separator + cat);
				String[] catDirectories1 = ipDirectory1.list();
				for (String cat1 : catDirectories1) {
					dir = new File(ipDir+ File.separator+ cat + File.separator + cat1);
					files = dir.list();
					outDir = xmlDir + cat + File.separator + cat1;
					if (files == null)
						continue;
					for (String f : files) {
						try {
							//d = ReutersParser.parse(dir.getAbsolutePath() + File.separator +f);
							xmlIn = new File(ipDir + File.separator + cat + File.separator +
									cat1 + File.separator + f);
							xmlOut = new File(outDir + File.separator + f);
							if (f.endsWith(".xml")) {
								List<XMLTags> tagList = nParser.parseNYCorpus(xmlIn);
//								ToXml.writeXML(xmlOut, ToXml.createDocument(tagList));
								nx.index(tagList);
							}
						} catch (ParserException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} 			
					}
				}
			}
			nx.commit();
//			PrintStream ps = new PrintStream(new FileOutputStream(xmlDir + "id.txt"));
//			ps.println(ToXml.getId());
//			ps.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
		}
	}
}
