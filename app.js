// Selecting the DOMelements 

//navbar Selectors
const navbar = document.querySelector('.navbar');
const home = document.querySelector(".home");
const cartTotal = document.querySelector('.cart-items');
const cartBtn = document.querySelector('.cart-logo')
const cartContainer = document.querySelector('.cart-container');
const cart = document.querySelector('.cart');

//hero Selectors
const shopNow = document.querySelector(".to-shop");

//product Selectors
const productContainer = document.querySelector(".product-container");
const productTitle = document.querySelector('.product-title');

//cart Selectors
const closeCart = document.querySelector(".close-cart");
const cartContent = document.querySelector('.cart-content');
const total = document.querySelectorAll('.cart-total');
const clearCart = document.querySelector('.clear-cart');
const cartFooterX = document.querySelector('.cart-footer-x');
// const cartTotalX = document.querySelector('.cart-total-x');


//For storing the elements in an array
let cartItems = [];
let buttonsDOM = [];

class Product{

    //getting the products from the json file
    async getData(){
        
        try {
            let data = await fetch('./product.json');
            let dataJSON = await data.json();
            let result = dataJSON.items;
            Storage.saveProducts(result);
            return result;

        } catch (error) {
            console.log(error);
        }
    }

}

//displaying items
class UI{

    //displays the product in the DOM
    displayProducts(products){

        let result = '';
        products.forEach(product => {
            result += `
            <article class="product-element">

                <div class="image-container">
                    <img src="${product.url}" alt="product" class = "product-image">
                    <button class="bag-btn" data-id = "${product.id}">
                    <i class="far fa-bookmark"></i>
                        Add to cart
                    </button>
                </div>
                
                <h3>${product.details}</h3>
                <p>Price : $${product.price}</p>

            </article>
            
            `
        });

        productContainer.innerHTML = result;
        
    }

    getInBagBtns(){
        const bagBtn = document.querySelectorAll('.bag-btn');
        const bagBtnArr = Array.from(bagBtn);
        buttonsDOM = bagBtnArr;
        
        bagBtnArr.forEach(button => {
            let id = button.dataset.id;
            let inCart = cartItems.find(items => items.id === id);
            
            if(inCart){
                button.innerHTML = `
                <i class="fas fa-bookmark"></i>
                In Cart`;
                button.disabled = true;
            }

            button.addEventListener('click' , (event)=>{
                event.target.innerHTML = '<i class="fas fa-bookmark"></i>In Cart';
                event.target.disabled = true;

                
                //retrieve the data from local storage
                let prod = Storage.getProduct(event.target.dataset.id);
                prod.quantity = 1;
                cartItems.push(prod);
                Storage.saveCart(cartItems);
                this.setCartValues(cartItems);
               this.addCartItems(prod);

            })
        });
    }



    //create element in the cart
    addCartItems(prod){
         
         let cartEl = document.createElement('div');
         cartEl.classList.add('cart-el');

         cartEl.innerHTML = `

         <div class="cart-item">

            <div class="cart-item-image">
                <img src="${prod.url}" alt="cartItem">
            </div>

            <div>
                <h3>${prod.details}</h3>
                <h4>Price: $ ${prod.price}</h4>
            </div>

            <div class="amount">

                <i class="fas fa-chevron-up" data-id="${prod.id}"></i>
                <p class="item-amount" data-id="${prod.id}">${prod.quantity}</p>
                <i class="fas fa-chevron-down" data-id="${prod.id}"></i>

            </div>
      
        </div>

        <div class="remove" data-id="${prod.id}">
            <span class="remove-item">
                <i class="fas fa-minus-circle"></i>
                Remove
            </span>
        </div>
         
         `;
     
     cartContent.appendChild(cartEl);
     sidepriceappear();
    //  showcart();

    }


    //setting the values of the cart
    setCartValues(cartItems){

        let cartamtTotal = 0;
        let cartValue = 0;

        cartItems.map(item => {
            cartamtTotal += item.quantity;
            cartValue += item.quantity * item.price;
        });

        cartTotal.innerText = cartamtTotal;
             
        total.forEach(item=>{
            item.innerText = cartValue;
        });
    }

    setMemData(){
        cartItems = Storage.getCart();
        this.setCartValues(cartItems);
        cartItems.forEach(item => {
            this.addCartItems(item);
        })
    }



    cartLogic(){
        clearCart.addEventListener('click', ()=>{
            this.clearCart();
        });


        cartContent.addEventListener('click', (event)=>{
            if(event.target.classList.contains('remove')){
                cartContent.removeChild(event.target.parentElement);
                this.removeItem(event.target.dataset.id);
                sidepriceappear();
            }
            
            else if(event.target.classList.contains('fa-chevron-up')){
                let id = event.target.dataset.id;
                let item = cartItems.find(i => i.id === id);
                item.quantity += 1;
                Storage.saveCart(cartItems);
                this.setCartValues(cartItems);
                event.target.nextElementSibling.innerText = item.quantity;
                
            }

            else if(event.target.classList.contains('fa-chevron-down')){
                let id = event.target.dataset.id;
                let item = cartItems.find(i => i.id === id);
                item.quantity = item.quantity - 1;

                if(item.quantity > 0){
                    event.target.previousElementSibling.innerText = item.quantity;
                    Storage.saveCart(cartItems);
                    this.setCartValues(cartItems);
                }
                else{
                    cartContent.removeChild(event.target.parentElement.parentElement.parentElement);
                    this.removeItem(event.target.dataset.id);
                }

            }

            
        });
    }

