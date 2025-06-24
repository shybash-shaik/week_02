const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/user.model');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected for seeding.');

        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded. Exiting.');
            mongoose.disconnect();
            return;
        }

        const response = await axios.get('https://randomuser.me/api/?results=50&nat=us');
        const usersToSeed = response.data.results.map(user => ({
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            age: user.dob.age,
            city: user.location.city,
            picture: user.picture.large
        }));

        await User.insertMany(usersToSeed);
        console.log('Database seeded successfully with 50 users!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
    }
};

seedDatabase();
