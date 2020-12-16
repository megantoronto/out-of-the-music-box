import numpy as np
from numpy import linalg
import pandas as pd
from sklearn.preprocessing import normalize, scale, Normalizer
from sklearn.decomposition import PCA
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.wait import TimeoutException
from sys import platform

def recommendation(seed_index,user_inputs):
    df=pd.read_csv('static/spotify_songs.csv')
    cats = ['danceability', 'energy', 'key', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo','lyrical_valence']
    look_up = {1:.25,2:.5,3:1,4:1.5,5:1.75}
    user_inputs = [look_up[i] for i in user_inputs]
    feat = df[cats].copy()
    weights = dict(zip(cats, user_inputs))
    feat = pd.DataFrame(normalize(feat, norm='l2'), columns=weights)
    seed_song_info = pd.DataFrame([feat.iloc[seed_index][cats]])
    feat=feat.drop(index=seed_index)
    feat = pd.DataFrame(feat, columns=weights)
    test = user_inputs * feat
    test['scores']= linalg.norm(test - seed_song_info.values.squeeze(), axis=1)
    seed_song_info['scores'] = 0
    test = pd.concat([seed_song_info, test], axis=0)
    
    #Code for PCA graph
    rec_pca=test.sort_values("scores").index[:250]
    feat = df[['danceability', 'energy', 'key', 'loudness', 'speechiness',
       'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo','lyrical_valence']]
    cats =['danceability', 'energy', 'key', 'loudness', 'speechiness',
       'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo','lyrical_valence']
    rec_song_df = feat.iloc[rec_pca,:].reset_index(drop=True)
    original_features = ['artist', 'song_name']
    identifier = df.loc[rec_pca][original_features].reset_index(drop=True)
    pca = PCA(n_components=2)
    pca_comp = pca.fit_transform(rec_song_df)
    pca_df = pd.DataFrame(data=pca_comp, columns=['pca1', 'pca2'])
    seed_song = pd.DataFrame(rec_song_df.iloc[0]).T
    seed_song = seed_song[cats]
    similarity = pd.DataFrame()
    seed_similarity = pd.DataFrame()
    def get_similarity (row,c,seed_song):
        
        
        same = seed_song[c][0]
        same_lower_bound = same - (same * 0.34)
        same_upper_bound = same + (same * 0.34)
        
        slightly_lower = same - (same * 0.68)
        slightly_higher = same + (same * 0.68)
        
        if row[c] == same:
            return "="
        if (row[c] >= same_lower_bound) and (row[c] <= same_upper_bound):
            return '='
        if (row[c] < same_lower_bound) and (row[c] >= slightly_lower):
            return '-'
        if (row[c] > same_upper_bound) and (row[c] <= slightly_higher):
            return '+'
        if row[c] < slightly_lower:
            return '--'
        if row[c] > slightly_higher:
            return '++'

    for c in cats:
        similarity[c] = rec_song_df.apply(lambda row: get_similarity(row,c,seed_song), axis=1)

    for c in cats:
        seed_similarity[c+"_range"] = seed_song.apply(lambda row: get_similarity(row,c,seed_song), axis=1)
    
    df_graph = pd.concat([identifier, similarity, pca_df], axis = 1)

    df_graph.to_csv('static/clustered_pca.csv')

    #Code for final 20 recommendations
    rec = test.sort_values("scores").index[:21]
    final=df.iloc[rec][['song_name', 'artist','album','track_id']][1:]
    final.set_index(['song_name'],inplace=True)
    final.index.name=None
    final['track_id']="https://open.spotify.com/embed/track/"+final['track_id']
    iframes=final['track_id'].values.tolist()
    bad_iframes=['https://open.spotify.com/embed/track/6GTNA255QkvjcwwyKLt3os']
    iframes=[i for i in iframes if i not in bad_iframes]

    return final,iframes,df_graph
