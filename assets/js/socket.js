var socket, userName, userPass, id, badniks = [];

function netSocket()
{
    socket = io();  
    
    socket.on('connect', function () {
            
        socket.on('loginOK', function(){
            
            $("#widgetChat").fadeIn(500);
            $("#widgetLogin").fadeOut(500);
            window.focus();
            
            clientState = 1;
            
            socket.on('platform',       function(data){
                var plat = new platform( data.x, data.y, data.w, data.h, data.i, data.c, data.id );
                level.push(plat);
            });
            
            socket.on("netChatMsg",     function(data) {
                var type = data.type;
                if( !data.type ){ type = "normal" };
                $("#messages").append( "<p class='chatMessage " + type + "'>[" +
                data.time+"] <b>"+data.name+"</b>: "+data.text.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</p>" );
                var msg = document.getElementById("messages");
                msg.scrollTop = msg.scrollHeight
            });

            socket.on('netRemove',      function(data){
                p.splice(data.ri,1);
            });

            socket.on("netPlayers",     function(data) {
                if( !p[data.id] ) {
                    p[data.id] = new player( data.x, data.y, data.name, data.cpic );
                    p[data.id].level = data.level;
                    p[data.id].hp = data.hp;
                    p[data.id].xp = data.XP;
                } else {
                    p[data.id].update( data.x, data.y );
                    p[data.id].hp = data.hp;                    
                    p[data.id].level = data.level;
                };
            });

            socket.on("updateBadnik",   function(data) {
                if( !badniks[data.id] ) {
                    badniks[data.id] = new badnik( data.x, data.y, data.type );
                    badniks[data.id].HP = data.HP;
                    badniks[data.id].id = data.id;
                } else {
                    badniks[data.id].x = data.x;
                    badniks[data.id].y = data.y;
                    badniks[data.id].a = data.a;
                    badniks[data.id].HP = data.HP;
                };
            });

            socket.on('projectile',     function(data){
                var newProj = new projectile(data.x, data.y, data.i);
                proj[data.id] = newProj;
                if(data.a == false) { proj.splice(data.id, 1) };
            });
            
            socket.on('item',           function(data){
                var newItem = new item( data.x, data.y, data.type, data.a, data.id );
                items[data.id] = newItem;
            });
            
            socket.on('this',           function(data){
                if( data.id != undefined ) { localPlayer = p[data.id] };
                if( localPlayer ){
                    if(data.Score) { localPlayer.Score = data.Score };
                    if(data.Rings) { localPlayer.Rings = data.Rings };
                    if(data.XP) { localPlayer.XP = data.XP };
                    if(data.Energy) { localPlayer.Energy = data.Energy };
                    if(data.ESP) { localPlayer.ESP = data.ESP };
                    if(data.Chaos) { localPlayer.Chaos = data.Chaos };
                    if(data.HP) { localPlayer.HP = data.HP };
                    if(data.PlayerLevel) { localPlayer.Level = data.PlayerLevel };
                    if(data.vY) { localPlayer.vY = data.vY };
                };
            });            
            
        });

        socket.on('loginNO',        function(data){
            alert( 'LOGIN FAILED: '+data.text );
            document.getElementById("btnConnect").value = "Connect";
            document.getElementById("btnConnect").disabled = false;
            document.getElementById("btnSignup").value = "Signup";
            document.getElementById("btnSignup").disabled = false;
        });

        socket.on('disconnect',     function() {
            alert("Connection with server has been lost.");
            socket.destroy();
        });
        
        socket.on('event',          function(data){
                switch( data.type ) {
                        
                    case "sound":
                        if( optionsSound.checked ) {
                            var audio = document.createElement("audio");
                            audio.src = data.src;
                            audio.addEventListener("ended", function () {
                                audio.remove();
                            }, false);
                            audio.play();
                        };
                        break;
                        
                    case "text":
                        alert(data.src);
                        if(data.name == "registered"){
                            $("#widgetSignup").fadeOut( 500, function(){
                                $("#widgetLogin").fadeIn( 500 );
                            });                            
                        };
                        
                    case "misc":
                        break;
                        
                    case "system":
                        switch( data.code ){
                            case 101:
                                document.getElementById("btnForgot").value = "Forgot password?";
                                document.getElementById("btnForgot").disabled = false;
                                break;
                            default:
                                break;
                        };
                        
                        break;
                        
                    default:
                        break;
                };

        });

    });
    
};

// # HELPER FUNCTIONS # //
selectById = function(array, id) {
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].id == id)
            return array[i];
    };
    return false;
};