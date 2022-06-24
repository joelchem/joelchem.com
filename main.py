from flask import Flask, render_template

from music import music_auth

app = Flask(__name__)
app.register_blueprint(music_auth)
debug = True
@app.route('/')
def index():
    return render_template("index.html")



if __name__ == "__main__":
    if debug:
        app.run(debug=True, port=8080, host="0.0.0.0")
    else:
        app.run(debug=False, port=8080)