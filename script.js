const header = document.getElementById("header");
const sectionContainer = document.getElementById("sectionContainer");

let loginSectionTemplate = `   
    <section id="loginSection">
        <h2>Logga in</h2> 
        <input id="loginUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="loginPassword" type="text" placeholder="Lösenord"><br> 
        <button id="loginBtn">Logga in</button>
        <div id="loginMsg"></div>
    </section>
`;

let registerSectionTemplate = `
    <section id="registerSection">
        <h2>Registrera dig</h2> 
        <input id="registerUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="registerPassword" type="text" placeholder="Lösenord"><br> 
        <button id="registerBtn">Registrera dig</button>
        <div id="registerMsg"></div>
    </section>
`;

sectionContainer.insertAdjacentHTML("afterbegin", loginSectionTemplate + registerSectionTemplate);

let registerUserName = document.getElementById("registerUserName");
let registerPassword = document.getElementById("registerPassword");
let registerBtn = document.getElementById("registerBtn");
let registerMsg = document.getElementById("registerMsg");




//registrera ny användare (identifieras genom randomiserad nyckel)
registerBtn.addEventListener("click", function() {
    // console.log("registerUserName.value", registerUserName.value);
    // console.log("registerPassword.value", registerPassword.value);

    let newUser = {userName: registerUserName.value, password: registerPassword.value};
    console.log("newUser", newUser);

    
    if ( (registerUserName.value !== "") && (registerPassword.value !== "") ) {
        console.log("fetcha");
        fetch('http://localhost:3000/users/login', {

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
        });
    } else {
        console.log("visa error");
        printErrorMsg();
    }

});

function printErrorMsg() {

    let errorMsg = `<p>Error, du måste fylla i både användarnamn och lösenord.</p>`;
    registerMsg.innerHTML = errorMsg;
}

function printRegisterSuccess() {

    let registerSuccess = `<p>Tack för din registrering. Du kan du logga in med dina nya användaruppgifter.</p>`;
    registerMsg.innerHTML = registerSuccess;

}