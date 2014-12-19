//used for setting up mongo

var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
	this.db = db;
}

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
      if( error ) callback(error);
      else {
        the_collection.find().toArray(function(error, results) {
          if( error ) callback(error);
          else callback(null, results);
        });
      }
    });
};

// geonear
CollectionDriver.prototype.geoNear = function(collectionName, lat1, long1, lat2, long2, callback) {
	this.getCollection(collectionName, function(error, the_collection) {
			if (error)
				callback(error);
			else {
				the_collection.findOne( { start : { $geoWithin : { $center : [[lat1, long1], .002] } }, end : { $geoWithin : { $center : [ [lat2, long2], .002 ] } } }, function(err, doc) { 
					if (error){
						console.log('could not retrieve doc');
						callback(error);
					}
					else{
						console.log("retrieved doc");
						console.log(doc);
						callback(null, doc.points);
					}
				});
			}
	});
}

// get existing object
CollectionDriver.prototype.get = function(collectionName, query, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
					the_collection.findOne(query, function(error,doc) {
						if (error){
							console.log('could not retrieve doc');
							callback(error);
						}
						else{
							callback(null, doc);
							console.log("retrieved doc");
							console.log(doc);
						}
					});
        }
    });
};

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
      if( error ) callback(error)
      else {
        obj.created_at = new Date();
        the_collection.insert(obj, function() {
          callback(null, obj);
        });
      }
    });
};

//update a specific object
// Note that this update operation replaces whatever was in there before with the new object – there’s no property-level updating supported.
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error);
        else {
            obj._id = ObjectID(entityId); //A convert to a real obj id
            obj.updated_at = new Date(); //B
            the_collection.save(obj, function(error,doc) { //C
                if (error) callback(error);
                else callback(null, obj);
            });
        }
    });
};

//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error);
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
                if (error) callback(error);
                else callback(null, doc);
            });
        }
    });
};

exports.CollectionDriver = CollectionDriver;

