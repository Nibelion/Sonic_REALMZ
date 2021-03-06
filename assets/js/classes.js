function player(x,y,name,cpic){
    this.x = x;
    this.y = y;
    this.name = name;
    this.w = 64;
    this.h = 64;
    this.vX = 0;
    this.vY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.ip;
    var id;
    this.f = 0, this.a = 0;
    this.fW = 64, this.fH = 64;
    this.face = 1;
    
    this.Energy = 0;
    this.ESP = 0;
    this.Chaos = 0;
    this.XP = 0;
    this.Score = 0;
    this.Rings = 0;
    
    this.type = "Normal";
    this.mode = "n";
    this.hp;
    this.level;
    this.onFloor = false;
    
    this.cpic = cpic;
    
    switch( this.cpic ){
        case "1":
            this.i = _SpriteSonic;
            this.anim = [8,8,8,4,2,2,8,8,8,1,1,7,7];
            break;
        case "2":
            this.i = _SpriteShadow;
            this.anim = [8,8,8,4,2,2,8,8,8,1,1,7,7];
            break;
        case "3":
            this.i = _SpriteSilver;
            this.anim = [8,8,8,4,8,8,8,8,8,1,1,5,5];
            break;
        case "4":
            this.i = _SpriteEspio;
            this.anim = [8,8,8,4,2,2,8,8,8,1,1,6,6];
            break;
        case "5":
            this.i = _SpriteBlaze;
            this.anim = [8,8,6,8,2,2,6,6,6,1,1,8,8];
            break;
        case "6":
            this.i = _SpriteFiona;
            this.anim = [8,8,8,8,2,2,8,8,8,1,1,8,8];
            break;
        case "7":
            this.i = _SpriteScourge;
            this.anim = [8,8,1,8,2,2,1,8,8,1,1,8,8];
            break;
        case "8":
            this.i = _SpriteRouge;
            this.anim = [8,8,8,8,4,4,8,8,8,1,1,8,8];
            break;
        case "9":
            this.i = _SpriteKnux;
            this.anim = [8,8,8,8,4,4,8,8,8,1,1,8,8];
            break;
        case "10":
            this.i = _SpriteTails;
            this.anim = [8,8,8,8,2,2,8,6,6,1,1,7,7];
            break;
        case "11":
            this.i = _SpriteAmy;
            this.anim = [8,8,8,4,4,4,8,6,6,1,1,8,8];
            break;
        case "12":
            this.i = _SpriteMetalSonic;
            this.anim = [4,4,6,4,1,1,6,4,4,1,1,6,6];
            break;
        case "13":
            this.i = _SpriteEmerl;
            this.anim = [8,8,8,4,1,1,8,6,6,1,1,8,8];
            break;
        case "14":
            this.i = _SpriteGemerl;
            this.anim = [8,8,6,6,1,1,6,4,4,1,1,5,5];
            break;
        case "15":
            this.i = _SpriteMarine;
            this.anim = [8,8,8,5,1,1,8,8,8,1,1,3,3];
            break;
        case "16":
            this.i = _SpriteMighty;
            this.anim = [8,8,1,4,1,1,1,8,8,1,1,8,8];
            break;
        case "17":
            this.i = _SpriteRay;
            this.anim = [8,8,4,8,1,1,4,8,8,1,1,8,8];
            break;
        case "18":
            this.i = _SpriteHoney;
            this.anim = [8,8,1,4,4,4,1,6,6,1,1,5,5];
            break;
        case "19":
            this.i = _SpriteSally;
            this.anim = [8,8,6,8,4,4,6,8,8,1,1,7,7];
            break;
        case "20":
            this.i = _SpriteTikal;
            this.anim = [8,8,6,4,1,1,6,8,8,1,1,8,8];
            break;
        case "21":
            this.i = _SpriteMetalKnux;
            this.anim = [8,8,6,4,2,2,6,4,4,1,1,8,8];            
            break;
            
        case "clic":
            this.i = _SpriteClic;
            this.anim = [8,8,8,8,8,8,8,8,8,8,8,8,8];
            break;
        case "snif":
            this.i = _SpriteSNIF;
            this.anim = [8,8,8,8,8,8,8,8,8,8,8,8,8];
            break;
        default:
            this.i = _SpriteSonic;
            this.anim = [8,8,8,4,2,2,8,8,8,1,1,7,7];
            break;
        };
        
    this.update = function(x,y){
        if( x ){ this.x = x };
        if( y ){ this.y = y };
        { this.vY = +(this.y - this.lastY).toFixed(2); this.lastY = this.y };
        { this.vX = +(this.x - this.lastX).toFixed(2); this.lastX = this.x };
    };
    
    this.updateAnim = function(){
        if( this.vY < 0 ) { this.onFloor = false };
        
        for( var i = 0; i < level.length; i++ ){
            var L = level[i];
            if( rectsOverlap(this.x-16, this.y, 32, 5, L.x, L.y, L.w, L.h ) && this.vY >= 0 )
                { this.vY = 0; this.onFloor = true };
        };
        
        if( this.vX > 0 ) { this.face = 1 };
        if( this.vX < 0 ) { this.face = 0 };
        if( this.onFloor ) {
            if( this.vX <= 0.15 && this.face == 1 ) { this.a = 2 };    // STAND RIGHT
            if( this.vX >= -0.15 && this.face == 0 ) { this.a = 6 };    // STAND LEFT
            if( this.vX > 0.15 ) { this.a = 0 };                       // WALK RIGHT
            if( this.vX < -0.15 ) { this.a = 1 };                       // WALK LEFT
            if( this.vX < -4.6 ) { this.a = 8 };                       // RUN RIGHT
            if( this.vX > 4.6 ) { this.a = 7 };                       // WALK LEFT
        };
        if( !this.onFloor ){
            if( this.vY < 0 ) { this.a = 3 };                       // JUMP
            if( this.vY >= 0 && this.face == 1) { this.a = 5 };      // FALL TO RIGHT
            if( this.vY >= 0 && this.face == 0) { this.a = 4 };      // FALL TO LEFT
            if( this.face == 0 && this.mode =="f" ) { this.a = 6 }; // EGGMOBILE LEFT
            if( this.face == 1 && this.mode =="f" ) { this.a = 2 }; // EGGMOBILE RIGHT
        };

        if( this.vX == -1.5 && this.vY == -1.5 ) { this.a = 9 };
        if( this.vX == 1.5 && this.vY == -1.5 ) { this.a = 10 };

        this.f += Math.max(0.15, Math.abs(this.vX * 0.075) );
        if( this.f > this.anim[this.a] - 1 ) { this.f = 0 };
    };
    
    this.do = function(){
        
        if( this.vX >= -0.15 && this.vX <= 0.15 ) { this.vX = 0 };

        this.updateAnim();

        context.textAlign = "center";
        context.font = "12px Andale Mono";

        if( p[i] && p[i].type == "admin" ) {
            context.strokeStyle = "black";
            context.strokeText( "ADMIN", this.x, this.y-55 );
            context.fillStyle = "#e8a";
            context.fillText( "ADMIN", this.x, this.y-55 );
        };

        context.strokeStyle = 'black';
        context.strokeText( "("+this.level+")"+this.name, this.x, this.y-45 );
        context.fillStyle = 'white';
        context.fillText( "("+this.level+")"+this.name, this.x, this.y-45 );     

        if(this.i){
            context.drawImage(
                this.i,
                parseInt(this.f)*this.fW,
                this.a * this.fH,
                this.fW, this.fH,
                this.x-this.fW*0.5,
                this.y-this.fH,
                this.fW,
                this.fH
            );
        };
        
        if ( this.mode == "f" ) { context.drawImage(_sprite_Eggmobile,this.face * 64, 0, 64, 46, this.x-32, this.y-25, 64, 46) };

        if ( localPlayer != this ) {
            context.strokeStyle = 'black';
            context.font = "10px Andale Mono";
            context.fillStyle = "black";
            context.fillRect(this.x-25, this.y+3,50,12);
            context.fillStyle = "red";
            context.fillRect(this.x-22, this.y+5,(44*this.hp)/(this.level*10+100),8);
            context.fillStyle = "#FFF";
            context.fillText(this.hp, this.x, this.y + 12);
        };
    };
};

