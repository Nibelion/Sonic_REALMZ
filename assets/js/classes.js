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
            this.i = _spriteSonic;
            break;
        case "2":
            this.i = _spriteShadow;
            break;
        case "3":
            this.i = _spriteSilver;
            break;
        case "4":
            this.i = _spriteEspio;
            break;
        case "5":
            this.i = _spriteBlaze;
            break;
        case "6":
            this.i = _spriteFiona;
            break;
        case "7":
            this.i = _spriteScourge;
            break;
        case "8":
            this.i = _spriteRogue;
            break;
        case "10":
            this.i = _spriteTails;
            break;
        case "11":
            this.i = _spriteAmy;
            break;
        case "9":
            this.i = _spriteKnuckles;
            break;
        case "clic":
            this.i = _spriteClic;
            break;
        case "snif":
            this.i = _spriteSNIF;
            break;
        default:
            this.i = _spriteSonic;
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
        if( this.vY < 0 ) { this.a = 3 };                       // JUMP
        if( this.vY > 0 && this.face == 1) { this.a = 5 };      // FALL TO RIGHT
        if( this.vY > 0 && this.face == 0) { this.a = 4 };      // FALL TO LEFT
        if( this.face == 0 && this.mode =="f" ) { this.a = 6 }; // EGGMOBILE LEFT
        if( this.face == 1 && this.mode =="f" ) { this.a = 2 }; // EGGMOBILE RIGHT
        this.f += Math.max(0.15, Math.abs(this.vX * 0.075) );
        if( this.f > 7 ) { this.f = 0 };
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
        if (this.mode == "f") { context.drawImage(_sprite_Eggmobile,this.face * 64, 0, 64, 46, this.x-32, this.y-25, 64, 46) };

        if (localPlayer != this ) {
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

function badnik(x, y){
    this.x = x;
    this.y = y;
    this.a = true;
    this.HP = 0;
    this.id;
        
    this.draw = function(){
        if( this.a ) {
            context.drawImage(this.i, parseInt(this.x)-32, parseInt(this.y)-16);
            context.textAlign = "center";
            context.strokeStyle = 'black';
            context.font = "10px Andale Mono";
            context.fillStyle = "black";
            context.fillRect(this.x-25, this.y+16,50,12);
            context.fillStyle = "red";
            context.fillRect(this.x-22, this.y+18,(44*this.HP)/25,8);
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
    this.i = i;
    
    switch(i){
        case "pa001":
            this.i = _sprite_PlatformA001;
            break;
        case "pb001":
            this.i = _sprite_PlatformB001;
            break;
        case "ba001":
            this.i = _sprite_BlockA001;
            break;
        case "bb001":
            this.i = _sprite_BlockB001;
            break;
        case "bb002":
            this.i = _sprite_BlockB002;
            break;
    };
            
    this.vX = 0;
    this.vY = 0;

    this.draw = function(){
        if(this.i){
            if( this.w > this.i.width ){
                var d = this.w / this.i.width;
                for(var l = 0; l < d; l++) {
                    context.drawImage(this.i,this.x + l * this.i.width, this.y);
                };
            } else {
                context.drawImage(this.i, this.x, this.y);
            };

        };
    };
};

function projectile(x,y){
    this.x = x;
    this.y = y;
        
    this.draw = function(){
        if( context ){ context.drawImage( _sprite_prj001, this.x, this.y) };
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