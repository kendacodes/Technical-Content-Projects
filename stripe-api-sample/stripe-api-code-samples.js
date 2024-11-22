// Handle Payment Token

function handleToken(token) {
  console.log('Token received:', token);

  fetch("/charge", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      token: token, 
      _id: artworkID 
    })
  })
  .then(response => response.json())
  .then(output => {
    if (output.status === "succeeded") {
      document.getElementById("shop").innerHTML = "<p>Purchase complete!</p>";
      window.location.href = '/gallery';
    } else {
      document.getElementById("shop").innerHTML = "<p>Payment failed. Please try again.</p>";
    }
  })
  .catch(error => {
    console.error('Payment error:', error);
    document.getElementById("shop").innerHTML = "<p>An error occurred. Please try again.</p>";
  });
}


// Attach Event Listener to Checkout Button

var button = document.getElementById("buttonCheckout"); 
button.addEventListener("click", function(ev) {
  ev.preventDefault();

  checkoutHandler.open({
    name: "VIA Studios", 
    description: "Art Purchase", 
    token: handleToken 
  });
});


// Backend Process payment

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.put('/charge', async (req, res) => {
  const { token, _id } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: 5000, // Amount in cents
      currency: 'usd',
      source: token.id,
      description: `Charge for artwork ${_id}`,
    });
    res.status(200).send({ status: charge.status });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

