const db = require('./data/QL-db.js');

const db1 = new db("db1");

db1.newTable('friends', {
    name:"string",
    age:"number"
});

db1.insert('friends', [{
    name:"John",
    age:23
},{
    name:"Maddie",
    age:25
},{
    name:"Kyle",
    age:22
},{
    name:"Allison",
    age:22
}]);

console.log(db1.find('friends', {}));
