"use strict";
/**
 ** InfoManager
 **
 ** @version 0.0.1
 **
 */

const url = "mongodb://localhost:27017";

const kqudie = require('kqudie')(url);

const filter = require('filter');

const encrypt = require('encryptor');

const message = require('./message');

const database = "hqummp";

const usr_collection = "userinfo";

const info_collection = "info_detail"

var infomgr = module.exports;

/**
 ** Login
 **
 ** @param uid
 ** @param passwd
 **
 */

infomgr.Login = async function(uid, passwd){
  if (typeof uid === "undefined" || typeof passwd === "undefined" || passwd === "") {
    throw new Error(message.uid_or_password_invalid); //using err.message to get message
  }

  if (!(filter.judgeNumber(uid) && filter.filter(passwd))) {
    throw new Error(message.uid_or_password_invalid);
  }

  let encrypted = encrypt.encrypt(passwd);
  let query = {
    "uid": uid,
    "passwd": encrypted
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, usr_collection, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 1) {
    return message.success;
  } else {
    throw new Error(message.uid_or_password_error);
  }
}
