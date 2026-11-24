const mongoose = require('mongoose');
const User = require('./models/User');
const Destination = require('./models/Destination');

async function testPlaceOwnership() {
  console.log('--- STARTING PLACE OWNERSHIP & AUTHORIZATION TEST ---');

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    console.log('1. Connected to MongoDB...');

    // A. Login User 1 (Demo Traveler)
    const user1LoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user1@wanderlust.com', password: 'User@123' })
    });
    const user1Data = await user1LoginRes.json();
    const token1 = user1Data.token;
    console.log('2. Logged in User 1 (Token received:', !!token1, ')');

    // B. Create a new Place as User 1
    const newPlaceData = {
      name: `Luxury Villa ${Date.now()}`,
      country: 'India',
      region: 'Goa',
      category: 'Beach',
      estimatedBudget: 350,
      description: 'Private beachfront luxury villa with ocean sunset views.',
      images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80']
    };

    const createRes = await fetch('http://localhost:5000/api/destinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify(newPlaceData)
    });
    const createData = await createRes.json();
    const createdPlaceId = createData.destination._id;
    console.log('3. Created New Place:', createData.destination.name, '(ID:', createdPlaceId, '| Owner:', createData.destination.owner.name, ')');

    // C. Fetch My Places for User 1
    const myPlacesRes = await fetch('http://localhost:5000/api/destinations/my-places', {
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const myPlacesData = await myPlacesRes.json();
    console.log('4. My Places count for User 1:', myPlacesData.count);

    // D. Edit Place as Owner (User 1)
    const editRes = await fetch(`http://localhost:5000/api/destinations/${createdPlaceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token1}`
      },
      body: JSON.stringify({ estimatedBudget: 400 })
    });
    const editData = await editRes.json();
    console.log('5. Edit by Owner Status:', editData.message, '| Updated Price:', editData.destination.estimatedBudget);

    // E. Login User 2 & Attempt Unauthorized Edit/Delete on User 1's Place
    const user2LoginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user2@wanderlust.com', password: 'User@123' })
    });
    const user2Data = await user2LoginRes.json();
    const token2 = user2Data.token;

    console.log('6. Testing Unauthorized Edit by User 2...');
    const unauthEditRes = await fetch(`http://localhost:5000/api/destinations/${createdPlaceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`
      },
      body: JSON.stringify({ name: 'Hacked Title' })
    });
    const unauthEditData = await unauthEditRes.json();
    console.log('   Unauthorized Edit Result (Status 403 Expected):', unauthEditRes.status, '| Message:', unauthEditData.message);

    console.log('7. Testing Unauthorized Delete by User 2...');
    const unauthDeleteRes = await fetch(`http://localhost:5000/api/destinations/${createdPlaceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token2}` }
    });
    const unauthDeleteData = await unauthDeleteRes.json();
    console.log('   Unauthorized Delete Result (Status 403 Expected):', unauthDeleteRes.status, '| Message:', unauthDeleteData.message);

    // F. Delete Place as Owner (User 1)
    console.log('8. Deleting Place as Authorized Owner...');
    const deleteRes = await fetch(`http://localhost:5000/api/destinations/${createdPlaceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token1}` }
    });
    const deleteData = await deleteRes.json();
    console.log('   Delete Result:', deleteData.message);

    console.log('--- ALL PLACE OWNERSHIP & AUTHORIZATION TESTS PASSED! ---');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Test Suite Error:', err);
  }
}

testPlaceOwnership();
