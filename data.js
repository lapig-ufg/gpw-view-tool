/**
 * @fileoverview Funções para carregar e processar dados.
 */

// Dicionários de classes para cada dataset
var gpw_dict = {
  1: "Cultivated grassland",
  2: "Natural/Semi-Natural grassland",
};

var esa_dict = {
  10: "Tree cover",
  20: "Shrubland",
  30: "Grassland",
  40: "Cropland",
  50: "Built-up",
  60: "Bare / sparse vegetation",
  70: "Snow and ice",
  80: "Permanent water bodies",
  90: "Herbaceous wetland",
  95: "Mangroves",
  100: "Moss and lichen",
};

var glad_dict = {
  1: "Terra Firma - True desert",
  2: "Terra Firma - Semi-arid",
  3: "Terra Firma - Dense short vegetation",
  4: "Terra Firma - Tree cover",
  5: "Wetland - Salt pan",
  6: "Wetland - Sparse vegetation",
  7: "Wetland - Dense short vegetation",
  8: "Wetland - Tree cover",
  9: "Open surface water",
  10: "Snow/ice",
  11: "Cropland",
  12: "Built-up",
  13: "Ocean",
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
  0: "Filled value",
};

/**
 * Recodifica as classes de uma imagem.
 * @param {ee.Image} image A imagem a ser recodificada.
 * @return {ee.Image} A imagem recodificada.
 */
function recodeClasses(image) {
  var classes = [
    10, 11, 12, 20, 51, 52, 61, 62, 71, 72, 81, 82, 91, 92, 120, 121, 122, 130,
    140, 150, 152, 153, 181, 182, 183, 184, 185, 186, 187, 190, 200, 201, 202,
    210, 220, 0,
  ];
  return image.remap(classes, ee.List.sequence(1, classes.length));
}

/**
 * Carrega as imagens do GPW, ESA WorldCover, GLAD e GLC FCS.  
 * @return {Object} Um objeto contendo as imagens carregadas.
 */
exports.loadImages = function() {
  // Carregar a imagem do GPW 2020
  var gpw_2020 = ee.Image('projects/gaia-319808/assets/gpw/gpw_grassland_rf-savgol-bthr_c_30m_20200101_20201231_go_epsg-4326_v1');
  gpw_2020 = gpw_2020.updateMask(gpw_2020.gt(0));

  // Carregar a imagem do ESA WorldCover v2
  var worldCover_v2 = ee.ImageCollection('ESA/WorldCover/v200').first();

  // Carregar a imagem do GLAD GLCLU 2020
  var landmask = ee.Image("projects/glad/OceanMask").lte(1); 
  var recodeClasses = function(image) {
    // Define the class values
    var classes = [10, 11, 12, 20, 51, 52, 61, 62, 71, 72, 81, 82, 91, 92, 120, 121, 122, 
                   130, 140, 150, 152, 153, 181, 182, 183, 184, 185, 186, 187, 190, 200, 
                   201, 202, 210, 220, 0];
    var reclassed = image.remap(classes, ee.List.sequence(1, classes.length));
    return reclassed;
  };
  
  var glad_classes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,
    27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,
      56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,
        85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,
        110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,
        131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,
        152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,
        173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,
        194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,
        215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,
        236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255]
  
  var glad_remap = [1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,
        4,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,8,8,8,8,8,8,8,
        8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,9,9,9,9,9,9,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,0,0,11,0,0,0,0,0,12,0,0,0,13,0]

  var GLCLU2020 = ee.Image('projects/glad/GLCLU2020/v2/LCLUC_2020').remap(glad_classes,glad_remap,0)
  
  GLCLU2020 = GLCLU2020.updateMask(GLCLU2020.gt(0)).updateMask(landmask)

  var GLC_FCS30D = ee.ImageCollection("projects/sat-io/open-datasets/GLC-FCS30D/annual")
    .mosaic()
    .select('b21')
    
  var glcfcs_recode = ee.Image(recodeClasses(GLC_FCS30D))
  
  return {
    gpw_2020: gpw_2020,
    worldCover_v2: worldCover_v2,
    GLCLU2020: GLCLU2020,
    glcfcs_recode: glcfcs_recode
  };
}
