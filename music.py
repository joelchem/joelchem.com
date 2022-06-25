from flask import Blueprint, redirect, request
import requests
import gspread

from urllib.parse import urlencode
import json
import base64
import time

music_auth = Blueprint('music_auth', __name__)

# totally not using a google spreadsheet to store keys....
gc = gspread.service_account(filename='google_service_account.json')
db = gc.open("MusicBackendDatabase")
auth_db = db.worksheet("SpotifyAuth")

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
    local = auth_db.get_values("A2:D1000")
    entry = [
        state, 
        post_response.json()["access_token"], 
        post_response.json()["refresh_token"],
        int(post_response.json()["expires_in"])+int(time.time())
    ]
    added = False
    for i,row in enumerate(local):
        if row[0] == state:
            local[i] = entry
            added = True
            break
    if not added:
        local.append(entry)
    
    auth_db.update("A2:D1000", local, value_input_option="USER_ENTERED")

    return f"<h1>Success!</h1><p>DM Teky your Spotify email to get added to the whitelist." \
           f" Once you do this your Spotify will be linked to the bot.</p><p><i>*You may close this site</i></p>"

