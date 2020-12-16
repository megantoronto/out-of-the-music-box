# out-of-the-music-box
A music recommendation system that generates song recommendations based on audio and lyrical features.

# Background
This is a project that began as the class project for my Data & Visual Analytics class through my Master's of Analytics degree at Georgia Tech. I worked on this project with Caroline Coyle, Joseph Hirschi, and Jonathan Dine. I did not write every line of code in this project, but was involved in every part of the process. I built and deployed the main infrastructure of the website. I will indicate below where I wrote individual code and where my teammates and I collaborated.

# Introduction
MusicBox is meant to help users discover music in a new way. Music recommendation systems have historically neglected involving users directly when recommending songs. They rarely solicit users personally to ask what you are looking for. We felt by not allowing direct user input, current music recommendation systems may not be allowing people to find the music they really want to listen to. We created MusicBox to address this issue. MusicBox is also unique in that it finds songs that are purely similar from an audio feature and lyrical valence perspective. This can result in surprising recommendations. For example, Bohemian Rhapsody has quite similar audio features to some Mormon Tabernacle songs due to its choral part. It can be interesting to see which songs are actually similar to one another.

# The Data
At the core of Music Box is a dataset comprised of two main parts. In the first, we utilized audio features Spotify has assigned to songs based on their musical composition. We got this data by scraping Spotify. In the second part, we performed sentiment analysis on the lyrics of these songs. We used the LyricsGenius API to pull the lyrics and utilized VADER to create a lyrical valence score that describes how positive or negative the sentiment of the lyrics are. This resulted in our final dataset, a csv of 391,548 songs with their accompanying audio and lyrical features.

# How it Works
We incorporate user input by allowing users to enter a seed song and adjust the weights of audio features. These weights are multiplied onto a normalized version of our main dataset and the Euclidean distance is used to calculate a similarity score for how close the seed song is to all other the other songs our dataset. The top 20 closest and recommended songs are then returned. We performed principal component analysis on the data to reduce the data to two dimensions. This allowed us to scatter plot the data to visualize how the 250 closest songs change when the weights change as shown by the two graphs here.

# Deployment and Final Web Link
I deployed this code on Heroku, using a Docker container. The final website can be found here: 

https://out-of-the-music-box.herokuapp.com/ 

It is best viewed in a large desktop window.

# Future Developments
There are a few developments I will try to add to this website in the coming months. The main updates will be:
- Make the website mobile friendly
- Move the data from a flat file to a database to improve loading speeds, 
- Improve the quality of the songs included in the dataset
- Make the dataset more comprehensive
- Add a genre filter
- Refine the recommendation algorithm

# Description of Code Files:
- **app.py**: This is the main file that creates and ultimately runs our Flask app. It is responsible for feeding information between the user interface and our recommendation algorithm.
  - *Contributor: Megan Toronto*
- **recommender.py**: Houses the recommendation algorithm that produces the final 20 recommended songs and the PCA data used in the graph on our site.
  - *Contributors: Caroline Coyle, Jonathan Dine, Joseph Hirschi, Megan Toronto*
- **static\d3-tip.min.js, static\d3.v5.min.js, static\jquery-3.5.1.min.js**: JavaScript and JQuery libraries used to build our other JavaScript files.
- **static\spotify_songs.csv**: The final dataset used for our app.
  - *Contributors: Caroline Coyle, Jonathan Dine, Joseph Hirschi, Megan Toronto*
- **static\clustered_pca_rick_roll**: The dataset used for the visualization that first appears when the app is loaded.
    - *Contributor: Caroline Coyle*
- **static\clustered_pca.csv**: The dataset used for the visualization when a different song is searched.
  - *Contributor: Caroline Coyle*
- **static\mastermap.js**: A JavaScript file that creates the visualization on for the user interface and does some error handling.
  - *Contributors: Caroline Coyle, Megan Toronto*
- **static\dropdown.js**: A JavaScript file that creates the dropdown menu, adds functionality for the slider bars, and does some error handling.
  - *Contributor: Megan Toronto*
- **static\style.css**: The CSS file that styles the user interface.
  - *Contributors: Caroline Coyle, Megan Toronto*
- **static\MusicBox_Banner.png**: The logo image for our app.
  - *Creator: Sabra Leong*
- **templates\index.html**: The HTML file for the user interface.
  - *Contributor: Megan Toronto*
- **Dockerfile**: The Dockerfile that builds the container for our app.
  - *Contributors: Joseph Hirschi, Megan Toronto*
- **requirements.text**: Contains all the required Python packages for our app. Needed for the Heroku deployment and Docker container build.
- **Procfile**: A Heroku specific file needed for Heroku deployment.


