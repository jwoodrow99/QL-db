# QL-db

QL-db is an extremely lightweight database, designed to be used as a learning tool within your Node.js applications!

This is a small project I have started with the intent to incorporate it in a later version of my QL-dev library, which currently only supports basic DOM manipulation in browser. I am working towards making QL-dev as more of a Node.js framework rather than just a small library to handle DOM manipulation. I will be integrating a version of QL-db later on down the road once I am happy with it, and adding in a basic MVC file structure to the framework and some command line tools as well.

# Use

### INTRO
This git repo illustrates what a small Node.js application should look like with QL-db. However all you require is a directory called **"data"** at the root of your project and the **"QL-db.js"** file inside of the **"data"** directory and you are ready to go!

All database files will be stored in the **"data"** directory, you should not manually remove or add anything within the directory.

All code examples are relative to the root of the directory, in the **"app.js"** file.

### Creating the database
```javascript
const QLdb = require('./data/QL-db.js');
const db1 = new QLdb("db1");
```
This will create a new object called db1 and create all the necessary directories for a database called db1.

### newTable(string, object)
```javascript
db1.newTable('friends', {
    name:"string",
    age:"number"
});
```
This will create a new table in the db1 database. This function takes 2 arguments, the name of the table, and an object which is the schema layout for the table. This is used to validate data when you do modifications to it.
### insert(string, array)
```javascript
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
```
This will add a new record to the db1 database in the friends table. This function takes 2 arguments, the name of the table, and an array of objects you are inserting to the table (the format of the objects must match your schema).
### find(string, object)
```javascript
db1.find('friends', {
    age:22
});
```
This will return all of the records in the friends table of the db1 database that have the age of 22 (Kyle and Allison). This function takes 2 parameters, the table and an object which contains 1 or more properties and will find all records which match the property value. (empty object will return all records in table).
```javascript
db1.findId('friends', 0);
```
A variation of the **find** function is the **findId** function. QL-db stores all of its records under an auto-incrementing id, this function allows for you to query one record by it id.

### delete(string, object)
```javascript
db1.find('friends', {
    age:22
});
```
The **delete** function works very similar to the **find** function. It takes 2 parameters, the first being the table name, and the second being an object with properties. Any record that matches the given properties will be deleted from the table.
```javascript
db1.deleteId('friends', 0);
```
The **delete** function also has a sister function called **deleteId** which allows you to delete one record by its id, working the same as the **findId** function.

### update(string, object, object)
```javascript
db1.update('friends', {age:22}, {age:23);
```
The **update** function works very similar to the **find** function. It takes 3 parameters, the first being the table name, and the second being an object with properties. Any record that matches the given properties will be selected and have property vales changes, specified in the 3rd parameter. In this example it changes every friend who is 22 years old to 23.
```javascript
db1.updateId('friends', 0, {age:23});
```
The **update** function also has a sister function called **updateId** which allows you to update one record by its id, working the same as the **update** function, but only selects 1 record by its id.

### dropTable(string)
```javascript
db1.dropTable('friends');
```
The **dropTable** function allows for you to remove the existence of a table in a given database

### dropDb(string)
```javascript
db1.update('db1');
```
The **dropDb** function allows for you to remove the existence of an entire database.

### show(string)
```javascript
db1.show('friends');
```
The **show** function will return an object that contains all of the records in a given table.

### list( )
```javascript
db1.list();
```
The **list** function will return a list of all tables in a given database.
