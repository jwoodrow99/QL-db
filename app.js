const db = require('./data/jsonDB.js');

const testDB = new db("testDB");

testDB.newTable('test1', {
    data1:"string",
    data2:"number",
    data3:"number"
});

testDB.insert('test1', [{
    data1:"data1",
    data2:1,
    data3:2
},{
    data1:"data2",
    data2:1,
    data3:2
},{
    data1:"data3",
    data2:3,
    data3:2
},{
    data1:"data4",
    data2:1,
    data3:3
}]);

testDB.show('test1');

const testDB2 = new db("testDB");

testDB2.newTable('test2', {
    data1:"string",
    data2:"number",
    data3:"number"
});

testDB2.insert('test2', [{
    data1:"data1",
    data2:1,
    data3:2
},{
    data1:"data2",
    data2:1,
    data3:2
},{
    data1:"data3",
    data2:3,
    data3:2
},{
    data1:"data4",
    data2:1,
    data3:3
}]);

testDB2.show('test2');
