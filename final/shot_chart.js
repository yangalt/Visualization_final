const playerSearchInput = document.getElementById('playerSearch');
let player = playerSearchInput.value;
const width = 500;
const height = 470;

// 創建 SVG 容器
const bg = d3.select('#bg-container').append('g');
bg.append("rect")
  .attr('width', width)
  .attr('height', height)
  .attr("class", "bg");
const svg = d3.select('#layer').append('g')
  .attr('width', width)
  .attr('height', height);
const legend = d3.select('#container').append('svg')
  .attr('width', 300)
  .attr('height', height);

// 設定顏色尺度
const colors = d3.scaleSequential(d3.interpolateRdYlBu).domain([0.09, -0.09]);

d3.csv("https://raw.githubusercontent.com/yangalt/Visualization_final/main/all_shots_league_player_percent.csv").then(function (data) {
  data.forEach(d => {
    d.x = +d["LOC_X"];
    d.y = +d["LOC_Y"];
    d['PERIOD'] = +d["PERIOD"];
    d['SHOT_MADE_FLAG'] = +d["SHOT_MADE_FLAG"];
    d['SHOT_DISTANCE'] = +d["SHOT_DISTANCE"];
    d['FG_PCT'] = +d['FG_PCT'];
    d['LG_FG_PCT'] = +d['LG_FG_PCT'];
    d['Home'] = +d['Home'];
    d['QUARTER_FG_PCT'] = +d['QUARTER_FG_PCT'];
    d['HOME_FG_PCT'] = +d['HOME_FG_PCT'];
  });
  document.getElementById('playerSearch').addEventListener('change', function () {
    player = this.value;
    console.log(player); // 在控制台輸出球員姓名
    updateData();
  });
  let selectedLocation = "All";
  const quarterDropdown = document.getElementById("quarterDropdown");

  quarterDropdown.addEventListener("change", function () {
    var selectedQuarter = quarterDropdown.value;
    selectedLocation = selectedQuarter;
    updateData();
  });

  document.getElementById("locationQuarterDropdown").addEventListener("change", function () {
    selectedLocation = this.value;
    updateData();
  });

  document.getElementById("dropdownMenu").addEventListener("change", function () {
    if (this.value === "Location") {
      selectedLocation = "All";
    } else if (this.value === "Quarter") {
      selectedLocation = "1";
    }
    console.log(selectedLocation)
    updateData();
  });

  const filteredData = filterData(data, selectedLocation);
  console.log(filteredData)

  function updateData() {
    const updatedData = filterData(data, selectedLocation);
    plot.data(updatedData);
    svg.call(plot);
  }

  function filterData(originalData, location) {
    if (location === "All" || location === "Home" || location === "Road") {
      return originalData.filter(d => {
        return d.PLAYER_NAME === playerSearchInput.value &&
          ((location === "All") ||
            (location === "Home" && d.Home === 1) ||
            (location === "Road" && d.Home === 0));
      }).map(d => {
        if (location === "Home" || location === "Road") {
          d['FG_PCT'] = +d['HOME_FG_PCT'];
        }
        return d;
      });
    } else {
      return originalData.filter(d => {
        return d.PLAYER_NAME === playerSearchInput.value &&
          d['PERIOD'] === +location;
      }).map(d => {
        d['FG_PCT'] = +d['QUARTER_FG_PCT'];
        return d;
      });
    }
  }

  const plot = hexMap(d3, d3.hexbin(), colors)
    .width(width)
    .height(height)
    .data(filteredData)
    .xValue((d) => d["LOC_X"])
    .yValue((d) => d["LOC_Y"])
    .margin({ top: 20, right: 20, bottom: 40, left: 50 });

  const leg = legendChart(d3, d3.hexbin(), colors)
    .width(300)
    .height(height)
    .player(player);

  svg.call(plot);
  legend.call(leg);
});

const hexMap = (d3, hexbin, colors) => {
  let width;
  let height;
  let data;
  let xValue;
  let yValue;
  let margin;

  const plot = (selection) => {
    const xScale = d3.scaleLinear()
      .domain([-250, 250])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([-50, 420])
      .range([0, height]);
    const hex = hexbin
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .radius(15);

    selection.selectAll(".hex").remove();

    selection.selectAll("path")
      .data(hexbin(data))
      .enter().append("path")
      .attr("d", d => `M${d.x},${d.y}${hexbin.hexagon(d.length > 30 ? 15 : d.length > 10 ? 10 : d.length >= 2 ? 5 : 0)}`)
      .attr("fill", d => colors(d[0]["FG_PCT"] - d[0]["LG_FG_PCT"]))
      .attr("class", "hex");
  };

  plot.width = (_ = width) => (width = +_, plot);
  plot.height = (_ = height) => (height = +_, plot);
  plot.data = (_ = data) => (data = _, plot);
  plot.xValue = (_ = xValue) => (xValue = _, plot);
  plot.yValue = (_ = yValue) => (yValue = _, plot);
  plot.margin = (_ = margin) => (margin = _, plot);

  return plot;
};

const legendChart = (d3, hexbin, colors) => {
  let width;
  let height;
  let player;

  const chart = (selection) => {
    const legendData = [
      { label: "Frequency", hexSize: 5 },
      { label: "Frequency", hexSize: 10 },
      { label: "Frequency", hexSize: 15 },
      { label: "FG% vs League Avg", value: -9 },
      { label: "FG% vs League Avg", value: -6 },
      { label: "FG% vs League Avg", value: -3 },
      { label: "FG% vs League Avg", value: 0 },
      { label: "FG% vs League Avg", value: 3 },
      { label: "FG% vs League Avg", value: 6 },
      { label: "FG% vs League Avg", value: 9 },
    ];

    selection.append("text")
      .attr("transform", `translate(${5},${70})`)
      .attr("class", "legend-title")
      .attr("fill", "black")
      .style("font-size", "16px")
      .text("Frequency");

    selection.append("text")
      .attr("transform", `translate(${139},${70})`)
      .attr("class", "legend-title")
      .style("font-size", "16px")
      .text("FG% vs League Avg")
      .attr("fill", "black");

    selection.selectAll("path.legend-hex")
      .data(legendData.filter(d => d.label === "Frequency"))
      .enter().append("path")
      .attr("transform", (d, i) => `translate(${i * 25 + 10},${35})`)
      .attr("d", d => hexbin.hexagon(d.hexSize))
      .attr("fill", "black");

    selection.selectAll("text.percent-text")
      .data(legendData.filter(d => d.label === "FG% vs League Avg"))
      .enter().append("text")
      .attr("transform", (d, i) => `translate(${i * 19 + 141},${20})`)
      .attr("class", "percent-text")
      .text(d => d.value)
      .attr("fill", "black");

    selection.selectAll("path.percent-hex")
      .data(legendData.filter(d => d.label === "FG% vs League Avg"))
      .enter().append("path")
      .attr("transform", (d, i) => `translate(${i * 19 + 150},${35})`)
      .attr("d", d => hexbin.hexagon(10))
      .attr("fill", d => colors(d.value * 0.01));

    selection.append("text")
      .attr("class", "player")
      .attr("transform", `translate(${55},${115})`)
      .text(`${player}`)
      .style("font-size", "20px")
      .attr("fill", "black");

  };

  chart.width = (_ = width) => (width = +_, chart);
  chart.height = (_ = height) => (height = +_, chart);
  chart.player = (_ = player) => (player = _, chart);

  return chart;
};
