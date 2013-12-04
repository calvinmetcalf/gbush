var should = require('chai').should();
var schools = require('./schools.json');
var gbush = require('../');
describe('rbush.geojson',function(){
  it('should be createable',function(){
    var bush = new gbush();
    bush.should.exist;
  });
  it('should be createable without new',function(){
    var bush = gbush();
    bush.should.exist;
  });

  it('should be able to have stuff added to it',function(){
    var bush = new gbush();
    bush.insert(schools.features[0])
    .search([-80,40,-70,50]).should.have.length(1);
  });
  it('should be able to have stuff removed from it',function(){
    var bush = new gbush();
    bush.insert(schools.features[0])
    .insert(schools.features[1])
    .search([-80,40,-70,50]).should.have.length(2);
    bush.remove(schools.features[0])
    .search([-80,40,-70,50]).should.have.length(1);
  });
  it('should be able to bulk load stuff',function(){
    var bush = new gbush();
    bush.insert(schools).search([-80,40,-70,50]).should.have.length(2666);
  });
  it('should be able to bulk load an array',function(){
    var bush = new gbush();
    bush.insert(schools.features).search([-80,40,-70,50]).should.have.length(2666);
  });
  it('should be able to bulk clera stuff',function(){
    var bush = new gbush();
    bush.insert(schools).search([-80,40,-70,50]).should.have.length(2666);
    bush.clear().search([-80,40,-70,50]).should.have.length(0);
  });
});