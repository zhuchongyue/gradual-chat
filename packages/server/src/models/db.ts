import * as mongoose from 'mongoose';

export default async function initDb() {

  await mongoose.connect('mongodb://localhost:27017', { dbName: 'test' })

}