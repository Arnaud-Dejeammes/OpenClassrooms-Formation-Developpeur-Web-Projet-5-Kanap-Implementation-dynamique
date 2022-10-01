// Affichage dynamique sur la page index des informations relatives aux produits fournies par l'API

// I. Requête de l'API pour obtenir l'ensemble des produits :
fetch("http://localhost:3000/api/products")
// II. Récupération de la réponse du service web :
    .then(allProductsData => allProductsData.json())
    // III. Parcours de la réponse pour l'insertion de chaque produit (élément) :
    .then(getAllProductsProperties => {
        let displayProducts = "";
        for (getProductProperties of getAllProductsProperties) {
            displayProducts +=
                `
                    <a href="product.html?id=${getProductProperties._id}">
                        <article>
                            <img src="${getProductProperties.imageUrl}" alt="${getProductProperties.altTxt}">
                                <h3 class="productName">
                                    ${getProductProperties.name}
                                </h3>
                                <p class="productDescription">
                                    ${getProductProperties.description}
                                </p>
                        </article>
                    </a>
                `
        };
        document.getElementById("items").insertAdjacentHTML("beforeend", displayProducts);        
    })    
    .catch((error) => console.error(error));