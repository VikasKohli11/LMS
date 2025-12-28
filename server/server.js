
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
//Initialisation
const app=express();

//connect to the database
await connectDB()
await connectCloudinary() 

//Middlewares
app.use(cors())
app.use(clerkMiddleware())


//Route
app.get('/',(req,res)=>res.send("API Working"))
// --- Clerk Webhook Raw Body Middleware for Vercel ---
import { Buffer } from 'buffer';
import { clerkMiddleware } from '@clerk/express';
import educatorRouter from './routes/educatorRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
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

app.use('/api/educator', educatorRouter);
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter);
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)
//Port
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

// Export for Vercel
export default app //serverless  
