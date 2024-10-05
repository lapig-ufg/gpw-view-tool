// Importar funções de outros arquivos
var customUi = require("users/irtharles/gpw-view-tool:ui.js");
var map = require("users/irtharles/gpw-view-tool:map.js");
var layers = require("users/irtharles/gpw-view-tool:layers.js");

// Carregar as imagens
var LAYERS = layers.LAYERS;

/**
 * Adiciona as camadas ao mapa.
 * @param {ui.Map} mapLayer - O mapa onde as camadas serão adicionadas.
 */
function addLayersToMap(mapLayer) {
  LAYERS.forEach(function (layer) {
    mapLayer.addLayer(
      layer.imagem,
      {
        palette: layer.palette,
        bands: layer.bands.length > 0 ? layer.bands : null,
      },
      layer.layerName,
      layer.visible
    );
  });
}

/**
 * Cria um painel de inspeção que mostra o nome das classes ao clicar no mapa.
 * @param {ui.Map} mapLayer - O mapa no qual configurar o evento de clique.
 */
function createInspector(mapLayer) {
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
    
    mapLayer.layers().set(
      4,
      ui.Map.Layer(point, { color: "blue" }, "Selected Point")
    );

    LAYERS.forEach(function (layer, index) {
      var sample = layer.imagem.sample(point, 30);
      var value = sample.first().get(layer.bands[0] || "default_band");

      value.evaluate(function (result) {
        print(result);
        var className = layer.imagemDictDataset[result] || "Unknown";
        inspector.widgets().set(
          index + 1,
          ui.Label({
            value: layer.layerName + ": " + className,
            style: { color: "black" },
          })
        );
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
 * Cria o painel de histogramas que será adicionado ao rodapé da página.
 * @return {ui.Panel} O painel de histogramas.
 */
function createHistogramPanel() {
  var histogramPanel = ui.Panel({
    layout: ui.Panel.Layout.Flow('vertical'),
    style: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  });

  histogramPanel.add(ui.Label('Histogram Panel', { 
    fontSize: '20px', 
    fontWeight: 'bold', 
    textAlign: 'center' 
  }));

  return histogramPanel;
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

  // Adicionar painel ao layout do mapa
  var mapGrid = customUi.createMapGrid(mapLayer, mainPanel);

  // Criar o painel de histogramas
  var histogramPanel = createHistogramPanel();

  // Criar um painel principal que contém o mapGrid e o histogramPanel
  var mainContainer = ui.Panel({
    widgets: [mapGrid, histogramPanel],
    layout: ui.Panel.Layout.Flow('vertical'),
    style: {
      stretch: 'both',
      width: '100%',
      height: '100%',
    },
  });

  // Limpar o ui.root e adicionar o contêiner principal
  ui.root.clear();
  ui.root.add(mainContainer);

  // Adicionar o painel de inspeção ao mapa
  createInspector(mapLayer);
}

// Inicializar o app
initializeApp();
