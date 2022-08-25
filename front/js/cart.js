/*
Récupération des articles ajoutés au panier
*/

// 0. Construction de la class Product afin de récupérer et organiser les données brutes de chaque produit en provenance du fichier products de l'API :
class Product {
    constructor(productData) {
        productData && Object.assign(this, productData);        
    }
}
// Récupération du panier avec l'affichage de chaque article et ses caractéristiques
cart = JSON.parse(sessionStorage.getItem("cart"));
console.log(cart);

if (cart == null) {
    (alert("Votre panier est vide. Merci de retourner à l'accueil pour choisir vos articles !"));
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
                    <p>Qté : ${product.selectQuantity}</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
            </article>
        `
    }
};