// Importar funções de outros arquivos
var ui = require("users/irtharles/gpw-view-tool:ui.js");
var map = require("users/irtharles/gpw-view-tool:map.js");
var data = require("users/irtharles/gpw-view-tool:data.js");

// Importar o pacote palettes
var palettes = require("users/gena/packages:palettes");
/**
 * Inicializa o app.
 */
function initializeApp() {
  // Criar o mapa
  var MapLayer = map.createMap();
  print(MapLayer)

  // Carregar as imagens
  var images = data.loadImages();

  // Adicionar camadas ao mapa
  MapLayer.addLayer(
    images.glcfcs_recode,
    { palette: palettes.colorbrewer.RdYlGn[11] },
    "GLC-FCS30D 2020",
    false
  );
  MapLayer.addLayer(
    images.GLCLU2020,
    { palette: palettes.colorbrewer.Spectral[11] },
    "GLAD LCLU 2020",
    false
  );
  MapLayer.addLayer(
    images.worldCover_v2,
    { bands: ["Map"] },
    "ESA WorldCover v2 2020",
    false
  );
  MapLayer.addLayer(
    images.gpw_2020,
    { palette: palettes.colorbrewer.YlOrBr[3] },
    "Global Pasture Watch 2020"
  );

  // Criar o painel de controle
  var MainPanel = ui.createControlPanel(MapLayer);

  // Criar as legendas
  var legend_gpw = ui.createLegend(
    "Global Pasture Watch",
    palettes.colorbrewer.YlOrBr[3],
    ["Cultivated grassland", "Natural/semi-natural grassland"]
  );
  var legend_esa = ui.createLegend(
    "ESA WorldCover v2",
    palettes.d3.category10,
    [
      "Tree cover",
      "Shrubland",
      "Grassland",
      "Cropland",
      "Built-up",
      "Bare / sparse vegetation",
      "Snow and ice",
      "Permanent water bodies",
      "Herbaceous wetland",
      "Mangroves",
      "Moss and lichen",
    ]
  );
  var legend_glad = ui.createLegend(
    "GLAD LCLU",
    palettes.colorbrewer.Spectral[11],
    [
      "Terra Firma - True desert",
      "Terra Firma - Semi-arid",
      "Terra Firma - Dense short vegetation",
      "Terra Firma - Tree cover",
      "Wetland - Salt pan",
      "Wetland - Sparse vegetation",
      "Wetland - Dense short vegetation",
      "Wetland - Tree cover",
      "Open surface water",
      "Snow/ice",
      "Cropland",
      "Built-up",
      "Ocean",
    ]
  );
  var legend_glcfcs = ui.createLegend(
    "GLC FCS",
    palettes.colorbrewer.RdYlGn[11],
    [
      "Rainfed cropland",
      "Herbaceous cover cropland",
      "Tree or shrub cover (Orchard) cropland",
      "Irrigated cropland",
      "Open evergreen broadleaved forest",
      "Closed evergreen broadleaved forest",
      "Open deciduous broadleaved forest (0.15<fc<0.4)",
      "Closed deciduous broadleaved forest (fc>0.4)",
      "Open evergreen needle-leaved forest (0.15< fc <0.4)",
      "Closed evergreen needle-leaved forest (fc >0.4)",
      "Open deciduous needle-leaved forest (0.15< fc <0.4)",
      "Closed deciduous needle-leaved forest (fc >0.4)",
      "Open mixed leaf forest (broadleaved and needle-leaved)",
      "Closed mixed leaf forest (broadleaved and needle-leaved)",
      "Shrubland",
      "Evergreen shrubland",
      "Deciduous shrubland",
      "Grassland",
      "Lichens and mosses",
      "Sparse vegetation (fc<0.15)",
      "Sparse shrubland (fc<0.15)",
      "Sparse herbaceous (fc<0.15)",
      "Swamp",
      "Marsh",
      "Flooded flat",
      "Saline",
      "Mangrove",
      "Salt marsh",
      "Tidal flat",
      "Impervious surfaces",
      "Bare areas",
      "Consolidated bare areas",
      "Unconsolidated bare areas",
      "Water body",
      "Permanent ice and snow",
      "Filled value",
    ]
  );

  // Adicionar legendas ao painel
  MainPanel.add(
    ui.createLegendPanel([legend_gpw, legend_esa, legend_glad, legend_glcfcs])
  );

  // Adicionar painéis ao mapa
  var mapGrid = ui.createMapGrid(MapLayer, MainPanel);
  ui.root.widgets().reset([mapGrid]);
  ui.root.setLayout(ui.Panel.Layout.Flow("vertical"));

  // Configurar evento de clique no mapa
  MapLayer.onClick(map.getValues);
}

initializeApp();
