/*
Affichage dynamique sur la page product les informations relatives au produit fournies par l'API en fonction de son id
*/

// 0. Extraction de l'id du produit en fonction de l'URL
let selectId = new URL(window.location.href).searchParams.get("id");

// I. Requête de l'API pour obtenir le produit, ciblé avec son id, et l'ensemble de ses propriétés :
fetch("http://localhost:3000/api/products/" + selectId)
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
      };
    });
    
/* 
.catch(function(err) {
    // Survenue d'une erreur
}); */

/*
Ajout des produits dans le panier 
*/
document.getElementById("addToCart").addEventListener("click", (addItem) => {
  
  let selectColor = document.getElementById("colors").value;
  let selectQuantity = document.getElementById("quantity").value;  
  let selectImageUrl = document.querySelector("#image img").getAttribute("src");
  let selectAltTxt = document.querySelector("#image img").getAttribute("alt");
  let selectName = document.getElementById("title").innerText;
  let selectPrice = document.getElementById("price").innerText;

  class Item {    
    constructor(selectId, selectColor, selectName, selectPrice, selectQuantity, selectImageUrl, selectAltTxt) {
      this.selectId = selectId;
      this.selectColor = selectColor;      
      this.selectName = selectName;
      this.selectPrice = selectPrice;
      this.selectQuantity = selectQuantity;
      this.selectImageUrl = selectImageUrl;
      this.selectAltTxt = selectAltTxt;
    }    
  };
  
  let item = new Item(selectId, selectColor, selectName, selectPrice, selectQuantity, selectImageUrl, selectAltTxt);  

  if (selectColor == "" && selectQuantity < 1) {
    (alert("Merci de bien vouloir choisir une couleur et une quantité !"));
  }

  else if (selectColor == "") {
    (alert("Merci de bien vouloir choisir une couleur !"));    
  }

  else if (selectQuantity <= 0) {
    (alert("Merci de bien vouloir choisir une quantité !"));
  }

  else if (selectQuantity > 100) {
    (alert("Merci de bien vouloir choisir une quantité inférieure à 100 articles !"));
  } 

  else {
    // Enregistrement des modifications du panier dans sessionStorage    
    function update() {
      // Récupération du panier
      cart = JSON.parse(sessionStorage.getItem("cart"));

      // Création du panier et ajout du premier article
      if (cart === null) {        
        function add() {cart.push(item)};
        function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};

        let cart = [];
        save(add());
      }

      // Vérification de l'existence éventuelle d'un même article (selectId et selectColor identiques), modification de sa quantité ou ajout d'un article différent
      if (cart) {        
        function modify() {
          // Recherche d'un article similaire
          let match = cart.find(retrieve => retrieve.selectId == selectId && retrieve.selectColor == selectColor);

          // Mise à jour de sa quantité (addition)
          if (match != null) {
            function sum() {match.selectQuantity = parseInt(match.selectQuantity) + parseInt(item.selectQuantity)};
            function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};
            
            save(sum());
          }

          // Ajout d'un nouvel article
          else {
            function add() {cart.push(item)};
            function save() {sessionStorage.setItem("cart", JSON.stringify(cart))};

            save(add());
          }
        }
        modify();
      }
    };
    update();
  }
});