function plotHeatMap(xValues, yValues, zValues, ratios, scores, lang) {
    var colorscaleValue = [ // ultramarine blue '#0d407f'  // buttons bg green '#7dae3e'
      [0, '#0C7BDC'],   // profile B
      [0.5, '#eee'],
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
                    label += (lang == "en" ?
                    "Profile A and B destroy the same number of models per point"
                    :
                    "Les Profils A et B détruisent un nombre équivalent de figurines par point");
                }
                else if (zValues[i][j] > 0){
                    label += (lang == "en" ? "Profile A destroys" : "Le Profil A détruit") + " <b>" + ratio + "</b> " + (lang == "en" ? "times more models per point than profile B" : "fois plus de figurines par point que le Profil B");
                } else {
                    label += (lang == "en" ? "Profile B destroys" : "Le Profil B détruit") + " <b>" + ratio + "</b> " + (lang == "en" ? "times more models per point than profile A" : "fois plus de figurines par point que le Profil A");
                }
                label += "<br><br>" + (lang == "en" ? "Profile A details:" : "Détails du Profil A:")
                for (var ia = 0; ia < scores[i][j][0].length; ia++) {
                    label += "<br> - " + (lang == "en" ? "weapon" : "l'arme") + " #" + (ia + 1) + (lang == "en" ? " destroys" : " détruit") + " <b>" + scores[i][j][0][ia] + "</b> " + (lang == "en" ? "models per phase" : "figurines par phase");
                }
                label += "<br><br>" + (lang == "en" ? "Profile B details:" : "Détails du Profil B:")
                for (var ib = 0; ib < scores[i][j][1].length; ib++) {
                    label += "<br> - " + (lang == "en" ? "weapon" : "l'arme") + " #" + (ib + 1) + (lang == "en" ? " destroys" : " détruit") + " <b>" + scores[i][j][1][ib] + "</b> " + (lang == "en" ? "models per phase" : "figurines par phase");
                }
            } else {
                label += (lang == "en" ? "<i>Not a common target profile</i>" : "N'est pas un profil de cible courant")
            }
            line.push(label)
        }
        labels.push(line);
    }

    const withBlast = yValues[0].includes("unit size");

    if (lang == "fr") {
        for (var i = 0; i < yValues.length; i++) {
            yValues[i] = yValues[i]
                .replace("T", "E")
                .replace("W", "PV")
                .replace("unit size", "taille unité")
                .replace("to", "à");
        }
    }

    var marginL = 250;

    var data = [{
      name: "",
      x: xValues,
      y: yValues,
      z: zValues,
      type: 'heatmap',
      text: labels,
      hovertemplate: (lang == "en" ? "Against target profile": "Contre le profil cible") + ": %{x}, %{y}<br>%{text}",
      colorscale: colorscaleValue,
      showscale: false,
      zmin: -1,
      zmax: 1,
      zauto: false
    }];

    var layout = {
      title:{
          y : 0.0015,
          yanchor : "bottom",
          text: "Generated using adeptus-optimus.web.app",
      },
      titlefont: {
          size: 13,
          color: '#fff'
      },
      font: {
        color: '#fff'
      },
      plot_bgcolor: '#202020',
      paper_bgcolor : '#202020',
      annotations: [""],
      xaxis: {
        ticks: '',
        side: 'top',
        title: (lang == "en" ?
        "Compares the average number of models destroyed per point<br>against many target units profiles"
        :
        "Compare le nombre moyen de figurines détruites par point<br>sur de nombreux profils cibles"),
        anchor: "free",
        position: 0.999,
        automargin: true,
        font: {size: 50}
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
        l: marginL
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

