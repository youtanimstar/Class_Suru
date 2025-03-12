import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { fileURLToPath } from 'url';
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.LOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env. CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });
    
    const uploadimage = async ( localfilepath) =>{
       try{
        const result = await cloudinary.uploader.upload(localfilepath);
        return result;
       }catch(error){
        Console.log(error);
       }
    }
});