// Importar funções de outros arquivos
var ui = require("users/irtharles/gpw-view-tool:ui.js");
var map = require("users/irtharles/gpw-view-tool:map.js");
var layers = require("users/irtharles/gpw-view-tool:layers.js");

// Carregar as imagens
var LAYERS = layers.LAYERS;

/**
 * Inicializa o app.
 */
function initializeApp() {
  // Criar o mapa
  var MapLayer = map.createMap();

  // Adicionar camadas ao mapa
  LAYERS.forEach(function (layer) {
    MapLayer.addLayer(
      layer.imagem,
      {
        palette: layer.palette,
        bands: layer.bands,
      },
      layer.layerName,
      layer.visible
    );
  });

  // Criar o painel de controle
  var MainPanel = ui.createControlPanel(MapLayer);

  // Criar as legendas
  var legends = LAYERS.map(function (layer) {
    return ui.createLegend(layer.layerName, layer.palette, layer.classNames);
  });

  // Adicionar legendas ao painel
  MainPanel.add(ui.createLegendPanel(legends));

  // Adicionar painéis ao mapa
  var mapGrid = ui.createMapGrid(MapLayer, MainPanel);
  ui.root.clear();
  ui.root.add(mapGrid);
  ui.root.setLayout(ui.Panel.Layout.Flow("vertical"));

  // Configurar evento de clique no mapa
  MapLayer.onClick(map.getValues);
}

// Inicializar o app
initializeApp();
