/**
 * Created with IntelliJ IDEA.
 * User: Marius Eggen
 * Date: 23.11.15
 * Time: 08:32
 * To change this template use File | Settings | File Templates.
 */




var mapSetup = function(){

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

    var map = new ol.Map({
        target: 'map',
        layers: layers,
        view: new ol.View({
            projection: projection,
            resolutions: RESOLUTIONS,
            center: CENTER,
            zoom: 3
        })
    });
};

var makeLayers = function(){
    var layers= [];
    var wms = new ol.layer.Tile({
        title: "Norges grunnkart",
        source: new ol.source.TileWMS({
            url: "http://wms.geonorge.no/skwms1/wms.topo2?",
            params:{
                LAYERS: "topo2_WMS",
                FORMAT: 'image/png',
                STYLE: 'default'
            }
        })
    });
    layers.push(wms);

    return layers;
};



