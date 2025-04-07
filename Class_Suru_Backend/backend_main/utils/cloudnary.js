import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"


dotenv.config();

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Check Cloudinary connection
    cloudinary.api.ping()
        .then(() => console.log("✅ Cloudinary is connected successfully!"))
        .catch((error) => console.error("❌ Cloudinary connection failed:", error));
    
    const uploadImage = async (req, res) => {
        try {
            const { folder } = req.params;

            if (!folder) {
                return res.status(400).json({ success: false, message: "No folder name provided in params!" });
            }
            // if (!req.files || !req.files.image) {
            //     return res.status(400).json({ success: false, message: "No image uploaded!" });
            // }
    
            const image = req.file.path;
            
    
            // ✅ Upload to Cloudinary
            const result = await cloudinary.uploader.upload(image, {
                folder: `ClassSuru/${folder}`, // Store in Cloudinary "uploads" folder with subfolder
                use_filename: true,
                unique_filename: false
            });
            //   fs.unlinkSync(image.tempFilePath); // remove temp file
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
    const deleteImage = async (req, res) => {
        try {
            const { public_id } = req.body;

            if (!public_id) {
                return res.status(400).json({ success: false, message: "No public_id provided!" });
            }

            console.log('Deleting image with public_id:', public_id);
            

            // ✅ Delete from Cloudinary
            const response = await cloudinary.uploader.destroy(public_id);
            console.log('Cloudinary response:', response);
            

            return res.status(200).json({
                success: true,
                message: "Image deleted successfully!"
            });
        } catch (error) {
            console.error("❌ Delete Error:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    };

    export { uploadImage, deleteImage };
    