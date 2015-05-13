var test = require('unit.js');
describe('Obtener un ZIP de localhost y descomprimirlo', function(){
  it('Contar los elementos del ZIP', function(){
    var zip_getter =  require('../src/getZIP.js');
    test.promise
    .given(zip_getter.getZip('http://localhost/facu.zip'))
    .then(function (zip) {
       var zipEntries =  zip.getEntries();
       test.assert.equal(zipEntries.length, 0);
    });    
  });
});