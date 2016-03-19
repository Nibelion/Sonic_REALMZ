var app         = require('express')();
var http        = require('http').Server(app);
var mail        = require('nodemailer');

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
global.proj     = [];
global.chat     = [];

global.spawnPoints = [
    { x: 0, y: 0 },
    { x: 5300, y: -1090 },
    { x: 6750, y: 450 },
    { x: 7400, y: -2560 },
    { x: 11050, y: -2350 },
    { x: 11050, y: -2350 }
];

global.cw = 1024;
global.ch = 600;

var gravity = 0.25;
var forgotTimer = 0;
var transporter = mail.createTransport('smtps://admin%40sonic-realmz.com:Peauty69@smtp.1and1.com');

var recoveryText = "Dear user. Here is your password for your character: ";
var recoveryHtml = "<b>Dear user</b><p>Here is your password for your character: </p>";

require('./inc/classes.js');
require('./inc/functions.js');
require('./inc/level.js');

setInterval(function(){
    
    // ITEMS
    for( var i = 0; i < items.length; i++){
        if( items[i].update() )
            { io.emit("item", {
                x: items[i].x,
                y: items[i].y,
                type: items[i].type,
                a: items[i].a,
                id: i
            } ) };
    };
    
    // PROJECTILES
    for( var i = 0; i < proj.length; i++ ) {
        var prj = proj[i];
        prj.update();
        
        for( var o = 0; o < players.length; o++ ) {
            var p = players[o];
            
            if( distance( prj.x1, prj.y1, p.x, p.y - 16 ) < prj.radius * prj.radius &&
                distance( 0, 0, p.x, p.y - 16 ) > 200 * 200 &&               
                prj.id != p.id ) {
                p.hp -= prj.damage();
                p.vY = -1.5;
                p.Controllable = false;
                p.cTimer = 15;
                p.socket.emit('this', { HP: p.hp });

                if( prj.x1 > p.x ) {
                    p.vX = -1.5
                } else {
                    p.vX = 1.5
                };
                
                prj.a = false;
            };            
        };
        
        for ( var o = 0; o < level.length; o++) {
            var l = level[o];
            if (prj.x1 >= l.x &&
                prj.x1 <= l.x + l.w &&
                prj.y1 >= l.y &&
                prj.y1 <= l.y + l.h &&
                l.c != 'nocollision')
            {
                prj.a = false;
                break;
            };
        };
            
        io.emit('projectile', {
            x: prj.x1,
            y: prj.y1,
            id: i,
            a: prj.a,
            i: prj.i
        });
        
        if( proj[i].a == false ) { proj.splice( i, 1 ) };     
    };
    
    // BADNIKS
    for( var i = 0; i < badniks.length; i++){
        var b = badniks[i];
        b.update();        

        for( var p = 0; p < proj.length; p++ ){
            var prj = proj[p];
            if( distance( proj[p].x1, proj[p].y1, b.x, b.y ) < prj.radius * prj.radius &&
               b.a == true &&
               proj[p].id != "badnik" ) {
                    b.HP -= parseInt( Math.random() * 4 ) + 8;
                    proj[p].a = false;
                };
                if( b.HP < 1 ) {
                    b.a = false;
                    b.t = now();
                    b.HP = b.maxHP;
                    var winner = selectById(players, proj[p].id)
                    winner.score = winner.score + b.awardScore;
                    winner.xp = winner.xp + b.awardXP;
                    winner.socket.emit('this',{ XP: winner.xp })
                };
        };  // COLLISION WITH PROJECTILES AND DEATH
        
        for( var o = 0; o < players.length; o++ ) {
            var p = players[o];
        
            if( distance( b.x, b.y, p.x, p.y-16 ) < 32 * 32 && b.a == true ){
                b.HP -= 10;
                p.vY = -2;
                p.y = b.y - 32;
                p.Controllable = true;
                
                if(b.HP < 1){
                    b.a = false;
                    b.t = now();
                    b.HP = b.maxHP;
                    p.socket.emit('this', {
                        id: o,  // Which player in CLIENT's array is THEIR local player. (Must be same as server's)
                        Score: p.score = parseInt(p.score) + 100,
                        XP: p.xp = parseInt(p.xp) + 10
                    });
                };
            };  // COLLISION WITH PLAYERS
        
            if ( distance( b.x, b.y, p.x, p.y - 16 * 16 ) < 800 * 800 ){
                if ( b.a == false ) {
                    p.socket.emit("updateBadnik",{ id: i, a: b.a, type: b.type }) 
                } else {
                    p.socket.emit("updateBadnik",{
                        id: i,
                        x: b.x,
                        y: b.y,
                        i: b.i,
                        HP: parseInt(b.HP),
                        a: b.a,
                        type: b.type
                    });
                };
            };  // IS BADNIK ON THE SCREEN?
            
            if( distance( b.x, b.y, p.x, p.y - 16 ) < 300 * 300 && !b.aggro )
                { b.aggro = p; break };
            
            if( distance( b.x, b.y, p.x, p.y - 16 ) > 300 * 300 && b.aggro )
                { b.aggro = undefined };
        };  
    };
    
    // PLAYERS
    for( var i = 0; i < players.length; i++) {
    var p = players[i];
        p.socket.emit('this', {
            id: i,
            Energy: p.Energy,
            ESP: p.ESP,
            Chaos: p.Chaos,
            Score: p.score,
            Rings: p.rings
        });

        if( p.mode != "f" && p.Controllable ) { p.vY += gravity };
        if( p.Levitate == 1 ) { p.vY = 0; p.ESP -= 1 };
        if( p.ESP < 1 && p.Levitate == 1 ) { p.Levitate = 0 };
        
        // !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !
        
        for ( var o = 0; o < level.length; o++) {
        var l = level[o];
            
            if( p.x >= l.x - 8 && p.x <= l.x + l.w + 8 && p.y + p.vY >= l.y && p.y + p.vY <= l.y + l.h && l.c != "skip" && p.vY > 0 )
                {
                    p.vY = 0;
                    p.Controllable = true;
                    p.y = l.y;
                    if ( p.doubleJump == false ) { p.doubleJump = true };
                };

            if( p.x >= l.x - 8 && p.x <= l.x + l.w + 8 && p.y >= l.y + l.h * 0.5 && p.y <= l.y + l.h + 32 && l.c != "nocollision" && p.vY < 0 )
                {
                    p.vY = 0;
                    p.Controllable = true;
                };
            
            if( p.y - 16 >= l.y && p.y <= l.y + l.h + 16 && p.x >= l.x - p.w * 0.25 && p.x <= l.x + l.w * 0.5 && l.c != "nocollision" && p.vX > 0 )
                {
                    p.vX = 0;
                    p.x = l.x - 16;
                    
                };
            
            if( p.y - 16 >= l.y && p.y <= l.y + l.h + 16 && p.x <= l.x + l.w + p.w * 0.25 && p.x >= l.x && l.c != "nocollision" && p.vX < 0 )
                {
                    p.vX = 0;
                    p.x = l.x + l.w + 16;
                };
            
        };  // LEVEL COLLISION
        
        // !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !!! !
        
        if( p.update() ) {
            io.emit("netPlayers", {
                x: +(p.x).toFixed(2),
                y: +(p.y).toFixed(2),
                hp: parseInt(p.hp),
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

setInterval(updateDB, 3500);

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
                        if( paswd != userPass ){ status = 1 };
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
                                var thisPlayer = new player( 0, 0, userName, ip );
                                thisPlayer.spawn();
                                thisPlayer.id = socket.id;
                                
                                thisPlayer.name = doc.name;
                                thisPlayer.score = doc.score;
                                thisPlayer.rings = doc.rings;
                                thisPlayer.level = doc.level;
                                thisPlayer.xp = doc.experience;        
                                thisPlayer.socket = socket;
                                thisPlayer.lastShot = now();
                                thisPlayer.hp = thisPlayer.level * 10 + 100;
                                thisPlayer.cpic = doc.sprite;                                

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
                                        c: l.c,
                                        id: l.id
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

                                for( var i = Math.max(chat.length - config.LMA, 0); i < chat.length; i++ ) {
                                    socket.emit("netChatMsg", {
                                        name: chat[i].name,
                                        text: chat[i].text,
                                        type: chat[i].type,
                                        time: chat[i].time
                                    }) 
                                };
                                // LAST CHAT MESSAGES
                                
                                var d = new Date();
                                var dH, dM, dS;
                                if ( d.getHours() < 10 ) { dH = "0" +d.getHours()}else{ dH = d.getHours() };
                                if ( d.getMinutes() < 10 ) { dM = "0" +d.getMinutes()}else{ dM = d.getMinutes() };
                                if ( d.getSeconds() < 10 ) { dS = "0" +d.getSeconds()}else{ dS = d.getSeconds() };
                                
                                netChatMsg('','system',"☣ Welcome to Sonic RealmZ v"+config.version+" (Public Beta) ☣",false, false, thisPlayer); // Welcome to Sonic RealmZ
                                
                                netChatMsg('','system',"Use AD to move, SPACE to jump and MOUSE to shoot.",false, false, thisPlayer); // Welcome to Sonic RealmZ
                                
                                socket.on("sysItemCollected", function(data){
                                    if( items[data.id] &&
                                        distance(
                                        items[data.id].x,
                                        items[data.id].y,
                                        thisPlayer.x,
                                        thisPlayer.y - 16) < 32 * 32 && 
                                        items[data.id].a == true )
                                    { awardPlayer( items[data.id], thisPlayer ) }
                                });

                                socket.on("netChatMsg", function(data){
                                    var msgText = "";
                                    var tx = "";
                                    if(data.text){
                                        msgText = data.text
                                            .substring(0,120)
                                            .replace(/</g,"&lt;")
                                            .replace(/>/g,"&gt;")
                                            .trim();
                                        tx = msgText.toUpperCase();
                                        if( msgText.indexOf("<SCRIPT>") != -1) {
                                            socket.disconnect();
                                            return false;
                                        };
                                    };
                                    
                                    netChatMsg(thisPlayer.name, undefined, msgText, true, true);
                                });

                                socket.on("netNewProjectile", function(data){
                                            var d = now();
                                                if( thisPlayer.lastShot + 500 < d && thisPlayer.Energy >= 10 ){
                                                    thisPlayer.lastShot = now();
                                                    thisPlayer.Energy -= 10;
                                                    var pj = new projectile(thisPlayer.x, thisPlayer.y-16, data.sX, data.sY, socket.id)
                                                    proj.push(pj);
                                                    thisPlayer.socket.emit("event",{
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
                                                    case 'E':
                                                        thisPlayer.useSkill(
                                                            "homingAttack",
                                                            badniks[data.parameter1].x,
                                                            badniks[data.parameter1].y
                                                        );
                                                        break;
                                                    case 'R':
                                                        thisPlayer.useSkill("ESP_Levitate");
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
                        };                        
                        if( db ){ db.close() };
                    } else {
                        socket.emit('loginNO', { text: "No such player!"} );
                        db.close()
                    };
                });
            };
        });
    
    });
      
    socket.on('netSignup', function(data){
        if( data.name.length >= 2 &&
            data.name.length <= 10 &&
            data.mail.length >= 3 &&
            data.pass.length >= 2 &&
            data.pass.length <= 10 )
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
                                var sprite = data.cpic;
                                db.collection('players').insertOne( {
                                    "name": data.name,
                                    "pass": data.pass,
                                    "experience": 0,
                                    "score": 0,
                                    "rings": 0,
                                    "level": 1,
                                    "email": data.mail,
                                    "sprite": sprite
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
    
    socket.on('netForgot', function(data){
        if ( forgotTimer + 60000 < now()  ){
        forgotTimer = now();
        socket.emit('event', { type: 'text', src: "Processing." } );
        mongodb.connect(urlDB, function(err, db) {
            db.collection('players').findOne( { "name" : data.who }, function(e, doc) {
                if(doc){
                    var email = {
                        from: 'Sonic RealmZ admin <admin@sonic-realmz.com>',
                        to: doc.email,
                        subject: 'Password recovery',
                        text: recoveryText + doc.pass,
                        html: recoveryHtml + doc.pass
                    };
                    transporter.sendMail(email, function(error, info){
                        if(error){
                            socket.emit('event', {type: 'text', src: "Something went wrong. Please contact admin."} );
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                        socket.emit('event', { type: 'text', src: "Your password has been sent to your email." } );
                    });
                    log(data.who + " - password reminded.");
                    
                } else {
                    log(data.who + " not found or other internal error");
                    socket.emit('event', { type: 'text', src: "That character does not exist." } );
                }
                
                socket.emit('event', { type: 'system', code: 101 } );
                db.close();
            });            
        });
        } else {
            socket.emit('event', {
                type: 'text',
                src: "Password recovery system is on cooldown. Try again in " + (forgotTimer + 60000 - now()).toString().substring(0,2) +" seconds." }
                       );
        };
    });
});
    
// ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### ### //

http.listen(config.port, function(){
          log('-= Sonic RealmZ Server v.'+config.version+' =- PORT: ' + config.port);
    });

// dirty sloths a ruining my suflae