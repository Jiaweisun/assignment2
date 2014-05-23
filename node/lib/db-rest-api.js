//API implementation

var common=require('./common')
var uuid=common.uuid
var mongodb=common.mongodb

var restaurantItem=null//todocoll
var util={}
util.validate=function(input){return input.name}
util.fixid=function(doc){
	if(doc._id){
		doc.id=doc._id.toString()
		delete doc._id
	}else if(doc.id){
    console.log(new mongodb.ObjectID(doc.id));
		doc._id=new mongodb.ObjectID(doc.id)
    console.log(doc._id);
		delete doc.id
	}return doc
}

exports.ping=function(req,res){
	var output={ok:true,time:new Date()}
	res.sendjson$(output)
}
exports.echo=function(req,res){
	var output=req.query
	if('POST' ==req.method){output=req.body}
		res.sendjson$(output)
}
exports.rest={
	create:function(req,res){
		var input = req.body
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }
    var restaurant = {
      restaurant_id:input.restaurant_id,
      name: input.name,//only text
      address: input.address,
      position: input.position,
      created: new Date().getTime(),
    }
    restaurantItem.insert(restaurant,res.err$(function(docs){
      res.sendjson$(util.fixid(docs[0]))
    }))
 

	},
	read:function(req,res){
	var input = req.params
   	 console.log(req.params)
    var query = util.fixid( {id:input.id} )
    restaurantItem.findOne( query, res.err$( function( doc ) {
      if( doc ) {
        var output = util.fixid( doc )
        res.sendjson$( output )
      }
      else {
        res.send$(404,'not found')
      }
    }))
	},
	list:function(req,res){
    var input = req.query
    var output = []
    var query   = {}
    var options = {sort:[['created','desc']]}

    restaurantItem.find( query, options, res.err$( function( cursor ) {
      cursor.toArray( res.err$( function( docs ) {
        output = docs
        output.forEach(function(restaurant){//item
          util.fixid(restaurant)
        })
        res.sendjson$( output )
      }))
    }))

	},
	update:function(req,res){
		var id    = req.params.id
    var input = req.body
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }
    var query = util.fixid( {id:id} )
    restaurantItem.update( query, {$set:{name:input.name}}, {w:1},res.err$( function( count ) {
      if( 0 < count ) {
        var output = util.fixid( input )
        res.sendjson$( output )
      }
      else {
        console.log('404')
        res.send$(404,'not found')
      }
    }))
	},
	del:function(req,res){
		var input = req.params
    var query = util.fixid( {id:input.restaurant_id} )
    restaurantItem.remove( query, res.err$( function() {
      var output = {}
      res.sendjson$( output )
    }))
	}
}

exports.connect=function(options,callback){
options.name = options.name || 'test'
options.server = options.server || '127.0.0.1'
options.port = options.port || 27017

	var database=new mongodb.Db(
		options.name,new mongodb.Server(
			options.server,options.port, {auto_reconnect:true}));


	database.open(function(err,client){
		if(err) return callback(err);
    client.authenticate(options.username,options.password,function(err){

			if(err) return callback(err);
			callback(null,client);
      client.collection('restaurant',function(err,collection){
        if(err) return callback(err);
          restaurantItem=collection
  
    })
		})
	})
}