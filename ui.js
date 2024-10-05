var _map = require("users/irtharles/gpw-view-tool:map.js");
var layers = require("users/irtharles/gpw-view-tool:layers.js");

// Carregar as camadas
var LAYERS = layers.LAYERS;

/**
 * Cria o painel de controle com as opções do app.
 * @param {ui.Map} map O mapa para adicionar as camadas.
 * @return {ui.Panel} O painel de controle.
 */
exports.createControlPanel = function(map) {
    // Criar widget
    var logo = ee.Image("projects/ee-vieiramesquita/assets/logos/Lapig_logo");
  
    var branding = ui.Thumbnail({
        image: logo,
        params: { bands: ['b1', 'b2', 'b3'], min: 0, max: 255 },
        style: {
            margin: '0px 0px 0px 25%',
            padding: '10px'
        }
    });

    var labelAppTittle = ui.Label('Global Pasture Watch Comparison Toolkit (GPW-CT) by LAPIG');
    labelAppTittle.style().set({
        fontSize: '100',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '0px 0px 25px 5%'
    });

    var labelTop = ui.Label('Datasets:');
    labelTop.style().set({
        fontSize: '25',
        textAlign: 'left',
        padding: '5px 0px 0px 0%'
    });

    // Criar checkboxes e sliders dinamicamente para cada camada
    var layerPanels = [];

    LAYERS.forEach(function(layer, index) {
        var checkbox = ui.Checkbox(layer.layerName, layer.visible);
        checkbox.onChange(function(checked) {
            map.layers().get(index).setShown(checked);
        });

        var slider = ui.Slider({
            min: 0,
            max: 100,
            value: 100,
            step: 10,
            onChange: function(value) {
                var opacity = value / 100.0;
                map.layers().get(index).setOpacity(opacity);
            },
            style: { width: '42%' }
        });

        // Criar painel para cada camada (checkbox + slider)
        var layerPanel = ui.Panel({
            widgets: [checkbox, slider],
            layout: ui.Panel.Layout.Flow('horizontal')
        });

        layerPanels.push(layerPanel);
    });

    // Criar painel para as regiões de exemplo
    var labelRegion = ui.Label('Example regions:');
    labelRegion.style().set({
        fontSize: '25',
        fontWeight: 'bold',
        textAlign: 'left',
        padding: '5px 0px 0px 0%'
    });

    var select_regions = ui.Select({
        items: Object.keys(_map.core_regions),
        value: 'Cocalinho, Mato Grosso, Brazil'
    });

    var button_region = ui.Button({
        label: 'Center to region',
        onClick: function() {
            var coords = _map.core_regions[select_regions.getValue()];
            map.setCenter(coords[0], coords[1], coords[2]);
        }
    });

    var region_Panel = ui.Panel([labelRegion, select_regions, button_region]);

    // Criar o painel principal
    var MainPanel = ui.Panel(
        [branding, labelAppTittle, region_Panel, labelTop].concat(layerPanels),
        ui.Panel.Layout.Flow('vertical'),
        {
            width: '25%',
            position: 'top-right'
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
exports.createLegend = function(title, palette, names) {
    var legend = ui.Panel({
        style: {
            position: 'bottom-right',
            padding: '8px 15px'
        }
    });

    var legendTitle = ui.Label({
        value: title,
        style: {
            fontWeight: 'bold',
            fontSize: '18px',
            margin: '0 0 4px 0',
            padding: '0'
        }
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
var makeRow = function(color, name) {
    var colorBox = ui.Label({
        style: {
            backgroundColor: color,
            padding: '8px',
            margin: '0 0 4px 0'
        }
    });

    var description = ui.Label({
        value: name,
        style: { margin: '0 0 4px 6px' }
    });

    return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
    });
};

/**
 * Cria um painel com as legendas.
 * @param {Array} legends Um array de painéis de legenda.
 * @return {ui.Panel} O painel com as legendas.
 */
exports.createLegendPanel = function(legends) {
    return ui.Panel({
        widgets: legends,
        layout: ui.Panel.Layout.Flow('vertical')
    });
};

/**
 * Cria um painel com o mapa e o painel de controle.
 * @param {ui.Map} map O mapa.
 * @param {ui.Panel} panel O painel de controle.
 * @return {ui.Panel} O painel com o mapa e o painel de controle.
 */
exports.createMapGrid = function(map, panel) {
    return ui.Panel([map, panel],
        ui.Panel.Layout.Flow('horizontal'), {
            stretch: 'both',
            height: '940px',
            width: '100%'
        }
    );
};
