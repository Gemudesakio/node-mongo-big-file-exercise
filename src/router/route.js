import {Router} from 'express'
import multer from 'multer';
import {upload, list} from '../controllers/controller.js';

const router = Router();
const uploadFile = multer({ dest: './_temp' });

router.post('/upload', uploadFile.single('file'), upload);
router.get('/records', list);

export default router;
