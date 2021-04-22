const sectionContainer = document.getElementById("sectionContainer");
const articleContainer = document.getElementById("articleContainer");

let loginSectionTemplate =    
    `<section id="loginSection">
        <h2>Logga in</h2> 
        <input id="loginUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="loginPassword" type="text" placeholder="Lösenord"><br> 
        <button id="loginBtn" class="btn-red-nofill">Logga in</button>
        <div id="loginMsgContainer"></div>
    </section>`;

let registerSectionTemplate = 
    `<section id="registerSection">
        <h2>Registrera dig</h2> 
        <input id="registerUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="registerEmail" type="text" placeholder="Email"><br> 
        <input id="registerPassword" type="text" placeholder="Lösenord"><br> 
        <button id="registerBtn" class="btn-red-fill">Registrera dig</button>
        <div id="registerMsgContainer"></div>
    </section>`;

let startPageTemplate = 
    `<article id="startWelcome">
        <h3 class="logo-font">Välkommen!</h3>
        <p>Här kan du logga in för att ändra din prenumerationsstatus.</p>
        <p>Är det första gången du besöker oss? Registrera ett gratiskonto.</p>
    </article>

    <article>
        <h4>Om oss</h4>
        <p>
            Vi är Kundklubben som gillar kunder.
        </p>
    </article>`;


const logOutBtnTemplate = `<button id="logOutBtn" class="btn-red-nofill">Logga ut</button>`;

//Om localStorage är tomt visas StartPage. Om den inte är tom visas UserPage.
if (localStorage.getItem("id") === null) {
    // console.log("ingen är inloggad");
    printStartPage();

} else {
    // console.log("någon är inloggad");
    let getId = localStorage.getItem("id");
    printUserPage(getId);
};

function saveToLS(key, value) {
    localStorage.setItem(key, value);
};

function printStartPage() {
    sectionContainer.innerHTML = loginSectionTemplate + registerSectionTemplate;
    articleContainer.innerHTML = startPageTemplate;

    let loginUserName = document.getElementById("loginUserName");
    let loginPassword = document.getElementById("loginPassword");
    let loginBtn = document.getElementById("loginBtn");
    let loginMsgContainer = document.getElementById("loginMsgContainer");
    let registerUserName = document.getElementById("registerUserName");
    let registerEmail = document.getElementById("registerEmail");
    let registerPassword = document.getElementById("registerPassword");
    let registerBtn = document.getElementById("registerBtn");
    let registerMsgContainer = document.getElementById("registerMsgContainer");

    //registrera ny användare (identifieras genom randomiserad nyckel)
    registerBtn.addEventListener("click", function() {

        loginMsgContainer.innerHTML = ""; 
        let newUser = {userName: registerUserName.value, password: registerPassword.value, email: registerEmail.value};

        if ( (registerUserName.value !== "") && (registerPassword.value !== "") && (registerEmail.value !== "")) {
            fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/register', {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(res => res.json())
            .then(function(res) {
                // console.log("res /register-routern:", res.code); 
                if (res.code === "newUser saved") {
                    
                    saveToLS("id", res.id)
                    printUserPage(res.id);
                }
                if (res.code === "userName already exists") {
                    printRegisterFail();
                }
            });
        } else {
            // console.log("visa error");
            printErrorMsg(registerMsgContainer);
        }
    });

    loginBtn.addEventListener("click", function() {

        registerMsgContainer.innerHTML = ""; 
        
        let user = {userName: loginUserName.value, password: loginPassword.value};
        // console.log("user", user);

        if ( (loginUserName.value !== "") && (loginPassword.value !== "" ) ) {
            console.log("fetcha");

            fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/userpage', {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(function(res) {
    
                console.log("res", res);
    
                if(res.code == "ok") {
                    // console.log("user inloggad");
                    saveToLS("id", res.userId);
                    // printUserPage(res.userId);
                    printUserPage();
                } else {
                    console.log("error");
                    printErrorMsg(loginMsgContainer);
                }
            });

        } else {
            console.log("visa error");
            printErrorMsg(loginMsgContainer);
        }
    });
};

function printErrorMsg(msgContainer) {
    let errorMsg = `<p class="error">Error, du måste fylla i användarnamn och lösenord.</p>`;
    msgContainer.innerHTML = errorMsg;
};

function printRegisterFail() {
    let registerFail = `<p>Användarnamnet finns redan, pröva med ett annat.</p>`;
    registerMsgContainer.innerHTML = registerFail;
};

// function printUserPage(id) {
    // fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/userpage/' + id )

function printUserPage() {

    fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/userpage')
    .then(data => data.json())
    .then(function(data) {
        console.log("userName + subscription", data);

        //visa prenumerationsstatus
        let subStatus = ""; 
        if (data.subscription === true) {
            subStatus = "<p>Wee, nu prenumererar du!"
        } else {
            subStatus = "<p>Oj oj, du prenumererar inte!</p>"
        }

        let userPageTemplate = 
            `<div id="userWelcome"> 
                <h4>Nu är du inloggad</h4>
                <span id="userNameSpan">${data.userName}!</span>
            </div>
            <div id="subWrapper">
                <p id="subHeading">Ditt prenumerationsstatus:</p>
                <div id="subStatusWrapper">${subStatus}</div>
                <div id="btnWrapper">
                    <button id="subBtn" class="btn-red-fill">Ändra status</button>
                </div>
            </div>`;

        articleContainer.innerHTML = userPageTemplate;
        sectionContainer.innerHTML = logOutBtnTemplate;

        let userWelcome = document.getElementById("userWelcome");
        let userNameSpan = document.getElementById("userNameSpan");
        let subWrapper = document.getElementById("subWrapper");
        let subStatusWrapper = document.getElementById("subStatusWrapper");
        let btnWrapper = document.getElementById("btnWrapper");
        let subBtn = document.getElementById("subBtn");
        
        subBtn.addEventListener("click", function() {

            let user = data;
            
            // fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/subscribe/' + id, {
            fetch('https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/users/subscribe', {


                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(function(res) {

                // console.log("res from MongoDB", res);
                subStatus = res.subscription;
                let newSubStatus; 

                switch (subStatus) {
                    case true: 
                        newSubStatus = "Wee, nu prenumererar du!"
                        break; 
                    case false: 
                        newSubStatus = "Oj oj, du prenumererar inte!"
                        break;
                };
                subStatusWrapper.innerHTML = newSubStatus;
            });
        });
        logOut();
    });
};

function logOut() {
    const logOutBtn = document.getElementById("logOutBtn");

    logOutBtn.addEventListener("click", function() {
        console.log("klick logout");
        localStorage.removeItem("id"); 
        printStartPage();
    });
};