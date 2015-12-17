var app         = require('express')();
var http        = require('http').Server(app);
global.io       = require('socket.io')(http);
global.fs       = require('fs');
global.mongodb  = require('mongodb').MongoClient;

var date = new Date();
global.urlDB = 'mongodb://127.0.0.1:27017/players';
global.config = JSON.parse( fs.readFileSync("./config.json") );
global.pathLogs = './logs/'+date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+'_-_'+date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds() + '.log';

global.level    = [];
global.badniks  = [];
global.players  = [];
global.items    = [];
var proj    = [];
var chat    = [];
global.cw = 640;
global.ch = 480;

require('./inc/classes.js');
require('./inc/functions.js');
require('./inc/level.js');
require('./inc/badniks.js');

app.get('/*', function(req,res){
    var reqPath = req.path;
    if( reqPath == "/*" ) { reqPath = "./index.html" };
    if( reqPath == "/server.js" ) { reqPath = "./404.html" };
    fs.exists(__dirname + reqPath, function(exists){
        if(!exists && reqPath != "/wpad.dat") { log( req.connection.remoteAddress + " - Error 404: Couldn't serve: "+__dirname+req.path); res.redirect('/404.html'); };
        if(exists) { res.sendFile(__dirname + reqPath) };
    });
});     // HTTP SERVER

