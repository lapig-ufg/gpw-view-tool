// Funções para criar a interface do usuário

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
      params: {bands: ['b1', 'b2', 'b3'], min: 0, max: 255},
      style: {
        width: '220px',
        height: '35px',
        margin: '0px 0px 6px 25%'
      }
    });
  
    var labelAppTittle = ui.Label('Global Pasture Watch Comparsion Toolkit (GPW-CT) by LAPIG');
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
  
    var checkbox_gpw = ui.Checkbox('Global Pasture Watch 2020', true);
    var checkbox_esa_v2 = ui.Checkbox('ESA WorldCover v2 2021', false);
    var checkbox_glad = ui.Checkbox('GLAD GLCLU 2020', false);
    var checkbox_glcfcs = ui.Checkbox('GLC FCS 2020', false);
  
    // Funções para controlar a visibilidade das camadas
    checkbox_gpw.onChange(function(checked) {
      map.layers().get(3).setShown(checked);
    });
  
    checkbox_esa_v2.onChange(function(checked) {
      map.layers().get(2).setShown(checked);
    });
  
    checkbox_glad.onChange(function(checked) {
      map.layers().get(1).setShown(checked);
    });
  
    checkbox_glcfcs.onChange(function(checked) {
      map.layers().get(0).setShown(checked);
    });
  
    // Criar sliders de opacidade
    var createOpacitySlider = function(index) {
      return ui.Slider({
        min: 0,
        max: 100.0,
        value: 100.0,
        step: 10.0,
        onChange: function(value) {
          var opacity = value / 100.0;
          map.layers().get(index).setOpacity(opacity);
        },
        style: {width: '42%'}
      });
    };
  
    var oppacity_l1 = createOpacitySlider(3);
    var oppacity_l2 = createOpacitySlider(2);
    var oppacity_l3 = createOpacitySlider(1);
    var oppacity_l4 = createOpacitySlider(0);
  
    // Criar painéis para os checkboxes e sliders
    var createLayerPanel = function(checkbox, slider) {
      return ui.Panel({
        widgets: [checkbox, slider],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
    };
  
    var panel_v1 = createLayerPanel(checkbox_gpw, oppacity_l1);
    var panel_v2 = createLayerPanel(checkbox_esa_v2, oppacity_l2);
    var panel_v3 = createLayerPanel(checkbox_glad, oppacity_l3);
    var panel_v4 = createLayerPanel(checkbox_glcfcs, oppacity_l4);
  
    // Criar painel para as regiões de exemplo
    var labelRegion = ui.Label('Examples regions:');
    labelRegion.style().set({
      fontSize: '25',
      fontWeight: 'bold',
      textAlign: 'left',
      padding: '5px 0px 0px 0%'
    });
  
    var select_regions = ui.Select({
      items: Object.keys(map.core_regions),
      value: 'Cocalinho, Mato Grosso, Brazil'
    });
  
    var button_region = ui.Button({
      label: 'Center to region',
      onClick: function() {
        var coords = map.core_regions[select_regions.getValue()];
        map.setCenter(coords[0], coords[1], coords[2]);
      }
    });
  
    var region_Panel = ui.Panel(
      [labelRegion, select_regions, button_region]
    );
  
    // Criar o painel principal
    var MainPanel = ui.Panel(
      [branding, labelAppTittle, region_Panel, labelTop, panel_v1, panel_v2, panel_v3, panel_v4],
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
    // Criar o painel da legenda
    var legend = ui.Panel({
      style: {
        position: 'bottom-right',
        padding: '8px 15px'
      }
    });
  
    // Criar o título da legenda
    var legendTitle = ui.Label({
      value: title,
      style: {
        fontWeight: 'bold',
        fontSize: '18px',
        margin: '0 0 4px 0',
        padding: '0'
      }
    });
  
    // Adicionar o título ao painel
    legend.add(legendTitle);
  
    // Criar as linhas da legenda
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
    // Criar o quadrado de cor
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });
  
    // Criar o label com o nome da classe
    var description = ui.Label({
      value: name,
      style: {margin: '0 0 4px 6px'}
    });
  
    // Retornar o painel da linha
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