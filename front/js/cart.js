// Récupération des articles ajoutés au panier
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const emptyCart = () => {
    document.getElementById("cart__items").insertAdjacentHTML("beforeend",
        `
            <div class="cart__empty" style:"color: #B6D7A8">
                <p>
                    Votre panier est vide.<br> Merci de retourner à l'<a href="./index.html">accueil</a> pour choisir vos articles !
                </p>
            </div>
        `
    )
    document.getElementById("cart__items").style.color = "#FBBCBC";

    document.getElementById("totalPrice").textContent = "0";
    document.getElementById("totalPrice").style.color = "#FBBCBC";

    document.getElementById("totalQuantity").textContent = "0";
    document.getElementById("totalQuantity").style.color = "#FBBCBC";
    
    document.querySelector(".cart__order").style.display = "none";
}

// Calcul de la quantité totale d'articles dans le panier
let totalQuantity = 0;
const computeTotalQuantity = () => {
    for (let item of cart) {
        totalQuantity += (isNaN(parseInt(item.selectQuantity)) ? 0 : parseInt(item.selectQuantity));
    }    
}

// Affichage de la quantité totale d'articles dans le panier
const displayTotalQuantity = () => {    
    if(isNaN(totalQuantity)){
        totalQuantity = 0
    }
    document.getElementById("totalQuantity").textContent = totalQuantity;
}

// Affichage du prix total du panier
let totalCartPrice = 0;
const displayTotalCartPrice = () => {
    document.getElementById("totalPrice").textContent = totalCartPrice;
}

let displayItems = "";

if (cart == null || cart.length == 0) {
    alert("Votre panier est vide.\nMerci de retourner à l'accueil pour choisir vos articles !");
    emptyCart();
}

const initialization = async () => {
    for (let item of cart) {
        let apiResponse = await fetch("http://localhost:3000/api/products/" + item.selectId);
        let product = await apiResponse.json();

        displayItems +=
            `
                <article class="cart__item" data-id="${item.selectId}" data-color="${item.selectColor}">
                    <div class="cart__item__img">
                        <img src="${item.selectImageUrl}" alt="${item.selectAltTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${item.selectName}</h2>
                            <p>${item.selectColor}</p>
                            <p>${product.price} €<p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.selectQuantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>                        
            `

        // Calcul du prix total du panier
        const computeTotalCartPrice = () => {
            totalCartPrice += (!parseInt(item.selectQuantity) ? 0 : parseInt(item.selectQuantity)) * product.price;
        }
        // Calcul et affichage du prix total du panier à l'arrivée sur la page
        computeTotalCartPrice();
        displayTotalCartPrice();
    }    
    document.getElementById("cart__items").insertAdjacentHTML("beforeend", displayItems);   

    // Calcul et affichage de la quantité totale d'articles à l'arrivée sur la page
    computeTotalQuantity();
    displayTotalQuantity();
    // Modification du nombre d'articles
    const updateQuantity = () => {
        Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.addEventListener("input", changeQuantity => {
            // changeQuantity.preventDefault();
            let itemQuantity = node.closest(".itemQuantity").value;

            // Blocage des quantités tapées au clavier inférieures à 0 et supérieures à 100
            if (itemQuantity > 100 || itemQuantity <= -1) {
                alert("Merci de bien vouloir choisir une quantité comprise entre 1 et 100 articles maximum !");            
            } else {
                // Modification de la quantité entre le DOM et le panier (cart du localStorage)
                let itemId = node.closest(".cart__item").dataset.id;
                let itemColor = node.closest(".cart__item").dataset.color;
                let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
                match.selectQuantity = itemQuantity;                
                localStorage.setItem("cart", JSON.stringify(cart));
                
                totalQuantity = 0;
                computeTotalQuantity();
                displayTotalQuantity();

                // Suppression d'un article avec les touches "delete", "backspace" ou 0
                if (itemQuantity == 0) {
                    cart.splice(cart.indexOf(match), 1);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    node.closest(".cart__item").remove();

                    totalQuantity = 0;                
                    computeTotalQuantity();
                    displayTotalQuantity();                    
                    
                    if (cart == null || cart == 0) {                          
                        localStorage.removeItem("cart");
                        emptyCart()
                    }
                }

                totalCartPrice = 0;
                const updateTotalCartPrice = async () => {
                    for (let item of cart) {
                        let apiResponse = await fetch("http://localhost:3000/api/products/" + item.selectId);
                        let product = await apiResponse.json();                        
                        const computeTotalCartPrice = () => {    
                            totalCartPrice += (!parseInt(item.selectQuantity) ? 0 : parseInt(item.selectQuantity)) * product.price;
                        }
                        computeTotalCartPrice();
                        displayTotalCartPrice();
                    }
                }                
                updateTotalCartPrice();
            }        
        }));
    }
    updateQuantity();
    
    // Suppression d'un article avec le bouton "Supprimer"    
    Array.from(document.getElementsByClassName("deleteItem")).forEach(node => node.addEventListener("click", deleteItem => {
        // deleteItem.preventDefault();

        let itemId = node.closest(".cart__item").dataset.id;
        let itemColor = node.closest(".cart__item").dataset.color;            
        let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);

        cart.splice(cart.indexOf(match), 1);
        localStorage.setItem("cart", JSON.stringify(cart));    
        node.closest(".cart__item").remove();
        
        totalQuantity = 0;        
        computeTotalQuantity();
        displayTotalQuantity();        

        totalCartPrice = 0;
        const updateTotalCartPrice = async () => {
            for (let item of cart) {
                let apiResponse = await fetch("http://localhost:3000/api/products/" + item.selectId);
                let product = await apiResponse.json();                        
                const computeTotalCartPrice = () => {    
                    totalCartPrice += parseInt(item.selectQuantity) * product.price;
                }
                computeTotalCartPrice();
                displayTotalCartPrice();
            }
        }
        updateTotalCartPrice()
        // displayTotalCartPrice();

        if (cart == null || cart == 0) {            
            localStorage.removeItem("cart");
            emptyCart();
        }
    }));    
}

