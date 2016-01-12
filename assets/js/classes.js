function player(x,y,name,cpic){
    this.x = x;
    this.y = y;
    this.name = name;
    this.w = 64;
    this.h = 64;
    this.vX = 0;
    this.vY = 0;
    this.ip;
    var id;
    this.f = 0, this.a = 0;
    this.fW = 64, this.fH = 64;
    this.face = 1;
    
    this.Energy;
    this.ESP;
    this.Chaos;
    this.XP;
    
    this.type = "Normal";
    this.mode = "n";
    this.hp;
    this.level;
    
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
        this.x = x; this.y = y;
    };
    
    this.updateAnim = function(){
        if( this.vX > 0 ) { this.face = 1 };
        if( this.vX < 0 ) { this.face = 0 };
        
        if( this.vX <= 0.15 && this.face == 1 ) { this.a = 2 };    // STAND RIGHT
        if( this.vX >= -0.15 && this.face == 0 ) { this.a = 6 };    // STAND LEFT
        if( this.vX > 0.15 ) { this.a = 0 };                       // WALK RIGHT
        if( this.vX < -0.15 ) { this.a = 1 };                       // WALK LEFT
        if( this.vX < -4.6 ) { this.a = 8 };                       // RUN RIGHT
        if( this.vX > 4.6 ) { this.a = 7 };                       // WALK LEFT
        if( this.vY < 0 ) { this.a = 3 };                       // JUMP
        if( this.vY > 0 && this.face == 1) { this.a = 5 };      // FALL TO RIGHT
        if( this.vY > 0 && this.face == 0) { this.a = 4 };      // FALL TO LEFT
        if( this.face == 0 && this.mode =="f" ) { this.a = 6 }; // EGGMOBILE LEFT
        if( this.face == 1 && this.mode =="f" ) { this.a = 2 }; // EGGMOBILE RIGHT
        
        if( this.vX == -1.5 && this.vY == -1.5 ) { this.a = 9 };
        if( this.vX == 1.5 && this.vY == -1.5 ) { this.a = 10 };
        
        
        this.f += Math.max(0.15, Math.abs(this.vX * 0.075) );
        if( this.f > this.anim[this.a] - 1 ) { this.f = 0 };
    };
    
    this.drawPlayer = function(){
        this.updateAnim();
        context.textAlign = "center";
        context.font = "12px Andale Mono";

        if(p[i] && p[i].type == "admin") {
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
    this.w = 38;
    this.h = 38;
    this.a = true;
    this.HP = 0;
    this.maxHP = 25;
    this.id;
    this.aF = [4,4,1];
    this.f = 0;
    
    switch( type ) {
        case 0:
            this.i = _SpriteBuzzbomber;
            this.maxHP = 25;
            break;
        default:
            this.i = _SpriteDarkVortex;
            this.maxHP = 25;
            break;
    };
    
    this.draw = function(){
        this.vX = this.x - this.lastX;
        this.lastX = this.x;
        this.f += 0.25;
        if( this.f >= 2 ) { this.f = 0 };
        if( this.vX < 0 ) { this.face = 0 };
        if( this.vX > 0 ) { this.face = 1 };
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

function platform(x,y,w,h,i){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;    
    this.vX = 0;
    this.vY = 0;
    this.offsetX = 16 * i;
    this.offsetY = 0;
    if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 }
    if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 }
    if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 }
    if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 }
    if( this.offsetX >= 240 ) { this.offsetX -= 240; this.offsetY += 1 }

    this.draw = function(){
        context.drawImage( _TilesetGHZ, this.offsetX, this.offsetY * 16, 16, 16, this.x, this.y, 16, 16);
    };
};

function projectile(x,y){
    this.x = x;
    this.y = y;
        
    this.draw = function(){
        if( context ){ context.drawImage( _sprite_prj001, this.x-3, this.y-3) };
    };
};

function item(x,y,t,a){
    this.x = x;
    this.y = y;
    this.t = t;
    switch( this.t ){
        case "ring":
            this.i = _spriteRing;
            break;
        case "ringBig":
            this.i = _spriteBigRing;
            break;
/*        default:
            this.i = _spriteRing;
            break;*/
    };

    this.f = 0.0;
    this.a = a;
    
    this.draw = function(){
        if( this.a ){
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
        };
    };    
};