function badnik(x, y, type){
    this.x = x;
    this.y = y;
    this.vX = 0;
    this.vY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.a = true;
    this.HP = 0;
    this.maxHP = 25;
    this.id;
    this.aF = [4,4,1];
    this.f = 0;

    switch( type ) {
        case "ballthing":
            this.i = _SpriteBossBallthing;
            this.w = 72;
            this.h = 87;
            this.maxHP = 500;
            this.maxFrames = 16;
            this.dualSideSprites = false;
            this.animationSpeed = 0.5;
            break;
        default:
            this.i = _SpriteBuzzbomber;
            this.w = 38;
            this.h = 38;
            this.maxHP = 25;
            this.maxFrames = 2;
            this.dualSideSprites = true;
            this.animationSpeed = 0.25;
            break;
    };
    
    this.draw = function(){
        this.vX = this.x - this.lastX;
        this.lastX = this.x;
        this.f += this.animationSpeed;
        if( this.f >= this.maxFrames ) { this.f = 0 };
        if( this.vX < 0 ) { this.face = 0 };
        if( this.vX > 0 && this.dualSideSprites ) { this.face = 1 };
        if( this.a ) {
            context.drawImage(
                this.i,
                parseInt(this.f) * this.w,
                this.face * this.h,
                this.w,
                this.h,
                parseInt(this.x) - this.w * 0.5,
                parseInt(this.y) - this.h * 0.5,
                this.w,
                this.h
            );
            context.textAlign = "center";
            context.strokeStyle = 'black';
            context.font = "10px Andale Mono";
            context.fillStyle = "black";
            context.fillRect(this.x-25, this.y+16,50,12);
            context.fillStyle = "red";
            context.fillRect(this.x-22, this.y+18,(44*this.HP)/this.maxHP,8);
            context.fillStyle = "#FFF";
            context.fillText(this.HP, this.x, this.y + 25);
        };
    };
};

