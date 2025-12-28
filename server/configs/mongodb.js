import mongoose from "mongoose";


//connexct to the Mongodb database
const connectDB=async()=>{
    try{
    mongoose.connection.on('connected',()=>console.log('Database Connected'))
    await mongoose.connect(process.env.MONGODB_URI , {
        dbName: "lms",
    })
    }
    catch(err){
        console.log("mongodb error"+err.message)
    }
}


export default connectDB