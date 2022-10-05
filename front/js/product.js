// Affichage dynamique sur la page product les informations relatives au produit fournies par l'API en fonction de son id

// 0. Extraction de l'id du produit en fonction de l'URL
let selectId = new URL(window.location.href).searchParams.get("id");

// I. Requête de l'API pour obtenir le produit, ciblé avec son id, et l'ensemble de ses propriétés :
fetch("http://localhost:3000/api/products/" + selectId)
// II. Récupération de la réponse du service web :
  .then(allProductData => allProductData.json())
  // III. Parcours de la réponse pour l'insertion de chaque élément du produit :  
  .then(getAllProductProperties => {
    // Affichage du nom du produit dans l'onglet du navigateur
    document.querySelector("title").innerText = getAllProductProperties.name;
    
    // Affichage des caractéristiques du produit à travers la page
    document.getElementById("image").insertAdjacentHTML("beforeend",    
      `
          <img src="${getAllProductProperties.imageUrl}" alt="${getAllProductProperties.altTxt}">
      `
    )     
    document.getElementById("title").innerText = getAllProductProperties.name;        
    document.getElementById("price").innerText = getAllProductProperties.price;
    document.getElementById("description").innerText = getAllProductProperties.description;    
    
    let displayColorsChoice = "";
    for (color of getAllProductProperties.colors) {
      displayColorsChoice +=
          `
              <option value="${color}">
                  ${color}
              </option>
          `        
    };
    document.getElementById("colors").innerHTML += displayColorsChoice;    
  })
  .catch((error) => console.error(error));

// Ajout des produits dans le panier
document.getElementById("addToCart").addEventListener("click", (addItem) => {
  
  let selectColor = document.getElementById("colors").value;
  let selectQuantity = document.getElementById("quantity").value;
  let selectImageUrl = document.querySelector("#image img").getAttribute("src");
  let selectAltTxt = document.querySelector("#image img").getAttribute("alt");
  let selectName = document.getElementById("title").innerText;  
  
  class Item {    
    constructor(selectId, selectColor, selectName, selectQuantity, selectImageUrl, selectAltTxt) {
      this.selectId = selectId;
      this.selectColor = selectColor;      
      this.selectName = selectName;      
      this.selectQuantity = selectQuantity;
      this.selectImageUrl = selectImageUrl;
      this.selectAltTxt = selectAltTxt;
    }    
  }
  
  let item = new Item(selectId, selectColor, selectName, selectQuantity, selectImageUrl, selectAltTxt);

  if (selectColor == "" && selectQuantity < 1) {
    (alert("Merci de bien vouloir choisir une couleur et une quantité !"));
  } else if (selectColor == "") {
      (alert("Merci de bien vouloir choisir une couleur !"));    
    } else if (selectQuantity <= 0) {
        (alert("Merci de bien vouloir choisir une quantité !"));
      } else if (selectQuantity > 100) {
          (alert("Merci de bien vouloir choisir une quantité inférieure à 100 articles !"));
        } else {
            // Enregistrement des modifications du panier dans localStorage
            cart = JSON.parse(localStorage.getItem("cart"));

            let messageOneItem =
                `
                  ${document.getElementById("quantity").value} ${document.getElementById("title").innerText} (${document.getElementById("colors").value}) ajouté au panier !
                `
            let messageSeveralItems =
              `
                ${document.getElementById("quantity").value} ${document.getElementById("title").innerText} (${document.getElementById("colors").value}) ajoutés au panier !
              `

            // Création du panier et ajout du premier article
            if (cart === null) {
              let cart = [];
              cart.push(item);
              localStorage.setItem("cart", JSON.stringify(cart));

              if (selectQuantity == 1) {
                alert(messageOneItem);
              }
              
              if (selectQuantity > 1) {             
                alert(messageSeveralItems);
              }      
            }

            // Vérification de l'existence éventuelle d'un même article (selectId et selectColor identiques), modification de sa quantité ou ajout d'un article différent
            if (cart) {
              // Recherche d'un article similaire
              let match = cart.find(retrieve => retrieve.selectId == selectId && retrieve.selectColor == selectColor);      

              // Mise à jour de sa quantité
              if (match != null) {
                if (parseInt(match.selectQuantity) + parseInt(item.selectQuantity) > 100) {

                  if (parseInt(match.selectQuantity) == 100) {
                    alert("Votre panier contient déjà le maximum de 100 articles pour ce canapé.");              
                  }
                  
                  if (item.selectQuantity == 100 && parseInt(match.selectQuantity) == 1) {
                    let messageMaximumItemsForOneItem =
                      `
                        Votre panier contient déjà ${parseInt(match.selectQuantity)} exemplaire du 
                        \n${document.getElementById("title").innerText} (${document.getElementById("colors").value}).
                        \nVous pouvez encore en rajouter ${100 - parseInt(match.selectQuantity)}.
                      `
                    alert(messageMaximumItemsForOneItem);
                  }

                  if (parseInt(match.selectQuantity) != 1 && parseInt(match.selectQuantity) < 100) {
                    let messageMaximumItems =
                      `
                        Votre panier contient déjà ${parseInt(match.selectQuantity)} exemplaires du 
                        \n${document.getElementById("title").innerText} (${document.getElementById("colors").value}).
                        \nVous pouvez encore en rajouter ${100 - parseInt(match.selectQuantity)}.
                      `
                    alert(messageMaximumItems);
                  }
                } else {
                    match.selectQuantity = parseInt(match.selectQuantity) + parseInt(item.selectQuantity); // Calcul de la somme
                    localStorage.setItem("cart", JSON.stringify(cart)); // Sauvegarde

                    if (selectQuantity == 1) {
                      alert(messageOneItem);
                    }
                    
                    if (selectQuantity > 1) {             
                      alert(messageSeveralItems);
                    }
                  }          
              } else { // Ajout d'un nouvel article
                  cart.push(item); // Ajout
                  localStorage.setItem("cart", JSON.stringify(cart));

                  if (selectQuantity == 1) {            
                    alert(messageOneItem);
                  }
                
                  if (selectQuantity > 1) {            
                    alert(messageSeveralItems);
                  }
                }        
            }
        }
});