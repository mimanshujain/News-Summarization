/**
 * 
 */
package documentParser.document;


/**
 * @author avinav
 * This is an enumeration that defines the different field names
 */
public enum FieldNames {
	FILEID, CATEGORY, TITLE, AUTHOR, AUTHORORG, PLACE, NEWSDATE, CONTENT;
	
	@Override
	public String toString() {
		switch(this) {
		case FILEID: return "FILEID";
		case CATEGORY: return "CATEGORY";
		case TITLE: return "TITLE";
		case AUTHOR: return "AUTHOR";
		case AUTHORORG: return "AUTHORORG";
		case PLACE: return "PLACE";
		case NEWSDATE: return "NEWSDATE";
		case CONTENT: return "CONTENT"; 
		default: throw new IllegalArgumentException();
		}	
	}
};


