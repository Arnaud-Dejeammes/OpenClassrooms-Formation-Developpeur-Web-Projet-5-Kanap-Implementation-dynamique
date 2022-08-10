/*
Afficher de manière dynamique sur la page product les informations relatives au produit fournies par l'API en fonction de son id
*/

// 0. Extraction de l'id du produit en fonction de l'URL
var getProductId = new URL(window.location.href).searchParams.get("id"); // window.location.href : URL complète de la page en cours de consultattion

// I. Requête de l'API pour obtenir le produit, ciblé avec son id, et l'ensemble de ses propriétés :
fetch("http://localhost:3000/api/products/" + getProductId)
// II. Récupération de la réponse du service web :
// (Création promise)
    .then(allProductData => allProductData.json())
    // III. Parcours de la réponse pour l'insertion de chaque élément du produit :
    // (Affichage du contenu json dans les éléments HTML cibles id (#items))
    .then(getAllProductProperties => { // Répartition de toutes les propriété du produit et de leurs valeurs

        document.getElementById("image").innerHTML +=
            `
                <img src="${getAllProductProperties.imageUrl}" alt="${getAllProductProperties.altTxt}">
            `
        document.getElementById("title").innerText +=
            `
                ${getAllProductProperties.name}
            `
        document.getElementById("price").innerText +=
            `
                ${getAllProductProperties.price}
            `
        document.getElementById("description").innerText +=
            `
                ${getAllProductProperties.description}
            `        
        for (color of getAllProductProperties.colors) { // Couleur visée (color) dans son array (getAllProductProperties) inclus dans la propriété (colors) du fichier json
        document.getElementById("colors").innerHTML +=
            `
                <option value="${color}">
                    ${color}
                </option>
            `
        console.log(getAllProductProperties);
        /* Ex. :
        {colors: Array(4), _id: 'a6ec5b49bd164d7fbe10f37b6363f9fb', name: 'Kanap orthosie', price: 3999, imageUrl: 'http://localhost:3000/images/kanap08.jpeg', …}
            altTxt: "Photo d'un canapé rose, trois places"
            colors: Array(4)
                0: "Pink"
                1: "Brown"
                2: "Yellow"
                3: "White"
                length: 4                
            description: "Mauris molestie laoreet finibus. Aenean scelerisque convallis lacus at dapibus. Morbi imperdiet enim metus rhoncus."
            imageUrl: "http://localhost:3000/images/kanap08.jpeg"
            name: "Kanap orthosie"
            price: 3999
            _id: "a6ec5b49bd164d7fbe10f37b6363f9fb"
        */
        console.log(getAllProductProperties.colors);
        // Ex. : (4) ['Pink', 'Brown', 'Yellow', 'White']
        console.log(color);
        // Ex. : Pink
        };
    });

/* 
.catch(function(err) {
    // Survenue d'une erreur
}); */
