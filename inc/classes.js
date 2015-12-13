global.badnik = function(x,y){
    this.spawnX = x;
    this.spawnY = y;
    this.x = x;
    this.y = y;
    this.f = 0;
    this.sX = 1;
    this.i = 0
    this.r = 100 //Math.max(100, (Math.random() * 300) );
    this.id = (new Date).getTime();
    this.a = true;
    this.t = 0;
    this.lastShot = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.maxHP = 50;
    this.HP = this.maxHP;
    
    this.update = function(){
        if(this.HP < this.maxHP ) { this.HP += 0.01 };
        if(this.HP > this.maxHP ) { this.HP = this.maxHP };        
        if(this.x > this.spawnX + this.r) { this.sX = -1 };
        if(this.x < this.spawnX ) { this.sX = 1 };
        if(this.a) { this.x += this.sX };
        if(this.t + 10000 < (new Date).getTime()) { this.a = true };
        if(this.x != this.lastX || this.y != this.lastY){
            this.lastX = this.x;
            this.lastY = this.y;
            return true;
        };
    };
};

global.player = function(x,y,name,ip){
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
    this.lastX = 0;
    this.lastY = 0;
    this.lastHP = 100;
    
    this.score = 0;
    this.rings = 0;
    this.xp = 0;
    this.level = 1;
    this.maxSpeed = 3.5;
    this.accel = 0.25;
    this.keyA = false;
    this.keyD = false;
    
    this.MaxEnergy = this.level * 10 + 100;
    this.MaxChaos = this.level * 10 + 100;
    this.MaxESP = this.level * 10 + 100;
    this.maxHP = this.level * 10 + 100;
    this.hp = this.maxHP;
    this.Energy = this.MaxEnergy;
    this.ESP = this.MaxESP;
    this.Chaos = this.MaxChaos;
    
    this.update = function(){
        var updateThis = false;
        
        this.maxHP = this.level * 10 + 100;
        this.MaxEnergy = this.level * 10 + 100;
        this.MaxChaos = this.level * 10 + 100;
        this.MaxESP = this.level * 10 + 100; 
        
        if(this.hp < this.maxHP )                       //Regen HP and SP
            { this.hp += 0.01 };
        if(this.Energy < this.MaxEnergy) 
            { this.Energy += 0.5 };
        if(this.ESP < this.MaxESP ) 
            { this.ESP += 0.3 };
        
        if ( this.xp >= 100 * this.level ) {
            this.level = parseInt( this.level ) + 1;
            this.xp = 0;
            this.hp = this.maxHP;
            updateThis = true;
        };
        if( this.hp > this.maxHP ) { this.hp = this.maxHP };
        if ( this.vX >  this.maxSpeed ) { this.vX =  this.maxSpeed };
        if ( this.vX < -this.maxSpeed ) { this.vX = -this.maxSpeed };
        
        if (this.y >= 732 ) { this.vY = 2; this.vX *= 0.93; };          // WATER PHYSICS
                
        if( this.keyA ){ this.vX -= 0.15 };
        if( this.keyD ){ this.vX += 0.15; };
        
        if( !this.keyA && !this.keyD ){ this.vX *= 0.9 };

        if (this.vX < this.accel - 0.3 && this.vX > 0) { this.vX = 0 };
        if (this.vX > -this.accel + 0.3 && this.vX < 0) { this.vX = 0 };
            
        if (this.y >= 700 + ch * 0.5 ) {
            this.hp = this.maxHP;
            this.x = Math.random() * 1900;
            this.y = 300;
            this.vY = 1;
            this.sck.emit("event",{
                name: "jump",
                type: "sound",
                src: "assets/audio/_sfxBlackout.ogg"
            });
        };  // death by sea
        
        if(this.hp <= 0) {
            this.hp = this.maxHP,
                this.x = Math.random() * 1900;
                this.y = 300;
                this.vY = 1;
                this.sck.emit("event",{
                    name: "jump",
                    type: "sound",
                    src: "assets/audio/_sfxBlackout.ogg"
                });
        };  // death by no hp
        
        this.y += this.vY;
        this.x += this.vX;
        if( this.x != this.lastX ||
            this.y != this.lastY ||
            this.hp != this.lastHP ||
            updateThis )
        {
            this.lastX = this.x;
            this.lastY = this.y;
            this.lastHP = this.hp;
            return true;
        };
    };
};

global.projectile = function(x1,y1,sX,sY,id){
    this.x1 = x1;
    this.y1 = y1;
    this.s = 3;     // speed
    this.t = 0;     // timer
    this.sX = sX;
    this.sY = sY;
    this.a = true;
    this.id = id;
    
    this.update = function(){
        this.t += 25;
        this.x1 -= this.sX;
        this.y1 -= this.sY;
        if( this.t > 500) { this.a = false; };
    };
};

global.platform = function(x,y,w,h,i){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
};

global.item = function(x,y,type){
    this.x = x;
    this.y = y;
    this.type = type;
    this.r = 0;
    
    this.a = true;
    
    switch( this.type ){
        case "ring":
            this.award = 1; this.d = 24; this.rr = 20;
            break;
        case "ringBig":
            this.award = 50; this.d = 48; this.rr = 300;
            break;
        default:
            this.award = 1; this.d = 16; this.rr = 10;
            break;
    };
    
    this.update = function(){

        if( now() >= this.r + this.rr * 1000 && this.a == false ) {
            this.a = true;
            this.u = true;
            
            if(this.type == "ringBig"){
                var rR = parseInt( Math.random() * level.length );
                this.x = level[rR].x + level[rR].w * 0.5 - 16;
                this.y = level[rR].y - 46;
                var d = new Date();
                io.emit("netChatMsg", {
                    name: "",
                    type: "system",
                    text: "The super ring has appeared in this world.",
                    time: d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()
                });  
            };
        };
        
        if( this.u ) { this.u = false; return true };
    };
};