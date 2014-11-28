/**
 * 
 */
package org.kb.documentParser.document;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;



/**
 * @author avinav
 *
 */
public class SAXNYTimesHandler extends DefaultHandler {
	private String tagAtt = "";
	private XMLTags tag;
	private String date = "", month = "", year = "";
	private List<XMLTags> tagList;
	private boolean setValue = false;

	public void startDocument() throws SAXException {
		this.tagList = new ArrayList<XMLTags>();
	}

	public void startElement(String nameSpaceURI, String localName,
			String qName, Attributes att) throws SAXException{
		Hashtable<String, String> attr = new Hashtable<String,String>();
		if (qName.equals("meta")) {
			if(att.getValue("name").equals("publication_year")) {
				this.year = att.getValue("content");
			}
			else if(att.getValue("name").equals("publication_month")) {
				this.month = att.getValue("content");
			}
			else if(att.getValue("name").equals("publication_day_of_month")) {
				this.date = att.getValue("content");
			}
			else if(att.getValue("name").equals("online_secton")) {
				attr.put("name", "NEWSCATEGORY");
				String text = att.getValue("content");
				if(text != null && !text.isEmpty()) {
					tagList.add(new XMLTags("NEWSCATEGORY",new StringBuffer(text),attr));
				}
			}
		}
		else if(qName.equals("doc-id")) {
			attr.put("name", "FILEID");
			String text = att.getValue("id-string");
			if(text != null && !text.isEmpty()) {
				tagList.add(new XMLTags("FILEID",new StringBuffer(text),attr));
			}
		}
		else if(qName.matches("location|byline|abstract") || 
				(qName.equals("block") && "full_text".equals(att.getValue("class")))){
			String tagKey = null;
			
			if(qName.equals("location")) {
				tagKey = "PLACE";
			}
			else if(qName.equals("byline")) {
				tagKey = "AUTHOR";
			}
			else if(qName.equals("abstract")) {
				tagKey = "TITLE";
			}
			else if(qName.equals("block")) {
				tagKey = "CONTENT";
				tagAtt = "full_text";
			}
			this.tag = new XMLTags();
			this.tag.setTagName(tagKey);
			attr.put("name", tagKey);
			this.tag.setAttributes(attr);
			this.setValue = true;
		}
	}

	public void endElement(String uri, String localName, String qName) throws SAXException {
		//			System.out.println("close: " + this.key);
		if(setValue && (qName.matches("location|byline|abstract")) ||
				(qName.equals("block") && "full_text".equals(tagAtt))) {
			this.tagList.add(this.tag);
			this.setValue = false;
			this.tagAtt = "";
		}
	}

	public void characters(char ch[], int start, int length) {
		if (setValue) {
			StringBuffer strBuff = this.tag.getText();
			if (strBuff != null && strBuff.length() != 0) {
				strBuff.append(new String(ch, start, length));
				this.tag.setText(strBuff);
			}
			else {
				this.tag.setText(new StringBuffer (new String(ch, start, length)));
			}
		}
	}
	public void endDocument() throws SAXException {
		//			System.out.println("END document");
		Hashtable <String,String> attr = new Hashtable<String, String>();
		attr.put("names", "NEWSDATE");
		this.tag = new XMLTags();
		this.tag.setTagName("NEWSDATE");
		this.tag.setText(new StringBuffer(this.date + "-" + this.month + "-" + this.year));
		this.tag.setAttributes(attr);
//		List<XMLTags> tagList = new ArrayList<XMLTags>();
		this.tagList.add(this.tag);
//		this.tagTable.put("NEWSDATE",tagList);
	}

	public List<XMLTags> getList() {
		return this.tagList;
	}
}
