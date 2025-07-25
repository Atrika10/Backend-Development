import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp'); // Specify the directory where files will be temporarily stored
    },
    filename : (req, file, cb)=>{
        cb(null, Date.now() + '-' + file.originalname); // Use current timestamp to avoid name conflicts
    }
})

export const upload = multer({
    storage,
})