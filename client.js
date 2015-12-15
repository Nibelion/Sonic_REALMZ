// PREVENT ENTER FROM SUBMITTING FORMS:
$(document).ready(function() {
    $(window).keydown(function(event){
        if(event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

// REQUEST ANIMATION FRAME TO RENDER CANVAS:
(function(){
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

// MAIN CODE:
function init(){
    
    $('#game').click(function(e){
        $(this).focus();
    });
    $('#game').click(function(e) {
        $('#field').trigger('click');
    });
    
    var _gameWaterLever = 700;
    
    var canvas  = document.getElementById("game");
    region  = canvas.getBoundingClientRect();
    context = canvas.getContext("2d");
    canvas.onmousemove = updateMouse;
    cw = (canvas.width = 640);     // 640 default
    ch = (canvas.height = 480);    // 480 default
    
    document.body.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
        if( e.keyCode == 32 &&
           document.activeElement.id != "formText" &&
           document.activeElement.id != "widgetLogin" ){
            e.preventDefault()
        };
    }); 
    document.body.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
        if ( e.keyCode == 84 ) { socket.emit('btnPress', { 'key': 'T' }) };
        if ( e.keyCode == 70 ) {
                    socket.emit('btnPress', {
                        'key' : 'F',
                        'parameter1': localPlayer.x - ( cw * 0.5 - mX ),
                        'parameter2': localPlayer.y - ( ch * 0.5 - mY ),
                    });
                };
        if ( e.keyCode == 13 && document.activeElement.id == "formText" ) {
            document.getElementById("game").focus();                
            sendMessage();
        } else if ( e.keyCode == 13 && document.activeElement.id == "game" ) {
            document.getElementById("formText").focus();
        };     // enter
    });
    canvas.addEventListener("mousedown", shoot);
    
    // ### MAIN LOOP ### = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //
        
    function update(){

        
        $("#userCount").html( p.length ); 
        
        // CONTROLS
        {

        if ( keys[27] && document.activeElement.id == "formText" ) {
            $("#formText").val('');
            document.getElementById("game").focus();
        };                              // escape

            if ( document.activeElement.id == "game" && socket){
                if ( keys[65] ) { socket.emit('btnPress', { 'key' : 'A' }) };   // left     - 37
                if ( !keys[65] ) { socket.emit('btnRelease', { 'key' : 'A' }) };   // left     - 37
                
                if ( keys[87] ) {  };   // up       - 38
                if ( keys[68] ) { socket.emit('btnPress', { 'key' : 'D' }) };   // right    - 39
                if ( !keys[68] ) { socket.emit('btnRelease', { 'key' : 'D' }) };   // right    - 39
                if ( keys[83] ) {  };   // down     - 40
                if ( keys[32] ) { socket.emit('btnPress', { 'key' : 'SPACE' }) };   // space    - 32
            }

        }
        
        // ### RENDER ### //
        context.drawImage(_image_Sky,0,0);
        
        if( clientState == 0 ) {
            context.drawImage(_imgIsland, 0,0,1039,540);
            context.drawImage(_imglogo, 0,0);
        } else {

            context.save();
            
            if( localPlayer ){     // IF WE HAVE OUR LOCAL PLAYER
                context.translate(
                    parseInt(cw * 0.5 - localPlayer.x),
                    parseInt(Math.max( ch * 0.5 - localPlayer.y, -_gameWaterLever + ch * 0.5 ))
                );
                context.globalAlpha = 0.25;
                context.drawImage(
                    _imgIsland,
                    400 + localPlayer.x * 0.15,
                    parseInt(Math.min( localPlayer.y * 0.25, 145 ))*0.25,
                    1039,
                    540
                );
            };

            context.globalAlpha = 1;
            context.drawImage(_level_TechnoTower,0,-860);

            for ( var i = 0; i < badniks.length; i++) { if ( badniks[i] ) { badniks[i].draw() } };

            for ( var i = 0; i < items.length; i++) { if ( items[i] ) { items[i].draw() } };

            for ( var i = 0; i < level.length; i++) { level[i].draw() };

            for ( var i = 0; i < proj.length; i++) { if( proj[i] ) { proj[i].draw() } };

            for ( var i = 0; i < p.length; i++) { if (p[i]) { p[i].drawPlayer() } };
            
            if( localPlayer ){
                context.fillStyle = "rgba( 0, 0, 168,0.5)";
                context.fillRect( localPlayer.x - cw * 0.5, _gameWaterLever, cw,  ch* 0.5 );
            };
            
            context.restore();
            
            if( localPlayer ) {
                drawBar(context, 10, 10, "#F33", 100, 15, 3, localPlayer.hp, localPlayer.level * 10 + 100 );
                drawBar(context, 10, 25, "#FA0", 100, 15, 3, localPlayer.Energy, 100 );
                drawBar(context, 10, 40, "#0CF", 100, 15, 3, localPlayer.ESP, localPlayer.level * 10 + 100 );
                drawBar(context, 10, 55, "#0B6", 100, 15, 3, localPlayer.Chaos, localPlayer.level * 10 + 100 );
                drawBar(context, 0, ch - 15, "#80F", cw, 15, 3, localPlayer.XP, localPlayer.level * 100 );
                context.font = "12px SonicTitle";
                context.fillStyle = "#FFF";
                context.textAlign = "left"
                context.strokeText("rings: "+localPlayer.Rings,11,85);
                context.fillText("rings: "+localPlayer.Rings,11,85);
                context.strokeText("score: "+localPlayer.Score,11,100);
                context.fillText("score: "+localPlayer.Score,11,100);
            };
            

            //context.drawImage( _spriteRing, 32,0,16,16,mX-8,mY-8,16,16);
        };
        
        requestAnimationFrame(update);
    };

    update();

};

//  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //

const drawBar = function(ctx,x,y,c,w,h,p,v1,v2){
    // ctx - context to draw on
    // x, y - x and y location
    // c - COLOR 
    // w, h - width (x) and height (y) of a bar
    // p - PADDING (fatness of borders)
    // v1 - variable to track
    // v2 - MAX variable
    
    if(ctx){
        ctx.font = ( h - p ) + "px Andale Mono";
        ctx.fillStyle = "black";
        ctx.fillRect( x, y, w, h );
        ctx.fillStyle = c;
        ctx.fillRect( x+p, y+p, ((w - (p * 2)) * v1)/v2, h - p * 2);
        ctx.textAlign = "center";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";        
        ctx.strokeText( parseInt(v1)+"/"+parseInt(v2), x + w * 0.5, y + h * 0.75 );
        ctx.fillStyle = "#FFF";
        ctx.fillText( parseInt(v1)+"/"+parseInt(v2), x + w * 0.5, y + h * 0.75 );
    };
};

function updateMouse(e){
    if(e.offsetX) { mX = e.offsetX; mY = e.offsetY } else
    if(e.layerX) { mX = e.layerX; mY = e.layerY };
};

const netLogin = function(){
    userName = $("#formName").val().trim();
    userPass = $("#formPass").val().trim();
    var choice = e.options[e.selectedIndex].value;
    if(!socket){ netSocket() };
    
    document.getElementById("btnConnect").value = "Trying...";
    document.getElementById("btnConnect").disabled = true;
    
    if(userName.length >= 2 && userName.length <= 10) {
        socket.emit("netLogin", {
            name: userName,
            pass: userPass,
            cpic: choice
        });
        document.getElementById("game").focus();
    } else {
        alert("Minimum 2 characters. Maximum 10 characters.")
    };
};

const netSignup = function(){
    if(!socket){ netSocket() };
    var signUpName = $("#formSignupName").val().trim();
    var signUpPass1 = $("#formSignupPass1").val().trim();
    var signUpPass2 = $("#formSignupPass2").val().trim();
    var signUpMail = $("#formEmail").val().trim();
    
    document.getElementById("btnSignup").value = "Trying...";
    document.getElementById("btnSignup").disabled = true;
    
    var error = 0;
    if(signUpName.length >= 2 && signUpName.length <= 10) {
        if( signUpPass1 != signUpPass2 ) {
            alert( "passwords don't match" );
            error = 1;
            document.getElementById("btnSignup").value = "Signup";
            document.getElementById("btnSignup").disabled = false;
        };
        
        if( signUpMail.length <= 3 ){
            alert("enter a valid email address");
            error = 1;
            document.getElementById("btnSignup").value = "Signup";
            document.getElementById("btnSignup").disabled = false;
        };
        
        if( error == 0 ) {
            socket.emit("netSignup", {
                name: signUpName,
                pass: signUpPass2,
                mail: signUpMail
            });
        };
    } else {
        alert("Minimum 2 characters. Maximum 10 characters.")
        document.getElementById("btnSignup").value = "Signup";
        document.getElementById("btnSignup").disabled = false;
    };
};

function sendMessage(){
    textChat = $("#formText").val();
    if ( socket && textChat != "" ) { 
        socket.emit("netChatMsg",{ text: textChat });
    };
    textChat = $("#formText").val("");
    $("#game").focus();
};

function checkCollisionBlock(o1, o2){
    o2.c = false;
    o2.x += o2.vX;
    o2.y += o2.vY;
    if( o1.x >= o2.x && o1.x <= o2.x + o2.w && o1.vY > 0 && o1.y +o1.vY >= o2.y && o1.y <= o2.y + o2.h + o1.vY ) {
        o1.vY = 0; o1.y = o2.y; p.mode = "n"; o2.c = true;
    };
    if( o2.c ) { o1.x += o2.vX; o1.y += o2.vY };
};

function shoot(){
    if( socket ){
        var angle = Math.atan2(ch * 0.5 - mY - 16, cw * 0.5 - mX);
        var sX = Math.cos(angle) * 15;
        var sY = Math.sin(angle) * 15;
        socket.emit('netNewProjectile', { sX: sX, sY: sY } );
    };
};

function distance(x1,y1,x2,y2){ return Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) ) };
    
function rnd(value){ return parseInt( Math.random() * value ) };