var levelOne = JSON.parse( fs.readFileSync("./data/_level_hub.json") );
var levelTwo = JSON.parse( fs.readFileSync("./data/_level_greenhill.json") );

for( var i = 0; i < levelOne.layers[1].objects.length; i++ ){
    level.push( new platform(
        levelOne.layers[1].objects[i].x + parseInt( levelOne.properties.offsetX ),
        levelOne.layers[1].objects[i].y + parseInt( levelOne.properties.offsetY ),
        levelOne.layers[1].objects[i].width,
        levelOne.layers[1].objects[i].height,
        -1,
        true,
        1
    ));
};

for( var i = 0; i < levelTwo.layers[1].objects.length; i++ ){
    level.push( new platform(
        levelTwo.layers[1].objects[i].x + parseInt( levelTwo.properties.offsetX ),
        levelTwo.layers[1].objects[i].y + parseInt( levelTwo.properties.offsetY ),
        levelTwo.layers[1].objects[i].width,
        levelTwo.layers[1].objects[i].height,
        -1,
        true,
        1
    ));
};

for( var i = 0; i < levelTwo.layers[2].objects.length; i++ ){
    items.push( new item(
        levelTwo.layers[2].objects[i].x + levelTwo.layers[2].objects[i].width * 0.5 + parseInt( levelTwo.properties.offsetX ),
        levelTwo.layers[2].objects[i].y + levelTwo.layers[2].objects[i].height* 0.5 + parseInt( levelTwo.properties.offsetY ),
        "ring"
    ) );
};

for( var i = 0; i < levelTwo.layers[3].objects.length; i++ ){
    badniks.push( new badnik(
        levelTwo.layers[3].objects[i].x + levelTwo.layers[3].objects[i].width * 0.5 + parseInt( levelTwo.properties.offsetX ),
        levelTwo.layers[3].objects[i].y + levelTwo.layers[3].objects[i].height* 0.5 + parseInt( levelTwo.properties.offsetY )
    ) );
};

/*global.loadLevel = function( l, layer, collidable ){
    
    var newArr = [];
    while( l.layers[layer].data.length ) newArr.push(l.layers[layer].data.splice(0,l.layers[1].width));

    for( var h = 0; h < l.layers[layer].width; h++ ){
        for( var w = 0; w < l.layers[layer].height; w++){
            
            switch( newArr[w][h] ){
                case 0:
                    break;
                default:
                    level.push( new platform(
                        h * 16 + parseInt( l.properties.offsetX ),
                        w * 16 + parseInt( l.properties.offsetY ),
                        16,
                        16,
                        newArr[w][h]-1,
                        collidable,
                        1
                    ));
                    break;
            };
            
        };       
    };
    
};

loadLevel(levelOne, 0, false);*/


//loadLevel(levelOne, 0, false);

//loadLevel(levelTwo, 1, false);
//loadLevel(levelTwo, 2, true);


// === === === === === === === === === === === === === === === === === === ===

//process.exit();

//console.log(levelOne.layers[0].data[0]);
//console.log(levelOne.layers[0].width);

/*

    {
        items.push( new item(0,-16,"ring") );
    } 

    var rR = parseInt( Math.random() * level.length );
    items.push( new item(
        level[rR].x + level[rR].w * 0.5 - 16,
        level[rR].y - 46,
        "ringBig"
    ));

*/