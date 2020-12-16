from flask import Flask
from flask import flash, render_template, request, redirect, url_for, jsonify, Response
import os
import json
import pandas as pd
import numpy as np
from recommender import recommendation

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/', methods=['GET','POST'])
def index():
    iframes=['https://open.spotify.com/embed/track/7MRVsoFbi0wsEVISRoFJE0', 'https://open.spotify.com/embed/track/7dgO6H1BxXeXfxDkiDN8E9', 
    'https://open.spotify.com/embed/track/6mJaW44PYj3ng3S24AHMaU', 'https://open.spotify.com/embed/track/2tkkZbX1LsTaDttsLpEA6E', 
    'https://open.spotify.com/embed/track/5G1RhMTSAzFSmTkeUbKlBF', 'https://open.spotify.com/embed/track/08OT9FuicGBVUjP2aK8XGs', 
    'https://open.spotify.com/embed/track/2qIRvqlP4vjDh8LonUDizH', 'https://open.spotify.com/embed/track/7tRQdzGdJ5KDhow1kYe69B', 
    'https://open.spotify.com/embed/track/1CusgkxK8iSVXjbHV6OrjT', 'https://open.spotify.com/embed/track/1zm9dbaNjNXTMd78MGXBr1', 
    'https://open.spotify.com/embed/track/5Fli1xRi01bvCjsZvKWro0', 'https://open.spotify.com/embed/track/4XvGKIdfCLvv7O3ABrzuTH', 
    'https://open.spotify.com/embed/track/5Dp5RPICiuwGdA7zHalMow', 'https://open.spotify.com/embed/track/1yzWJYBjiU9jzYHQ6yJFK2', 
    'https://open.spotify.com/embed/track/2Z5FipHH2FebcDQyPBRFkm', 'https://open.spotify.com/embed/track/1WZC7SFQy13GD3ZS62aO5m', 
    'https://open.spotify.com/embed/track/1XXyHhgmhMYqn55Gej4NXs', 'https://open.spotify.com/embed/track/5yXjcwHXNFBfaj24q8OfNi', 
    'https://open.spotify.com/embed/track/42drs59mOHJlIDMjVOrG0j', 'https://open.spotify.com/embed/track/2HRmZKGvi9Fg4wE3Fq4Pfr']
    
    if request.method == 'POST':
        search=request.form['songSearch']
        danceability=int(request.form['dance'])
        energy = int(request.form['energy'])
        key = int(request.form['key'])
        loudness= int(request.form['loudness'])
        speech=int(request.form['speech'])
        acousticness=int(request.form['acousticness'])
        instrumentalness=int(request.form['instrumentalness'])
        liveness=int(request.form['liveness'])
        valence=int(request.form['valence'])
        tempo=int(request.form['tempo'])
        lyrical_valence=int(request.form['lyricalvalence'])
        user_inputs=[danceability,energy,key,loudness,speech,acousticness,instrumentalness,liveness,valence,tempo,lyrical_valence]
        return search_results(search,user_inputs)
    return render_template('index.html',iframes=iframes,home_page=1)

@app.route('/')
def search_results(search,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    search = search.split(" | ")
    song=search[0]
    artist=search[1]
    album = search[2]
    seed_index=df.index[(df['song_name']==song) & (df['artist']==artist) & (df['album']==album)][0]
    df,iframes,df_graph=recommendation(seed_index,user_inputs)
    return render_template('index.html',inputs=user_inputs,iframes=iframes,df_graph=df_graph,home_page=0)  

@app.route('/getMyJson')
def getMyJson():
    df_graph=pd.read_csv('static/clustered_pca.csv')
    json = df_graph.to_json(orient='records', date_format='iso')
    response = Response(response=json, status=200, mimetype="application/json")
    return(response)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port,debug=False)