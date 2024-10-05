var _map = require("users/irtharles/gpw-view-tool:map.js");
var layers = require("users/irtharles/gpw-view-tool:layers.js");

// Carregar as camadas
var LAYERS = layers.LAYERS;

/**
 * Cria o painel de controle com as opções do app.
 * @param {ui.Map} map O mapa para adicionar as camadas.
 * @return {ui.Panel} O painel de controle.
 */
exports.createControlPanel = function (map) {
  // Criar widget
  var logo = ee.Image("projects/ee-vieiramesquita/assets/logos/Lapig_logo");

  var branding = ui.Thumbnail({
    image: logo,
    params: { bands: ["b1", "b2", "b3"], min: 0, max: 255 },
    style: {
      margin: "10px 0px 0px 20%",
    },
  });

  var labelAppTittle = ui.Label(
    "Global Pasture Watch Comparison Toolkit (GPW-CT) by LAPIG"
  );
  labelAppTittle.style().set({
    fontSize: "100",
    fontWeight: "bold",
    textAlign: "center",
    padding: "0px 0px 25px 5%",
  });

  var labelTop = ui.Label("Datasets:");
  labelTop.style().set({
    fontSize: "30",
    fontWeight: "bold",
    textAlign: "left",
    padding: "5px 0px 0px 0%",
  });

  // Criar checkboxes e sliders dinamicamente para cada camada
  var layerPanels = [];

  LAYERS.forEach(function (layer, index) {
    // Create a checkbox for the layer
    var checkbox = ui.Checkbox(layer.layerName, layer.visible);
    checkbox.onChange(function (checked) {
      map.layers().get(index).setShown(checked);
    });

    // Create a slider to control the opacity
    var slider = ui.Slider({
      min: 0,
      max: 100,
      value: 100,
      step: 10,
      onChange: function (value) {
        var opacity = value / 100.0;
        map.layers().get(index).setOpacity(opacity);
      },
      style: { width: "150px" },
    });

    // Create a panel for the checkbox with horizontal stretching
    var checkboxPanel = ui.Panel({
      widgets: [checkbox],
      style: { stretch: "horizontal" },
    });

    // Create a panel for the slider to keep it aligned to the right
    var sliderPanel = ui.Panel({
      widgets: [slider],
      style: {},
    });

    // Create a layer panel to contain the checkbox and slider panels
    var layerPanel = ui.Panel({
      widgets: [checkboxPanel, sliderPanel],
      layout: ui.Panel.Layout.Flow("horizontal"),
      style: { width: "100%" },
    });

    layerPanels.push(layerPanel);
  });

  // Criar painel para as regiões de exemplo
  var labelRegion = ui.Label("Example regions:", {
    fontSize: "25",
    fontWeight: "bold",
    textAlign: "left",
    padding: "5px 0px 0px 0%",
  });

  var select_regions = ui.Select({
    items: Object.keys(_map.core_regions),
    value: "Cocalinho, Mato Grosso, Brazil",
  });

  select_regions.style().set({
    width: "95%",
  });

  var button_region = ui.Button({
    label: "CENTER TO REGION",
    style: {
      width: "95%",
    },
    onClick: function () {
      var coords = _map.core_regions[select_regions.getValue()];
      map.setCenter(coords[0], coords[1], coords[2]);
    },
  });

  var region_Panel = ui.Panel([labelRegion, select_regions, button_region]);
  region_Panel.style().set({
    width: "100%",
  });
  // Criar o painel principal
  var MainPanel = ui.Panel(
    [branding, labelAppTittle, region_Panel, labelTop].concat(layerPanels),
    ui.Panel.Layout.Flow("vertical"),
    {
      width: "22%",
      position: "top-right",
    }
  );

  return MainPanel;
};

/**
 * Cria a legenda para uma determinada camada.
 * @param {string} title O título da legenda.
 * @param {Array} palette A paleta de cores da legenda.
 * @param {Array} names Os nomes das classes da legenda.
 * @return {ui.Panel} O painel da legenda.
 */
exports.createLegend = function (title, palette, names) {
  var legend = ui.Panel({
    style: {
      position: "bottom-right",
      padding: "8px 15px",
    },
  });

  var legendTitle = ui.Label({
    value: title,
    style: {
      fontWeight: "bold",
      fontSize: "14px",
      margin: "0 0 4px 0",
      padding: "0",
    },
  });

  legend.add(legendTitle);

  for (var i = 0; i < names.length; i++) {
    legend.add(makeRow(palette[i], names[i]));
  }

  return legend;
};

/**
 * Cria uma linha da legenda.
 * @param {string} color A cor da linha.
 * @param {string} name O nome da classe.
 * @return {ui.Panel} O painel da linha da legenda.
 */
var makeRow = function (color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: "8px",
      margin: "0 0 4px 0",
    },
  });

  var description = ui.Label({
    value: name,
    style: { margin: "0 0 4px 6px" },
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow("horizontal"),
  });
};

/**
 * Cria um painel com as legendas.
 * @param {Array} legends Um array de painéis de legenda.
 * @return {ui.Panel} O painel com as legendas.
 */
exports.createLegendPanel = function (legends) {
  return ui.Panel({
    widgets: legends,
    layout: ui.Panel.Layout.Flow("vertical"),
  });
};

/**
 * Cria um painel com o mapa e o painel de controle.
 * @param {ui.Map} map O mapa.
 * @param {ui.Panel} panel O painel de controle.
 * @return {ui.Panel} O painel com o mapa e o painel de controle.
 */
exports.createMapGrid = function (map, panel) {
  // Configurar estilos do painel do mapa
  map.style().set({
    stretch: "both",
    height: "500px", // Definir um tamanho fixo para o mapa
    width: "100%",
  });

  // Configurar estilos do painel de controle
  panel.style().set({
    stretch: "both",
    overflow: "auto", // Permitir rolagem apenas no painel de controle
    width: "400px", // Definir um tamanho adequado para o painel de controle
  });

  return ui.Panel([map, panel], ui.Panel.Layout.Flow("horizontal"), {
    stretch: "both",
    height: "100%",
    width: "100%",
  });
};
