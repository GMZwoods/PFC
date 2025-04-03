const navbar = document.querySelector('.navbar'); //
const upBtn = document.querySelector('.upBtn'); // bouton de retour en haut de la page
window.onscroll = () => {
    // réduire la taille de la navbar lors du scroll
    if(window.scrollY >= 50){ 
        navbar.style.height = '4rem';
        navbar.style.color = '$bg-bg-color';
        navbar.style.transition = '1s';
        
        

    }   
    else { // si on est en haut de la page
        navbar.style.height = '6rem';
        navbar.style.color = '$bg-bg-color';
        navbar.style.transition = '1s'; 
    } 
    // afficher le bouton de retour en haut de la page
    if (window.scrollY >= 500) {  // si on a scrollé de 500px
        upBtn.removeAttribute('hidden');
        
    }
    //else if () { // si on est en haut de la page
    else { // si on est en haut de la page
        upBtn.setAttribute('hidden', '');
    }
} // fin de la fonction

//-----------------------------------------------------
//Variables du site 
const productsContainer = document.querySelector('#productsContainer');  // conteneur des produits
const cartContainer = document.querySelector('#cartList');  // panier
let totalContainer = document.querySelector('#total');  // prix total du panier
let cartCount = document.querySelector('.itemCount'); // nombre d'items dans le panier
let myCart = document.querySelector('.cartItemsCount');  // nombre d'items dans le panier
const clearCartBtn = document.querySelector('#clearCart'); // bouton de vider le panier   
let basketTotal = document.querySelector('.itemCount'); // nombre d'items dans le panier dans la navbar
basketTotal.innerHTML = 0; // nombre d'items dans le panier dans le modal
myCart.innerHTML = 0; // nombre d'items dans le panier 
let price = 0; // prix du produit
let data = []; // tableau de produits
let cart = JSON.parse(localStorage.getItem("cart")) || []; // init du cart 
let detailedInfoBtn = document.querySelector('.detailedInfo'); // bouton de détails 
const sendBtn = document.querySelector('#contactUs'); // bouton d'envoi du formulaire


