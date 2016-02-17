// FUNCTIONS
global.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
};

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

global.distance = function(x1,y1,x2,y2){ return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) };

global.now = function(){ return (new Date).getTime() };

global.sendPlayersOnce = function(){
    for( var i = 0; i < players.length; i++) {
        var p = players[i];
        
            io.emit("netPlayers", {
                id: p.id,
                x: p.x,
                y: p.y,
                hp: p.hp,
                name: p.name,
                cpic: p.cpic,
                type: p.type,
                level: p.level
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

global.rectsOverlap = function(x1,y1,w1,h1,x2,y2,w2,h2){
    if( x1 >= x2 && x1 + w1 <= x2 + w2 && y1 >= y2 && y1 + h1 <= y2 + h2 ) { return true } else { return false };
};

global.awardPlayer = function( item, target ) {
    item.a = false;
    item.r = now();
    item.u = true;
    target.rings += item.awardRings;
    target.score += item.awardScore;
    target.hp += item.awardHP;
    target.Energy += item.awardEnergy;
    target.ESP += item.awardESP;
    target.Chaos += item.awardChaos;
    
/*    target.socket.emit("event",{
        name: "jump",
        type: "sound",
        src: "assets/audio/_sfxRing.ogg"
    });*/
};

global.netChatMsg = function( author, type, text, cache, logging, recepient ) {
    var d = new Date();
    var dH, dM, dS;
    if ( d.getHours() < 10 ) { dH = "0" +d.getHours()}else{ dH = d.getHours() };
    if ( d.getMinutes() < 10 ) { dM = "0" +d.getMinutes()}else{ dM = d.getMinutes() };
    if ( d.getSeconds() < 10 ) { dS = "0" +d.getSeconds()}else{ dS = d.getSeconds() };
    
    if( recepient ){
        recepient.socket.emit('netChatMsg',{
                name: author,
                type: type,
                text: text,
                time: dH + ":" + dM + ":" + dS
            });
    } else {
        io.emit("netChatMsg", {
            name: author,
            type: type,
            text: text,
            time: dH + ":" + dM + ":" + dS
        });
    };
    
    
    if( cache ) {
        chat.push({
            name: author,
            type: type,
            text: text,            
            time: dH + ":" + dM + ":" + dS
        });
    };
    if( logging ){
        log(author+": "+text);
    };    
};

// shpargalko
// use players
// db.players.update( {}, { $set: { score: p.score } }, { multi: true } )
// db.players.update( { name: "this"}, { $set: { score: p.score } } )
// db.players.update( {}, { $set: { score: "500" } }, { multi: true } )