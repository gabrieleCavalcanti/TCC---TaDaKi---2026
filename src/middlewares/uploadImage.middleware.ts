import createMulter from "../config/post.multer";

const uploadImage = createMulter({
    folder: "Images",
    allowedTypes: [
        "image/png",
        "image/jpeg"
    ],
    fileSize: 10 * 1024 * 1024
}).single("image");

export default uploadImage;