import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.get('/', authController.home_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

export default router;
