    {
    level.push( new platform( 0, 480, 128*7, 32, "bb001" ));
    level.push( new platform( 896, 480, 128*3, 32, "bb002" ));
    level.push( new platform( 896+128*3, 480, 128*5, 52, "ba001" ));

    level.push( new platform( 896+128*5, 680, 64, 27, "pa001" ));
    level.push( new platform( 896+128*6, 680, 64, 27, "pa001" ));        
    level.push( new platform( 896+128*7, 680, 64, 27, "pa001" ));
    level.push( new platform( 896+128*8, 630, 64, 27, "pa001" ));
    level.push( new platform( 896+128*9, 560, 64, 27, "pa001" ));
    level.push( new platform( 896+128*8, 500, 64, 27, "pa001" ));
    level.push( new platform( 896+128*9, 450, 64, 27, "pa001" ));
    
    level.push( new platform( 896+128*3, 680, 128, 52, "ba001" ));
    
    level.push( new platform( 150, 400, 64, 27, "pb001" ));
    level.push( new platform( 300, 350, 64, 27, "pb001" ));
    level.push( new platform( 450, 300, 64, 27, "pb001" ));
    level.push( new platform( 550, 250, 128*2, 32, "bb001" ));
    level.push( new platform( 850, 175, 64, 27, "pb001" ));
    level.push( new platform( 550, 100, 128*2, 32, "bb001" ));
        
    level.push( new platform( 400, 100, 64, 27, "pb001" ));
        
    level.push( new platform( 0, 100, 128, 32, "bb001" ));
    level.push( new platform( 128*2, 100, 64, 27, "pb001" ));
    level.push( new platform( 0, -20, 128, 32, "bb001" ));
    level.push( new platform( -75, 35, 64, 27, "pb001" ));
    
    level.push( new platform( 128, -20, 128*4, 32, "bb002" ));
    
    level.push( new platform( 128*5, -20, 128, 32, "bb001" ));
    level.push( new platform( 750, -100, 64, 27, "pb001" ));
    level.push( new platform( 625, -150, 64, 27, "pb001" ));
    level.push( new platform( 750, -210, 64, 27, "pb001" ));
    level.push( new platform( 625, -260, 64, 27, "pb001" ));
    level.push( new platform( 750, -320, 64, 27, "pb001" ));
    level.push( new platform( 625, -370, 64, 27, "pb001" ));
    level.push( new platform( 94, -420, 128*3, 32, "bb001" ));
    level.push( new platform( -35, -470, 64, 27, "pb001" ));
    level.push( new platform( -35, -550, 64, 27, "pb001" ));
    level.push( new platform( 32, -600, 128, 32, "bb001" ));
    level.push( new platform( 160, -600, 128*3, 32, "bb002" ));
    level.push( new platform( 160+128*3, -600, 128*2, 32, "bb001" ));
    } // LEVEL

    {
    items.push( new item(300,465,"ring") );
    items.push( new item(320,465,"ring") );
    items.push( new item(340,465,"ring") );

    items.push( new item(-50,-200,"ring") );
    items.push( new item(-70,-180,"ring") );
    items.push( new item(-90,-160,"ring") );

    items.push( new item(600,-620,"ring") );
    items.push( new item(620,-620,"ring") );
    items.push( new item(640,-620,"ring") );
    items.push( new item(660,-620,"ring") );
    items.push( new item(680,-620,"ring") );

    items.push( new item(1000,465,"ring") );
    items.push( new item(1020,465,"ring") );
    items.push( new item(1040,465,"ring") );

    items.push( new item(1300,660,"ring") );
    items.push( new item(1320,660,"ring") );
    items.push( new item(1340,660,"ring") );
    items.push( new item(1360,660,"ring") );
    items.push( new item(1380,660,"ring") );

    items.push( new item(1600,200,"ring") );
    items.push( new item(1600,220,"ring") );
    items.push( new item(1600,240,"ring") );
    } // RINGS

    var rR = parseInt( Math.random() * level.length );
    items.push( new item(
        level[rR].x + level[rR].w * 0.5 - 16,
        level[rR].y - 46,
        "ringBig"
    ));


/*
pa001 - Platform A001 - Green Hill Platform
pb001 - Platform B001 - Chemical Plant Platform
ba001 - Block A001 - Green Hill Block (Ground)
bb001 - Block B001 - Chemical Plant Block (Metal)
bb002 - Block B002 - Chemical Plant Block (Tube)
*/