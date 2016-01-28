var levelOne = JSON.parse( fs.readFileSync("./data/_level_hub.json") );
var levelTwo = JSON.parse( fs.readFileSync("./data/_level_greenhill.json") );
var levelTri = JSON.parse( fs.readFileSync("./data/_level_hydrocity.json") );

function loadLevel(jsonLevel, layer){    
    for( var i = 0; i < jsonLevel.layers[layer].objects.length; i++ ){
        level.push( new platform(
            jsonLevel.layers[layer].objects[i].x + parseInt( jsonLevel.properties.offsetX ),
            jsonLevel.layers[layer].objects[i].y + parseInt( jsonLevel.properties.offsetY ),
            jsonLevel.layers[layer].objects[i].width,
            jsonLevel.layers[layer].objects[i].height,
            -1,
            true,
            1
        ));
    };    
};

function loadRings(jsonLevel, layer){
    for( var i = 0; i < jsonLevel.layers[layer].objects.length; i++ ){
        items.push( new item(
            jsonLevel.layers[layer].objects[i].x + jsonLevel.layers[layer].objects[i].width * 0.5 + parseInt( jsonLevel.properties.offsetX ),
            jsonLevel.layers[layer].objects[i].y + jsonLevel.layers[layer].objects[i].height* 0.5 + parseInt( jsonLevel.properties.offsetY ),
            "ring"
        ) );
    };
};

function loadBadniks(jsonLevel, layer){
    for( var i = 0; i < jsonLevel.layers[layer].objects.length; i++ ){
        badniks.push( new badnik(
            jsonLevel.layers[layer].objects[i].x + jsonLevel.layers[layer].objects[i].width * 0.5 + parseInt( jsonLevel.properties.offsetX ),
            jsonLevel.layers[layer].objects[i].y + jsonLevel.layers[layer].objects[i].height* 0.5 + parseInt( jsonLevel.properties.offsetY )
        ) );
    };
};


loadLevel(levelOne, 1);

loadLevel(levelTwo,   1); // Layer with collision
loadRings(levelTwo,   2); // Level with rings
loadBadniks(levelTwo, 3); // Layer with badniks

loadLevel(levelTri,   3);
loadRings(levelTri,   4);
loadBadniks(levelTri, 5);


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