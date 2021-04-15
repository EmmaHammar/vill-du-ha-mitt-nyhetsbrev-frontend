// const header = document.getElementById("header");
const sectionContainer = document.getElementById("sectionContainer");
const articleContainer = document.getElementById("articleContainer");

let loginSectionTemplate = `   
    <section id="loginSection">
        <h2>Logga in</h2> 
        <input id="loginUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="loginPassword" type="text" placeholder="Lösenord"><br> 
        <button id="loginBtn">Logga in</button>
        <div id="loginMsgContainer"></div>
    </section>
`;

let registerSectionTemplate = `
    <section id="registerSection">
        <h2>Registrera dig</h2> 
        <input id="registerUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="registerPassword" type="text" placeholder="Lösenord"><br> 
        <button id="registerBtn">Registrera dig</button>
        <div id="registerMsgContainer"></div>
    </section>
`;

let startPageTemplate = `
    <article>
        <h2>Välkommen till Kundklubben!</h2>
        <p>Här kan du logga in för att ändra din prenumerationsstatus.</p>
    </article>

    <article>
        <h3>Om oss</h3>
        <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates aspernatur voluptate, tenetur eveniet earum necessitatibus ipsum possimus. Autem aut error illum assumenda quod molestias, nisi aperiam nemo. Itaque, labore sint.
        </p>
    </article>
`;

const logOutBtnTemplate = `<button id="logOutBtn">Logga ut</button>`;

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
    articleContainer.insertAdjacentHTML("afterbegin", startPageTemplate);

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

        //borde detta vara samma som newUser i registerBtn-listener?
        let user = {userName: loginUserName.value, password: loginPassword.value};
        console.log(user);

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
                console.log("res", res);
                console.log("res.id", res.id);
                console.log("res.subscription", res.subscription);

                if (res.id !== undefined) {

                    console.log("Login sucess - save id to lS");
                    localStorage.setItem("id", res.id);
                    
                    let subscriptionStatus;

                    if (res.subscription === true) {
                        subscriptionStatus = "Du prenumererar";
                        localStorage.setItem("subscription", subscriptionStatus);
                        console.log(subscriptionStatus);
                        
                    } else {
                        subscriptionStatus = "Du prenumererar inte";
                        console.log(subscriptionStatus);
                        localStorage.setItem("subscription", subscriptionStatus);

                    }
                    printUserPage(subscriptionStatus);
                    

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

    let errorMsg = `<p>Error, du måste fylla i användarnamn och lösenord.</p>`;
    msgContainer.innerHTML = errorMsg;
};

function printRegisterSuccess() {

    let registerSuccess = `
        <p>Tack för din registrering. Du kan du logga in med dina nya användaruppgifter.</p>
    `;
    registerMsgContainer.innerHTML = registerSuccess;

};

function printRegisterFail() {
    
    let registerFail = `
        <p>Användarnamnet finns redan, pröva med ett annat.</p>
    `;
    registerMsgContainer.innerHTML = registerFail;

};

function printUserPage(subscriptionStatus) {
    let getSubscriptionStatus = localStorage.getItem("subscription");
    console.log(getSubscriptionStatus);

    let userPageTemplate = `
        <h5>Du är inloggad på Kundklubben!</h5> 
        <p>${getSubscriptionStatus} på nyhetsbrevet.</p>
    `;
    
    articleContainer.innerHTML = userPageTemplate;
    sectionContainer.innerHTML = logOutBtnTemplate;

    let logOutBtn = document.getElementById("logOutBtn");

    logOutBtn.addEventListener("click", function() {
        console.log("klick logout");
        localStorage.removeItem("id"); 
        localStorage.removeItem("subscription"); 
        printStartPage();
    })
};