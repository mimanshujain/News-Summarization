package org.kb.documentParser.parser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

import org.kb.documentParser.document.FieldNames;
import org.kb.documentParser.document.NewsDocument;

public class ToXml {
	private static Long id = (long) 0;
	/**
	 * Takes input NewsDocument object and convert to dom.document object 
	 * @param nd NewsDocument
	 * @return XML document
	 */
	public static Document createDocument(NewsDocument nd) {
		id ++;
		Document document = DocumentHelper.createDocument();
		Element root = document.addElement("add");
		Element doc = root.addElement("doc");
		doc.addElement("field")
		.addAttribute("name", "id")
		.addText(id.toString());
		FieldNames[] fn = {FieldNames.FILEID, FieldNames.CATEGORY, FieldNames.AUTHOR,
				FieldNames.AUTHORORG, FieldNames.NEWSDATE, FieldNames.PLACE,   
				FieldNames.TITLE, FieldNames.CONTENT};
		for (int i = 0; i < fn.length; i++) {
			String[] str = nd.getField(fn[i]);
			if (str != null && str.length > 0) {
				if (fn[i].equals(FieldNames.AUTHOR)) {
					for (String author: str[0].split(",")) {
						if(author != null && !author.trim().isEmpty()) {
							doc.addElement("field").addAttribute("name", fn[i].toString())
							.addText(author.trim());
						}
					}
				}
				else {
				doc.addElement("field").addAttribute("name", fn[i].toString())
					.addText(str[0]);	
				}
			}
		}
		return document;
		/*
		Element fileId = root.addElement("FileId")
				.addText(nd.getField(FieldNames.FILEID)[0]);
		Element category = root.addElement("Category")
				.addText(nd.getField(FieldNames.CATEGORY)[0]);
		Element title = root.addElement("Title")
				.addText(nd.getField(FieldNames.TITLE)[0]);
		Element place = root.addElement("Place")
				.addText(nd.getField(FieldNames.PLACE)[0]);
		Element newsdate = root.addElement("NewsDate")
				.addText(nd.getField(FieldNames.NEWSDATE)[0]);
		Element content = root.addElement("Content")
				.addText(nd.getField(FieldNames.CONTENT)[0]);
		String[] authors = nd.getField(FieldNames.AUTHOR);
		for (String author: authors) {
			root.addElement("Author")
			.addText(author);
		}
		Element authorOrg = root.addElement("AuthorOrg")
				.addText(nd.getField(FieldNames.AUTHORORG)[0]);
		*/
		
	}
	/**
	 * 
	 * @param fOut
	 * @param dom
	 */
	public static void writeXML (File fOut, Document dom) {
		try {
			fOut.getParentFile().mkdirs();
			OutputFormat format = OutputFormat.createPrettyPrint();
			XMLWriter writer = new XMLWriter(new FileWriter(fOut), format);
			writer.write(dom);
			writer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
