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
    this.maxHP = 25;
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
    this.socket;

    this.score = 0;
    this.rings = 0;
    this.xp = 0;
    this.level = 1;
    this.maxSpeed = 5;
    this.accel = 0.12;
    this.keyA = false;
    this.keyD = false;

    this.MaxEnergy = 100;
    this.MaxChaos = this.level * 10 + 100;
    this.MaxESP = this.level * 10 + 100;
    this.maxHP = this.level * 10 + 100;
    this.hp = this.maxHP;
    this.Energy = this.MaxEnergy;
    this.ESP = this.MaxESP;
    this.Chaos = this.MaxChaos;
    this.Controllable = true;
    this.target = null;
    this.cTimer = 0;
    this.doubleJump = false;

    this.update = function(){
        var updateThis = false;

        this.maxHP = this.level * 10 + 100;
        this.MaxChaos = this.level * 10 + 100;
        this.MaxESP = this.level * 10 + 100;

        if( this.hp < this.maxHP )          // HP regen
            { this.hp += 0.01 };
        if( this.Energy < this.MaxEnergy)   // EN regen
            { this.Energy += 0.5 };
        if(this.ESP < this.MaxESP )         // ESP REGEN
            { this.ESP += 0.3 };

        if( this.hp > this.maxHP ) { this.hp = this.maxHP };
        if( this.Energy > this.MaxEnergy ) { this.Energy = this.MaxEnergy };
        if( this.ESP > this.MaxESP ) { this.ESP = this.MaxESP };
        if( this.Chaos > this.MaxChaos ) { this.Chaos = this.MaxChaos };

        if ( this.xp >= 100 * this.level ) {
            this.level = parseInt( this.level ) + 1;
            this.xp = 0;
            this.hp = this.maxHP;
            updateThis = true;
        };
        
        if( !this.Controllable ) { this.cTimer += 1 };
        if( this.cTimer == 30 ) { this.Controllable = true; this.cTimer = 0 };
        
        if( this.Controllable ){
            this.cTimer = 0;
            if( this.y >= 732 ) { this.vY = 2; this.vX *= 0.93; };          // WATER PHYSICS
            if( this.keyA && this.vX > -this.maxSpeed ){ this.vX -= this.accel }; // MOVE LEFT
            if( this.keyD && this.vX < this.maxSpeed ){ this.vX += this.accel }; // MOVE LEFT
            if( !this.keyA && !this.keyD ) { this.vX *= 0.9 };

            if( this.vX > -0.1 && this.vX < 0.1 && !this.keyA && !this.keyD ) 
                { this.vX = 0; };
            
            if( this.vX < -this.maxSpeed ){ this.vX = -this.maxSpeed };
            if( this.vX > this.maxSpeed ){ this.vX = this.maxSpeed };
        };

            if (this.y >= 700 + ch * 0.5 ) {
                this.hp = this.maxHP;
                this.x = 0;
                this.y = 0;
                this.vY = 1;
                this.socket.emit("event",{
                    name: "jump",
                    type: "sound",
                    src: "assets/audio/_sfxBlackout.ogg"
                });
            };  // death by sea

            if(this.hp <= 0) {
                this.hp = this.maxHP,
                    this.x = 0;
                    this.y = 0;
                    this.vY = 1;
                    this.socket.emit("event",{
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

    this.useSkill = function(skill, parameter1, parameter2){
        switch( skill ){
            case "jump":
                if( this.vY == 0 && this.Energy >= 30 ){
                    this.vY = -5;
                    this.Energy -= 30;
                    this.socket.emit("event",{
                        name: "jump",
                        type: "sound",
                        src: "assets/audio/_sfxJump.ogg"
                    });
                } else if( this.vY != 0 && this.doubleJump && this.Energy >= 30 ) {
                    this.doubleJump = false;
                    this.vY =-5;
                    this.Energy -= 30;
                    this.socket.emit("event",{
                        name: "jump",
                        type: "sound",
                        src: "assets/audio/_sfxJump.ogg"
                    });
                };
                break;
            case "dash":
                if( this.Energy >= 20 && this.vX != 0 ){
                    this.Energy -= 20;
                    if( this.vX < 0 ){ this.vX = -14 };
                    if( this.vX > 0 ){ this.vX = 14 };
                };
                break;
            case "homingAttack":
                if( this.Energy >= 30 &&
                   this.vY != 0 &&
                   distance(this.x, this.y, parameter1, parameter2) < 200 ){

                    this.Controllable = false;
                    this.Energy -= 30;
                    var angle = Math.atan2( parameter2 - this.y + 16, parameter1 - this.x );
                    this.vX = Math.cos(angle) * 15;
                    this.vY = Math.sin(angle) * 15;
                };
                break;
            case "chaosControl":
                if( this.Chaos >= 20 && distance(this.x, this.y, parameter1, parameter2)  < 360 ){
                    this.x = parameter1;
                    this.y = parameter2;
                    this.Chaos -= 20;
                    this.vY = 0;
                };
                break;
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

global.platform = function(x,y,w,h,i,c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.i = i;
    this.c = c;    
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
