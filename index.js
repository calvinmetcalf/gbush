var Rbush = require('rbush');
var gbv = require('geojson-bounding-volume');

function format(coords){
  // transform from gbv which gives [[min1, min2, ...],[max1, max2, ...]]
  //to rbush which wants [min1, min2, max1, max2]
  return [coords[0][0],coords[0][1],coords[1][0],coords[1][1]];
}

function GeoBush(maxEntries){
  if(!(this instanceof GeoBush)){
    return new GeoBush(maxEntries);
  }
  this.rbush = new Rbush(maxEntries);
  this.store = new WeakMap();
}

GeoBush.prototype.insert = function(feature){
  if(Array.isArray(feature)||feature.type === 'FeatureCollection'){
    this.bulkInsert(feature);
  }
  var coords = format(gbv(feature.geometry));
  this.store.set(coords,feature);
  this.store.set(feature,coords);
  this.rbush.insert(coords);
  return this;
};

GeoBush.prototype.load = function(geojson){
  var array;
  if(!Array.isArray(geojson)){
    array = geojson.features;
  }else{
    array = geojson;
  }
  var coords = array.map(function(feature){
    var coord = format(gbv(feature.geometry));
    this.store.set(coord,feature);
    this.store.set(feature,coord);
  }, this);
  this.rbush.load(coords);
  return this;
}

GeoBush.prototype.search = function(bbox){
  return this.rbush.search(bbox).map(function(coords){
    return this.store.get(coords);
  },this);
}

GeoBush.prototype.remove = function(item){
  var geojson = this.store.get(item);
  this.store.delete(item);
  this.store.delete(geojson);
  this.rbush.remove(item);
  return this;
}

GeoBush.prototype.clear = function(){
  this.rbush.clear();
  this.store.clear();
}