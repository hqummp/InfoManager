const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "hqummp";
const collection = "usr_userinfo";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const infomgr = require('../lib/infomgr');

describe('loginTest', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            let std_info = db.collection(collection);

            await std_info.deleteMany({});
            await std_info.insertMany([
                {
                    "uid": 2017220301024,
                    "passwd": encrypt.encrypt("301024")
                }
            ]);
        } catch (err) {
            console.log(err);
        }
    });

    it('loginTest#1', async function () {
        let result, catch_err;
        try {
          result = await infomgr.Login(2017220301024, "301024");
        } catch (err) {
          catch_err = err;
        }
        expect(result).to.be.equal("OK");
        expect(catch_err).to.be.an("undefined");
    });

    it('loginTest#2', async function () {
      let result, catch_err;
      try {
        result = await infomgr.Login("2017220301024", "301024");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });

    it('loginTest#3', async function () {
      let result, catch_err;
      try {
        result = await infomgr.Login();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });

    it('loginTest#4', async function () {
      let result, catch_err;
      try {
        result = await infomgr.Login(2017220301024, "{ $ne: '1'}");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });

    it('loginTest#5', async function () {
      let result, catch_err;
      try {
        result = await infomgr.Login(2017220301024, "test");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_error);
    });
});
