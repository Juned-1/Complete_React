const stripe_public_key ='Your Key';
const stripe = Stripe(stripe_public_key);

window.bookTour = async (tourId) => {
    try{
        //1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);
        //2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    }catch(err){
        console.log(err);
        showAlert('error: ',err);
    }

};
