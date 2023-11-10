'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('./users');
const { Course } = require('./course')
const { authenticateUser } = require('../middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Route that returns(gets) a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
const user = req.currentUser;
res.status(200).json({
  name: user.firstName + ' ' + user.lastName,
  username: user.emailAddress
});
}));

// Route that creates(posts) a new user.
router.post('/users', asyncHandler(async (req, res) => {
      await User.create(req.body);
      res.location('/');
      res.status(201).json({ "message": "Account successfully created!" });
  }));


  // Route that returns(gets) a list of courses.
router.get('/courses', asyncHandler(async (req, res) => {  
 const courses = await Course.find().populate('user');
 res.status(200).json(courses);
}));

// Route that creates(posts) a new course.
router.post('/courses/', authenticateUser, asyncHandler(async (req, res) => {  
    const course = await Course.create(req.body);
    res.location(`/api/courses/${course.id}`);
    res.status(201).end();
   }));


// Route that returns(gets) a specific course.
//Code from Github Co-Pilot
router.get('/courses/:id', asyncHandler(async (req, res) => {  
  const course = await Course.findById(req.params.id).populate('user');
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({message: "Course not found"});
  }
}));

// Route that updates a specific course.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {  
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (course) {
     await course.update(req.body);
     res.status(204).end();
    } else {
      res.status(404).json({message: "Course not found"});
    }
   }));   


router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {  
  const courseId = req.params.id;
  const course = await Course.findById(courseId);
  
  if (course) {
     // Delete the course
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({message: "Course not found"});
   }
  }));  
  
module.exports = router;