function platform(x,y,w,h,i,c,id){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.id = id;
    this.offsetX = 16 * i;
    this.offsetY = 0;
    
    if( this.id === 1 ) {
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };
        if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 };       
    };
    
    if( this.id === 2 ) {
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
        if( this.offsetX >= 1600 ) { this.offsetX -= 1600; this.offsetY += 1 };
    };

    this.draw = function(){
        context.strokeStyle = "#F00";
        context.strokeRect(this.x, this.y, this.w, this.h);
    };
};

function projectile(x,y,i){
    this.x = x;
    this.y = y;
    switch( i ) {
        case "prj001":
            this.i = _SpriteProjBT;
            break;
        default:
            this.i = _sprite_prj001;
            break;
    };
        
    this.draw = function(){
        if( context ){
            //context.save();
            //context.translate(this.x, this.y);
            //context.rotate(0*Math.PI/180);
            context.drawImage( this.i, this.x-this.i.width*0.5, this.y-this.i.height*0.5)
            //context.restore();
        };
    };
};

function item(x,y,t,a,id){
    this.x = x;
    this.y = y;
    this.t = t;
    this.f = 0.0;
    this.a = a;
    this.id = id;
    switch( this.t ){
        case "ring":
            this.i = _spriteRing;
            break;
        case "ringBig":
            this.i = _spriteBigRing;
            break;
        default:
            this.i = _spriteRing;
            break;
    };

    
    this.do = function(){
        if( this.a && localPlayer && distance(localPlayer.x, localPlayer.y - 16, this.x, this.y, "less", 480 ) ) {
            this.f += 0.15;
            if( this.f >= this.i.width / this.i.height ) { this.f = 0 };
            context.drawImage(
                this.i,
                parseInt( this.f ) * this.i.height,
                0,
                this.i.height,
                this.i.height,
                this.x - 8,
                this.y - 8,
                this.i.height,
                this.i.height
            );
                
            if ( distance( localPlayer.x, localPlayer.y - 16, this.x, this.y, "less", 32 ) && this.a ) {
                socket.emit('sysItemCollected', { id: this.id } );                playSound('assets/audio/_sfxRing.ogg');
                this.a = false;
            };            
        };
    };    
};