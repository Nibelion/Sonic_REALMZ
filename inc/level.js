var levelOne = JSON.parse( fs.readFileSync("./data/_level_hub.json") );
var levelTwo = JSON.parse( fs.readFileSync("./data/_level_greenhill.json") );
var levelTri = JSON.parse( fs.readFileSync("./data/_level_hydrocity.json") );
var levelFor = JSON.parse( fs.readFileSync("./data/_level_wingf.json") );

function loadLevel(jsonLevel, layer){    
    for( var i = 0; i < jsonLevel.layers[layer].objects.length; i++ ){
        level.push( new platform(
            jsonLevel.layers[layer].objects[i].x + parseInt( jsonLevel.properties.offsetX ),
            jsonLevel.layers[layer].objects[i].y + parseInt( jsonLevel.properties.offsetY ),
            jsonLevel.layers[layer].objects[i].width,
            jsonLevel.layers[layer].objects[i].height,
            -1,
            jsonLevel.layers[layer].objects[i].type,
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
        var thisLVL = jsonLevel.layers[layer];
        badniks.push( new badnik(
            thisLVL.objects[i].x + thisLVL.objects[i].width * 0.5 + parseInt( jsonLevel.properties.offsetX ),
            thisLVL.objects[i].y + thisLVL.objects[i].height* 0.5 + parseInt( jsonLevel.properties.offsetY ),
            thisLVL.objects[i].type
        ) );
    };
};

loadLevel(levelOne,     1);

loadLevel(levelTwo,     1); // Layer with collision
loadRings(levelTwo,     2); // Level with rings
loadBadniks(levelTwo,   3); // Layer with badniks

loadLevel(levelTri,     3);
loadRings(levelTri,     4);
loadBadniks(levelTri,   5);

loadLevel(levelFor,     2);
loadRings(levelFor,     3);
loadBadniks(levelFor,   4);

//items.push( new item( 0, 0, "ringWarp" ) );