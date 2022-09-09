/*
Récupération des articles ajoutés au panier
*/

// 0. Construction de la class Product afin de récupérer et organiser les données brutes de chaque produit en provenance du fichier products de l'API :
class Product {
    constructor(productData) {
        productData && Object.assign(this, productData);        
    }
};

class Price {
    constructor(price) {
        this.price = price;
    }
};

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
    let product = new Product();
    for (product of cart) {

    // II. Distribution des éléments nécessaires sur la page pour chaque article du panier.
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
                        <p>
                            ${
                                // III. Récupération sécurisée du prix de chaque article sur l'API :
                                fetch("http://localhost:3000/api/products/" + product.selectId)
                                    .then(allProductsData => allProductsData.json())
                                    .then(getAllProductsPrices => { // getProductPrice

                                        console.log(getAllProductsPrices.price); // Récupère bien tous les prix de tous les produits du panier.
                                        
                                        let displayPrice = document.querySelector(".cart__item__content__description > p").nextElementSibling;
                                        displayPrice.innerText = ""; // Si enlevé : tous les prix des produits sur le premier produit.
                                        displayPrice.innerText += getAllProductsPrices.price; // Prend le prix du dernier article du panier pour l'afficher au premier article. Les autres : [objectPromise]                                        
                                    })
                                    .catch((error) => console.error(error))
                            }
                        </p>
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
    }
            
}

// IV. Affichage de la quantité de tous les articles ajoutés au panier
let totalQuantity = 0;
for (index in cart) {
    let updateQuantity = parseInt(cart[index].selectQuantity);
    totalQuantity += updateQuantity;
}
document.getElementById("totalQuantity").innerText +=
            `
                ${totalQuantity}
            `

// V. Modification de la quantité pour chaque article et de la quantité totale des articles :
Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.addEventListener("input", changeQuantity => {
    let itemQuantity = node.closest(".itemQuantity").value;    

    // Blocage des quantités tapées au clavier inférieures à 0 et supérieures à 100
    if (itemQuantity > 100 || itemQuantity <= -1) { // || itemQuantity <= -1
        (alert("Merci de bien vouloir choisir une quantité comprise entre 1 et 100 articles maximum !")); // Saut de ligne \n entre les guillements : "Merci de bien vouloir choisir une quantité inférieure à 100 articles !\nRetourner au panier ?"
        // Remettre la quantité précédente automatiquement à jour.        
    }    

    else {
        // Mise à jour de la quantité entre le DOM et le panier (cart du sessionStorage)
        function adjust() {
            let itemId = node.closest(".cart__item").dataset.id;
            let itemColor = node.closest(".cart__item").dataset.color;            
            let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
            
            function replace() {match.selectQuantity = itemQuantity};
            
            replace();
        };
        function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};    
        
        save(adjust());
        
        // Mise à jour de la quantité totale du panier sur la page du site
        let totalQuantity = 0;
        
        for (index in cart) {
            
            let updateQuantity = parseInt(cart[index].selectQuantity);            
            totalQuantity += updateQuantity;            

            document.getElementById("totalQuantity").innerText = "";
            document.getElementById("totalQuantity").innerText +=
                `
                    ${totalQuantity}
                `         
        } // Si utilisation du clavier, taper entrée.

        // Suppression d'un article avec 0 ou supprimer + entrée au clavier        
        if (itemQuantity == 0) {
            let itemId = node.closest(".cart__item").dataset.id;
            let itemColor = node.closest(".cart__item").dataset.color;            
            let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);

            function discard() {cart.splice(cart.indexOf(match), 1)};    
            function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
            function refresh() {window.location.reload()}
                    
            refresh((save(discard())));
        }

        // Bug en tapant "e" : supprime l'article. Seule lettre qui s'affiche quand on la tape.
        
    }
}));

// VI. Suppression d'un article avec les touches "enter", "backspace" ou "delete"
Array.from(document.getElementsByClassName("deleteItem")).forEach(node => node.addEventListener("click", deleteItem => {
    let itemId = node.closest(".cart__item").dataset.id;
    let itemColor = node.closest(".cart__item").dataset.color;            
    let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
    
    function discard() {cart.splice(cart.indexOf(match), 1)};    
    function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
    function refresh() {window.location.reload()}    
    
    refresh((save(discard()))); // A voir si la suppression du sessionStorage par un clear() ou un removeItem() est utile.
}));

// VII. Calcul du coût total du panier
// Chercher la quantité de chaque produit dans le cart OU dans le DOM.
// Multiplier chaque quantité avec le prix (fetch OU DOM ?).

let articleQuantity = document.getElementsByClassName("itemQuantity").value;
console.log(articleQuantity); // undefined
for (product of cart) {
    console.log(product.selecQuantiy);} // undefined

let itemQuantity = Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.closest(".itemQuantity").value); // Si non déclarée : node not defined ; sinon, undefined.    

for (product of cart) {
    document.getElementById("totalPrice").innerText +=
        `
            ${
                fetch("http://localhost:3000/api/products/" + product.selectId) // Voir si un nouveau fetch est utile.
                    .then(allProductsData => allProductsData.json())
                    .then(getAllProductsPrices => {
                        
                        /* reduce @ MDN
                        const array1 = [1, 2, 3, 4];
                        
                        // 0 + 1 + 2 + 3 + 4
                        const initialValue = 0;
                        const sumWithInitial = array1.reduce(
                            (previousValue, currentValue) => previousValue + currentValue,
                            initialValue
                        );

                        console.log(sumWithInitial);
                        // expected output: 10
                        */

                        console.log(getAllProductsPrices.price); // Récupère bien tous les prix de tous les produits du panier.
                        console.log(product.selectQuantity) // Seulement la quantité du dernier produit ajouté.

                        for (index in cart) {                                
                            let updateQuantity = parseInt(cart[index].selectQuantity);
                            console.log(updateQuantity);
                            console.log(cart[index].selectQuantity);
                            // let totalCartPrice = 0;
                            // totalCartPrice = totalCartPrice + getAllProductsPrices.price * updateQuantity;

                            totalItemPrice = getAllProductsPrices.price * updateQuantity;
                            console.log(totalItemPrice);

                            let totalCartPrice = 0;
                            totalCartPrice = totalItemPrice // ???

                            document.getElementById("totalPrice").innerText = "";
                            document.getElementById("totalPrice").innerText += totalCartPrice;

                            console.log(totalCartPrice);
                        }

                        console.log(totalQuantity) // Ok
                        // console.log(totalCartPrice); // La page doit être rafraîchie pour obtenir le prix.
                        
                    })
                    .catch((error) => console.error(error))
            }
        `
};

 /*
    addEventListener :
    change (The event occurs when the content of a form element, the selection, or the checked state have changed (for <input>, <select>, and <textarea>))
    input (The event occurs when an element gets user input)
    invalid (The event occurs when an element is invalid)
    reset (The event occurs when a form is reset)
    search (The event occurs when the user writes something in a search field (for <input="search">))
*/