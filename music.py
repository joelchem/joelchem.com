from flask import Blueprint, redirect, request
import requests

from urllib.parse import urlencode
import json
import base64

music_auth = Blueprint('music_auth', __name__)

with open("secrets.json") as f:
    secrets = json.load(f)

@music_auth.route('/music/auth/<state>')
def auth(state):
    scopes = " ".join([
        "user-follow-read",
        "user-read-recently-played",
        "user-read-playback-position",
        "user-top-read",
        "playlist-read-collaborative",
        "user-library-read"
    ])
    redirect_uri = request.url_root + "music/callback"

    params = {
        "client_id": secrets["SPOTIFY_CLIENT_ID"],
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": scopes,
        "state": state,
        "show_dialog": "true"
    }

    final_url = "https://accounts.spotify.com/authorize?" + urlencode(params)
    return redirect(final_url)

@music_auth.route('/music/callback')
def callback():
    code = request.args.get('code', None)
    state = request.args.get('state', None)
    error = request.args.get('error', None)

    if error:
        return "Sorry! An error occurred\n\nError: " + error

    token_url = 'https://accounts.spotify.com/api/token'
    authorization = secrets["SPOTIFY_CLIENT_ID"] + ":" + secrets["SPOTIFY_CLIENT_SECRET"]
    authorization = base64.b64encode(authorization.encode("ascii")).decode("ascii")
    redirect_uri = request.url_root + "music/callback"

    headers = {'Authorization': "Basic " + authorization, 
             'Accept': 'application/json', 
             'Content-Type': 'application/x-www-form-urlencoded'}

    body = {'code': code, 'redirect_uri': redirect_uri, 
          'grant_type': 'authorization_code'}

    post_response = requests.post(token_url,headers=headers,data=body)

    # implement database things

    return "<h1>Success!</h1>"

