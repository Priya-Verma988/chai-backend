import {v2 as cloudinary} from "cloudinary" ;
import fs from "fs";

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY , 
  api_secret:process.env.CLOUDINARY_API_SECRET 
});


// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if(!localFilePath) return null //upload the file cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         //file has been uploaded successfullly
//         console.log("file is uploaded on cloudinary", response.url);
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath)// remove the locally saved filed as the upload operation got failed

//         return null;
//     }
// }


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // DELETE FILE AFTER SUCCESS
        fs.unlinkSync(localFilePath)

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export {uploadOnCloudinary};
// cloudinary.v2.uploader.upload("https://res.cloudinary.com/dbqxwiqwz/image/upload/v1771422644/main-sample.png", { public_id: "main_sample"}, function(error, result)  {console.log(result); });
