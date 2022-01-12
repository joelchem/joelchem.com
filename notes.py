from flask import url_for

import markdown
import requests
import re

def getNote(title):
    md = requests.get(f"https://raw.githubusercontent.com/teky1/APGovNotes/main/{title}.md").text

    md = re.sub(r"\[\[.+\]\]", lambda x: f"[{x.group()[2:-2]}]({url_for('notesFile', title=x.group()[2:-2])})", md)

    if md == "404: Not Found":
        md = "# 404: Resource not found :("
        title = "404: Resource not found :("
    html = markdown.markdown(md)
    return html, title
    

