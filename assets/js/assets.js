// ### VARIABLES ### //
var localPlayer;
var localTarget;
var clientState = 0;
var keys = [];
var level = [];
var items = [];
var proj = [];
var p = [];

var mX, mY, i = 0;
var cw, ch;

var moving = false;
var textChat ="";

var e = document.getElementById('char');
var optionsSound = document.getElementById('optionsSound');

// ### IMAGES ### //

var _imgIsland = new Image();           _imgIsland.src          = "../assets/i/angelIsland.png";
var _TilesetGHZ = new Image();          _TilesetGHZ.src          = "../assets/i/tiles/_TilesetGHZ.png";

var _spriteRing = new Image();          _spriteRing.src         = "../assets/i/sprites/_spriteRing.png";
var _spriteBigRing = new Image();       _spriteBigRing.src      = "../assets/i/sprites/_spriteBigRing.png";

var _spriteLevelHCZ_o = new Image();    _spriteLevelHCZ_o.src     = "../assets/i/levels/_spriteLevelHCZ_o.png";
var _spriteLevelHCZ = new Image();      _spriteLevelHCZ.src     = "../assets/i/levels/_spriteLevelHCZ.png";
var _spriteLevelHub = new Image();      _spriteLevelHub.src     = "../assets/i/levels/_spriteLevelHUB.png";
var _spriteLevelGHZ = new Image();      _spriteLevelGHZ.src     = "../assets/i/levels/_spriteLevelGHZ.png";

var _SpriteSonic = new Image();         _SpriteSonic.src        = "../assets/i/player/_SpriteSonic.png";
var _SpriteShadow = new Image();        _SpriteShadow.src       = "../assets/i/player/_SpriteShadow.png";
var _SpriteSilver = new Image();        _SpriteSilver.src       = "../assets/i/player/_SpriteSilver.png";
var _SpriteEspio = new Image();         _SpriteEspio.src        = "../assets/i/player/_SpriteEspio.png";
var _SpriteBlaze = new Image();         _SpriteBlaze.src        = "../assets/i/player/_SpriteBlaze.png";
var _SpriteFiona = new Image();         _SpriteFiona.src        = "../assets/i/player/_SpriteFiona.png";
var _SpriteScourge = new Image();       _SpriteScourge.src      = "../assets/i/player/_SpriteScourge.png";
var _SpriteRouge = new Image();         _SpriteRouge.src        = "../assets/i/player/_SpriteRouge.png";
var _SpriteKnux = new Image();          _SpriteKnux.src         = "../assets/i/player/_SpriteKnux.png";
var _SpriteTails = new Image();         _SpriteTails.src        = "../assets/i/player/_SpriteTails.png";
var _SpriteAmy = new Image();           _SpriteAmy.src          = "../assets/i/player/_SpriteAmy.png";
var _SpriteMetalSonic = new Image();    _SpriteMetalSonic.src   = "../assets/i/player/_SpriteMetalSonic.png";
var _SpriteEmerl = new Image();         _SpriteEmerl.src        = "../assets/i/player/_SpriteEmerl.png";
var _SpriteGemerl = new Image();        _SpriteGemerl.src       = "../assets/i/player/_SpriteGemerl.png";
var _SpriteMarine = new Image();        _SpriteMarine.src       = "../assets/i/player/_SpriteMarine.png";
var _SpriteMighty = new Image();        _SpriteMighty.src       = "../assets/i/player/_SpriteMighty.png";
var _SpriteRay = new Image();           _SpriteRay.src          = "../assets/i/player/_SpriteRay.png";
var _SpriteHoney = new Image();         _SpriteHoney.src        = "../assets/i/player/_SpriteHoney.png";
var _SpriteSally = new Image();         _SpriteSally.src        = "../assets/i/player/_SpriteSally.png";
var _SpriteTikal = new Image();         _SpriteTikal.src        = "../assets/i/player/_SpriteTikal.png";
var _SpriteMetalKnux = new Image();     _SpriteMetalKnux.src    = "../assets/i/player/_SpriteMetalKnux.png";

var _sprite_prj001 = new Image();       _sprite_prj001.src      = "../assets/i/_sprite_prj001.png";

var _imglogo = new Image();             _imglogo.src            = "../assets/i/_imgLogo.png";
var _imgFun = new Image();              _imgFun.src             = "../assets/i/_imgFun.png";
var _sprite_Eggmobile = new Image();    _sprite_Eggmobile.src   = "../assets/i/_sprite_Eggmobile.png";

var _SpriteDarkVortex = new Image();    _SpriteDarkVortex.src       = "../assets/i/badniks/_SpriteDarkVortex.png";
var _SpriteBuzzbomber = new Image();    _SpriteBuzzbomber.src       = "../assets/i/badniks/_SpriteBossBallthing.png";
var _SpriteBossBallthing = new Image(); _SpriteBossBallthing.src       = "../assets/i/badniks/_SpriteBossBallthing.png";