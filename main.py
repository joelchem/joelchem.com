from flask import Flask, render_template
import notes

app = Flask(__name__)
debug = True
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/blocks')
def blocks():
    return render_template('blocks.html')

@app.route("/notes/<title>")
def notesFile(title):
    content, title = notes.getNote(title=title)
    return render_template('notes/notesBase.html', notes=content, noteName=title)


if __name__ == "__main__":
    if debug:
        app.run(debug=True, port=8080, host="0.0.0.0")
    else:
        app.run(debug=False, port=8080)