package org.kb.documentParser.document;

import java.util.Hashtable;

public class XMLTags {
	private String tagName;
	private StringBuffer text;
	private Hashtable<String, String> attributes;
	
	public XMLTags() {
		
	}
	public XMLTags(String tagName, StringBuffer text, Hashtable<String, String> attributes) {
		this.tagName = tagName;
		this.text = text;
		this.attributes = attributes;
	}
	
	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public StringBuffer getText() {
		return text;
	}

	public void setText(StringBuffer text) {
		this.text = text;
	}

	public Hashtable<String, String> getAttributes() {
		return attributes;
	}

	public void setAttributes(Hashtable<String, String> attributes) {
		this.attributes = attributes;
	}
}
