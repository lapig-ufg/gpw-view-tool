var customUi = require("users/irtharles/gpw-view-tool:ui.js");
var map = require("users/irtharles/gpw-view-tool:map.js");
var layers = require("users/irtharles/gpw-view-tool:layers.js");

// Carregar as imagens
var LAYERS = layers.LAYERS;

/**
 * Cria um painel de inspeção que mostra o nome das classes ao clicar no mapa e adiciona histogramas.
 * @param {ui.Map} mapLayer - O mapa no qual configurar o evento de clique.
 * @param {ui.Panel} histogramPanel - O painel de histogramas onde os histogramas serão adicionados.
 */
function createInspector(mapLayer, histogramPanel) {
  var inspector = ui.Panel([ui.Label("Click to get class names")]);
  inspector.style().set({
    fontSize: "50",
    fontWeight: "bold",
    textAlign: "center",
    position: "top-left",
  });

  mapLayer.add(inspector);

  // Configurar evento de clique no mapa
  mapLayer.onClick(function (coords) {
    inspector.widgets().set(
      0,
      ui.Label({
        value: "Loading...",
        style: { color: "gray" },
      })
    );

    var point = ee.Geometry.Point(coords.lon, coords.lat);
    
    // Adicionar ponto selecionado ao mapa
    mapLayer.layers().set(
      4,
      ui.Map.Layer(point, { color: "blue" }, "Selected Point")
    );

    // Limpar o painel de histogramas antes de adicionar novos histogramas
    histogramPanel.clear();
    histogramPanel.add(ui.Label('Histogram Panel', { 
      fontSize: '20px', 
      fontWeight: 'bold', 
      textAlign: 'center' 
    }));

    // Iterar sobre cada camada para amostrar o ponto e gerar histogramas
    LAYERS.forEach(function (layer, index) {
      var sample = layer.imagem.sample(point, 30);
      var value = sample.first().get(layer.bands[0] || "default_band");

      value.evaluate(function (result) {
        var className = layer.imagemDictDataset[result] || "Unknown";
        inspector.widgets().set(
          index + 1,
          ui.Label({
            value: layer.layerName + ": " + className,
            style: { color: "black" },
          })
        );
      });

      // Criar histogramas para as camadas no ponto selecionado
      var region = point.buffer(100); // Buffer de 100 metros para gerar um histograma mais representativo
      var histogram = layer.imagem.reduceRegion({
        reducer: ee.Reducer.histogram(),
        geometry: region,
        scale: 30,
        maxPixels: 1e8,
      });

      histogram.evaluate(function (histogramData) {
        if (histogramData && histogramData[layer.bands[0]]) {
          var hist = ui.Chart.array.values(
            histogramData[layer.bands[0]].histogram,
            0,
            histogramData[layer.bands[0]].bucketMeans
          ).setOptions({
            title: 'Histogram for ' + layer.layerName,
            hAxis: { title: 'Value' },
            vAxis: { title: 'Frequency' },
            series: {
              0: { color: 'blue' },
            },
          });

          histogramPanel.add(hist);
        } else {
          histogramPanel.add(ui.Label({
            value: 'No histogram data for ' + layer.layerName,
            style: { color: 'red' }
          }));
        }
      });
    });

    inspector.widgets().set(
      LAYERS.length + 1,
      ui.Label({
        value: "Coordinates: " + coords.lat + ", " + coords.lon,
      })
    );
  });

  return inspector;
}

/**
 * Inicializa o app.
 */
function initializeApp() {
  // Criar o mapa
  var mapLayer = map.createMap();

  // Adicionar camadas ao mapa
  addLayersToMap(mapLayer);

  // Criar o painel de controle
  var mainPanel = customUi.createControlPanel(mapLayer);

  // Criar e adicionar as legendas ao painel de controle
  var legends = LAYERS.map(function (layer) {
    return customUi.createLegend(
      layer.layerName,
      layer.palette,
      layer.classNames
    );
  });
  mainPanel.add(customUi.createLegendPanel(legends));

  // Criar o painel de histogramas
  var histogramPanel = createHistogramPanel();

  // Adicionar painel ao layout do mapa
  var mapGrid = customUi.createMapGrid(mapLayer, mainPanel, histogramPanel);

  // Limpar o ui.root e adicionar o contêiner principal
  ui.root.clear();
  ui.root.add(mapGrid);

  // Adicionar o painel de inspeção ao mapa
  createInspector(mapLayer, histogramPanel);
}

// Inicializar o app
initializeApp();
