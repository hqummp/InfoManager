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

infomgr.addInfo = async function(year, month, day, source, category, subcategory, title, subtitle, content, remark, level){
  if(!isDateLegal(year, month, day)){
    throw new Error(message.date_illegal);
  }

  let insert_json = {
    'year' : year,
    'month' : month,
    'day' : day,
    'sourse' : source,
    'category' : category,
    'subcategory' : subcategory,
    'title' : title,
    'subtitle' : subtitle,
    'content' : content,
    'remark' : remark,
    'level' : level
  }

  let result;
  try{
    result = await kqudie.insert(database, info_collection, insert_json);
  }catch(err){
    throw err;
  }
  if(result){
    return message.success;
  }else{
    throw new Error(message.database_error);
  }
}

infomgr.deleteInfoByid = async function(id){
  let objid = kqudie.String2ObjectId(id);

  let option = {
    'delete' : { '_id' : objid },
  }

  let result;
  try{
    result = await kqudie.remove(database, info_collection, option)
  }catch(err){
    throw err;
  }

  if(result){
    return message.success
  }else{
    throw new Error(message.database_error)
  }
}

infomgr.deleteInfoBytitle = async function(title){
  let option = {
    'delete' : { 'title' : title },
  }

  let result;
  try{
    result = await kqudie.remove(database, info_collection, option)
  }catch(err){
    throw err;
  }

  if(result){
    return message.success;
  }else{
    throw new Error(message.database_error);
  } 
}

infomgr.queryInfo = async function(id){
  let objid = kqudie.String2ObjectId(id);

  let query = {
    '_id' : objid
  }

  let option = {
    'find' : query
  }

  let result;
  try{
    result = kqudie.find(database, info_collection, option);
  }catch(err){
    throw err;
  }

  if(result.length === 1){
    return result;
  }else{
    throw new Error(message.database_error);
  }
}

infomgr.updateInfo = async function(query_json, update_json, option = {}){
  let result;
  try{
    result = kqudie.update(database, info_collection, query_json, update_json , option);
  }catch(err){
    throw err;
  }

  if(result.length === 1){
    return message.success;
  }else{
    throw new Error(message.database_error);
  }
}


 function isDateLegal(year, month, day){
   let isLegal = true;
   if( year<0 || month<0 || month>12 || day<0 || day>31){
     isLegal = false;
   }

   return isLegal;
 }


