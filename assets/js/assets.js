// ### VARIABLES ### //
var clientState = 0;
var camera = { x: 0, y: 0 }

var keys = [];
var level = [];
var items = [];
var proj = [];
var p = [];

var mX, mY, i = 0;
var cw, ch;

var moving = false;
var textChat ="";

var score = 0;
var rings = 0;
var exper = 0;
var Energy = 0;
var ESP = 0;
var Chaos = 0;
var HP = 0;
var PlayerLevel = 0;

var e = document.getElementById('char');
var optionsSound = document.getElementById('optionsSound');

// ### IMAGES ### //

var _imgIsland = new Image();           _imgIsland.src = "../assets/i/angelIsland.png";

var _spriteRing = new Image();          _spriteRing.src = "../assets/i/sprites/_spriteRing.png";
var _spriteBigRing = new Image();       _spriteBigRing.src = "../assets/i/sprites/_spriteBigRing.png";

var _spriteSonic = new Image();         _spriteSonic.src    = "../assets/i/player/_spriteSonic.png";
var _spriteShadow = new Image();        _spriteShadow.src   = "../assets/i/player/_spriteShadow.png";
var _spriteSilver = new Image();        _spriteSilver.src   = "../assets/i/player/_spriteSilver.png";
var _spriteEspio = new Image();         _spriteEspio.src    = "../assets/i/player/_spriteEspio.png";
var _spriteBlaze = new Image();         _spriteBlaze.src    = "../assets/i/player/_spriteBlaze.png";
var _spriteFiona = new Image();         _spriteFiona.src    = "../assets/i/player/_spriteFiona.png";
var _spriteScourge = new Image();       _spriteScourge.src  = "../assets/i/player/_spriteScourge.png";
var _spriteRogue = new Image();         _spriteRogue.src    = "../assets/i/player/_spriteRogue.png";
var _spriteKnuckles = new Image();      _spriteKnuckles.src = "../assets/i/player/_spriteKnuckles.png";
var _spriteTails = new Image();         _spriteTails.src = "../assets/i/player/_spriteTails.png";
var _spriteAmy = new Image();           _spriteAmy.src = "../assets/i/player/_spriteAmy.png";
var _spriteClic = new Image();          _spriteClic.src     = "../assets/i/player/_spriteClic.png";

var _sprite_prj001 = new Image();       _sprite_prj001.src     = "../assets/i/_sprite_prj001.png";

var _imglogo = new Image();             _imglogo.src = "../assets/i/_imgLogo.png";
var _imgFun = new Image();              _imgFun.src = "../assets/i/_imgFun.png";
var _sprite_Eggmobile = new Image();    _sprite_Eggmobile.src = "../assets/i/_sprite_Eggmobile.png";
var _image_Sky = new Image();           _image_Sky.src = "../assets/i/_image_Sky.png";

var _sprite_PlatformB001 = new Image();  _sprite_PlatformB001.src = "../assets/i/_sprite_PlatformB001.png";
var _sprite_PlatformA001 = new Image();  _sprite_PlatformA001.src = "../assets/i/_sprite_PlatformA001.png";
var _sprite_BlockB001 = new Image();     _sprite_BlockB001.src = "../assets/i/_sprite_BlockB001.png";
var _sprite_BlockB002 = new Image();     _sprite_BlockB002.src = "../assets/i/_sprite_BlockB002.png";
var _sprite_BlockA001 = new Image();     _sprite_BlockA001.src = "../assets/i/_sprite_BlockA001.png";

var _level_TechnoTower = new Image();   _level_TechnoTower.src = "../assets/i/_level_TechnoTower.png";

var _sprite_Badnik_Cloud = new Image(); _sprite_Badnik_Cloud.src = "../assets/i/_sprite_Badnik_Cloud.png";