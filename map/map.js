/**
 * @fileoverview Funções relacionadas ao mapa.
 */

var style = require('users/irtharles/gpw-view-tool/ui/style');
// Dicionários de classes para cada dataset (movidos de data.js)
var gpw_dict = {
  1: 'Cultivated grassland',
  2: 'Natural/Semi-Natural grassland'
};

var esa_dict = {
  10: 'Tree cover',
  20: 'Shrubland',
  30: 'Grassland',
  40: 'Cropland',
  50: 'Built-up',
  60: 'Bare / sparse vegetation',
  70: 'Snow and ice',
  80: 'Permanent water bodies',
  90: 'Herbaceous wetland',
  95: 'Mangroves',
  100: 'Moss and lichen'   

};

var glad_dict = {
  1: 'Terra Firma - True desert',
  2: 'Terra Firma - Semi-arid',
  3: 'Terra Firma - Dense short vegetation',
  4: 'Terra Firma - Tree cover',
  5: 'Wetland - Salt pan',
  6: 'Wetland - Sparse vegetation',
  7: 'Wetland - Dense short vegetation',
  8: 'Wetland - Tree cover',
  9: 'Open surface water',
  10: 'Snow/ice',
  11: 'Cropland',
  12: 'Built-up',
  13: 'Ocean'
};

var glc_fcs_dict = {
  10: "Rainfed cropland",
  11: "Herbaceous cover cropland",
  12: "Tree or shrub cover (Orchard) cropland",
  20: "Irrigated cropland",
  51: "Open evergreen broadleaved forest",
  52: "Closed evergreen broadleaved forest",
  61: "Open deciduous broadleaved forest (0.15<fc<0.4)",
  62: "Closed deciduous broadleaved forest (fc>0.4)",
  71: "Open evergreen needle-leaved forest (0.15< fc <0.4)",
  72: "Closed evergreen needle-leaved forest (fc >0.4)",
  81: "Open deciduous needle-leaved forest (0.15< fc <0.4)",
  82: "Closed deciduous needle-leaved forest (fc >0.4)",
  91: "Open mixed leaf forest (broadleaved and needle-leaved)",
  92: "Closed mixed leaf forest (broadleaved and needle-leaved)",
  120: "Shrubland",
  121: "Evergreen shrubland",
  122: "Deciduous shrubland",
  130: "Grassland",
  140: "Lichens and mosses",
  150: "Sparse vegetation (fc<0.15)",
  152: "Sparse shrubland (fc<0.15)",
  153: "Sparse herbaceous (fc<0.15)",   

  181: "Swamp",
  182: "Marsh",
  183: "Flooded flat",
  184: "Saline",
  185: "Mangrove",
  186: "Salt marsh",
  187: "Tidal flat",
  190: "Impervious surfaces",
  200: "Bare areas",
  201: "Consolidated bare areas",
  202: "Unconsolidated bare areas",
  210: "Water body",
  220: "Permanent ice and snow",   

  0: "Filled value"
};

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