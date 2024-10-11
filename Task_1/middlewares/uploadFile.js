import multer from 'multer';
import path from 'path';

// Cấu hình multer để lưu file trong thư mục 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

export default upload;
