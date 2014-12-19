//instantiates mongo client and sets up node server
var http = require('http'),
    express = require('express'),
    path = require('path');

MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
CollectionDriver = require('./collectionDriver').CollectionDriver;
 
var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade'); 
app.use(express.bodyParser());

//running on ec2
var mongoHost = 'ec2-54-69-87-192.us-west-2.compute.amazonaws.com'; 
var mongoPort = 27017; 
var collectionDriver;
 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort)); 
mongoClient.open(function(err, mongoClient) { 
  if (!mongoClient) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); 
  }
  var db = mongoClient.db("MyDatabase");  
  collectionDriver = new CollectionDriver(db); 
});
 
app.use(express.static(path.join(__dirname, 'public')));

//getting points back from mongo
app.get('/:collection', function(req, res) { 
   var params = req.params; 
   collectionDriver.findAll(req.params.collection, function(error, objs) { 
			  if (error) { res.send(400, error); } 
	      else { 
	          if (req.accepts('html')) { 
			          res.render('data',{objects: objs, collection: req.params.collection}); 
              } else {
									res.set('Content-Type','application/json'); 
                  res.send(200, objs); 
              }
         }
		});
});
 
app.get('/:collection/:entity', function(req, res) { 
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
	console.log("trying to get");
	console.log(params);
	// basic get request
   if (entity.indexOf("$") == -1) {
       collectionDriver.get(collection, entity, function(error, objs) { 
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } 
       });
	 // geonear get request
	 // url format should be: ip:port/collectionName/$lat1_long1_lat2_long2
   } else if ( entity ){
			entity = entity.substring(1, entity.length);
			var coords = entity.split("_");
			console.log(coords);
			if (coords.length != 4) {
				res.send(400, {error: 'bad url does not contain the correct amount of lat/long coordinates. use format ip:port/collectionName/$lat1_long1_lat2_long2.', url: req.url});
			} else {
				for(var i=0; i<coords.length; i++)
					coords[i] = parseFloat(coords[i]);
			 collectionDriver.geoNear(collection, coords[0], coords[1], coords[2], coords[3], function(error, objs) { 
					if (error) { res.send(400, error); }
					else { res.send(200, objs); } 
			 });
			}	
	 } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

//post request for adding locations to mongo
app.post('/:collection', function(req, res) { 
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) { res.send(400, err); } 
          else { res.send(201, docs); } 
     });
});

//put request to mongo
app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C
       });
   } else {
       var error = { "message" : "Cannot PUT a whole collection" };
       res.send(400, error);
   }
});

app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
   }
});
 
app.use(function (req,res) {
    res.render('404', {url:req.url});
});
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
