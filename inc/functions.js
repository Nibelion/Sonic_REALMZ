// FUNCTIONS

global.log = function(text){
    var date = new Date();
    var time = '['+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' - '+date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '] ';
    console.log(time+text);
    
    if(config.logging){
        fs.open(pathLogs, 'a', function(err,id){
            fs.write(id, time+text + "\r\n", null, 'utf8', function(){
                //fs.close();
            });
        });
    };
};

global.selectById = function(array, id) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return array[i];
    };
    return false;
};

global.selectByName = function(array, name) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].name == name)
            return array[i];
    };
    return false;
};

global.distance = function(x1,y1,x2,y2){
    return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );
};

global.now = function(){
    return (new Date).getTime();
};

global.sendPlayersOnce = function(){
    for( var i = 0; i < players.length; i++) {
        var p = players[i];
            io.emit("netPlayers", {
                id: p.id,
                x: p.x,
                y: p.y,
                vX: p.vX,
                vY: p.vY,
                hp: p.hp,
                name: p.name,
                cpic: p.cpic,
                type: p.type,
                level: p.level,
                rings: p.rings,
                id: i
        });
    };
};

global.updateDB = function(){
    mongodb.connect(urlDB, function(err, db) {
        if( !db ){
            log('Database unavailable.');
        } else {
            //log('Updating players info.');
            for( var i = 0; i < players.length; i++) {
                var p = players[i];
                db.collection('players').updateOne(
                    { "name" : p.name },
                        {
                            $set: { "score": p.score,
                                   "rings": p.rings,
                                   "experience": p.xp,
                                   "level": p.level
                                  },
                        }, function(e,r){
                            // something
                        }
                );
            };
            db.close();
        };
    });
};

// use players
// db.players.update( {}, { $set: { score: p.score } }, { multi: true } )
// db.players.update( { name: "this"}, { $set: { score: p.score } } )
// db.players.update( {}, { $set: { score: "500" } }, { multi: true } )