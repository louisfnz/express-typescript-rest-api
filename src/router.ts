import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import authMiddleware from './middleware/auth';
import authController from './controllers/authController';
import setPasswordController from './controllers/setPasswordController';
import userController from './controllers/userController';
import roleController from './controllers/roleController';

const router = Router();

router.post('/auth/login', asyncHandler(authController.login));
router.post('/auth/refresh', asyncHandler(authController.refresh));
router.post('/auth/logout', authMiddleware, asyncHandler(authController.logout));
router.get('/auth/me', authMiddleware, asyncHandler(authController.me));

router.post('/auth/set-password/send', asyncHandler(setPasswordController.sendSetPasswordToken));
router.post('/auth/set-password/verify', asyncHandler(setPasswordController.verifySetPasswordToken));
router.post('/auth/set-password', asyncHandler(setPasswordController.setPassword));

router.get('/users/:id', authMiddleware, asyncHandler(userController.show));
router.get('/users', authMiddleware, asyncHandler(userController.index));
router.post('/users', authMiddleware, asyncHandler(userController.store));
router.put('/users/:id', authMiddleware, asyncHandler(userController.update));
router.delete('/users/:id', authMiddleware, asyncHandler(userController.destroy));

router.get('/roles', authMiddleware, asyncHandler(roleController.index));

export default router;
