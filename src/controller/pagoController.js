// controllers/pagoController.js
const stripe = require('stripe')('sk_test_51PHDADRxhro7mv4NGXI1LrJQmViXX6I711hrFJa2NSmZC1qpcrI5SlI66RCyPEmNVNRxmXbnHZ6ds8bh0qpTR5z800GpMe203J');

const createCheckoutSession = async (req, res) => {
  const { carrito } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: carrito.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.nombre,
            description: item.descripcion
          },
          unit_amount: parseFloat(item.precio) * 100
        },
        quantity: item.cantidad
      })),
      mode: 'payment',
      success_url: 'https://buy.stripe.com/test_4gwcPOdIX2hbfqU4gg',
      cancel_url: 'http://localhost:3000/dashboard/Orders'
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error al crear sesión de pago:', error);
    res.status(500).json({ error: 'Error al procesar el pago' });
  }
};

module.exports = {createCheckoutSession}