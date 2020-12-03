let carts = document.querySelectorAll('.add-cart');

//products on the pages
let products = [
    {
        name: 'Steamboat - Welcome Sign',
        tag: 'Steamboat_welcome2',
        location: '04_Steamboat_Monograms',
        price: 28,
        inCart: 0
    },
    {
        name: 'Personalized Steamboat',
        tag: 'personalized_steamboat2',
        location: '04_Steamboat_Monograms',
        price: 55,
        inCart: 0
    },
    {
        name: 'UW Graduation Trivet',
        tag: 'uw_grad_trivet1',
        location: '04_Steamboat_Monograms',
        price: 39,
        inCart: 0
    },
    {
        name: 'Personalized Steamboat Arched Text Sign',
        tag: 'Steamboat_arched_text',
        location: '04_Steamboat_Monograms',
        price: 28,
        inCart: 0
    }
];

//event listener for when items added to cart
for (let i=0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i])
    })
}
//keeps items in cart on reload
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if(productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

//number shown on cart when items added
function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if( action === 'decrease') {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
        console.log("action running");
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

//items added to cart and shown in cart and in local storage; updates key-value 'product.inCart'
function setItems(product) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems !== null) {
        let currentProduct = product.tag;
    
        if(cartItems[currentProduct] === undefined ) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            }
        } 
        cartItems[currentProduct].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = { 
            [product.tag]: product
        };
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

//add total cost in cart
function totalCost(product, action) {
    let cart = localStorage.getItem("totalCost");

    if(action === 'decrease') {
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart !== null) { 
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

//displaying contents in cart on cart page
function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let productContainer = document.querySelector('.products');

    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    
    if(cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map( (item, index) => {
            productContainer.innerHTML += `
            <div class="product col-5 col-md-6">
                <ion-icon name="close-circle"></ion-icon>
                <img class=cartImage src="./Photos/${item.location}/${item.tag}.jpg">
                <span>${item.name}</span>
                <span class="hiddenTag">${item.tag}</span>
            </div>
            <div class="price col-2">$${item.price}.00</div>
            <div class="quantity col-3 col-md-2">
                <ion-icon class="decrease" name="remove-circle"></ion-icon>
                    <span>${item.inCart}</span>
                <ion-icon class="increase" name="add-circle"></ion-icon>
            </div>
            <div class="total col-2">
                $${item.inCart * item.price}.00
            </div>
            `
        });
        
        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Cart Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost}.00
                </h4>
            </div>
        `
        deleteButtons();
        manageQuantity();
    }
}

//make increase and decrease buttons work in cart
function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let cartItems = localStorage.getItem('productsInCart');
    let currentQuantity = 0;
    let currentProduct = '';
    cartItems = JSON.parse(cartItems);


    for(let i=0; i < decreaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span.hiddenTag').textContent.trim();

            if(cartItems[currentProduct].inCart > 1){
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], 'decrease');
                totalCost(cartItems[currentProduct], 'decrease');
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            }
        });
    }

    for(let i=0; i < increaseButtons.length; i++) {
        increaseButtons[i].addEventListener('click', () => {
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span.hiddenTag').textContent.trim();
        
            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();           
        });
    }
}

//make delete button work in cart
function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.querySelector('span.hiddenTag').textContent.trim();
            console.log(productName);
           
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        });
    }
}


//shows items still in cart when page refreshed
onLoadCartNumbers();

//run cart content whenever cart page loaded
displayCart();