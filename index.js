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
        print(result)
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
  ui.root.clear();
  ui.root.add(mapGrid);
  ui.root.setLayout(ui.Panel.Layout.Flow("vertical"));

  // Adicionar o painel de inspeção ao mapa
  createInspector(mapLayer);
  
}

// Inicializar o app
initializeApp();
