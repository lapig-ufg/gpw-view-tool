# Global Pasture Watch Comparison Toolkit (GPW-CT)

This Google Earth Engine app allows you to compare different pasture datasets, including:

* Global Pasture Watch 2020
* ESA WorldCover v2 2021
* GLAD GLCLU 2020
* GLC FCS 2020

**Features:**

* Visualize pasture maps from different sources.
* Compare maps side-by-side with opacity control.
* Get information about the classes of each map by clicking on the points.
* Explore example regions around the world.
* Interactive legends for each dataset.

**How to use:**

1. Open the app in Google Earth Engine.
2. Select the datasets you want to visualize.
3. Adjust the opacity of the layers with the sliders.
4. Click on the map to get information about the classes at the selected point.
5. Use the "Example regions" dropdown to center the map on different areas of interest.

**Data:**

* **Global Pasture Watch 2020:**  `projects/gaia-319808/assets/gpw/gpw_grassland_rf-savgol-bthr_c_30m_20200101_20201231_go_epsg-4326_v1`
* **ESA WorldCover v2 2021:** `ESA/WorldCover/v200`
* **GLAD GLCLU 2020:** `projects/glad/GLCLU2020/v2/LCLUC_2020`
* **GLC FCS 2020:** `projects/sat-io/open-datasets/GLC-FCS30D/annual`

**Code:**

The source code of the app is available in this repository. It is organized in different files to facilitate maintenance and reuse:

* `index.js`: Main logic of the app.
* `ui.js`: Functions to create the user interface.
* `map.js`: Functions to manage the map.
* `data.js`: Functions to load and process the data.
* `layers.js`: Defines the data layers, their characteristics, and visibility.
* `styles.js`: Defines map styles, such as shades of grey and highlighted elements.

**Remarks:**

* This app was developed in Google Earth Engine.
* You need a Google Earth Engine account to run the app.

**Authors:**

Tharles de Sousa Andrade - irtharles@gmail.com | 
Jairo Matos da Rocha - devjairomr@gmail.com | Maria O'Healy Hunter - maria.hunter@ufg.br |  Vinícius Vieira Mesquita - vieiramesquita@gmail.com
