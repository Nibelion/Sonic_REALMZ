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
    
    var _gameWaterLever = 1000;
    
    var canvas  = document.getElementById("game");
    region  = canvas.getBoundingClientRect();
    context = canvas.getContext("2d");
    
    var grd = context.createLinearGradient(0,0,0,170);
        grd.addColorStop(0,"#3251D1");
        grd.addColorStop(1,"#37D6FF");
    
    canvas.onmousemove = updateMouse;
    cw = (canvas.width = 1024);     // 640 default
    ch = (canvas.height = 600);    // 480 default
    
    {
        
    document.body.addEventListener("keydown", function(e) {

        if ( socket ){
            
            switch( e.keyCode ){
                    
                case 13:
                    if ( document.activeElement.id == "formText" ) {
                        document.getElementById("game").focus();                
                        sendMessage();
                    } else if ( document.activeElement.id == "game" ) {
                        document.getElementById("formText").focus();
                    };
                    break;
                    
                case 27:    // ESCAPE
                    if( document.activeElement.id == "formText" ) {
                        $("#formText").val('');
                        document.getElementById("game").focus();
                    };
                    break;
                    
                case 65:
                    if( document.activeElement.id != "formText" ){
                        socket.emit('btnPress', { 'key' : 'A' });
                    };                    
                    break;
                    
                case 68:
                    if( document.activeElement.id != "formText" ){
                        socket.emit('btnPress', { 'key' : 'D' });
                    };
                    break;
                    
                default:
                    break;                
            };

        };
    });
    
    document.body.addEventListener("keyup", function(e) {
        
        if ( document.activeElement.id != "formText" && socket ){
            
            switch( e.keyCode ){

                case 32:
                    if( document.activeElement.id != "formText" ){                    
                        socket.emit('btnPress', { 'key' : 'SPACE' });
                    };
                    break;

                case 65:
                    socket.emit('btnRelease', { 'key' : 'A' });
                    break;

                case 68:
                    socket.emit('btnRelease', { 'key' : 'D' });
                    break;

                case 84:
                    if( document.activeElement.id != "formText" ){
                        socket.emit('btnPress', { 'key' : 'T' });
                    };
                    break;

                case 69:
                    if( localTarget && document.activeElement.id != "formText" ) {
                        socket.emit('btnPress', { 'key': 'E', 'parameter1': localTarget.id });
                    };
                    break;

                case 70:
                    if ( localPlayer && document.activeElement.id != "formText" ) {
                        socket.emit('btnPress', { 'key': 'F',
                            'parameter1': localPlayer.x - ( cw * 0.5 - mX ),
                            'parameter2': localPlayer.y - ( ch * 0.5 - mY ),
                        });
                    };
                    break;

                case 82:
                    if( document.activeElement.id != "formText" ){
                        socket.emit('btnPress', { 'key' : 'R' });
                    };                    
                    break;

            };

        };
    });

    canvas.addEventListener("mousedown", shoot);

    }; // CONTROLS
    
    // ### MAIN LOOP ### = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //
        
    function update(){

        $("#userCount").html( p.length );

        if( document.activeElement.id == "formText" || $('#widgetChat').is(":hover") ) {
            $("#widgetChat").css("opacity","0.9");
        } else {
            $("#widgetChat").css("opacity","0.5");
        };
        
        // ### RENDER ### //

        context.fillStyle = grd;
        context.fillRect( 0, 0, 1280, 800 );        
        
        if( clientState == 0 ) {
            context.drawImage( _imgIsland, 0, 0, 1039, 540 );
            context.drawImage( _imglogo, 0, 0 );
        } else {

            context.save();
            
            if( localPlayer ){     // IF WE HAVE OUR LOCAL PLAYER
                context.translate(
                    parseInt( cw * 0.5 - localPlayer.x ),
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

            context.drawImage(_spriteLevelHub,-256,0);
            context.drawImage(_spriteLevelGHZ,224,0);
            context.drawImage(_spriteLevelHCZ,1568,-5568);

            for ( var i = 0; i < items.length; i++) { if ( items[i] ) { items[i].draw() } };

            for ( var i = 0; i < proj.length; i++) { if( proj[i] ) { proj[i].draw() } };

            for ( var i = 0; i < p.length; i++) { if (p[i]) { p[i].do() } };
            
            context.drawImage(_spriteLevelHCZ_o,1568,-5568);

            //for ( var i = 0; i < level.length; i++) { if (level[i]) { level[i].draw() } }; // OBSOLETE

            localTarget = null;

            {
            var dist = 200 * 200;
            for ( var i = 0; i < badniks.length; i++) {
            var b = badniks[i];            
                if ( b ) {
                    b.draw();
                    if ( localPlayer ) {
                        if( distance( b.x, b.y, localPlayer.x, localPlayer.y - 16 ) < 200 * 200 && b.a ) {
                            if ( distance( b.x, b.y, localPlayer.x, localPlayer.y - 16 ) < dist * dist ) {
                                dist = distance( b.x, b.y, localPlayer.x, localPlayer.y - 16 );
                                localTarget = b;
                            };
                        };
                    };
                };
            };
            } // HOMING ATTACK ALGORITHM
            
            if( localTarget && localPlayer.vY != 0 ) {
                context.strokeStyle = "red";
                context.lineWidth = 3;
                context.beginPath();
                context.arc( localTarget.x, localTarget.y, 15, 0, 2 * Math.PI );
                context.stroke();
            }; // DRAW NEAREST TARGET
            
            context.lineWidth = 1;            
            
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
                context.textAlign = "left";
                context.strokeText("rings: "+localPlayer.Rings,11,85);
                context.fillText("rings: "+localPlayer.Rings,11,85);
                context.strokeText("score: "+localPlayer.Score,11,100);
                context.fillText("score: "+localPlayer.Score,11,100);
            };

        };
        
        requestAnimationFrame(update);
    };

    $("#loadingScreen").hide();
    toggleMusic();
    document.getElementById("ost").play();
    
    update();

};