fetch('products.json') 
    .then(response => response.json()) 
    .then(products => { 
        data = products;
        data.forEach(productObject => { 
            let productCard = document.createElement('div'); 
            productCard.classList.add("col-md-4"); 
            productCard.dataset.id = productObject.id;
            productCard.dataset.name = productObject.name;
            productCard.dataset.price = productObject.price;
            productCard.dataset.image = productObject.image;
            productCard.dataset.description = productObject.description;
            productCard.dataset.descriptionSum = productObject.descriptionSum;
            productCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${productObject.image}" class="card-img-top" alt="${productObject.name}">
                    <div class="card-body d-flex justify-content-center flex-column">
                        <h5 class="card-title container d-flex justify-content-center">${productObject.name}</h5>
                        <p class="card-text container"><p class="prixTest"><strong>Prix:</strong> ${productObject.price} $</p>
                        <p class="card-text container">${productObject.descriptionSum}</p>
                        <button data-id="${productObject.id}"
                            data-name="${productObject.name}"
                            data-price="${productObject.price}"
                            data-image="${productObject.image}"
                            data-description="${productObject.description}"
                            class="btn btn-secondary add-to-cart my-1">
                            Ajouter au panier
                        </button>
                        <button data-id="${productObject.id}"
                            data-name="${productObject.name}"
                            data-price="${productObject.price}"
                            data-image="${productObject.image}"
                            data-description="${productObject.description}" 
                            class="btn btn-secondary detailedInfo my-1">
                            Détails
                        </button>
                    </div>
                </div>
            `; 
            productsContainer.appendChild(productCard); 
        });
         // fin de la boucle forEach    
}); // fin de la fonction fetch


document.addEventListener("click", (event) => {
    const addToCartBtn = event.target;
    if (addToCartBtn.classList.contains("add-to-cart")) {
        let chosenItem = {
            id: addToCartBtn.dataset.id,
            name: addToCartBtn.dataset.name,
            price: addToCartBtn.dataset.price,
            image: addToCartBtn.dataset.image,
            description: addToCartBtn.dataset.description
        };
        addToCart(chosenItem);
    };
});

document.addEventListener("click", (event) => {
    const detailsBtn = event.target;
    if (detailsBtn.classList.contains("detailedInfo")) {
        //  id: detailsBtn.dataset.id,
        // name: detailsBtn.dataset.name,
        // price: detailsBtn.dataset.price,
        // image: detailsBtn.dataset.image,
        // description: detailsBtn.dataset.description
        // descriptionSum: detailsBtn.dataset.descriptionSum
        // console.log(detailsItem + " ne fonctione pas?");

        const productCard = detailsBtn.dataset.descriptionSum;
        const productName = detailsBtn.dataset.name;
        const productPrice = detailsBtn.dataset.price;
        const productDescription = detailsBtn.dataset.description;
        const productImage = detailsBtn.dataset.image;


        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("role", "dialog");
        modal.innerHTML =`
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title container d-flex justify-content-center">${productName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img src="${productImage}" width="300" height="300" class="container img mb-3" alt="${productName}">
                        <p><strong>Prix: </strong>${productPrice} $</p>
                        <p><strong>Description:</strong> ${productDescription}</p>
                    </div>
                    
                    <div class="modal-footer">
                        <button data-id="${detailsBtn.dataset.id}"
                            data-name="${detailsBtn.dataset.name}"
                            data-price="${detailsBtn.dataset.price}"
                            data-image="${detailsBtn.dataset.image}"
                            data-description="${detailsBtn.dataset.description}" 
                            class="btn btn-secondary add-to-cart my-1">
                            Ajouter au panier
                        </button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    </div>
                </div>
            </div>
        `;

        // Append modal to body
        document.body.appendChild(modal);

        // Show modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        // Remove modal from DOM after it's hidden
        modal.addEventListener("hidden.bs.modal", () => {
            modal.remove();
        });
    }
});


clearCartBtn.addEventListener("click", () =>{
    emptyTheCart();
});

document.querySelector("#cart").addEventListener("click", () => {
    updateCart();
});

function addToCart(chosenItem){ //ce que je veux ajouter
    console.log(chosenItem.id); // id du produit
    const existInCart = cart.find((alreadyInCart)=> alreadyInCart.id == chosenItem.id);
    console.log(existInCart); // ce que qui est deja dans le panier idientique a product
    if (existInCart){
        existInCart.quantity++;
        
    }
    else{
        // ce qui est dans le panier
        let id = chosenItem.id;
        let name = chosenItem.name;
        let price = chosenItem.price;
        let image = chosenItem.image;
        cart.push({id, name, price, image, quantity: 1});
    }
updateCart();
}

function addToCartMemory() {
    localStorage.setItem('cart', JSON.stringify(cart)); // stocker les produits dans le localStorage KEY value
};

function emptyTheCart(){
    cart = [];
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = "";
    let totalPrice = 0;
    let totalQuantity = 0;
    
    
    cart.forEach((produitAchat) =>{
        
        totalPrice += produitAchat.price * produitAchat.quantity; 
        totalQuantity += produitAchat.quantity;
        
        let newProduitVendu = document.createElement('li');
        newProduitVendu.classList.add("list-group-item","d-flex", "justify-content-between", "lh-sm");
        newProduitVendu.innerHTML= `
            <div class="container">
                <img src="${produitAchat.image}" class="card" alt="${produitAchat.name}">
                <h5 class="fw-bold fs-3">${produitAchat.name}</h6>
                <button class="minus btn btn-secondary" data-id ="${produitAchat.id}"> - </button>
                <span class="text-muted">${produitAchat.quantity}</span>
                <button class="plus btn btn-secondary" data-id ="${produitAchat.id}"> + </button>
            </div>
            <span class="productCount fw-bold fs-3">Total: ${(produitAchat.price * produitAchat.quantity).toFixed(2)}$</span>`;
        cartContainer.appendChild(newProduitVendu);
        console.log(produitAchat.price); // pr
    });
    totalContainer.innerHTML = totalPrice.toFixed(2);
    cartCount.innerHTML = totalQuantity;
    myCart.innerHTML = totalQuantity + " items";

    document.querySelectorAll(".minus").forEach((bouton) =>{
    bouton.addEventListener("click", (i) =>{
        const id = i.target.getAttribute("data-id")
        removeFromCart(id);
    });
}); /// modifier pour variable 
    document.querySelectorAll(".plus").forEach((bouton) =>{
    bouton.addEventListener("click", (i) =>{
        const id = i.target.getAttribute("data-id")
        const object = cart.find((alreadyInCart)=> alreadyInCart.id == id);
        addToCart(object);
    });
});
addToCartMemory();
}; 

function removeFromCart(id){
    const itemToDelete = cart.findIndex((alreadyInCart)=> alreadyInCart.id == id);
    if(itemToDelete !== -1){
        if(cart[itemToDelete].quantity >=2){
            cart[itemToDelete].quantity--;
        }
        else{
            cart.splice(itemToDelete, 1)
        }        
    };
    updateCart();  
};

updateCart();


// formulaire de contact verification des champs ** ne fonctionne pas tel qu'initialement prevu
document.addEventListener("click", (sendBtn) => {
    const nom = document.querySelector("#userNameContactUs").value;
    const email = document.querySelector("#emailAdressContactUs").value;
    const message = document.querySelector("#textContactUs").value;
    if (nom.length < 3) {
    let errorMessage1 = document.querySelector(".inputError1");
        errorMessage1.innerHTML = "Le nom doit contenir au moins 3 caractères.";
        errorMessage1.style.color = "red";
        return;
    }
    if (email.value == "" || email.value == null || email.value != email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        let errorMessage2 = document.querySelector(".inputError2"); // https://regexr.com/3e48o
        errorMessage2.innerHTML = "L'adresse e-mail est invalide.";
        errorMessage2.style.color = "red";
        return;
    }
    if (message.length < 10) {
        let errorMessage3 = document.querySelector(".inputError3");
        errorMessage3.innerHTML = "Le message doit contenir au moins 10 caractères.";
        errorMessage3.style.color = "red";
        return;
    }
    else {
        let validInput = document.querySelector(".inputValid");
        validInput.innerHTML = "OK!";
        validInput.style.color = "green";
    }
});



 //************************************************************************************  unused code
// ajouter un produit au panier
// const addToCart = () => {

//     cartIndexQty = cartQuantity.findIndex((value) => value.product_id == product_id);
//     if (cartQuantity.length <= 0) { 
//         cartQuantity = [{product_id: product_id, quantity: 1}];
//     }
//     else if (cartIndexQty < 0) {
//         cartQuantity.push({product_id: product_id, quantity: 1});
//     }
//     else{
//         cartQuantity[cartIndexQty].quantity = cartQuantity[cartIndexQty].quantity + 1;
//     }

    
//     ShowCart();
//     totalContainer.innerHTML ='';
//     let newSpanTotal = document.createElement('span');
//     newSpanTotal.innerHTML = `<span class="badge text-dark">Total (CA$): ${totalPrice}</span>`;
//     totalContainer.appendChild(newSpanTotal);        
//     cartCount.innerHTML = totalQuantity;
//    addToCartMemory();
// }


// faire lajout de plus 

    // if (cartQuantity.length > 0) {
    //         cartQuantity.forEach(cartObj => {   
    //             let newCartObj = document.createElement('li');
    //             newCartObj.classList.add("list-group-item","d-flex", "justify-content-between", "lh-sm");
    //             let cartIndexID = cartProduct.findIndex((value) => value.id == cartObj.product_id);
    //             let produitAchat = cartProduct[cartIndexID];
    //             price = parseFloat(produitAchat.price);
                
    //             newCartObj.innerHTML = `
    //             <div>
    //                 <img src="${produitAchat.image}" class="card-img-top" alt="${produitAchat.name}">
    //                 <h6 class="my-0">${produitAchat.name}</h6>
    //                 <small class="text-muted">${produitAchat.description}</small>
    //                 <span class="minus">-</span>
    //                  <span class="text-muted">${cartObj.quantity}</span>
    //                   <span class="plus">+</span>
    //             </div>
    //             <span class="productCount text-muted">${price * cartObj.quantity}</span>
    //             `;
    //             seeCart = newCartObj;
    //             cartContainer.appendChild(seeCart);
                
                
    //             totalQuantity = cartObj.quantity;
    //             });
    //         //
            
    //         totalPrice = totalPrice + (price);
    //         console.log(totalQuantity); // Pour tester seulement
    //     } 
    //     basketTotal.innerHTML = totalQuantity;