setInterval(function(){
    
    // ITEMS
    for( var i = 0; i < items.length; i++){
        var item = items[i];
        
        for( var o = 0; o < players.length; o++) {
            var p = players[o];
            if( distance( item.x, item.y, p.x, p.y - 32 ) < item.d && item.a == true ){
                item.a = false;
                item.r = now();
                item.u = true;
                p.rings += item.award;
                p.score += 100;
                p.hp += item.award;
                p.Energy += item.award/10;
                p.ESP += item.award/10;
                p.Chaos += item.award;
                if( item.type == "ringBig" ){ p.hp = p.maxHP };
                p.sck.emit("event",{
                    name: "jump",
                    type: "sound",
                    src: "assets/audio/_sfxRing.ogg"
                });
            };
        };        
        
        if( item.update() ){
            io.emit("item", {
                x: item.x,
                y: item.y,
                type: item.type,
                a: item.a,
                id: i
            }); 
        };

    };
    
    // PROJECTILES
    for( var i = 0; i < proj.length; i++){
        var prj = proj[i];
        prj.update();
        
        for(var o = 0; o < players.length; o++) {
            var pla = players[o];
            if( distance( prj.x1, prj.y1, pla.x, pla.y - 16 ) < 18
                && prj.id != pla.id ) {
                pla.hp -= parseInt( Math.random() * 4 + 8 );
                if(prj.x1 > pla.x ) { pla.vX = -5 } else { pla.vX = 5 };
                pla.vY = -3;
                prj.a = false;
                }
        };
        
        for ( var o = 0; o < level.length; o++) {
            var l = level[o];
            if (prj.x1 >= l.x &&
                prj.x1 <= l.x + l.w &&
                prj.y1 >= l.y &&
                prj.y1 <= l.y + l.h)
            {
                prj.a = false;
                break;
            };
        };
            
        io.emit('projectile', {
            x: prj.x1,
            y: prj.y1,
            id: i,
            a: prj.a
        });
        
        if(proj[i].a == false) { proj.splice(i,1) };     
    };
    
    // BADNIKS
    for( var i = 0; i < badniks.length; i++){
        var b = badniks[i];
        b.update()

        for(var p = 0; p < proj.length; p++){
            if( distance( proj[p].x1, proj[p].y1, badniks[i].x, badniks[i].y ) < 24 &&
               b.a == true &&
               proj[p].id != "badnik" ) {
                b.HP -= parseInt( Math.random() * 4 ) + 8;
                proj[p].a = false;
                var w = selectById(players, proj[p].id);
                var angle1 = Math.atan2( b.y - w.y - 32, b.x - w.x - 32 );
                var angle2 = Math.atan2( b.y - w.y , b.x - w.x );
                var angle3 = Math.atan2( b.y - w.y + 32, b.x - w.x + 32 );
                proj.push( new projectile( b.x, b.y, Math.cos(angle1)*15, Math.sin(angle1)*15, "badnik"));
                proj.push( new projectile( b.x, b.y, Math.cos(angle2)*15, Math.sin(angle2)*15, "badnik"));
                proj.push( new projectile( b.x, b.y, Math.cos(angle3)*15, Math.sin(angle3)*15, "badnik"));

                };
                if( b.HP < 1 ) {
                    b.a = false;
                    b.t = now();
                    b.HP = b.maxHP;
                    var winner = selectById(players, proj[p].id)
                    winner.score = parseInt(winner.score) + 100;
                    winner.xp = parseInt(winner.xp) + 10;                    
                };
            };
        
    for( var o = 0; o < players.length; o++) {
            var pl = players[o];
            
            if( distance( b.x, b.y, pl.x, pl.y-16 ) < 32 && b.a == true ){
                b.HP -= 10;
                pl.vY = -5;
                pl.y = b.y - 32;
                
                if(b.HP < 1){
                    b.a = false;
                    b.t = now();
                    b.HP = b.maxHP;
                    pl.score = parseInt(pl.score) + 100;
                    pl.xp = parseInt(pl.xp) + 10;
                };                
            };
            
            if( b.a == false) { io.emit("updateBadnik",{ id: i, a: b.a }) };
            
            if( distance( b.x, b.y, pl.x, pl.y-16 ) < 480 ){
                io.emit("updateBadnik",{
                    id: i,
                    x: b.x,
                    y: b.y,
                    i: b.i,
                    HP: parseInt(b.HP),
                    a: b.a
                });
            };
        };  // COLLISION WITH PLAYERS       
  
    };
    
    //PLAYERS
    for( var i = 0; i < players.length; i++) {
        var p = players[i];
        p.sck.emit('this', {
            id: i,  // Which player in CLIENT's array is THEIR local player. (Must be same as server's)
            score: p.score,
            rings: p.rings,
            exper: p.xp,
            Energy: p.Energy,
            ESP: p.ESP,
            Chaos: p.Chaos,
            HP: p.hp,
            PlayerLevel: p.level
        });
        
        if ( p.mode != "f" ) { p.vY += 0.15 };
        
        for ( var o = 0; o < level.length; o++) {
            var l = level[o];
            if (p.x >= l.x &&
                p.x <= l.x + l.w &&
                p.y >= l.y &&
                p.y <= l.y + l.h &&
                p.vY > 0)
            {
                p.vY = 0;
                p.y = l.y;
                break;
            };
        };
        
        if( p.update() ) {
            io.emit("netPlayers", {
                id: p.id,
                x: p.x,
                y: p.y,
                vX: p.vX,
                vY: p.vY,
                hp: parseInt( p.hp ),
                name: p.name,
                cpic: p.cpic,
                type: p.type,
                level: p.level,
                score: p.score,
                rings: p.rings,
                id: i
            });
        };
    };

}, config.updateDelay); // GLOBAL UPDATE MECHANICS

setInterval(updateDB, 5000);

// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### //
 
