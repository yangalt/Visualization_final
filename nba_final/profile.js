let margin = { top: 20, right: 30, bottom: 40, left: 40 };
let p_width = 600 - margin.left - margin.right;
let p_height = 800 - margin.top - margin.bottom;
let playerSearchInput_pr = document.getElementById('playerSearch');
let player_pr = playerSearchInput_pr.value;
let x = 280;
let t = 50;


d3.csv('https://raw.githubusercontent.com/yangalt/Visualization_final/main/2022-2023.csv').then((data) => {
  //console.log(data);
  let playerattr = ['RK', 'Player', 'Pos', 'Age', 'Tm', 'MP', 'FG%', '3P%', 'FT%', 'TRB', 'AST', 'STL', 'BLK', 'PTS'];
  let num = [0,1,2,3,4,7,10,13,20,23,24,25,26,29];
  let playerName = player_pr;
  
  var svg = d3.select("#player-profile")
  .append("svg")
  .attr("width", p_width)
  .attr("height", p_height);
  
  
  var findplayer = data.find((p) => p.Player === playerName);
  //console.log(findplayer);
  var playerArray = Object.values(findplayer);
  console.log(playerArray);
  

  let ur = "https://github.com/yangalt/Visualization_final/blob/main/image/"+ playerArray[4]+ ".jpg?raw=true";
  console.log(ur);

  var photo = svg.append("image").style("position", "absolute")
    .attr("href", ur)
    .attr("x", 50)
    .attr("y", 300);

  var a = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 30+t)
  .text("Player: " + playerArray[1])
  .style("font-size", "18px");
  
  var b = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 70+t)
  .text("Position: " + playerArray[2])
  .style("font-size", "18px");
  
  var c = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 110+t)
  .text("Age: " + playerArray[3])
  .style("font-size", "18px");
  
  var d = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 150+t)
  .text("Team: " + playerArray[4])
  .style("font-size", "18px");
  
  var e = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 190+t)
  .text("MP: " + playerArray[7])
  .style("font-size", "18px");
  
  var f = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 230+t)
  .text("FG%: " + (playerArray[10]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  var g = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 270+t)
  .text("3P%: " + (playerArray[13]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  var h = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 310+t)
  .text("FT%: " + (playerArray[20]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  var i = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 350+t)
  .text("REB: " + playerArray[23])
  .style("font-size", "18px");
  
  var j = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 390+t)
  .text("AST: " + playerArray[24])
  .style("font-size", "18px");
  
  var k = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 430+t)
  .text("STL: " + playerArray[25])
  .style("font-size", "18px");
  
  var l = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 470+t)
  .text("BLK: " + playerArray[26])
  .style("font-size", "18px");
  
  var m = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 510+t)
  .text("PTS: " + playerArray[29])
  .style("font-size", "18px");
  
  /*var table = d3.select("#player-profile").append("table");

  // Add table header
  table.append("thead")
    .append("tr")
    .selectAll("th")
    .data(playerattr)
    .enter().append("th")
    .text(function(d) { return d; });*/
  
  document.getElementById('playerSearch').addEventListener('change', function () {
    player_pr = this.value;
    playerName = player_pr;
    findplayer = data.find((p) => p.Player === playerName);
    //console.log(findplayer);
    playerArray = Object.values(findplayer);
    console.log(playerArray);

    photo.remove();
    a.remove();
    b.remove();
    c.remove();
    d.remove();
    e.remove();
    f.remove();
    g.remove();
    h.remove();
    i.remove();
    j.remove();
    k.remove();
    l.remove();
    m.remove();
    
  
  ur = "https://github.com/yangalt/Visualization_final/blob/main/image/"+ playerArray[4]+ ".jpg?raw=true";
  photo = svg.append("image")
    .attr("href", ur)
    .attr("x", 50)
    .attr("y", 300);

  a = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 30+t)
  .text("Player: " + playerArray[1])
  .style("font-size", "18px");
  
  b = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 70+t)
  .text("Position: " + playerArray[2])
  .style("font-size", "18px");
  
  c = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 110+t)
  .text("Age: " + playerArray[3])
  .style("font-size", "18px");
  
  d = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 150+t)
  .text("Team: " + playerArray[4])
  .style("font-size", "18px");
  
e = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 190+t)
  .text("MP: " + playerArray[7])
  .style("font-size", "18px");
  
  f = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 230+t)
  .text("FG%: " + (playerArray[10]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  g = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 270+t)
  .text("3P%: " + (playerArray[13]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  h = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 310+t)
  .text("FT%: " + (playerArray[20]*100).toFixed(1) + "%")
  .style("font-size", "18px");
  
  i = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 350+t)
  .text("REB: " + playerArray[23])
  .style("font-size", "18px");
  
  j = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 390+t)
  .text("AST: " + playerArray[24])
  .style("font-size", "18px");
  
  k = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 430+t)
  .text("STL: " + playerArray[25])
  .style("font-size", "18px");
  
  l = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 470+t)
  .text("BLK: " + playerArray[26])
  .style("font-size", "18px");
  
  m = svg.selectAll(".player-info").data(data).enter().append("text")
  //.attr("class", "player-info")
  .attr("x", x)
  .attr("y", 510+t)
  .text("PTS: " + playerArray[29])
  .style("font-size", "18px");
      
  });
  
  
})