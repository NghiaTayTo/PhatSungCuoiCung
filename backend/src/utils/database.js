const mongoose = require('mongoose');
require('dotenv').config(); // Tải biến môi trường từ file .env


const connectDatabase = async () => {
    try {
        console.log('Mongo URI:', process.env.MONGO_URI);
        console.log('Environment Variables:', process.env);

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Dừng server nếu không kết nối được
    }
};


module.exports = connectDatabase;