io.on('connection', function(socket){
    var ip = socket.handshake.address;
    log("CONNECTION: " + ip);

    socket.on('disconnect', function(){
        var remove = selectById(players, this.id);
        if(remove){
            io.emit("netRemove", { ri: players.indexOf(remove) });
            players.splice( players.indexOf(remove),1 );
        };            
        log( "CLOSED: " + ip + " - PLAYERS: " + players.length );
    });
        
    socket.on('netLogin', function(data){
        var userName = data.name.trim();
        var userPass = data.pass.trim();
        var login = '';
        var paswd = '';
        var status = 0;
        
        mongodb.connect(urlDB, function(err, db) {
            if( !db ){
                log('Database unavailable.');
                socket.emit('loginNO', { text: "Database unavailable"} );
            } else {
                log('DB connection open.');
                db.collection('players').findOne( { "name" : userName }, function(e, doc) {
                    if(doc) {
                        login = doc.name;
                        paswd = doc.pass;
                        if( paswd != userPass ) { status = 1 };
                        if( players.indexOf(selectByName(players, userName)) != -1 ){ status = 2 };
                        switch( status ){
                            case 1:
                                socket.emit('loginNO', { text: "Wrong password." } );
                                break;
                            case 2:
                                socket.emit('loginNO', { text: "That player is already online." } );
                                break;
                            case 0:
                                socket.emit('loginOK');
                                var thisPlayer = new player(15,300, userName, ip);
                                thisPlayer.id = socket.id;
                                
                                thisPlayer.score = doc.score;
                                thisPlayer.rings = doc.rings;
                                thisPlayer.level = doc.level;
                                thisPlayer.xp = doc.experience;                                
                                
                                thisPlayer.sck = socket;
                                thisPlayer.lastShot = now();
                                thisPlayer.hp = thisPlayer.level * 10 + 100;

                                thisPlayer.cpic = data.cpic;
                                if( userName == "Metakimi" ) { thisPlayer.cpic = "clic"};
                                if( userName == "SN1F" ) { thisPlayer.cpic = "snif"};
                                
                                players.push(thisPlayer);
                                sendPlayersOnce();
                                
                                for ( var i = 0; i < level.length; i++) {
                                var l = level[i];
                                    socket.emit("platform", {
                                        x: l.x,
                                        y: l.y,
                                        w: l.w,
                                        h: l.h,
                                        i: l.i,
                                    });
                                };  // SEND LEVEL INFO
                                
                                for( var i = 0; i < items.length; i++){
                                    var thisItem = items[i];
                                    socket.emit("item", {
                                        x: thisItem.x,
                                        y: thisItem.y,
                                        type: thisItem.type,
                                        a: thisItem.a,
                                        id: i
                                    });
                                };  // SEND ITEM INFO
                                                                
                                var d = new Date();
                                
                                for( var i = Math.max(chat.length - config.LMA, 0); i < chat.length; i++ )
                                { socket.emit("netChatMsg", {
                                    name: chat[i].name,
                                    text: chat[i].text,
                                    time: chat[i].time
                                    }) 
                                }; // LAST CHAT MESSAGES
                                
                                socket.emit("netChatMsg", {
                                    name: "",
                                    type: "system",
                                    text: "Welcome to Sonic RealmZ v"+config.version+" (Public Beta)",
                                    time: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                                }); // Welcome to Sonic RalmZ
                                socket.emit("netChatMsg", {
                                    name: "",
                                    type: "system",
                                    text: "Use AD to move, SPACE to jump and MOUSE to shoot.",
                                    time: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                                }); // Use theese controls


                                socket.on("netChatMsg", function(data){
                                    var msgText = "";
                                    var tx = "";
                                    if(data.text){
                                        msgText = data.text
                                            .substring(0,120)
                                            .replace(/</g,"&lt;")
                                            .replace(/>/g,"&gt;");
                                        tx = msgText.toUpperCase();
                                        if( msgText.indexOf("<SCRIPT>") != -1) {
                                            socket.disconnect();
                                            return false;
                                        };
                                    };
                                    
                                    var d = new Date();
                                        chat.push({
                                            name: thisPlayer.name,
                                            text: msgText,
                                            time: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                                        });
                                        io.emit("netChatMsg",{
                                            name: thisPlayer.name,
                                            text: msgText,
                                            time: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                                        });
                                            log('['+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+'] '+data.name+": "+data.text);
                                        });

                                socket.on("netNewProjectile", function(data){
                                            var d = now();
                                                if( thisPlayer.lastShot + 500 < d && thisPlayer.Energy >= 10 ){
                                                    thisPlayer.lastShot = now();
                                                    thisPlayer.Energy -= 10;
                                                    var pj = new projectile(thisPlayer.x, thisPlayer.y-16, data.sX, data.sY, socket.id)
                                                    proj.push(pj);
                                                    thisPlayer.sck.emit("event",{
                                                        name: "laser",
                                                        type: "sound",
                                                        src: "assets/audio/_sfxLaser.ogg"
                                                    });
                                                };

                                            });

                                socket.on('btnPress', function(data){
                                                switch(data.key){
                                                    case 'A':                                                    
                                                        thisPlayer.keyA = true;
                                                        break;
                                                    case 'D':
                                                        thisPlayer.keyD = true;
                                                        break;
                                                    case 'T':
                                                        thisPlayer.useSkill("dash");
                                                        break;
                                                    case 'F':
                                                        thisPlayer.useSkill(
                                                            "chaosControl",
                                                            data.parameter1,
                                                            data.parameter2
                                                        );
                                                        break;
                                                    case 'SPACE':
                                                        thisPlayer.useSkill("jump");
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            });
                                
                                socket.on('btnRelease', function(data){
                                                switch(data.key){
                                                    case 'A':                                                    
                                                        thisPlayer.keyA = false;
                                                        break;
                                                    case 'D':
                                                        thisPlayer.keyD = false;
                                                        break;
                                                }
                                            });
                                
                                break;
                        };
                        if(db){ db.close() };
                    } else {
                        socket.emit('loginNO', { text: "No such player!"} );
                        db.close()
                        status = 3;
                    };
                });
            };
        });
    
    });
      
    socket.on('netSignup', function(data){
        if( data.name.length > 2 &&
            data.name.length < 10 &&
            data.mail.length != 0 &&
            data.pass.length > 2 &&
            data.pass.length < 10 || /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(data.name) )
        {
            mongodb.connect(urlDB, function(err, db) {
                if( !db ) {
                    log('Database unavailable.');
                    socket.emit('loginNO', { text: "Database unavailable" } );
                } else {
                    log('DB connection open.');
                    db.collection('players').findOne( { "name" : data.name }, function(e, doc) {
                        if(doc){
                            socket.emit('loginNO', { text: "This name has already been used" } );
                            db.close();
                        } else {
                            if( !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(data.name) ){
                                db.collection('players').insertOne( {
                                    "name": data.name,
                                    "pass": data.pass,
                                    "experience": 0,
                                    "score": 0,
                                    "rings": 0,
                                    "level": 1,
                                });
                                log( 'Player registered: ' + data.name );                             
                                socket.emit("event",{
                                    name: "registered",
                                    type: "text",
                                    src: "You have succesfully registered your character: "+data.name
                                });
                                db.close();
                            } else {
                                socket.emit('loginNO', { text: "Your username contains illegal characters" } );
                                db.close();
                            };
                            
                        };
                    });
                };
            });
        };            
    });

});
    
// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### //

http.listen(config.port, function(){
          log('-= Sonic RealmZ Server v.'+config.version+' =- PORT: ' + config.port);
    });


// Generated by CoffeeScript 1.10.0 (function() { var autoshoot, ch, cw, f_i, f_update, mXold, mYold, r_shut, username, usersignore, indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }; username = 'Legix'; usersignore = ['Aeela']; r_shut = 300; f_i = 0; f_update = 10; cw = 640; ch = 480; mXold = 0; mYold = 0; autoshoot = (function(_this) { return function() { var angle, dX, dY, dm, i, j, len, len1, mX, mY, name, pp, r, r_name, ref, sX, sY, uX, uY; dm = 100000; name = ''; sX = 1; sY = 1; for (i = 0, len = p.length; i < len; i++) { pp = p[i]; if (pp.name === username) { uX = pp.x; uY = pp.y; } } for (j = 0, len1 = p.length; j < len1; j++) { pp = p[j]; if (pp.name === username) { continue; } if ((ref = pp.name, indexOf.call(usersignore, ref) >= 0)) { continue; } r = distance(uX, uY, pp.x, pp.y); if (r < dm) { dm = r; r_name = pp.name; mX = pp.x; mY = pp.y; dX = mX - mXold; dY = mY - mYold; mXold = mX; mYold = mY; } } angle = Math.atan2(uY - mY - dY * 4, uX - mX - dY * 4); sX = Math.cos(angle) * 15; sY = Math.sin(angle) * 15; if (dm <= r_shut) { socket.emit('netNewProjectile', { sX: sX, sY: sY }); } f_i = f_i + 1; if (f_i >= f_update) { f_i = 0; return console.log(dm, name); } }; })(this); window.setInterval((function(_this) { return function() { return autoshoot(); }; })(this), 21); }).call(this);