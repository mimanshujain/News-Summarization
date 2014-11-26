/**
 * 
 */
package org.kb.documentParser;

import java.io.File;

import org.dom4j.Document;

import org.kb.documentParser.document.NewsDocument;
import org.kb.documentParser.document.ParserException;
import org.kb.documentParser.parser.ReutersParser;
import org.kb.documentParser.parser.ToXml;

/**
 * 
 *
 */
public class Runner {

	/**
	 * 
	 */
	public Runner() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String ipDir = args[0];
		String xmlDir = args[1];
		
		//more? idk!
		if (!xmlDir.endsWith(File.separator)) {
			xmlDir = xmlDir + File.separator;
		}
		File ipDirectory = new File(ipDir);
		String[] catDirectories = ipDirectory.list();
		
		String[] files;
		File dir, xmlOut;
		NewsDocument d = null;
//		IndexWriter writer = new IndexWriter(indexDir);
		
		try {
			String outDir;
			for (String cat : catDirectories) {
				dir = new File(ipDir+ File.separator+ cat);
				files = dir.list();
				outDir = xmlDir + cat;
				if (files == null)
					continue;
				
				for (String f : files) {
					try {
						d = ReutersParser.parse(dir.getAbsolutePath() + File.separator +f);
						Document xmlDoc = ToXml.createDocument(d);
						xmlOut = new File(outDir + File.separator + f + ".xml");
						ToXml.writeXML(xmlOut, xmlDoc);
						
					} catch (ParserException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					} 
					
				}
				
			}
			
//			writer.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
