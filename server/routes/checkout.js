import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/start', async (req, res) => {
  try {
    const { lines } = req.body;
    if (!Array.isArray(lines) || !lines.length) {
      return res.status(400).json({ error: 'Lines inválidas' });
    }

    const resp = await fetch(process.env.SHOPIFY_STOREFRONT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: `
          mutation CartCreate($input: CartInput!) {
            cartCreate(input: $input) {
              cart {
                id
                checkoutUrl
              }
              userErrors { field message }
            }
          }
        `,
        variables: {
          input: { lines }, // [{ merchandiseId, quantity }]
        },
      }),
    });

    const json = await resp.json();
    const err = json?.data?.cartCreate?.userErrors?.[0]?.message;
    const checkoutUrl = json?.data?.cartCreate?.cart?.checkoutUrl;

    if (!checkoutUrl) {
      return res.status(400).json({ error: err || 'Falha ao criar cart.' });
    }

    return res.json({ checkoutUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao iniciar checkout' });
  }
});

export default router;