    //for clearing the cart
    clearCart(){
         
        let cartid = cartItems.map(item => item.id); 
        cartid.forEach(id=> this.removeItem(id));
        while(cartContent.childElementCount>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        closeCar();
         
        
    }
    
    removeItem(id){
        cartItems = cartItems.filter(item => (item.id !== id));
        this.setCartValues(cartItems);
        Storage.saveCart(cartItems);
        let but = this.getButton(id);
        but.disabled = false;
        but.innerHTML = `                    
        <i class="far fa-bookmark"></i>
        Add to cart
        `;
        


    }

    getButton(id){
        return buttonsDOM.find(item => item.dataset.id === id);
    }
}

class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products));
    }

    static getProduct(id){
        let product = JSON.parse(localStorage.getItem('products'));
        return product.find(item => item.id === id);
    }

    static saveCart(cartItems){
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    static getCart(){
        return localStorage.getItem('cartItems')?JSON.parse(localStorage.getItem('cartItems')):[];
    }
}

//  end of the main class functions 




//----------event listeners---------------------//


document.addEventListener('DOMContentLoaded', ()=>{
    const product = new Product();
    const ui = new UI(); 

    ui.setMemData();

    product.getData().then(products => {
        ui.displayProducts(products);
    }).then(()=>{
        ui.getInBagBtns();
        ui.cartLogic();
    });

});


//opening the cart container
cartBtn.addEventListener('click', ()=>{
    showcart();
});

//closing the cart container
closeCart.addEventListener('click', ()=>{
    closeCar();
});

// Adding the smooth scroll functionality
shopNow.addEventListener('click', function(){
    smoothScroll(document.querySelector('.products'), 1000);
});

// const pressShop = () => new Promise(resolve => home.addEventListener('click', resolve,{once:true} ));

// (async function(){
//     const x = await pressShop();
//     smoothScroll(document.querySelector('.s1'), 1500);
// }());
    



cartContainer.addEventListener('scroll', sidepriceappear);

window.addEventListener('scroll', scrollAppear);

//end of the event listeners




//-------other design functions----------//

//opening the cart
function showcart(){
    cartContainer.classList.add('show-cart');
    cart.classList.add('background-bg');
}

//closing the cart
function closeCar(){
    cartContainer.classList.remove('show-cart');
    cart.classList.remove('background-bg');
    cartFooterX.classList.remove('vis');
}

//for the appearance of the side price
function sidepriceappear(){
 
    let relHeight = document.querySelector('.cart-footer').getBoundingClientRect().top;

    if(relHeight > window.innerHeight &&  !cartFooterX.classList.contains('vis') && cart.classList.contains('background-bg')){
        cartFooterX.classList.add('vis');
    }
    else if((relHeight < window.innerHeight || !cart.classList.contains('background-bg')) &&  cartFooterX.classList.contains('vis')){
        cartFooterX.classList.remove('vis');
    }
};


//for smooth scrolling

function smoothScroll(element, duration){
    var targetPosition = element.getBoundingClientRect().top;
    var startingPosition = window.pageYOffset;
    var distance = targetPosition - startingPosition;
    
    // distance *=1.7;
    var startTime = null;

    function animation(currentTime){
        if(startTime === null)startTime = currentTime;
        var timeElapsed = currentTime -startTime;
        var run = ease(timeElapsed, startingPosition, distance, duration);
        window.scrollTo(0, run);
        if(timeElapsed < 1000) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d){
        t /= d/2;
        if(t<1) return c/2 * t * t + b;
        t--;
        return -c/2*(t*(t-2)-1)+b;
    }

    requestAnimationFrame(animation);

}

function splitScroll(){
    const controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        duration : '200%',
        triggerElement : '.about-title',
        triggerHook : 0
    })
    .setPin('.about-title')
    // .addIndicators()
    .addTo(controller);
}

var scrollid =1;

function scrollAppear(){
    let introText = [...document.querySelectorAll('.texter')];
    // console.log(introText);
    if(scrollid <= 3){
        let temp = introText.filter(item => item.dataset.p === scrollid.toString());
        
        let item = temp[0];
        let introPos = item.getBoundingClientRect().top;
        

        let screenPosition = window.innerHeight;
            
        console.log(item.dataset.p , introPos.toFixed(2), (screenPosition/6).toFixed(2));

        if(introPos < screenPosition/6 && !item.children[1].classList.contains('text-appear')){
            item.children[1].classList.add('text-appear');
            console.log(scrollid);
            scrollid = scrollid+1;
        }
    }
    

}

splitScroll();