/**
 * @fileoverview Funções relacionadas ao mapa.
 */

var style = require('users/irtharles/gpw-view-tool:style.js');

// Regiões de exemplo
exports.core_regions = {
  'Cocalinho, Mato Grosso, Brazil': [-51.27693984464683, -14.072734440523552, 13],
  'Osorno, Los Lagos, Chile': [-72.9630983253247, -40.61221002719209, 14],
  'Las Guasduitas, Apure, Venezuela': [-68.9075311624308, 7.318736035405456, 13],
  'Alto Alegre, Roraima, Brazil': [-61.33973562607987, 3.0356217005968626, 13],
  'Vitória do Xingu, Pará, Brazil': [-52.30386472689355, -3.0251300859699426, 13],
  'Quaraí, Rio Grande do Sul, Brazil': [-56.43055670552016, -30.305082428057972, 13],
  'Zona La Patria, Paraguay': [-61.16688959983465, -20.80885387383086, 11],
  'Sorriso, Mato Grosso, Brazil': [-55.96, -12.8, 14],
  'Buenos Aires province, Argentina': [-59.8572, -36.7928, 14],
  'PN das Emas, Goiás, Brazil': [-52.9254395476717, -18.17677670132077, 15],
  'Jalapão, Tocantins, Brazil': [-46.6717, -10.0359, 14],
};

/**
 * Cria e configura o mapa.
 * @return {ui.Map} O mapa configurado.
 */
exports.createMap = function() {
  var map = ui.Map();
  map.setOptions('SHADES OF GREY', style.MAP_STYLES);
  map.setCenter(5, 13, 2.4);
  map.setControlVisibility({all: true});
  map.style().set('cursor', 'crosshair');
  return map;
};


exports.getValues = function(coords){
    
  inspector.widgets().set(0, ui.Label({
    value: 'Loading...',
    style: {color: 'gray'}
  }));
  
  var point = ee.Geometry.Point(coords.lon, coords.lat);
  
  MapLayer.layers().set(4,ui.Map.Layer(point, {color: 'blue'}, 'Selected Point'))
  
  var sample_glc = GLC_FCS30D.sample(point, 30);
  var sample_glad = GLCLU2020.sample(point, 10);
  var sample_esa = worldCover_v2.sample(point, 30);
  var sample_gpw = gpw_2020.sample(point, 30);
  
  var value_glc = sample_glc.first().get('b21')
  var value_glad = sample_glad.first().get('remapped')
  var value_esa = sample_esa.first().get('Map')
  var value_gpw = sample_gpw.first().get('b1')
  
  //var values = [value_gpw,value_esa,value_glad,value_glc]
  
  inspector.widgets().set(0, ui.Label({
    value: 'Classes:',
    style: {color: 'gray'}
  }));
  
  var dict_class = {
    0:gpw_dict,
    1:esa_dict,
    2:glad_dict,
    3:glc_fcs
  }
  
  value_gpw.evaluate(function(result) {
    
    // When the server returns the value, show it.
    inspector.widgets().set(1, ui.Label({
      value: 'GPW: ' + gpw_dict[result],
    }));
  });
  
  value_esa.evaluate(function(result) {
    
    // When the server returns the value, show it.
    inspector.widgets().set(2, ui.Label({
      value: 'ESA WC v2: ' + esa_dict[result],
    }));
  });
  
  value_glad.evaluate(function(result) {
    
    // When the server returns the value, show it.
    inspector.widgets().set(3, ui.Label({
      value: 'GLAD: ' + glad_dict[result],
    }));
  });
  
  value_glc.evaluate(function(result) {
    
    // When the server returns the value, show it.
    inspector.widgets().set(4, ui.Label({
      value: 'GLC FCS: ' + glc_fcs[result],
    }));
  });
  
  inspector.widgets().set(5, ui.Label({
      value: 'Coordinates: ' + coords.lat + ' ' + coords.lon,
  }));

}