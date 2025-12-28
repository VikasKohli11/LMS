import express from 'express';  
import { addCourse, educatorDashBoardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorControllers.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddlewares.js';
const educatorRouter = express.Router();
// Add Educator Role    
educatorRouter.get('/update-role',updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse);
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,educatorDashBoardData)
educatorRouter.get('/enroolled-students',protectEducator,getEnrolledStudentsData);
export default educatorRouter;