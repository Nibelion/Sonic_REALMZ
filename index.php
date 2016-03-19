<!DOCTYPE html>

<html>
    <head>
        <meta charset="utf-8" />
        <title>SERVER</title>
        <link rel="shortcut icon" href="../assets/i/favicon.ico" type="image/x-icon" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css"/>
        <link rel="stylesheet" type="text/css" href="assets/css/main.css"/>
        <script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
        <script src="http://code.jquery.com/jquery-1.11.1.js"></script>
        <script src="assets/js/main.js"></script>
    </head>
    
<body onload="init()">
    <?php
        echo "This";
    ?>
    <div id="loadingScreen">LOADING.</div>
    <div id="wrap">
        
        <div id="widgetLogin">
            <form id="formLogin" autocomplete="off">
                <input id="formName" maxlength="10" type="text" placeholder="Login... (Name)" class="forms" />
                <input id="formPass" maxlength="10" type="password" placeholder="Password..." class="forms" />
                <input id="btnConnect" type="button" value="Connect" onclick="netLogin()" class="forms" />
                <input id="btnRegister" type="button" value="Register" onclick="register()" class="forms" />
                <input id="btnForgot" type="button" value="Forgot password?" onclick="forgot()" class="forms" />
            </form>                
        </div>
        
        <div id="widgetSignup">
            <form id="formSignup" autocomplete="off">
                <input id="formSignupName" maxlength="10" type="text" placeholder="Login (Name)" class="forms" />
                <input id="formSignupPass1" maxlength="10" type="password" placeholder="Password" class="forms" />
                <input id="formSignupPass2" maxlength="10" type="password" placeholder="Password (Repeat)" class="forms" />
                <input id="formEmail" maxlength="26" type="email" placeholder="E-mail" class="forms" />
                <b>Character:</b>
                <select id="char">
                    <option value="1">Sonic</option>
                    <option value="2">Shadow</option>
                    <option value="3">Silver</option>
                    <option value="4">Espio</option>
                    <option value="5">Blaze</option>
                    <option value="6">Fiona</option>
                    <option value="7">Scourge</option>
                    <option value="8">Rogue</option>
                    <option value="9">Knuckles</option>
                    <option value="10">Tails</option>
                    <option value="11">Amy</option>
                    <option value="12">Metal Sonic</option>
                    <option value="13">Emerl</option>
                    <option value="14">Gemerl</option>
                    <option value="15">Marine</option>
                    <option value="16">Mighty</option>
                    <option value="17">Ray</option>
                    <option value="18">Honey</option>
                    <option value="19">Sally</option>
                    <option value="20">Tikal</option>
                    <option value="21">Metal Knuckles</option>
                </select>
                <input id="btnSignup" type="button" value="Signup" onclick="netSignup()" class="forms" />
                <input id="btnLogin" type="button" value="Cancel" onclick="login()" class="forms" />
            </form>
        </div>        
        <script> $("#widgetSignup").hide() </script>        
        
        <canvas id="game" ondragstart="return false" ondrop="return false" tabindex="1"></canvas>        
        
        <div id="widgetChat">            
            <div id="messages"></div>
            <form id="formChat" autocomplete="off">
                <input id="formText" maxlength="120" type="text" placeholder="Type your text to chat here..." class="forms" />
            </form>
        </div>
        
        <script> $("#widgetChat").hide() </script>
        
        <div style="text-align: center">
            Players online: <span id="userCount"></span> |
            Sound:<input id="optionsSound" type="checkbox" checked></input> |
            Music:<input id="optionsMusic" type="checkbox" onclick="toggleMusic()"></input> |
            Debug:<input id="optionsDebug" type="checkbox" ></input> |
            <input type="button" id="toogleChat" value="Toogle chat" onclick="toggleChat()"></input>
        </div>

        <audio id="ost">
            <source src="assets/audio/_ostRealmz.mp3" type="audio/mpeg">
            <source src="assets/audio/_ostRealmz.ogg" type="audio/ogg">
        </audio>

        <script src="assets/js/assets.js"></script>
        <script src="assets/js/classes.js"></script>
        <script src="assets/js/socket.js"></script>
        <script src="client.js"></script>

    </div>
</body>
</html>