/*
Afficher de manière dynamique sur la page index les informations relatives aux produits fournies par l'API 
*/

// 0. Construction de la class Product afin de récupérer et organiser les données brutes de chaque produit en provenance du fichier products de l'API :
class Product {
    constructor(productData) {
        productData && Object.assign(this, productData);
        /* Object.assign : assigne les propriétés de l'objet productData dans l'objet pour chaque instance (this) de la class Product
        Cette syntaxte évite un constructor énumérant toutes les propriétés (colors, _id, name, price, imageUrl, description, altTxt),
        ainsi que toutes les instances qui le suivent ("this.colors = colors;", etc.). */
    }
}

// I. Requête de l'API pour obtenir l'ensemble des produits :
fetch("http://localhost:3000/api/products")
// II. Récupération de la réponse du service web :
// (Création promise)
    .then(allProductsData => allProductsData.json()) // Fonction fléchée (partie gauche) : variable créée (résultat du fetch)    
    // III. Parcours de la réponse pour l'insertion de chaque produit (élément) :
    // (Affichage du contenu json dans l'élément HTML cible id (#items))
    .then(getAllProductsProperties => {
        for (getProductProperties of getAllProductsProperties) { // Parcourir le tableau et créer une variable getProductProperties pour chaque entrée
            // Suppression du let getProductProperties of getAllProductsProperties
            let product = new Product(getProductProperties); // class Product créée à l'étape 0.
            // L'objet product est créé à partir de la class Product avec toutes les propriétés d'un objet
            console.log(getAllProductsProperties); // Toutes les information de tous les produits
            console.log(getProductProperties); // Toutes les propriétés d'un objet particulier
            console.log(product); // Le produit comme objet
            console.log(Product); // La class Product (constructor) qui construit l'objet product
            document.getElementById("items").innerHTML += // Template literals
                `
                    <a href="product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                                <h3 class="productName">
                                    ${product.name}
                                </h3>
                                <p class="productDescription">
                                    ${product.description}
                                </p>
                        </article>
                    </a>
                ` // Le bactick permet le texte multiligne et la méthode d'interpolation de variable ${}.                
        };
    }); // Enlever ";" une fois le ".catch" défini et activé
    /* 
    .catch(function(err) {
        // Survenue d'une erreur
    }); */