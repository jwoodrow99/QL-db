
const fs = require('fs');
const path = require('path');
const colors = require('colors');

class jsonDB {

    constructor(name) {

        this.name = name;
        this.DIR = path.join(__dirname, 'db/' + this.name);
        this.structure = {
            schema:{},
            records:{}
        }

        // Created the dir structure if it has not already been created & db dir
        fs.mkdirSync(this.DIR, { recursive: true });
        console.log(colors.bgGreen.black('- New database', this.name, 'created sucessfully! -') + "\n");
    } // end constructor

    newTable(table, modle){
        let structure = this.structure;
        structure.schema = modle;
        fs.writeFileSync(path.join(this.DIR, table + '.json'), JSON.stringify(structure));
        console.log(colors.bgGreen.black('- New table', this.name+'.'+table, 'created sucessfully! -') + "\n");
    }

    insert(table, records){
        let obj = this.loadTable(table);

        for (let record of records) {
            if (this.varifySchema(table, record)) {
                if (Object.keys(obj.records).length == 0) {
                    obj.records[0] = record;
                } else {
                    obj.records[this.lastId(table)+1] = record;
                } // end if

                fs.writeFileSync(path.join(this.DIR, table + '.json'), JSON.stringify(obj));

                console.log(colors.green("Record sucessfully added to", this.name+'.'+table+":", record));
            }
        }
        console.log("\n");
    }

    find(table, property){
        let obj = this.loadTable(table);
        let matching = {};

        if (Object.keys(property).length == 0) {
            matching = this.show(table);
        } else {
            for (let i = 0; i < Object.keys(obj.records).length; i++) {
                for (let j = 0; j < Object.keys(property).length; j++) {

                    let curMatch = true;

                    if (obj.records[i][Object.keys(property)[j]] == property[Object.keys(property)[j]] && curMatch == true) {
                        curMatch = true;
                    } else {
                        curMatch = false;
                    }

                    if (j == Object.keys(property).length-1 && curMatch == true) {
                        matching[i] = obj.records[i];
                    }
                }
            } // end for
        }

        if (Object.keys(matching).length == 0) {
            console.log(colors.red("No matches found in", this.name+'.'+table, "for:"), colors.yellow(property) + "\n");
            return null;
        } else {
            console.log(colors.green("Match found in", this.name+'.'+table, "for:"), colors.yellow(property));
            console.log(matching);
            console.log("\n");
            return matching;
        } // end if
    }

    findId(table, id){
        let record = this.loadTable(table).records[id];
        let matching = {};
        if (record == undefined) {
            console.log(colors.red("No matches found in", this.name+'.'+table, "for id:"), colors.yellow(id) + "\n");
        } else {
            matching[id] = record;
            console.log(colors.green("Match found in", this.name+'.'+table, "for id:"), colors.yellow(id));
            console.log(matching);
            console.log("\n");
            return matching;
        }
    }

    delete(table, property){
        this.deleteId(table, Object.keys(this.find(table, property)));
    }

    deleteId(table, id){
        let obj = this.loadTable(table);
        for (let recordId of id) {
            console.log(colors.green("Record removed from", this.name+'.'+table+":"), colors.yellow(obj.records[recordId]));
            delete obj.records[recordId];
        }
        fs.writeFileSync(path.join(this.DIR, table + '.json'), JSON.stringify(obj));
        console.log("\n");
    }

    update(table, property, update){
        this.updateId(table, Object.keys(this.find(table, property)), update);
    }

    updateId(table, id, update){
        let obj = this.loadTable(table);
        for (let recordId of id) {
            for (let i = 0; i < Object.keys(update).length; i++) {
                obj.records[recordId][Object.keys(update)[i]] = update[Object.keys(update)[i]];
            }
            console.log(colors.green("Record updated in", this.name+'.'+table));
            let updatedRecord = {};
            updatedRecord[recordId] = obj.records[recordId];
            console.log(colors.cyan(updatedRecord));
        } // end for
        fs.writeFileSync(path.join(this.DIR, table + '.json'), JSON.stringify(obj));
        console.log("\n");
    }

    dropTable(table){
        fs.unlinkSync(path.join(this.DIR, table + '.json'));
        console.log(colors.green("Table", this.name+'.'+table, "dropped sucessfully!"));
        console.log("\n");
    }

    dropDb(){
        fs.unlinkSync(path.join(this.DIR));
        console.log(colors.green("Database", this.name+'.'+table, "dropped sucessfully!"));
        console.log("\n");
    }

    show(table){
        console.log(colors.green('All records in', this.name+'.'+table + ':'));
        console.log(this.loadTable(table).records);
        console.log("\n");
        return this.loadTable(table).records;
    }

    list(){

        let list = [];

        fs.readdirSync(this.DIR).forEach(file => {
            let name = file.split(".");
            list.push(name[0]);
        });
        console.log(colors.green('All tables in', this.name+':'));
        console.log(colors.cyan(list));
        console.log("\n");
        return list;
    }

    loadTable(table){
        return JSON.parse(fs.readFileSync(path.join(this.DIR, table + '.json')));
    }

    varifySchema(table, record){
        let obj = this.loadTable(table);
        if (Object.keys(record).length == Object.keys(obj.schema).length) {
            for (let i = 0; i < Object.keys(obj.schema).length; i++) {
                if (Object.keys(obj.schema)[i] == Object.keys(record)[i]) {
                    if (typeof record[Object.keys(record)[i]] != obj.schema[Object.keys(obj.schema)[i]] && record[Object.keys(record)[i]] != null) {
                        console.log(colors.red("Record property type did not match schema for", this.name+'.'+table+":"), colors.yellow(Object.keys(record)[i] + ":" + record[Object.keys(record)[i]]));
                        return false;
                    } // end if
                } else {
                    console.log(colors.red("Record property name did not match schema for", this.name+'.'+table+":"), colors.yellow(Object.keys(record)[i] + ":" + record[Object.keys(record)[i]]));
                    return false;
                } // end if
            } // end for
        } else {
            console.log(colors.red("Record properties do not match schema properties for", this.name+'.'+table+"....."));
            console.log(colors.yellow("schema:", obj.schema));
            console.log(colors.cyan("record:", record));
            return false;
        } // end if
        return true;
    }

    lastId(table){
        let obj = this.loadTable(table);
        let allRecordIds = Object.keys(obj.records);
        let largestID = allRecordIds[0];

        for (let id of allRecordIds) {
            if (id > largestID) {
                largestID = id;
            }
        }

        return Number(largestID);
    }

} // end jsonDB class

module.exports = jsonDB;
