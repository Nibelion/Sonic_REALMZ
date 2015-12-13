global.mongodb  = require('mongodb').MongoClient;
global.urlDB = 'mongodb://127.0.0.1:27017/players';


/*
mongodb.connect(urlDB, function(err, db) {
    if( !db ){
        console.log('Database unavailable.');
    } else {
        console.log('DB connection open.');
    var find
    //db.collection('players').deleteOne( { "name" : "Mickey", "pass": "perets28" } );  // REMOVE
    //db.collection('players').insertOne( { "name" : "Mickey", "pass": "perets28" } );  // INSERT
    //db.collection('players').findOne( { "name" : "Mickey" }, function(e, doc) { console.log(doc.pass) }); //FO
    //db.collection('players').findOne( { "name" : "Mickey" }, function(e, doc) { console.log( find = doc.pass ) }); //FO

    };
});

/*

var findAll = function(db) {
    var cursor = db.collection('players').find();
    cursor.each( function(e, doc){
        if( doc != null ) {
            console.dir(doc);
        };
    });
};

var insertDocument = function(db, cb) {
    db.collection('players').insertOne({
        "name": "That",
        "pass": "perets33"
    }, function(e,r){
        cb(r);
    });
};

var removeDoc = function (db,cb){
    db.collection('players').deleteMany(
        { 'name': "Mickey"},
        function(e,r){
            console.log(r);
            cb();
        }
    );
};

*/