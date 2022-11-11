document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {

            pizzas: [],
            username: '',
            pizzaCartId: '',
            cart: { total: 0.00 },
            paymentMessege: '',
            payNow: false,
            paymentAmount: 0,
            message: '',

            init() {
                axios.get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {
                        const list = result.data.pizzas;

                        // this.pizzas is declared on you AlpineJS Widget.
                        this.pizzas = list;
                    })
                    .then(() => {
                        return this.createCart();

                    })
                    .then((result) => {
                        this.pizzaCartId = result.data.cart_code;

                    })
            },
            createCart() {
               return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },
            pizzaImage(pizza) {
                return `./PICS/${pizza.size}.png`;
            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.pizzaCartId}/get`;

                axios.get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },

            add(pizza) {
                const params = {
                    cart_code: this.pizzaCartId,
                    pizza_id: pizza.id
                }
                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },

            remove(pizza) {

                const params = {
                    cart_code: this.pizzaCartId,
                    pizza_id: pizza.id
                }

                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {
                        this.message = "pizza removed to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));

            },
            pay() {
                const params = {
                    cart_code: this.pizzaCartId,
                }

                axios.post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                    .then(() => {
                        if (!this.paymentAmount) {
                            this.paymentMessege = 'Please payment amount!'
                        }
                        else if (this.paymentAmount >= this.cart.total.toFixed(2)) {
                            this.paymentMessege = 'sucessfully paid!';
                            this.message = this.username + " paid!";

                        } else if (this.paymentAmount < this.cart.total){
                            this.paymentMessege = 'Payment Declined !'
                            
                        }

                    })
                .catch(err => alert(err));
            }
        }
    });
})