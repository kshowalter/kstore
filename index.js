var _ = require('lodash');

var kdbProto = {
  _addItem: function(document){
    var _id = this.lastId++;
    this.data.push(document);
    for( var name in document ){
      var value = document[name];
      if( this.index[name] === undefined ){
        this.index[name] = {};
      }
      if( this.index[name][value] === undefined ){
        this.index[name][value] = [];
      }
      this.index[name][value].push(_id);
      this.index[name][value] = _.sortedUniq( this.index[name][value] );
    }
    return this;
  },
  insert: function(input){
    var documents;
    if( input.constructor !== Array ){
      documents = [input];
    } else {
      documents = input;
    }
    for( var i = 0; i < documents.length; i++){
      this._addItem(documents[i]);
    }
  },
  _matchList: function(request){
    var request_idList;
    for( var name in request ){
      var value = request[name];
      if( value.constuctor === Object ){
        //handle special request
      }
      if( this.index[name] && this.index[name][value] ){
        var parameter_idList = this.index[name][value];
        if( !request_idList ){
          request_idList = parameter_idList;
        } else {
          request_idList = _.intersection(request_idList, parameter_idList);
        }
      }
    }
    return request_idList;
  },
  find: function(request){
    var data = this.data;
    var request_idList = this._matchList(request);
    if( request_idList && request_idList.length >= 1){
      var documentArray = request_idList.map(function(_id){
        return data[_id];
      });
      return documentArray;
    } else {
      return false;
    }
  },
  findOne: function(request){
    var data = this.data;
    var request_idList = this._matchList(request);
    if( request_idList && request_idList.length >= 1){
      var _id = request_idList[0];
      return data[_id];
    } else {
      return false;
    }
  },
  options: function(name){
    return Object.keys(this.index[name]);
  }

};

//export default function(input){
module.exports = function(input){

  var kdbVariables = {
    data: [],
    lastId: 0,
    index: {}
  };
  console.log(typeof kdbProto,typeof x);
  var kdb = Object.create(kdbProto); // propertiesObject parameter fails on Chromium
  kdb = Object.assign(kdb, kdbVariables);

  if( input ){
    kdb.insert(input);
  }

  return kdb;
}
