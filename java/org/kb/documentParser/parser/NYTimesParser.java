/**
 * 
 */
package org.kb.documentParser.parser;


import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.kb.documentParser.document.ParserException;
import org.kb.documentParser.document.SAXNYTimesHandler;
import org.kb.documentParser.document.XMLTags;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.DefaultHandler;


/**
 * Generic Handler for all tags
 * @author avinav
 *
 */
public class NYTimesParser {
	public class SAXDefaultHandler extends DefaultHandler {
		private Hashtable<String, List<XMLTags>> tagTable;
		private String key;
		private XMLTags tag;

		public void startDocument() throws SAXException {
			this.tagTable = new Hashtable<String, List<XMLTags>>();
		}

		public void startElement(String nameSpaceURI, String localName,
				String qName, Attributes att) throws SAXException{
			List<XMLTags> tagList;
			this.key = qName + ":" + att.getValue("name");
			this.tag = new XMLTags();
			this.tag.setTagName(qName);
			Hashtable<String, String> atts = new Hashtable<String, String>();
			for (int i = 0; i < att.getLength(); i++) {
				atts.put(att.getQName(i),att.getValue(i));
			}
			this.tag.setAttributes(atts);
			if(this.tagTable.containsKey(key)) {
				tagList = this.tagTable.get(key);
				tagList.add(this.tag);
			}
			else {
				tagList = new ArrayList<XMLTags>();
				tagList.add(this.tag);
				this.tagTable.put(key, tagList);
			}
			
			//			System.out.println(key + " name:" + this.name);
		}

		public void endElement(String uri, String localName, String qName) throws SAXException {
			//			System.out.println("close: " + this.key);
		}

		public void characters(char ch[], int start, int length) {
			StringBuffer strBuff = this.tag.getText();
			if (strBuff != null && strBuff.length() != 0) {
				strBuff.append(new String(ch, start, length));
				this.tag.setText(strBuff);
			}
			else {
				this.tag.setText(new StringBuffer (new String(ch, start, length)));
			}
		}
		public void endDocument() throws SAXException {
			//			System.out.println("END document");
		}

		public Hashtable<String, List<XMLTags>> getTable() {
			return this.tagTable;
		}
	}

		/**
		 * Parses xml with any/all tags.
		 * @param filename
		 * @return Hashtable <String, StringBuffer> with tag name as key and tag text as value
		 * @throws ParserException
		 */
		public Hashtable<String, List<XMLTags>> parseGeneric (String filename) throws ParserException {
			if (filename == null || filename.isEmpty()) {
				throw new ParserException();
			}
			File file = new File(filename);
			SAXDefaultHandler dh = new SAXDefaultHandler();
			return parse(file, dh);
		}
		/**
		 * Parses xml file with tags specific to NYCorpus.
		 * @param filename
		 * @return Hashtable <String, StringBuffer> with tag name as key and tag text as value
		 * @throws ParserException
		 */

		public Hashtable<String, List<XMLTags>> parseNY (String filename) throws ParserException {
			if (filename == null || filename.isEmpty()) {
				throw new ParserException();
			}
			File file = new File(filename);
			SAXDefaultHandler dh = new SAXDefaultHandler();
			return parse(file, dh);
		}

		/**
		 * Parser for any specific requirements through a custom SAXDefaultHandler.
		 * @param file
		 * @param dh
		 * @return Hashtable <String, StringBuffer> with tag name as key and tag text as value
		 * @throws ParserException
		 */
		public Hashtable<String, List<XMLTags>> parse (File file, SAXDefaultHandler dh) throws ParserException {
			Hashtable<String, List<XMLTags>> tags = null;
			SAXParserFactory factory = SAXParserFactory.newInstance();
			try {
				SAXParser saxParser = factory.newSAXParser();
				saxParser.parse(file, dh);
				tags = dh.getTable();
			} catch (ParserConfigurationException | SAXException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return tags;
			//		SAXReader reader = new SAXReader();
			//		try {
			//			Document doc = reader.read(file);
			//			Element root = doc.getRootElement();
			//			for(Iterator<Element> itr = root.elementIterator(); itr.hasNext();) {
			//				Element element = (Element) itr.next();
			//			}
			//		
			//		}
			//		catch (DocumentException e) {
			//			// TODO Auto-generated catch block
			//			System.out.println(e.getMessage());
			//			}
		}
		
		public List<XMLTags> parseNYCorpus (File file) throws ParserException{
			List<XMLTags> tagList = null;
			SAXNYTimesHandler dh = new SAXNYTimesHandler();
			SAXParserFactory factory = SAXParserFactory.newInstance();
			try {
				SAXParser saxParser = factory.newSAXParser();
				XMLReader xmlParser = saxParser.getXMLReader();
				xmlParser.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
				xmlParser.setFeature("http://xml.org/sax/features/validation", false);
				saxParser.parse(file, dh);
				tagList = dh.getList();
			} catch (ParserConfigurationException | SAXException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return tagList;
		}
	}