//  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = //

function toggleMusic(){
    if( document.getElementById("optionsMusic").checked )
        { document.getElementById("ost").volume = 0.25 }
    else
        { document.getElementById("ost").volume = 0.0 };    
};

const rectsOverlap = function(x1,y1,w1,h1,x2,y2,w2,h2){
    if( x1 >= x2 && x1 + w1 <= x2 + w2 && y1 >= y2 && y1 + h1 <= y2 + h2 ) {
        return true
    } else {
        return false
    };
};

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

const register = function(){
    $("#widgetLogin").slideUp(250, function(){
        $("#widgetSignup").slideDown(250);
    });
    
};

const login = function(){
    $("#widgetSignup").slideUp(250, function(){
        $("#widgetLogin").slideDown(250);
    });
};

const forgot = function(){
    if(!socket){ netSocket() };
    document.getElementById("btnForgot").value = "Trying...";
    document.getElementById("btnForgot").disabled = true;
    var userName = $("#formName").val().trim();
    socket.emit("netForgot", { who: userName } );
};

const toggleChat = function(){
    $("#widgetChat").toggle();
    $("#game").focus();
};

function updateMouse(e){
    if(e.offsetX) { mX = e.offsetX; mY = e.offsetY } else
    if(e.layerX) { mX = e.layerX; mY = e.layerY };
};

const netLogin = function(){
    userName = $("#formName").val().trim();
    userPass = $("#formPass").val().trim();
    if(!socket){ netSocket() };
    document.getElementById("btnConnect").value = "Trying...";
    document.getElementById("btnConnect").disabled = true;
    
    if(userName.length >= 2 && userName.length <= 10) {
        socket.emit("netLogin", {
            name: userName,
            pass: userPass
        });
        document.getElementById("game").focus();
    } else {
        alert("Minimum 2 characters. Maximum 10 characters.")
        document.getElementById("btnConnect").value = "Login";
        document.getElementById("btnConnect").disabled = false;
    };
};

const netSignup = function(){
    if(!socket){ netSocket() };
    var signUpName = $("#formSignupName").val().trim();
    var signUpPass1 = $("#formSignupPass1").val().trim();
    var signUpPass2 = $("#formSignupPass2").val().trim();
    var signUpMail = $("#formEmail").val().trim();
    var choice = e.options[e.selectedIndex].value;
    
    document.getElementById("btnSignup").value = "Trying...";
    document.getElementById("btnSignup").disabled = true;
    
    var error = 0;
    if(signUpName.length >= 2 && signUpName.length <= 10) {
        if( signUpPass1 != signUpPass2 ) {
            alert( "passwords don't match" );
            error = 1;
        };
        
        if( signUpMail.length <= 3 ){
            alert("enter a valid email address");
            error = 1;
        };
        
        if( error == 0 ) {
            socket.emit("netSignup", {
                name: signUpName,
                pass: signUpPass2,
                mail: signUpMail,
                cpic: choice
            });
        } else {
            document.getElementById("btnSignup").value = "Signup";
            document.getElementById("btnSignup").disabled = false;
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

function distance(x1,y1,x2,y2){ return (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) };
    
function rnd(value){ return parseInt( Math.random() * value ) };