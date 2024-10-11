import express from 'express';
import upload from '../middlewares/uploadFile.js';
import { uploadFile } from '../controllers/uploadController.js';
import { queryTransactions } from '../controllers/queryController.js';

const router = express.Router();

router.post('/upload-file', upload.single('file'), uploadFile);
router.get('/query-transactions', queryTransactions);

export default router;
