/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 

let currentFilePath = "https://raw.githubusercontent.com/yangalt/Visualization_final/main/result_df_advanced.csv";
let leg = ["ALL", "Home", "Road"];
let features = ['PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV']
let legendTitle = "Location";

d3.csv("https://raw.githubusercontent.com/yangalt/Visualization_final/main/result_df_advanced.csv").then(function (data) {
    data.forEach(d => {
        d['GP'] = +d['GP'];
        d['PTS'] = +d['PTS'];
        d['REB'] = +d['REB'];
        d['AST'] = +d['AST'];
        d['STL'] = +d['STL'];
        d['BLK'] = +d['BLK'];
        d['TOV'] = +d['TOV'];
        d['NET_RATING'] = +d['NET_RATING'];
        d['OREB_PCT'] = +d['OREB_PCT'];
        d['DREB_PCT'] = +d['DREB_PCT'];
        d['USG_PCT'] = +d['USG_PCT'];
        d['TS_PCT'] = +d['TS_PCT'];
        d['AST_PCT'] = +d['AST_PCT'];

    });
    var filteredDatas = data.filter(d => d['PLAYER_NAME'] === 'Luka Doncic');
    //console.log(filteredDatas)

    const maxValues = {};
    features.forEach(feature => {
        maxValues[feature] = d3.max(data, d => d[feature]);
    });


    function normalize(value, feature) {
        const max = maxValues[feature];
        return value / max;
    }

    const normalized_data = data.map(d => {
        const normalizedEntry = { ...d };
        features.forEach(feature => {
            const normalizedValue = normalize(d[feature], feature);
            normalizedEntry[feature] = normalizedValue;
        });
        return normalizedEntry;
    });
    //console.log(normalized_data)

    var filteredData = normalized_data.filter(d => d['PLAYER_NAME'] === 'Luka Doncic');
    //console.log(filteredData)

    const radarChartData = filteredData.map(d => (
        features.map(feature => ({
            axis: feature,
            value: d[feature]
        }))
    ));

    //console.log(radarChartData);

    var margin = { top: 50, right: 100, bottom: 10, left: 100 },
        width = Math.min(700, window.innerWidth - 700) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 450);
    //console.log(data)
    ////////////////////////////////////////////////////////////// 
    //////////////////// Draw the Chart ////////////////////////// 
    ////////////////////////////////////////////////////////////// 

    var radarChartOptions = {
        w: width,
        h: height,
        margin: margin,
        maxValue: 1,
        levels: 5,
    };

    function RadarChart(id, data, options, filteredDatas, maxValues) {


        var colorInterpolator = d3.interpolateRainbow;

        var colorScale = d3.scaleOrdinal()
            .range(d3.schemeCategory10);

        var cfg = {
            w: 600,				//Width of the circle
            h: 600,				//Height of the circle
            margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
            levels: 3,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
            color: colorScale	//Color function
        };
        //console.log(data)

        //Put all of the options into a variable called cfg
        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
            }//for i
        }//if

        //If the supplied maxValue is smaller than the actual one, replace by the max in the data
        var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));

        var allAxis = (data[0].map(function (i, j) { return i.axis })),	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format('%'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        //Scale for the radius
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        /////////////////////////////////////////////////////////
        //////////// Create the container SVG and g /////////////
        /////////////////////////////////////////////////////////

        //Remove whatever chart with the same id/class was present before
        d3.select(id).select("svg").remove();

        //Initiate the radar chart SVG
        var svg = d3.select(id).append("svg")
            .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
            .attr("class", "radar" + id);
        //Append a g element		
        var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");



        /////////////////////////////////////////////////////////
        ////////// Glow filter for some extra pizzazz ///////////
        /////////////////////////////////////////////////////////

        //Filter for the outside glow
        var filter = g.append('defs').append('filter').attr('id', 'glow'),
            feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
            feMerge = filter.append('feMerge'),
            feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
            feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        /////////////////////////////////////////////////////////
        /////////////// Draw the Circular grid //////////////////
        /////////////////////////////////////////////////////////

        //Wrapper for the grid & axes
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function (d, i) { return radius / cfg.levels * d; })
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", cfg.opacityCircles)
            .style("filter", "url(#glow)");

        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", function (d) { return -d * radius / cfg.levels; })
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(function (d, i) { return maxValue * d / cfg.levels; });
        //console.log(maxValues)


        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");
        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
            .text(function (d) { return d + "(max): " + maxValues[d] })
            .call(wrap, cfg.wrapWidth);

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////

        //The radial line function
        var radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(function (d) { return rScale(d.value); })
            .angle(function (d, i) { return i * angleSlice; });

        if (cfg.roundStrokes) {
            radarLine.curve(d3.curveLinearClosed);
        }

        //Create a wrapper for the blobs	
        var blobWrapper = g.selectAll(".radarWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarWrapper");

        //Append the backgrounds	
        blobWrapper
            .append("path")
            .attr("class", "radarArea")
            .attr("d", function (d, i) { return radarLine(d); })
            .style("fill", function (d, i) { return cfg.color(i); })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function (d, i) {
                //Dim all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", 0.1);
                //Bring back the hovered over blob
                d3.select(this)
                    .transition().duration(200)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', function () {
                //Bring back all blobs
                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);
            });

        //Create the outlines	
        blobWrapper.append("path")
            .attr("class", "radarStroke")
            .attr("d", function (d, i) { return radarLine(d); })
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", function (d, i) { return cfg.color(i); })
            .style("fill", "none")
            .style("filter", "url(#glow)");

        //Append the circles
        blobWrapper.selectAll(".radarCircle")
            .data(function (d, i) { return d; })
            .enter().append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", function (d, i, j) { return cfg.color(j); })
            .style("fill-opacity", 0.8);

        /////////////////////////////////////////////////////////
        //////// Append invisible circles for tooltip ///////////
        /////////////////////////////////////////////////////////

        //Wrapper for the invisible circles on top
        var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
            .data(data)
            .enter().append("g")
            .attr("class", "radarCircleWrapper");

        //Append a set of invisible circles on top for the mouseover pop-up
        blobCircleWrapper.selectAll(".radarInvisibleCircle")
            .data(function (d, i) { return d; })
            .enter().append("circle")
            .attr("class", "radarInvisibleCircle")
            .attr("r", cfg.dotRadius * 1.5)
            .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
            .style("fill", "none")
            .style("pointer-events", "all");

        //Set up the small tooltip for when you hover over a circle
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        /////////////////////////////////////////////////////////
        /////////////////// Helper Function /////////////////////
        /////////////////////////////////////////////////////////

        //Taken from http://bl.ocks.org/mbostock/7555321
        //Wraps SVG text	
        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.4, // ems
                    y = text.attr("y"),
                    x = text.attr("x"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }//wrap	
        var legendContainer = d3.select(".legend-container");

        var radarChartContainer = d3.select(".radarChart");

        legendContainer.style("position", "absolute")
            .style("top", margin.top + "px")
            .style("left", radarChartOptions.w + 700 + "px");

        legendContainer.selectAll(".legend-title").remove();
        var legendTitleElement = legendContainer.insert("div", ":first-child")  // 在第一個子元素之前插入圖例標題
            .attr("class", "legend-title")
            .style("font-weight", "bold")  // 加粗
            .style("font-size", "30px")  // 加大
            .text(legendTitle);

        d3.select(".legend-container").selectAll(".legend-item").remove();
        var legend = legendContainer.selectAll(".legend-item")
            .data(leg)
            .enter().append("div")
            .attr("class", "legend-item");

        legend.append("div")
            .attr("class", "legend-color")
            .style("background-color", function (d, i) { return cfg.color(leg.indexOf(d)); });

        legend.append("div")
            .attr("class", "legend-text")
            .text(function (d) { return d; });

        legend.on("mouseover", function (legendItem, index) {
            // 選擇 tooltip，並更新其位置和內容
            var centerX = (cfg.w / 2 + 430);
            var centerY = (cfg.h / 2);

            // 更新 tooltip 的位置和內容
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(generateTooltipContent(index))
                .style("left", centerX + "px")
                .style("top", centerY + "px")
                .style("color", "black");

            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", function (d, i) {
                    return i === index ? 1 : 0.1;
                });

            d3.selectAll(".radarCircle")
                .transition().duration(200)
                .style("fill-opacity", function (d, i, j) {
                    return j === index ? 1 : 0.1;
                });

            d3.selectAll(".radarStroke")
                .transition().duration(200)
                .style("stroke-opacity", function (d, i) {
                    return i === index ? 1 : 0.1;
                });
        })
            .on("mouseout", function () {
                // 在 mouseout 時，隱藏 tooltip
                tooltip.transition().duration(200).style("opacity", 0);

                d3.selectAll(".radarArea")
                    .transition().duration(200)
                    .style("fill-opacity", cfg.opacityArea);

                d3.selectAll(".radarCircle")
                    .transition().duration(200)
                    .style("fill-opacity", 0.8);

                d3.selectAll(".radarStroke")
                    .transition().duration(200)
                    .style("stroke-opacity", 1);
            });

        // 生成 tooltip 內容的輔助函數
        function generateTooltipContent(index) {
            var content = "<strong style='color: black;'>" + legendTitle + " : " + leg[index] + "</strong><br>";
            features.forEach(function (feature) {
                content += "<span style='color: black;'>" + feature + ": " + filteredDatas[index][feature] + "</span><br>";
            });
            return content;
        }
    }
    // 獲取輸入框和顯示匹配球員名稱的元素
    var playerSearchInput = document.getElementById('playerSearch');
    var matchingPlayersContainer = document.getElementById('matchingPlayers');

    // 在輸入框內容發生變化時觸發的事件
    playerSearchInput.addEventListener('input', function (event) {
        var playerNamePrefix = event.target.value;
        var matchingPlayers = getMatchingPlayers(playerNamePrefix);
        matchingPlayersContainer.innerHTML = '';

        matchingPlayers.forEach(function (player) {
            var playerElement = document.createElement('div');
            playerElement.textContent = player;
            matchingPlayersContainer.appendChild(playerElement);
        });
        var searchValue = playerSearchInput.value;

        if (searchValue.trim()) {
        } else {
            matchingPlayersContainer.style.display = 'block';
        }
    });


    matchingPlayersContainer.addEventListener('click', function (event) {
        var selectedPlayer = event.target.textContent;
        playerSearchInput.value = selectedPlayer;
        updateRadarChart(selectedPlayer);
        var changeEvent = new Event('change');
        playerSearchInput.dispatchEvent(changeEvent);
        matchingPlayersContainer.style.display = 'none';
    });

    function getMatchingPlayers(prefix) {
        var uniquePlayers = new Set();

        data.forEach(d => {
            var playerName = d['PLAYER_NAME'];
            if (playerName.toLowerCase().includes(prefix.toLowerCase())) {
                uniquePlayers.add(playerName);
            }
        });

        return Array.from(uniquePlayers);
    }

    function updateRadarChart(playerName) {
        d3.csv(currentFilePath).then(function (data) {
            data.forEach(d => {
                d['GP'] = +d['GP'];
                d['PTS'] = +d['PTS'];
                d['REB'] = +d['REB'];
                d['AST'] = +d['AST'];
                d['STL'] = +d['STL'];
                d['BLK'] = +d['BLK'];
                d['TOV'] = +d['TOV'];
                d['NET_RATING'] = +d['NET_RATING'];
                d['OREB_PCT'] = +d['OREB_PCT'];
                d['DREB_PCT'] = +d['DREB_PCT'];
                d['USG_PCT'] = +d['USG_PCT'];
                d['TS_PCT'] = +d['TS_PCT'];
                d['AST_PCT'] = +d['AST_PCT'];

            });
            var selectedType = typeDropdown.node().value; // 添加這一行以確保 selectedType 被正確定義
            if (selectedType === 'Advanced') {
                data = data.filter(d => d['GP'] > 10);
            }
            const maxValues = {};
            features.forEach(feature => {
                maxValues[feature] = d3.max(data, d => d[feature]);
            });
            console.log(maxValues)

            function normalize(value, feature) {
                const max = maxValues[feature];
                return value / max;
            }

            const normalized_data = data.map(d => {
                const normalizedEntry = { ...d };
                features.forEach(feature => {
                    const normalizedValue = normalize(d[feature], feature);
                    normalizedEntry[feature] = normalizedValue;
                });
                return normalizedEntry;
            });
            //console.log(normalized_data)
            var filteredDatas = data.filter(d => d['PLAYER_NAME'] === playerName);
            console.log(filteredDatas)
            var filteredData = normalized_data.filter(d => d['PLAYER_NAME'] === playerName);

            const radarChartData = filteredData.map(d => (
                features.map(feature => ({
                    axis: feature,
                    value: d[feature]
                }))
            ));
            RadarChart(".radarChart", radarChartData, radarChartOptions, filteredDatas, maxValues);
        })
    }

    var dropdownMenu = d3.select("#dropdownMenu");
    var typeDropdown = d3.select("#typeDropdown");

    dropdownMenu.on("change", function () {
        var selectedOption = this.value;
        legendTitle = selectedOption;

        if (selectedOption === 'Location') {
            currentFilePath = "https://raw.githubusercontent.com/yangalt/Visualization_final/main/result_df_advanced.csv";
            leg = ["ALL", "Home", "Road"];
        } else if (selectedOption === 'Quarter') {
            currentFilePath = "https://raw.githubusercontent.com/yangalt/Visualization_final/main/quarters_advanced.csv";
            leg = ["1", "2", "3", "4"]
        }
        updateRadarChart(playerSearchInput.value);
    });

    typeDropdown.on("change", function () {
        var selectedType = this.value;

        if (selectedType === 'Traditional') {
            features = ['PTS', 'REB', 'AST', 'STL', 'BLK', 'TOV']
        } else if (selectedType === 'Advanced') {
            features = ['NET_RATING', 'OREB_PCT', 'DREB_PCT', 'USG_PCT', 'TS_PCT', 'AST_PCT']
        }
        updateRadarChart(playerSearchInput.value);
    });


    RadarChart(".radarChart", radarChartData, radarChartOptions, filteredDatas, maxValues);
});