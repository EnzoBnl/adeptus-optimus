function plotComparatorChart(xValues, yValues, zValues, ratios, scores, callWhenDone) {
    var colorscaleValue = [ // ultramarine blue '#0d407f'  // buttons bg green '#7dae3e'
      [0, '#0C7BDC'],   // profile B
      [0.5, '#ffffff'],
      [1, '#DC3220']  // profile A
    ];

    var labels = [];
    for (i = 0; i < zValues.length; i++) {
       var line = [];
        for (j = 0; j < zValues[0].length; j++) {
            var label = "";
            var ratio = ratios[i][j]
            if (ratio == 1.0) {
                label += "Profile A and B should destroy the same number of models per point"
            }
            else if (zValues[i][j] > 0){
                label += "Profile A should destroy " + ratio + " times more models per point than profile B";
            } else {
                label += "Profile B should destroy " + ratio + " times more models per point than profile A";
            }
            label += "<br><br>Profile A details:"
            for (var ia = 0; ia < scores[i][j][0].length; ia++) {
                label += "<br>  weapon #" + (ia + 1) + " should destroy " + scores[i][j][0][ia] + " models per phase";
            }
            label += "<br>Profile B details:"
            for (var ib = 0; ib < scores[i][j][1].length; ib++) {
                label += "<br>  weapon #" + (ib + 1) + " should destroy " + scores[i][j][1][ib] + " models per phase";
            }
            line.push(label)
        }
        labels.push(line);
    }

    var data = [{
      name: "",
      x: xValues,
      y: yValues,
      z: zValues,
      type: 'heatmap',
      text: labels,
      hovertemplate: "Against defense profile: %{x}, %{y}<br>%{text}",
      colorscale: colorscaleValue,
      showscale: false,
      zmin: -1,
      zmax: 1,
      zauto: false
    }];

    var layout = {
      title:{
          "y" : 0.0015,
          "yanchor" : "bottom",
          "text": "Generated using adeptus-optimus.web.app"
      },
      titlefont: {
          size: 13
      },
      annotations: [""],
      xaxis: {
        ticks: '',
        side: 'top',
        title: "Comparison of the average number of models destroyed per point<br>over many different target's defense profiles",
        anchor: "free",
        position: 0.999,
        automargin: true
      },
      yaxis: {
        ticks: '',
        ticksuffix: ' ',
        autosize: true,
        title: ""
      },
      margin: {
        t: 130,
        b: 15,
        l:100
      },
      height: 2000,
    };

    for ( var i = 0; i < yValues.length; i++ ) {
      for ( var j = 0; j < xValues.length; j++ ) {
        var result = {
          xref: 'x1',
          yref: 'y1',
          x: xValues[j],
          y: yValues[i],
          text: "",
          font: {
            family: 'Arial',
            size: 14,
            color: 'rgb(50, 171, 96)'
          },
          showarrow: false,
          font: {
            color: 'white'
          }
        };
        layout.annotations.push(result);
      }
    }
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
    Plotly.newPlot('chart', data, layout);
    callWhenDone();
}

