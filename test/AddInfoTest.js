 const expect = require('chai').expect;
 const URL ="mongodb://localhost:27017";
 const database = "hqummp";
 const collection = "info_userinfo";
 const message = require('../lib/message');

 const MongoClient = require('mongodb').MongoClient;
 const infomgr = require('../lib/infomgr');

 const test_data = {
    "year": 2018,
    "month": 10,
    "day": 14,
    "source": "公开电话",
    "category": "规划建设",
    "subcategory": "asd",
    "title": "balabalabala",
    "subtitle": "balabalabala",
    "content": "rua",
    "remark": "ruarua",
    "level": 23
 }

 describe('AddInfoTest', function(){
    before(async function(){
        try{
            
            let info = await get_Info_collection();

            await info.deleteMany({});
            await info.insertMany([test_data]);
        }catch(err){
            console.log(err);
        }
    });

    it('AddInfoTest#1', async function(){
        let result, catch_err;

        try{
            result = await infomgr.addInfo(2018, 10, 15, "公开电话", "规划建设", "asd",  "balabalabala", "balabalabala", "rua", "ruarua", 1)

        }catch(err){
            catch_err = err;
        }

        expect(result).to.be.equals("OK");
        expect(catch_err).to.be.an("undefined");
    });

    it('AddInfoTest#2', async function(){
        let result, catch_err;

        try{
            result = await infomgr.addInfo(-1, 10, 14, "公开电话", "规划建设", "asd",  "balabalabala", "balabalabala", "rua", "ruarua", 1);
        }catch(err){
           catch_err = err;
        }
        expect(result).to.be.an("undefined");
        expect(catch_err).to.be.an("error");
        expect(catch_err.message).to.be.equal(message.date_illegal);
    });
    
 });

 async function get_Info_collection(){
     let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
     let db = connect.db(database);
     let info = db.collection(collection);
     return info;
 }