import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"


dotenv.config();

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env. CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
    });
    
    const uploadImage = async (req, res) => {
        try {
            if (!req.files || !req.files.image) {
                return res.status(400).json({ success: false, message: "No image uploaded!" });
            }
    
            const image = req.files.image;
    
            // ✅ Upload to Cloudinary
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "classSuru", // Store in Cloudinary "uploads" folder
                use_filename: true,
                unique_filename: false
            });
              fs.unlinkSync(image.tempFilePath); // remove temp file
            return res.status(200).json({
                success: true,
                message: "Image uploaded successfully!",
                imageUrl: result.secure_url
            });
        } catch (error) {
            console.error("❌ Upload Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    };
    
    export { uploadImage };