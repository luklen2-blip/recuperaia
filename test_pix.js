async function testPix() {
  try {
    const res = await fetch('http://localhost:3000/api/billing/pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'pro' }),
    });
    const text = await res.text();
    console.log('PIX STATUS:', res.status);
    console.log('RESPONSE TEXT:', text.substring(0, 300));
  } catch (err) {
    console.error('ERROR:', err);
  }
}
testPix();
