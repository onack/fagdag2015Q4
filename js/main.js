var map;
var layerDraw;
var interactionDraw; // global so we can remove it later

var init = function() {
    this.setupMap();
    this.buildEventListeners();
};

var setupMap = function() {
    console.log("setupMap invoked");
    var EPSG = 'EPSG:32633';
    var EXTENT = [-2500000.0,3500000.0,3045984.0,9045984.0];
    var RESOLUTIONS = [21664,10832,5416,2708,1354,677,338.5,169.25,84.625,42.3125,21.15625,10.578125,5.2890625,2.64453125,1.322265625,0.6611328125,0.33056640625,0.165283203125];
    var CENTER = [270954.00, 7038739.20];

    var layers = makeLayers();

    var projection = new ol.proj.Projection({
        code: EPSG,
        extent: EXTENT,
        units: 'm'
    });

    // Named projections (http://spatialreference.org/ref/epsg/<srid>/proj4js/)
    proj4.defs([
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"], // WGS 84
        ["EPSG:32631", "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 31N
        ["EPSG:32632", "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 32N
        ["EPSG:32633", "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 33N
        ["EPSG:32634", "+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 34N
        ["EPSG:32635", "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 35N
        ["EPSG:32636", "+proj=utm +zone=36 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"], // UTM 36N
        ["EPSG:3006",  "+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"], // SWEREF99
        //+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs
        ["EPSG:2400", "+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel +units=m +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs"] // RT90
        //+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +units=m +no_defs
        //+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 +y_0=0.0 +proj=tmerc +ellps=bessel +units=m +towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs
    ]);

    map = new ol.Map({
        target: 'section_map',
        layers: layers,
        view: new ol.View({
            projection: projection,
            resolutions: RESOLUTIONS,
            center: CENTER,
            zoom: 3
        })
    });
};

var buildEventListeners = function() {
    var $drawPolygon = $("#" + "drawPolygon");
    $drawPolygon.on("click", function() {
        map.removeInteraction(interactionDraw);
        addDrawPolygonInteraction();
    });

    var $plotNidarosdomen = $("#" + "plotPointNidarosdomen");
    $plotNidarosdomen.on("click", function() {
        plotPoint(10.396700, 63.427029);
    });

    var $plotVigelandsparken = $("#" + "plotPointVigelandsparken");
    $plotVigelandsparken.on("click", function() {
        plotPoint(10.705147, 59.924484);
    });
};

var makeLayers = function() {
    console.log("makeLayers invoked");
    var layers = [];
    var wms = new ol.layer.Tile({
        title: "Norges grunnkart",
        source: new ol.source.TileWMS({
            url: "http://wms.geonorge.no/skwms1/wms.topo2?",
            params: {
                LAYERS: "topo2_WMS",
                FORMAT: 'image/png',
                STYLE: 'default'
            }
        })
    });
    layers.push(wms);

    this.layerDraw = createLayerDraw();
    layers.push(this.layerDraw);

    return layers;
};

var createLayerDraw = function() {

    return new ol.layer.Vector({
        source : new ol.source.Vector(),
        style : new ol.style.Style({
            fill : new ol.style.Fill({
                color : 'rgba(255, 255, 255, 0.2)'
            }),
            stroke : new ol.style.Stroke({
                color : '#ffcc33',
                width : 2
            }),
            image : new ol.style.Circle({
                radius : 7,
                fill : new ol.style.Fill({
                    color : '#ffcc33'
                })
            })
        })
    });
};

function addDrawPolygonInteraction() {

    interactionDraw = new ol.interaction.Draw({
        source: layerDraw.getSource(),
        type: "Polygon"
    });
    map.addInteraction(interactionDraw);
}

var plotPoint = function(lon, lat) {
    console.log("plotPoint invoked with lon: " + lon + ", lat: " + lat);
    //var projection = this.map.getView().getProjection();
    var projection = "EPSG:32633";
    var coordinateArray = proj4("EPSG:4326", projection, [lon, lat]);
    var point = new ol.geom.Point(coordinateArray);
    //point.transform('EPSG:4326', 'EPSG:32633');



    var pointFeature = new ol.Feature({
        geometry: point
    });

    var vectorSource = new ol.source.Vector();
    vectorSource.addFeature(pointFeature);

    var vectorLayer = new ol.layer.Vector();
    vectorLayer.setSource(vectorSource);

    this.map.addLayer(vectorLayer);

    var extent = vectorSource.getExtent();

    /*
    this.map.setView(new ol.View({
        center: [0, 0],
        zoom: 2
    }));
*/

    this.map.getView().fit(extent, this.map.getSize());
}