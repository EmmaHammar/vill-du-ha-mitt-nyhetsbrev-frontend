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
    let registerPassword = document.getElementById("registerPassword");
    let registerBtn = document.getElementById("registerBtn");
    let registerMsgContainer = document.getElementById("registerMsgContainer");

    //registrera ny användare (identifieras genom randomiserad nyckel)
    registerBtn.addEventListener("click", function() {

        loginMsgContainer.innerHTML = ""; 

        let newUser = {userName: registerUserName.value, password: registerPassword.value, subscription: false};

        if ( (registerUserName.value !== "") && (registerPassword.value !== "") ) {
            fetch('http://localhost:3000/users/register', {

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
                    
                    // console.log(res.id);
                    saveToLS("id", res.id)
                    // printUserPage();
                    printRegisterSuccess();
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
        console.log("klick loginBtn");
        
        //köra crypto
        let user = {userName: loginUserName.value, password: loginPassword.value};
        console.log("user", user);

        // fetch('http://localhost:3000/users/check', {

        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(user)
        // })
        // .then(res => res.json())
        // .then(function(res) {

        //     console.log("res", res);

        //     if(res.code == "ok") {
        //         console.log("user inloggad");
        //         saveToLS("id", res.userId);
        //         printUserPage();
        //     } else {
        //         console.log("error");
        //     }
        // });

        console.log("loginUserName.value ", loginUserName.value);
        console.log("loginPassword.value ", loginPassword.value);

        
        if ( (loginUserName.value !== "") && (loginPassword.value !== "" ) ) {
            console.log("fetcha");

            fetch('http://localhost:3000/users/userpage', {

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
                    printUserPage(res.userId);

                    // fetch('http://localhost:3000/users/userpage/' + res.userId )

                    // .then(data => data.json())
                    // .then(function(data) {
                    //     console.log("data för att visa userpage-sidan", data);
                    // });

                } else {
                    console.log("error");
                    printErrorMsg(loginMsgContainer);

                }
            });

            

            //         if (res.id !== undefined) {
            //             console.log("Login sucess - save id to lS");
            //             localStorage.setItem("id", res.id);
            //             printUserPage();
            //         } else {
            //             console.log("Login fail - show error");
            //             printErrorMsg(loginMsgContainer)
            //         }
            // }); 

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



function printUserPage(id) {

    fetch('http://localhost:3000/users/userpage/' + id )

    .then(data => data.json())
    .then(function(data) {
        console.log("userName + subscription", data);

        //visa prenumerationsstatus
        let subStatus = ""; 
        if (data.subscription === true) {
            subStatus = "<p>Wee, nu prenumererar du!"
        } else {
            subStatus = "<p>Oj oj, nu prenumererar du inte!</p>"
        }

        let userPageTemplate = 
            `<div id="userWelcome"> 
                <h4>Nu är du inloggad,</h4>
                <span id="userNameSpan">${data.userName}</span>
            </div>
            <div id="subWrapper">
                <p>Ditt prenumerationsstatus:</p>
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
            console.log("klick subBtn");

            
            let user = data;
            
            fetch('http://localhost:3000/users/subscribe/' + id, {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(function(res) {

                console.log("res from MongoDB", res);

                subStatus = res.subscription;

                let newSubStatus; 

                switch (subStatus) {
                    case true: 
                        newSubStatus = "Wee, nu prenumererar du!"
                        break; 
                    case false: 
                        newSubStatus = "Oj oj, nu prenumererar du inte!"
                        break;

                };

                subStatusWrapper.innerHTML = newSubStatus;


                
            });

        })
        logOut();


           
        
        // userNameSpan.innerHTML = data.userName;
       
        // let userPageInfo = 
        //     `<h5>Nu är du inloggad, ${data.userName}!</h5>
        //     <button id="subscriptionBtn" class="btn-red-fill">Ändra prenumerationsstatus</button>
        //     `;

        // console.log("userPageInfo", userPageInfo); //den är som ovan
        // userPageTemplate += userPageInfo;

        // console.log("userPageTemplate med userPageInfo", userPageTemplate); // här har object lagts till.. VARFÖR?
        
        // printSubscriptionStatus(data, userPageTemplate);
        // sectionContainer.innerHTML = logOutBtnTemplate;

        // const subscriptionBtn = document.getElementById("subscriptionBtn");
        // subscriptionBtn.addEventListener("click", function() {
        //     console.log("klixk subscriptionBtn");


        //     let user = data;
            
        //     fetch('http://localhost:3000/users/subscribe/' + id, {

        //         method: 'post',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(user)
        //     })
        //     .then(res => res.json())
        //     .then(function(res) {
        //         console.log("res.subscription in", res.subscription);

        //         let subscribeTemplate;
        //         let subscribeStatusContainer = document.getElementById("subscribeStatusContainer");
        //         switch (res.subscription) {
        //             case true: 
        //                 subscriptionStatus = "Du prenumererar";
        //                 console.log("subscriptionStatus from case true", subscriptionStatus);
        //                 subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
        //                 subscribeStatusContainer.innerHTML = subscribeTemplate;
        //                 break;
        //             case false: 
        //                 subscriptionStatus = "Du prenumererar inte";
        //                 console.log("subscriptionStatus from case false", subscriptionStatus);
        //                 subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
        //                 subscribeStatusContainer.innerHTML = subscribeTemplate;
        //                 break;
        //         };

        //     });

        //     printSubscriptionStatus(data, userPageTemplate);
        //     printUserPage(id); // här går det att trycka på subscribeBtn 

        // });

        // changeSubscriptionStatus(data.subscription, id, data);
        // logOut();

    });
};

function printSubscriptionStatus(data, userPageTemplate) {
    let subscriptionStatus; 

    if (data.subscription === false) {
        subscriptionStatus = `<div id="subscribeStatusContainer">Du prenumererar inte på vårt nyhetsbrev.</div>`;
        userPageTemplate += subscriptionStatus;
    } else {
        subscriptionStatus = `<div id="subscribeStatusContainer">Du prenumererar på vårt nyhetsbrev.</div>`;
        userPageTemplate += subscriptionStatus;
    }
    articleContainer.innerHTML = userPageTemplate;

};

function logOut() {
    const logOutBtn = document.getElementById("logOutBtn");

    logOutBtn.addEventListener("click", function() {
        console.log("klick logout");
        localStorage.removeItem("id"); 
        printStartPage();
    });
};




function changeSubscriptionStatus(status, id, data) {
    const subscriptionBtn = document.getElementById("subscriptionBtn");
    let newStatus; 
    
    subscriptionBtn.addEventListener("click", function() {
        console.log("klick changeSubscriptionStatus");
        if (status === false) {
            console.log("Grattis, du prenumererar!");
            newStatus = true;
        } else {
            console.log("Oh no, du prenumererar inte!");
            newStatus = false;
        }
        console.log("spara newStatus till mongoDB", newStatus);
        // console.log("id söka efter", id);
        
        let user = data;
        console.log("notUpdatedUser", user);

            fetch('http://localhost:3000/users/subscribe/' + id, {

                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(res => res.json())
            .then(function(res) {
                console.log("res.subscription", res.subscription);

                let subscribeTemplate;
                let subscribeStatusContainer = document.getElementById("subscribeStatusContainer");
                switch (res.subscription) {
                    case true: 
                        subscriptionStatus = "Du prenumererar";
                        // console.log("subscriptionStatus from case true", subscriptionStatus);
                        subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                        subscribeStatusContainer.innerHTML = subscribeTemplate;
                        break;
                    case false: 
                        subscriptionStatus = "Du prenumererar inte";
                        // console.log("subscriptionStatus from case false", subscriptionStatus);
                        subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
                        subscribeStatusContainer.innerHTML = subscribeTemplate;
                        
                        break;
                };

            });
    });
};


            // fetch('http://localhost:3000/users/subscribe/' + id )
            // .then(data => data.json())
            // .then(function(data) {
            //     console.log("subscriptionStatus True or False", data);

            //     // let subscribeTemplate;
            //     // switch (data) {
            //     //     case true: 
            //     //         subscriptionStatus = "Du prenumererar";
            //     //         console.log("subscriptionStatus from case true", subscriptionStatus);
            //     //         subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
            //     //         subscribeStatusContainer.innerHTML = subscribeTemplate;
            //     //         break;
            //     //     case false: 
            //     //         subscriptionStatus = "Du prenumererar inte";
            //     //         console.log("subscriptionStatus from case false", subscriptionStatus);
            //     //         subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
            //     //         subscribeStatusContainer.innerHTML = subscribeTemplate;
            //     //         break;
            //     // };
            // });




    // });

//         let newStatus = "";
//         console.log("status", status);
        

//         switch (status) {
//             case true: 
//         //         status = false; 
//         //         let subscribeStatusContainer = `<div id="subscribeStatusContainer">Oh no, du prenumererar inte på vårt nyhetsbrev.</div>`;
//         //         // subscriptionStatus = "Du prenumererar";
//         //         // // console.log("subscriptionStatus from case true", subscriptionStatus);
//         //         // subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//         //         subscribeStatusContainer.innerHTML = subscribeTemplate;
//         //         // // console.log("subscribeStatusContainer", subscribeStatusContainer);
//         //         break;
//         //     case false: 
//         //         status = true; 
//         //         subscribeStatusContainer = `<div id="subscribeStatusContainer">Grattis, du prenumererar på vårt nyhetsbrev.</div>`;

//         //         // subscriptionStatus = "Du prenumererar inte";
//         //         // // console.log("subscriptionStatus from case false", subscriptionStatus);
//         //         // subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//         //         subscribeStatusContainer.innerHTML = subscribeTemplate;
//         //         break;
//         // };
//     });

// };


// function printUserPage(getSubscriptionStatus) {
//     let getId = localStorage.getItem("id");
//     console.log("getId", getId);
    
//     fetch('http://localhost:3000/users/userpage/' + getId )

//     .then(data => data.json())
//     .then(function(data) {
//         console.log(data);

//         let userPageTemplate = 
//             `<h5>Nu är du inloggad!</h5> 
//             <div id="subscribeStatusContainer"></div>
//             <button id="subscriptionBtn" class="btn-red-fill">Ändra prenumerationsstatus</button>`;

//         articleContainer.innerHTML = userPageTemplate;
//         sectionContainer.innerHTML = logOutBtnTemplate;

//         let subscriptionStatus;
//         let subscribeTemplate;
//         let subscribeStatusContainer = document.getElementById("subscribeStatusContainer");

//         switch (data) {
//             case true: 
//                 subscriptionStatus = "Du prenumererar";
//                 // console.log("subscriptionStatus from case true", subscriptionStatus);
//                 subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//                 subscribeStatusContainer.innerHTML = subscribeTemplate;
//                 // console.log("subscribeStatusContainer", subscribeStatusContainer);
//                 break;
//             case false: 
//                 subscriptionStatus = "Du prenumererar inte";
//                 // console.log("subscriptionStatus from case false", subscriptionStatus);
//                 subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//                 subscribeStatusContainer.innerHTML = subscribeTemplate;
//                 break;
//         };

//         let subscriptionBtn = document.getElementById("subscriptionBtn");
//         let logOutBtn = document.getElementById("logOutBtn");

//         subscriptionBtn.addEventListener("click", function() {
//             console.log("klick subscriptionBtn");
            
//             // fetch(`http://localhost:3000/users/subscribe/${getId}`)
//             fetch('http://localhost:3000/users/subscribe/' + getId )
//             .then(data => data.json())
//             .then(function(data) {
//                 console.log("subscriptionStatus True or False", data);

//                 let subscribeTemplate;
//                 switch (data) {
//                     case true: 
//                         subscriptionStatus = "Du prenumererar";
//                         console.log("subscriptionStatus from case true", subscriptionStatus);
//                         subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//                         subscribeStatusContainer.innerHTML = subscribeTemplate;
//                         break;
//                     case false: 
//                         subscriptionStatus = "Du prenumererar inte";
//                         console.log("subscriptionStatus from case false", subscriptionStatus);
//                         subscribeTemplate = `<p>${subscriptionStatus} på nyhetsbrevet</p>`;
//                         subscribeStatusContainer.innerHTML = subscribeTemplate;
//                         break;
//                 };
//             });
//         })

//         logOutBtn.addEventListener("click", function() {
//             console.log("klick logout");
//             localStorage.removeItem("id"); 
//             printStartPage();
//         })
//     });
// };