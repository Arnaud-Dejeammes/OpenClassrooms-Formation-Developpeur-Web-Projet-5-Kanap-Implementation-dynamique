/*
Récupération des articles ajoutés au panier
*/

// I. Récupération du panier (sessionStorage) avec l'affichage de chaque article et ses caractéristiques :
cart = JSON.parse(sessionStorage.getItem("cart"));

if (cart == null || cart == 0) {
    (alert("Votre panier est vide. Merci de retourner à l'accueil pour choisir vos articles !"));

    document.getElementById("cart__items").innerHTML +=
        `
            <div class="cart__empty">
                <p>
                    Votre panier est vide.<br> Merci de retourner à l'<a href="./index.html">accueil</a> pour choisir vos articles !
                </p>
            </div>
        `
}

else {
    for (let product of cart) {
        // II. Répartition de chaque produit et de ses caractéristiques sur la page, avec la récupération sécurisée du prix à partir de l'API :
        fetch("http://localhost:3000/api/products/" + product.selectId)
            .then(allProductsData => allProductsData.json())
            .then(getAllProductsPrices => {
                document.getElementById("cart__items").innerHTML +=
                    `
                        <article class="cart__item" data-id="${product.selectId}" data-color="${product.selectColor}">
                            <div class="cart__item__img">
                                <img src="${product.selectImageUrl}" alt="${product.selectAltTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                <h2>${product.selectName}</h2>
                                <p>${product.selectColor}</p>
                                <p>${getAllProductsPrices.price}&nbsp;€</p>

                            </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.selectQuantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>                        
                    `

                // III. Calcul du coût total du panier et affichage du résultat :
                // Calcul du prix de chaque article en fonction de sa quantité.
                let totalItemPrice = product.selectQuantity * getAllProductsPrices.price;

                // Calcul du prix total
                function computeTotalCartPrice () {
                    totalCartPrice += totalItemPrice;
                }
                // Affichage du prix total du panier
                function displayTotalCartPrice() {
                    document.getElementById("totalPrice").innerText = "";
                    document.getElementById("totalPrice").innerText +=
                        `
                            ${totalCartPrice}
                        `
                }
                
                // Calcul et affichage du prix total du panier à l'arrivée sur la page
                displayTotalCartPrice(computeTotalCartPrice());

                // Modification du prix total du panier en fonction de la modification de la quantité des articles
                Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.addEventListener("input", updateTotal => {
                        displayTotalCartPrice(computeTotalCartPrice());
                }));

                // IV. Modification et mise à jour de la quantité pour chaque article, ainsi que de de la quantité totale des articles :
                Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.addEventListener("input", changeQuantity => {
                    let itemQuantity = node.closest(".itemQuantity").value;

                    // Blocage des quantités tapées au clavier inférieures à 0 et supérieures à 100
                    if (itemQuantity > 100 || itemQuantity <= -1) {
                        (alert("Merci de bien vouloir choisir une quantité comprise entre 1 et 100 articles maximum !")); // Saut de ligne \n entre les guillements : "Merci de bien vouloir choisir une quantité inférieure à 100 articles !\nRetourner au panier ?"
                        // Essayer de remettre la quantité précédente automatiquement à jour.        
                    }

                    // Palliatif au bug du code d'origine (la lettre "e" est la seule lettre qui s'affiche quand on la tape au clavier).
                    /* if (itemQuantity = "e") {
                        (alert("Merci de bien vouloir utiliser les chiffres de votre clavier pour entrer une quantité."));
                    } */ // Nombreux problèmes à l'utilisation.   
                    // if (itemQuantity = ""), selectQuantity: "" dans le cart, avec impossibilité de rentrer un nouveau chiffre.

                    else {
                        // Affichage de la quantité totale des articles dans le panier
                        function displayTotalQuantity() {
                            document.getElementById("totalQuantity").innerText = "";
                            document.getElementById("totalQuantity").innerText +=
                                `
                                    ${totalQuantity}
                                `
                        }

                        // Modification de la quantité entre le DOM et le panier (cart du sessionStorage)
                        function adjust() {
                            let itemId = node.closest(".cart__item").dataset.id;
                            let itemColor = node.closest(".cart__item").dataset.color;
                            let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
                            
                            function replace() {match.selectQuantity = itemQuantity};
                            
                            replace();
                        };
                        function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
                        
                        save(adjust());
                        
                        // Affichage de la quantité de tous les articles ajoutés au panier :                        
                        let totalQuantity = 0;
                        
                        for (index in cart) {
                            
                            let updateQuantity = parseInt(cart[index].selectQuantity);            
                            totalQuantity += updateQuantity;
                            // Trouver la solution pour mettre totalQuantity = 0 quand totalQuantity affiche NaN.
                            
                           displayTotalQuantity();
                        }                        
                        
                        // Suppression d'un article avec 0 ou les touche "delete" ou "backspace" + entrée au clavier
                        // Eviter la suppression avec "backspace" ou "delete" pour pouvoir entrer les chiffres.
                        if (itemQuantity == 0) { // Quand itemQuantity == 0, supprime l'article. Quand itemQuantity === 0, garde l'article sans le supprimer, mais sans la quantité (ou "0" ou "" dans la panier en fonction de la valeur entrée).
                            let itemId = node.closest(".cart__item").dataset.id;
                            let itemColor = node.closest(".cart__item").dataset.color;            
                            let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);

                            function discard() {cart.splice(cart.indexOf(match), 1)};    
                            function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
                            
                            node.closest(".cart__item").remove();
                                    
                            (save(discard()));                            
                            /*
                            if (cart === null || cart === 0) {
                                // sessionStorage.removeItem("cart");
                                sessionStorage.clear();
                            } */

                            // let totalQuantity = 0;

                            for (index in cart) {
                                    
                                let updateQuantity = parseInt(cart[index].selectQuantity); 
                                        
                                totalQuantity += updateQuantity;
                                // Trouver la solution pour mettre totalQuantity = 0 quand totalQuantity affiche NaN.
                                
                                displayTotalQuantity();
                                
                            }
                            
                            displayTotalCartPrice(computeTotalCartPrice());
                        }
                    }
                }));

                // V. Suppression d'un article avec le bouton "Supprimer"
                Array.from(document.getElementsByClassName("deleteItem")).forEach(node => node.addEventListener("click", deleteItem => {
                    let itemId = node.closest(".cart__item").dataset.id;
                    let itemColor = node.closest(".cart__item").dataset.color;            
                    let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
                
                    function discard() {cart.splice(cart.indexOf(match), 1)};
                    function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};                    
                    
                    node.closest(".cart__item").remove(); // La méthode remove() est plus moderne que removeChild().                    

                    (save(discard()));

                    // totalCartPrice = 0;
                    
                    let totalQuantity = 0;

                    for (index in cart) {
                            
                        let updateQuantity = parseInt(cart[index].selectQuantity); 
                                   
                        totalQuantity += updateQuantity;
                        // Trouver la solution pour mettre totalQuantity = 0 quand totalQuantity affiche NaN.

                        function displayTotalQuantity() {
                            document.getElementById("totalQuantity").innerText = "";
                            document.getElementById("totalQuantity").innerText +=
                                `
                                    ${totalQuantity}
                                `
                        }

                        displayTotalQuantity();
                    }
                    displayTotalCartPrice(computeTotalCartPrice());                    
                }));

            })
            .catch((error) => console.error(error))
    }

    totalCartPrice = 0;

    // Affichage de la quantité de tous les articles ajoutés au panier dès l'arrivée sur le panier :
    let totalQuantity = 0;   
    for (index in cart) {                                
        let updateQuantity = parseInt(cart[index].selectQuantity);
        totalQuantity += updateQuantity;
    }
    document.getElementById("totalQuantity").innerText +=
        `
            ${totalQuantity}
        ` 
}

