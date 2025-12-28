import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
//update role to educator   
export const updateRoleToEducator=async (req, res) => {
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata: {role: 'educator',

            }
        })
        res.json({success:true, message :'You can publish a course now'})
    } catch(error){
res.json({success:false, message: error.message})
    }
}

//add new Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;
    if (!imageFile) {
      return res.json({ success: false, message: 'Thumbnail Not Attached' });
    }
    const parsedCourseData = JSON.parse(courseData);

    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

   const imageUpload= await cloudinary.uploader.upload(imageFile.path)
   newCourse.courseThumbnail=imageUpload.secure_url
   await newCourse.save()
    res.json({success:true,message:'Course Added'});
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Get Educator Courses 
export const getEducatorCourses=async(req,res)=>{
  try{
const educator=req.auth.userId
const courses=await Course.find({educator})
res.json({success:true,courses})
  }
  catch(error){
res.json({success:false,message:error.message})
  }
}


// Get educator Dashboard Data (Total Earning,Enrolled Students,No of Courses)
export const educatorDashBoardData=async(req,res)=>{
  try{
const educator=req.auth.userId;
const courses=await Course.find({educator});
const totalCourses=courses.length;
const courrseIds=courses.map(cours=>course._id);
//calculate total earnings from purchases
const purchases=await Purchase.find(
  {
    courseId:{$in:courseIds},
    status:'completed'
  });
  const totalEarnings=purchases.reduce((sum,purchase)=>sum+purchase.amount,0);
  //Collect unique enrolled student IDs with their course titles
  const enrolleStudentsData=[];
  for(const course of courses){
    const students=await User.find({
      _id:{$in:course.enrolledStudents}
    },'name imageUrl');
    students.forEach(student=>{
      enrolleStudentsData.push({
        courseTitle:course.courseTitle,
        student
      })
    })
  }
  res.json({success:true,dashboardData:{
    totalEarnings,enrolleStudentsData,totalCourses
  }})
} catch(error){
res.json({success:false,message:error.message});
  }
}

//get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData=async (req,res)=>{
try{
const educator =req.auth.userId;
const courses=await Course.find({educator});
const courrseIds=courses.map(cours=>course._id);
const puchases=await Purchase.find({
  courseId:{$in:courseIds},
  status:'completed'
}).populate('userId','name imageUrl').populate('courseId','courseTitle')
const enrolledStudents=purchases.map(purchase=>({
  student:purchase.userId,
  courseTitle:purchase.courseId.courseTitle,
  purchaseDate:purchase.createdAt
}))
res.json({success:true,enrolledStudents})
} catch(error){
res.json({success:false,message:error.message});
}
}