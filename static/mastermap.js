var margin = {top: 100, right: 0, bottom: 60, left: 15},
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var xScale = d3.scaleLinear()
    .range([0, width]);
var yScale = d3.scaleLinear()
    .range([height, 0]);
var svg = d3.select("#graph")
    .append("svg")
    //.attr("viewBox",`0 0  ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("viewBox",'0 0 700 500')
    //.attr('viewBox','0 0 '+Math.min(width+ margin.left + margin.right,height + margin.top + margin.bottom)+' '+Math.min(width+ margin.left + margin.right,height + margin.top + margin.bottom))
    //.attr('preserveAspectRatio','xMinYMin')
    // .attr("width", width + margin.left + margin.right)
    /* .attr("width",'100%')
    .attr("height",'100%') */
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
function homeGraph(){
d3.dsv(",", "static/clustered_pca_rick_roll.csv", function(d) {
    return {
        artist: d.artist,
        song: d.song_name,
        danceability: d.danceability,
        energy: d.energy,
        key: d.key,
        loudness: d.loudness,
        speechiness: d.speechiness,
        acousticness: d.acousticness,
        instrumentalness: d.instrumentalness,
        liveness: d.liveness,
        valence: d.valence,
        tempo: d.tempo,
        lyrical_valence: d.lyrical_valence,
        pca1: +d.pca1,
        pca2: +d.pca2,
    }
    }).then(function(data){
    var seedSong = data[0]['song'];
    var seedArtist = data[0]['artist'];
    recs = data.slice(1, 21);
    songList = [];
    for (i in recs) songList.push(recs[i]["song"]);
    // Compute the scales' domains.
    xScale.domain(d3.extent(data, function(d) { return d.pca1; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.pca2; })).nice();
    const xaxis = d3.axisBottom()
        .scale(xScale);
    const yaxis = d3.axisLeft()
        .scale(yScale);
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yaxis)
    // Add the tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(d => `<strong>Song: </strong><span class='details'>${d.song}<br></span>
        <strong>Artist: </strong><span class='details'>${d.artist}<br></span>`)
    // Add the tooltip
    var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([150, 0])
        .html(d => `<strong>Danceability: </strong><span class='details'>${d.danceability}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;&emsp;Key: </strong><span class='details'>${d.key}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;Energy: </strong><span class='details'>${d.energy}<br></span>
        <strong>Loudness: </strong><span class='details'>${d.loudness}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;Acousticness: </strong><span class='details'>${d.acousticness}</span>
        <strong>&emsp;&emsp;Speechiness: </strong><span class='details'>${d.speechiness}<br></span>
        <strong>Instrumentalness: </strong><span class='details'>${d.instrumentalness}</span>
        <strong>&nbsp;&nbsp;&emsp;&ensp;Tempo: </strong><span class='details'>${d.tempo}</span>
        <strong>&emsp;&emsp;&emsp;Liveness: </strong><span class='details'>${d.liveness}<br></span>
        <strong>Musical Valence: </strong><span class='details'>${d.valence}</span>
        <strong>&emsp;&emsp;Lyrical Valence: </strong><span class='details'>${d.lyrical_valence}<br></span>`);
         // Add the points!
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", function(d) {return xScale(d.pca1);})
        .attr("cy", function(d) {return yScale(d.pca2);})
        .attr("r",4)
        .attr("fill", function(d) {if (d.song == seedSong){return "#01665e"}
            if (songList.includes(d.song)) {return "#8c510a"}
            else {return "#c7eae5"}})
        .attr("r", function(d) {if (d.song == seedSong){return 12}
            if (songList.includes(d.song)) {return 6}
            else {return 4}})
        .call(tip)
        .call(tip2)
        .on('mouseover',function(d){
            tip.show(d);
            tip2.show(d);
            })
        .on('mouseout', function(d){
            tip.hide(d);
            tip2.hide(d);
            })
    //add seed song legend
    svg.append("circle")
        .attr("cx",20)
        .attr("cy",360)
        .attr("r", 12)
        .style("fill", "#01665e")
        .append("text")
        .attr("dx", function(d){return -20})
    svg.append("text")
        .attr("x", 40)
        .attr("y", 362)
        .text("'" + seedSong + "'")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
    //add rec songs legend
    svg.append("circle")
        .attr("cx",290)
        .attr("cy",360)
        .attr("r", 6)
        .style("fill", "#8c510a");
    svg.append("text")
        .attr("x", 300)
        .attr("y", 362)
        .text("Recommended Songs")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
    // add title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -15)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight","500")
        .text("What Songs are Similar to '" + seedSong + "' by " + seedArtist + "?")
    });
}
function updateGraph(){d3.json('/getMyJson').then(function(data){
    data.forEach(function(d){
        d.artist= d.artist;
        d.song= d.song_name;
        d.danceability= d.danceability;
        d.energy= d.energy;
        d.key= d.key;
        d.loudness= d.loudness;
        d.speechiness= d.speechiness;
        d.acousticness= d.acousticness;
        d.instrumentalness= d.instrumentalness;
        d.liveness= d.liveness;
        d.valence= d.valence;
        d.tempo= d.tempo;
        d.lyrical_valence=d.lyrical_valence;
        d.pca1= +d.pca1;
        d.pca2= +d.pca2;
});
    var seedSong = data[0]['song'];
    var seedArtist = data[0]['artist'];
    recs = data.slice(1, 21);
    songList = [];
    for (i in recs) songList.push(recs[i]["song"]);
    // Compute the scales' domains.
    xScale.domain(d3.extent(data, function(d) { return d.pca1; })).nice();
    yScale.domain(d3.extent(data, function(d) { return d.pca2; })).nice();
    const xaxis = d3.axisBottom()
        .scale(xScale);
    const yaxis = d3.axisLeft()
        .scale(yScale);
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yaxis)
    // Add the tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-30, 0])
        .html(d => `<strong>Song: </strong><span class='details'>${d.song}<br></span>
        <strong>Artist: </strong><span class='details'>${d.artist}<br></span>`)
    // Add the tooltip
    var tip2 = d3.tip()
        .attr('class', 'd3-tip')
        .offset([150, 0])
        .html(d => `<strong>Danceability: </strong><span class='details'>${d.danceability}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;&emsp;Key: </strong><span class='details'>${d.key}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;Energy: </strong><span class='details'>${d.energy}<br></span>
        <strong>Loudness: </strong><span class='details'>${d.loudness}</span>
        <strong>&emsp;&emsp;&emsp;&emsp;Acousticness: </strong><span class='details'>${d.acousticness}</span>
        <strong>&emsp;&emsp;Speechiness: </strong><span class='details'>${d.speechiness}<br></span>
        <strong>Instrumentalness: </strong><span class='details'>${d.instrumentalness}</span>
        <strong>&nbsp;&nbsp;&emsp;&ensp;Tempo: </strong><span class='details'>${d.tempo}</span>
        <strong>&emsp;&emsp;&emsp;Liveness: </strong><span class='details'>${d.liveness}<br></span>
        <strong>Musical Valence: </strong><span class='details'>${d.valence}</span>
        <strong>&emsp;&emsp;Lyrical Valence: </strong><span class='details'>${d.lyrical_valence}<br></span>`);
    // Add the points!
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", function(d) {return xScale(d.pca1);})
        .attr("cy", function(d) {return yScale(d.pca2);})
        .attr("r",4)
        .attr("fill", function(d) {if (d.song == seedSong){return "#01665e"}
            if (songList.includes(d.song)) {return "#8c510a"}
            else {return "#c7eae5"}})
        .attr("r", function(d) {if (d.song == seedSong){return 12}
            if (songList.includes(d.song)) {return 6}
            else {return 4}})
        .call(tip)
        .call(tip2)
        .on('mouseover',function(d){
            tip.show(d);
            tip2.show(d);
            })
        .on('mouseout', function(d){
            tip.hide(d);
            tip2.hide(d);
            })
    if (seedSong.length > 20) {seedSongTitle = seedSong.slice(0,20) + "..."}
        else {seedSongTitle = seedSong}
    if (seedArtist.length > 20) {seedArtistTitle = seedArtist.slice(0,20) + "..."}
        else {seedArtistTitle = seedArtist}
    //add seed song legend
    svg.append("circle")
        .attr("cx",20)
        .attr("cy",360)
        .attr("r", 12)
        .style("fill", "#01665e")
        .append("text")
        .attr("dx", function(d){return -20})
    svg.append("text")
        .attr("x", 40)
        .attr("y", 360)
        .text("'" + seedSongTitle + "'")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
    //add rec songs legend
    svg.append("circle")
        .attr("cx",290)
        .attr("cy",360)
        .attr("r", 6)
        .style("fill", "#8c510a");
    svg.append("text")
        .attr("x", 300)
        .attr("y", 362)
        .text("Recommended Songs")
        .style("font-size", "15px")
        .attr("alignment-baseline","middle");
    // add title
    svg.append("text")
        .attr("x", width/2)
        .attr("y", -15)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight","500")
        .text("What Songs are Similar to '" + seedSongTitle + "' by " + seedArtistTitle + "?")
});};
    function remove(){
        var svg = d3.select("svg");
        input = document.getElementById("autocomplete")
        if(input.value.indexOf("|")!=-1){
        svg.selectAll("*").remove();
        var elements = document.getElementsByTagName("iframe");
        while (elements.length) {
            elements[0].parentNode.removeChild(elements[0]);
          };}
    };