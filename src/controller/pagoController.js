// controllers/pagoController.js
const stripe = require('stripe')('sk_test_51PHDADRxhro7mv4NGXI1LrJQmViXX6I711hrFJa2NSmZC1qpcrI5SlI66RCyPEmNVNRxmXbnHZ6ds8bh0qpTR5z800GpMe203J')

const createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body

  try {
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.nombre,
        },
        unit_amount: item.precio * 100, // Los montos en Stripe están en centavos
      },
      quantity: item.cantidad,
    }))
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/pagos/exitoso',
      cancel_url: 'http://localhost:3000/pagos/error',
    })
  
    res.json({ id: session.id })
  } catch (error) {
    console.error('Error al crear sesión de pago:', error)
    res.status(500).json({ error: 'Error al procesar el pago' })
  }
}

module.exports = {createCheckoutSession}