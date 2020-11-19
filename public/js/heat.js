function plotComparatorChart(xValues, yValues, zValues, ratios, scores) {
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
            if (zValues[i][j] != null) {
                var ratio = ratios[i][j]
                if (ratio == 1.0) {
                    label += "Profile A and B should destroy the same number of models per point"
                }
                else if (zValues[i][j] > 0){
                    label += "Profile A should destroy <b>" + ratio + "</b> times more models per point than profile B";
                } else {
                    label += "Profile B should destroy <b>" + ratio + "</b> times more models per point than profile A";
                }
                label += "<br><br>Profile A details:"
                for (var ia = 0; ia < scores[i][j][0].length; ia++) {
                    label += "<br> - weapon #" + (ia + 1) + " should destroy <b>" + scores[i][j][0][ia] + "</b> models per phase";
                }
                label += "<br>Profile B details:"
                for (var ib = 0; ib < scores[i][j][1].length; ib++) {
                    label += "<br> - weapon #" + (ib + 1) + " should destroy <b>" + scores[i][j][1][ib] + "</b> models per phase";
                }
            } else {
                label += "<i>Not a common target profile</i>"
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
        title: "Compares A and B average number of models destroyed per point<br>against a large variety of target units defense profiles",
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
        t: 150,
        b: 15,
        l:185
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
          text: zValues[i][j] == null ? "x" : "",
          font: {
            family: 'Arial',
            size: 20,
          },
          showarrow: false,
          font: {
            color: 'grey'
          }
        };
        layout.annotations.push(result);
      }
    }
    Plotly.newPlot('chart', data, layout);
}

