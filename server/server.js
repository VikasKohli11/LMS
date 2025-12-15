import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
//Initialisation
const app=express();

//connect to the database
await connectDB()


//Middlewares
app.use(cors())


//Route
app.get('/',(req,res)=>res.send("API Working"))
// --- Clerk Webhook Raw Body Middleware for Vercel ---
import { Buffer } from 'buffer';
function rawBodySaver(req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf;
    }
}
app.post(
    '/clerk',
    express.json({ verify: rawBodySaver }),
    (req, res, next) => {
        // If Vercel/Express has parsed JSON, use req.rawBody for svix
        if (req.rawBody) {
            req.bodyBufferForSvix = req.rawBody;
        } else if (Buffer.isBuffer(req.body)) {
            req.bodyBufferForSvix = req.body;
        } else {
            req.bodyBufferForSvix = Buffer.from(JSON.stringify(req.body));
        }
        next();
    },
    clerkWebhooks
);
//Port
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

// Export for Vercel
export default app 
