/*
Récupération des articles ajoutés au panier
*/

// 0. Construction de la class Product afin de récupérer et organiser les données brutes de chaque produit en provenance du fichier products de l'API :
class Product {
    constructor(productData) {
        productData && Object.assign(this, productData);        
    }
}

function refresh() {window.location.reload()}
/*
class Cart {
    constructor(cartData) {
        cartData && Object.assign(this, cartData);        
    }
}
let cart = new Cart();
console.log(cart); */

// Récupération du panier avec l'affichage de chaque article et ses caractéristiques
cart = JSON.parse(sessionStorage.getItem("cart"));

if (cart == null) {
    (alert("Votre panier est vide. Merci de retourner à l'accueil pour choisir vos articles !")); // Ne fonctionne plus avec la suppression effective d'un article.
}

else {
    let product = new Product();
    for (product of cart) {
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
                <p>${product.selectPrice}</p>
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
    /* document.getElementById("cart__price").innerText +=
        `
        <div class="cart__price">
            <p>Total (<span id="totalQuantity">${product.selectQuantity}</span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €</p>
        </div>
        ` */
    }    
};

/*
Modification de la quantité des articles ou suppression
*/
// Action sur le DOM et le localStorage pour conserver les modifications, même avec une actualisation ou un changement de page

Array.from(document.getElementsByClassName("itemQuantity")).forEach(node => node.addEventListener("change", changeQuantity => {
    function adjust() {
        let itemQuantity = node.closest(".itemQuantity").value;        
        let itemId = node.closest(".cart__item").dataset.id;
        let itemColor = node.closest(".cart__item").dataset.color;            
        let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
        let product = new Product(match);
        function replace() {match.selectQuantity = itemQuantity};
        
        replace();        
    };
    function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};    
    
    save(adjust());
    /* !!! Si un nombre supérieur à 100 est entré grâce au clavier, le sessionStorage enregistre le nombre et l'indicateur (.itemQuantity value) le conserve sur la page.
    Si une modification est effectuée vers le bas, le nombre redescend automatiquement à 100 ; le nombre ne bouge pas en direction du haut.
    Lorsqu'il y a un retour sur la page product, il s'agit de la même quantité entrée précédemment sur la page product (elle ne correspond pas à celle du panier). En revanche, la couleur n'est pas enregistrée. */
}));

Array.from(document.getElementsByClassName("deleteItem")).forEach(node => node.addEventListener("click", deleteItem => {    
    
    function discard() {cart.splice(cart.indexOf(match), 1)};    
    function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
    let itemId = node.closest(".cart__item").dataset.id;
    let itemColor = node.closest(".cart__item").dataset.color;            
    let match = cart.find(retrieve => retrieve.selectId == itemId && retrieve.selectColor == itemColor);
    // let product = new Product(match);
    
    refresh((save(discard())));

        /* if (cart == null) { // Fonctionne aussi avec undefined. // Ne fonctionne plus avec la suppression d'un article (stringify). L'alerte du panier vide se trouve empêchée, le panier étant toujours présent dans le sessionStorage (cart = []).
            function empty() {sessionStorage.removeItem("cart", JSON.stringify())}

            // localStorage.clear();
            
            empty();            
        } */
}));

/*
<div class="cart__price">
    <p>Total (<span id="totalQuantity"><!-- 2 --></span> articles) : <span id="totalPrice"><!-- 84,00 --></span> €</p>
</div> */
