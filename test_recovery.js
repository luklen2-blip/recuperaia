async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Mariana',
        customerPhone: '11988887777',
        cartTotal: 124.9,
        items: ['Pizza Margherita'],
      }),
    });
    const text = await res.text();
    console.log('STATUS:', res.status);
    console.log('RESPONSE:', text);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
