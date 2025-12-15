import {Webhook} from "svix";
import User from "../models/User.js";

//API controller Function to Manage Clerk User with databse

export const clerkWebhooks = async (req, res) => {
    console.log('Webhook received:', req.method, req.url)
    console.log('Headers:', JSON.stringify(req.headers))
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // Use the raw body buffer for svix verification
        const rawBody = req.bodyBufferForSvix || req.rawBody || Buffer.from(JSON.stringify(req.body));
        await whook.verify(rawBody, {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        })
        // parse payload after successful verification
        const payload = typeof req.body === 'object' ? req.body : JSON.parse(rawBody.toString());
        const { data, type } = payload;
        console.log('Webhook type:', type, 'Data:', data);
        console.log('Webhook type:', type, 'Data:', data)
switch(type){
        case 'user.created': {
            console.log('Creating user:', data.id)
            const email = data?.email_addresses?.[0]?.email_address || ''
            const userData = {
                _id: data.id,
                email,
                name: (data.first_name || '') + ' ' + (data.last_name || ''),
                imageUrl: data.image_url || '',
            }
            await User.create(userData)
            console.log('User created successfully')
            res.json({})
            break
        }
        case 'user.updated': {
            console.log('Updating user:', data.id)
            const email = data?.email_addresses?.[0]?.email_address || ''
            const userData = {
                email,
                name: (data.first_name || '') + ' ' + (data.last_name || ''),
                imageUrl: data.image_url || '',
            }
            await User.findByIdAndUpdate(data.id, userData, { upsert: true })
            console.log('User updated successfully')
            res.json({})
            break
        }
        case 'user.deleted': {
            console.log('Deleting user:', data.id)
            await User.findByIdAndDelete(data.id)
            console.log('User deleted successfully')
            res.json({})
            break
        }
default:
    break;
}

}catch(error){
res.json({success:false,message:error.message})
}
}