window.addEventListener("load", initialization);

document.getElementById("order").addEventListener("click", event => {
    event.preventDefault(); // Désactivation du changement d'URL et du chargement d'une nouvelle page.

    /* Regex pour firstName et lastName (clients avec des noms écrits avec les différents alphabets
    européens et leurs caractères spéciaux, ainsi que les translitérations en alphabet latin) */
    let namePattern = new RegExp("^[A-Za-zÀ-žĄ-ę’'ʼ-]+$");
    /* Regex pour address (livraison en France uniquement; virgule non
    prise en compte afin de se conformer aux nouvelles normes postales) */ 
    let addressPattern = new RegExp("^[0-9A-Za-zÀàÂâÄäÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜüŸÿ ’'ʼ-]+$");
    /* Regex pour city (localité; livraison en France uniquement; virgule non
    prise en compte afin de se conformer aux nouvelles normes postales) */
    let cityPattern = new RegExp("^[A-Za-zÀàÂâÄäÆæÇçÈèÉéÊêËëÎîÏïÔôŒœÙùÛûÜüŸÿ’'ʼ-]+$");
    /* Regex pour email */
    let emailPattern = new RegExp(/[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_]+\.[a-zA-Z]{2,4}/);

    // let valid = false;
    
    if (namePattern.test(document.getElementById("firstName").value)) {
        valid = true;
    } else {
        document.getElementById("firstName").style.backgroundColor = "#FBBCBC";
        document.getElementById("firstNameErrorMsg").textContent =
        "Lettres, tiret, apostrophe seulement. Merci !";
        return false;
    }

    if (namePattern.test(document.getElementById("lastName").value)) {
        valid = true;
    } else {
        document.getElementById("lastName").style.backgroundColor = "#FBBCBC";
        document.getElementById("lastNameErrorMsg").textContent =
        "Lettres, tiret, apostrophe seulement. Merci !";            
        return false;
    }

    if (addressPattern.test(document.getElementById("lastName").value)) {        
        valid = true;
    } else {
        document.getElementById("address").style.backgroundColor = "#FBBCBC";
        document.getElementById("addressErrorMsg").textContent =
        "Lettres, tiret, apostrophe seulement. Merci !\nLivraison en France.";
        return false;
    }
    
    if (cityPattern.test(document.getElementById("city").value)) {
        valid = true;
    } else {
        document.getElementById("city").style.backgroundColor = "#FBBCBC";
        document.getElementById("cityErrorMsg").textContent =
        "Lettres, tiret, apostrophe seulement. Merci !\nLivraison en France.";        
        return false;
    }

    if (emailPattern.test(document.getElementById("email").value)) {        
        valid = true;
    } else {
        document.getElementById("email").style.backgroundColor = "#FBBCBC";
        document.getElementById("emailErrorMsg").textContent =
        "identifiant@fournisseur.domaine";
        return false;
    }

    // Arrêt du script avec le formulaire en défaut
    if (!valid) {
        return false;
    }   
        
    // Informations client pour l'envoi du formulaire (objet contact à partir des données du formulaire)    
    let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }    
    
    // Collecte de l'id de chaque article (tableau de produits)
    let products = [];
    cart.forEach((product) => {
        products.push(product.selectId);            
    });    

    let customerCart = {contact, products};
    let cuePayload = JSON.stringify(customerCart);    

    fetch("http://localhost:3000/api/products/order/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: cuePayload
    })
    .then(apiResponse => apiResponse.json())
    .then(orderData => {
        // Récupération de l'identifiant de commande dans la réponse de l'API
        // Redirection de l'utilisateur sur la page Confirmation, en passant l'id de commande dans l'URL afin d'afficher le numéro de commande
        document.location.href = "confirmation.html?id=" + orderData.orderId;        
        localStorage.removeItem("cart");
    })   
    .catch((error) => console.error(error))    
});