const header = document.getElementById("header");
const sectionContainer = document.getElementById("sectionContainer");

let loginSectionTemplate = `   
    <section id="loginSection">
        <h2>Logga in</h2> 
        <input id="loginUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="loginPassword" type="text" placeholder="Lösenord"><br> 
        <button id="loginBtn">Logga in</button>
        <div id="loginError"></div>
    </section>
`;

let registerSectionTemplate = `
    <section id="registerSection">
        <h2>Registrera dig</h2> 
        <input id="registerUserName" type="text" placeholder="Användarnamn"><br> 
        <input id="registerPassword" type="text" placeholder="Lösenord"><br> 
        <button id="registerBtn">Registrera dig</button>
        <div id="registerError"></div>
    </section>
`;

sectionContainer.insertAdjacentHTML("afterbegin", loginSectionTemplate + registerSectionTemplate);
