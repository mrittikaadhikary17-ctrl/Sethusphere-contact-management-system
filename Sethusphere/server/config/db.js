import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to your backend .env file.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    dbName: 'sethusphere',
    autoIndex: true,
    family: 4,
  });

  console.log('MongoDB connected: sethusphere');
};

export default connectDB;