/*
Validation du formulaire
*/

/* document.querySelector(".cart__order__form").addEventListener("input", scanActivity => {
    console.log(document.querySelector(".cart__order__form").value);
}) */

/*
document.getElementsByClassName("cart__order__form__submit").addEventListener("click", order => {
    
    function switchSubmit(disabled) {
        if (disabled) {
            document.getElementsByClassName("cart__order__form__submit").setAttribute("disabled", true);
        }
        else {
        document.getElementsByClassName("cart__order__form__submit").removeAttribute("disabled");
        }
    }
});
*/

document.getElementById("firstName").addEventListener("input", validateFirstName => {
    /* Regex pour firstName et lastName (clients avec des prénoms écrits avec les différents alphabets
    européens et leurs caractères spéciaux, ainsi que les translitérations en alphabet latin) */
    
    let namePattern = new RegExp("^[A-Za-zÀ-žĄ-ę’'ʼ-]+$"); // "^[^ ][A-Za-zÀ-žĄ-ę ’'ʼ-]+$"
    
        if (namePattern.test(document.getElementById("firstName").value)) {
            document.getElementById("firstName").style.backgroundColor = "#B6D7A8";
            document.getElementById("firstNameErrorMsg").innerText = "";
            return true;
        }       

        else {
            document.getElementById("firstName").style.backgroundColor = "#FBBCBC";
            document.getElementById("firstNameErrorMsg").innerText =
            "Seuls les lettres de l’alphabet, le tiret et l’apostrophe peuvent être utilisés.";
            // alert("Il y a un petit souci avec le format du prénom !");            
            return false;
        }
      
})

