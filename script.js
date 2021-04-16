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
        <input id="registerPassword" type="text" placeholder="Lösenord"><br> 
        <button id="registerBtn" class="btn-red-fill">Registrera dig</button>
        <div id="registerMsgContainer"></div>
    </section>`;

let startPageTemplate = 
    `<article>
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
    console.log("ingen är inloggad");
    printStartPage();

} else {
    console.log("någon är inloggad");
    printUserPage();
};

function printStartPage() {
    sectionContainer.innerHTML = loginSectionTemplate + registerSectionTemplate;
    articleContainer.innerHTML = startPageTemplate;
    let loginUserName = document.getElementById("loginUserName");
    let loginPassword = document.getElementById("loginPassword");
    let loginBtn = document.getElementById("loginBtn");
    let loginMsgContainer = document.getElementById("loginMsgContainer");
    let registerUserName = document.getElementById("registerUserName");
    let registerPassword = document.getElementById("registerPassword");
    let registerBtn = document.getElementById("registerBtn");
    let registerMsgContainer = document.getElementById("registerMsgContainer");

    //registrera ny användare (identifieras genom randomiserad nyckel)
    registerBtn.addEventListener("click", function() {
        // console.log("registerUserName.value", registerUserName.value);
        // console.log("registerPassword.value", registerPassword.value);
        loginMsgContainer.innerHTML = ""; 

        let newUser = {userName: registerUserName.value, password: registerPassword.value, subscription: false};
        console.log("newUser", newUser);

        if ( (registerUserName.value !== "") && (registerPassword.value !== "") ) {
            console.log("fetcha");
            fetch('http://localhost:3000/users/register', {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            })
            .then(res => res.json())
            .then(function(res) {
                console.log(res);
                if (res === "newUser saved") {
                    printRegisterSuccess();
                }
                if (res === "userName already exists") {
                    printRegisterFail();
                }
            });
        } else {
            console.log("visa error");
            printErrorMsg(registerMsgContainer);
        }
    });

    loginBtn.addEventListener("click", function() {

        registerMsgContainer.innerHTML = ""; 
        console.log("klick loginBtn");

        //FRÅGA: borde detta vara samma som newUser i registerBtn-listener?
        //köra crypto
        let user = {userName: loginUserName.value, password: loginPassword.value};
        // console.log(user);

        if ( (loginUserName.value !== "") && (loginPassword.value !== "") ) {
            console.log("fetcha");

            fetch('http://localhost:3000/users/login', {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(function(res) {
                // console.log("res.id", res.id);

                if (res.id !== undefined) {
                    console.log("Login sucess - save id to lS");
                    localStorage.setItem("id", res.id);
                    printUserPage();
                } else {
                    console.log("Login fail - show error");
                    printErrorMsg(loginMsgContainer)
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

function printRegisterSuccess() {
    let registerSuccess = `<p>Tack för din registrering. Du kan du logga in med dina nya användaruppgifter.</p>`;
    registerMsgContainer.innerHTML = registerSuccess;
};

function printRegisterFail() {
    let registerFail = `<p>Användarnamnet finns redan, pröva med ett annat.</p>`;
    registerMsgContainer.innerHTML = registerFail;
};

function printUserPage(getSubscriptionStatus) {
    let getId = localStorage.getItem("id");
    console.log("getId", getId);
    
    fetch('http://localhost:3000/users/userpage/' + getId )

    .then(data => data.json())
    .then(function(data) {
        console.log(data);

        let userPageTemplate = 
            `<h5>Nu är du inloggad!</h5> 
            <div id="subscribeStatusContainer"></div>
            <button id="subscriptionBtn" class="btn-red-fill">Ändra prenumerationsstatus</button>`;

        articleContainer.innerHTML = userPageTemplate;
        sectionContainer.innerHTML = logOutBtnTemplate;

        let subscriptionStatus;
        let subscribeTemplate;
        let subscribeStatusContainer = document.getElementById("subscribeStatusContainer");

        switch (data) {
            case true: 
                subscriptionStatus = "Du prenumererar";
                // console.log("subscriptionStatus from case true", subscriptionStatus);
                subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                subscribeStatusContainer.innerHTML = subscribeTemplate;
                // console.log("subscribeStatusContainer", subscribeStatusContainer);
                break;
            case false: 
                subscriptionStatus = "Du prenumererar inte";
                // console.log("subscriptionStatus from case false", subscriptionStatus);
                subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                subscribeStatusContainer.innerHTML = subscribeTemplate;
                break;
        };

        let subscriptionBtn = document.getElementById("subscriptionBtn");
        let logOutBtn = document.getElementById("logOutBtn");

        subscriptionBtn.addEventListener("click", function() {
            console.log("klick subscriptionBtn");
            
            // fetch(`http://localhost:3000/users/subscribe/${getId}`)
            fetch('http://localhost:3000/users/subscribe/' + getId )
            .then(data => data.json())
            .then(function(data) {
                console.log("subscriptionStatus True or False", data);

                let subscribeTemplate;
                switch (data) {
                    case true: 
                        subscriptionStatus = "Du prenumererar";
                        console.log("subscriptionStatus from case true", subscriptionStatus);
                        subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                        subscribeStatusContainer.innerHTML = subscribeTemplate;
                        break;
                    case false: 
                        subscriptionStatus = "Du prenumererar inte";
                        console.log("subscriptionStatus from case false", subscriptionStatus);
                        subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                        subscribeStatusContainer.innerHTML = subscribeTemplate;
                        break;
                };
            });
        })

        logOutBtn.addEventListener("click", function() {
            console.log("klick logout");
            localStorage.removeItem("id"); 
            printStartPage();
        })
    });
};