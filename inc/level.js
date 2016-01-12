var levelOne = JSON.parse( fs.readFileSync("./data/_level_hub.json") );

// === === === === === === === === === === === === === === === === === === ===


console.log( levelOne.properties.offsetX );

//process.exit();

for( var i = 0; i < levelOne.layers[1].data.length; i++ ){
    
    var Y = i / levelOne.layers[1].width;
    
    switch( levelOne.layers[1].data[i] ){
        case 0:
            break;
        default:
            level.push( new platform(
                (i - parseInt(Y) * levelOne.layers[1].width ) * 16 + parseInt( levelOne.properties.offsetX ),
                parseInt(Y) * 16 + parseInt( levelOne.properties.offsetY ),
                16,
                16,
                levelOne.layers[1].data[i] - 1,
                true
            ));
            break;
    };
}

// === === === === === === === === === === === === === === === === === === ===

for( var i = 0; i < levelOne.layers[0].data.length; i++ ){
    
    var Y = i / levelOne.layers[0].width;
    
    switch( levelOne.layers[0].data[i] ){
        case 0:
            break;
        default:
            level.push( new platform(
                (i - parseInt(Y) * levelOne.layers[0].width ) * 16 + parseInt( levelOne.properties.offsetX ),
                parseInt(Y) * 16 + parseInt( levelOne.properties.offsetY ),
                16,
                16,
                levelOne.layers[0].data[i] - 1,
                false
            ));
            break;
    };
}

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