document.getElementById("lastName").addEventListener("input", validateLastName => {
    /* Regex pour firstName et lastName (clients avec des noms écrits avec les différents alphabets
    européens et leurs caractères spéciaux, ainsi que les translitérations en alphabet latin) */
    let namePattern = new RegExp("^[A-Za-zÀ-žĄ-ę’'ʼ-]+$"); // "^[^ ][A-Za-zÀ-žĄ-ę ’'ʼ-]+$"
    
    if (namePattern.test(document.getElementById("lastName").value)) {
        document.getElementById("lastName").style.backgroundColor = "#B6D7A8";
        document.getElementById("lastNameErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("lastName").style.backgroundColor = "#FBBCBC";
        document.getElementById("lastNameErrorMsg").innerText =
        "Seuls les lettres de l’alphabet, le tiret et l’apostrophe peuvent être utilisés.";
        // alert("Il y a un petit souci avec le format de votre nom n'est pas valide.\nMerci de n'utilser que des lettres.");
        return false;
    }
})

document.getElementById("address").addEventListener("input", validateAddress => {
    /* Regex pour address (livraison en France uniquement; virgule non
    prise en compte afin de se conformer aux nouvelles normes postales) */ 
    let addressPattern = new RegExp("^[0-9A-Za-zÀàÂâÄäÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜüŸÿ ’'ʼ-]+$"); // "^[^ ][A-Za-zÀ-žĄ-ę ’'ʼ-]+$"
    
    if (addressPattern.test(document.getElementById("address").value)) {
        document.getElementById("address").style.backgroundColor = "#B6D7A8";
        document.getElementById("addressErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("address").style.backgroundColor = "#FBBCBC";
        document.getElementById("addressErrorMsg").innerText =
        "Seuls les chiffres, les lettres de l’alphabet, le tiret et l’apostrophe peuvent être utilisés.\nLivraison en France uniquement.";
        // alert("Il y a un petit souci avec votre adresse !\nMerci de n'utilser que des chiffres et des lettres.");
        return false;
    }
})

document.getElementById("city").addEventListener("input", validateCity => {
    /* Regex pour city (localité; livraison en France uniquement; virgule non
    prise en compte afin de se conformer aux nouvelles normes postales) */
    let cityPattern = new RegExp("^[A-Za-zÀàÂâÄäÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜüŸÿ’'ʼ-]+$"); // "^[^ ][A-Za-zÀ-žĄ-ę ’'ʼ-]+$"
    
    if (cityPattern.test(document.getElementById("city").value)) {
        document.getElementById("city").style.backgroundColor = "#B6D7A8";
        document.getElementById("cityErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("city").style.backgroundColor = "#FBBCBC";
        document.getElementById("cityErrorMsg").innerText =
        "Seuls les lettres de l’alphabet, le tiret et l’apostrophe peuvent être utilisés.\nLivraison en France uniquement.";
        // alert("Il y a un petit souci avec votre adresse !\nMerci de n'utilser que des chiffres et des lettres.");
        return false;
    }
})

document.getElementById("email").addEventListener("input", validateEmail => {
    /* Regex pour email */
    // let emailPattern = new RegExp("[a-z09]+[@]{1}+[.]{1}[a-z]{2,}+$")

    let emailPattern = new RegExp("^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_]+.[a-z]{0,63}$"); // Devient vert dès la première partie du nom de domaine, avant le point. // {2,4}
    // new RegExp(/^([w-_.]+)@((?:[w]+.)+)([a-zA-Z]{2,4})/i)

    if (emailPattern.test(document.getElementById("email").value)) {
        document.getElementById("email").style.backgroundColor = "#B6D7A8";
        document.getElementById("emailErrorMsg").innerText = "";
        return true;
    }
    else {
        document.getElementById("email").style.backgroundColor = "#FBBCBC";
        document.getElementById("emailErrorMsg").innerText =
        "identifiant@nomde.domaine";
        // alert("Il y a un petit souci avec votre email !\nMerci de pas utilser de caractères spéciaux à part @.");
        return false;
    }
})

    /*
    {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email.email.value
    }
    */
    /*
    class customerInformation {    
        constructor(firstName, lastName, address, city, email) { // constructor(selectId, selectColor, selectName, selectPrice, selectQuantity, selectImageUrl, selectAltTxt)
          this.firstName = firstName.value;
          this.lastName = lastName.value;      
          this.address = address.value;
          // this.selectPrice = selectPrice;
          this.city = city.value;
          this.email = email.value;          
        }    
      }
})  */

/*
fetch("http://localhost:3000/api/products/order/", { // "http://localhost:3000/api/order/"
    method: "POST",
    headers: {"Content-Type": "application/json",
              "Accept": "application/json"}
    body: JSON.stringify({
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    })
})
.then(allProductsData => allProductsData.json())
.then(getAllProductsData => {})
.catch((error) => console.error(error)) */

document.getElementById("firstName").addEventListener("input", scanActivity => {
    console.log(document.getElementById("firstName").value);
})

document.getElementById("lastName").addEventListener("input", scanActivity => {
    console.log(document.getElementById("lastName").value);
})

document.getElementById("address").addEventListener("input", scanActivity => {
    console.log(document.getElementById("address").value);
})

document.getElementById("city").addEventListener("input", scanActivity => {
    console.log(document.getElementById("city").value);
})

document.getElementById("email").addEventListener("input", scanActivity => {
console.log(document.getElementById("email").value);
})

 /*
    addEventListener :
    change (The event occurs when the content of a form element, the selection, or the checked state have changed (for <input>, <select>, and <textarea>))
    input (The event occurs when an element gets user input)
    invalid (The event occurs when an element is invalid)
    reset (The event occurs when a form is reset)
    search (The event occurs when the user writes something in a search field (for <input="search">))
*/