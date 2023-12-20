'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User } = require('./models');
const { Course } = require('./models')
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();


// Route that returns(gets) a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
const user = req.currentUser;
res.status(200).json({
  userId: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.emailAddress,
  password: user.password
});
}));

// Route that creates(posts) a new user.
router.post('/users', asyncHandler(async (req, res, next) => {
  // Attempts to get the validation result from the Request object.
  // Code from Github Co-Pilot
  try {
    const newUser = await User.create(req.body);
    res.location(`/`);
    res.status(201).end();
} catch (error) {
if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const errors = error.errors.map(err => err.message);
    res.status(400).json({ errors }); 
   }  else {
    next(error)
  }
   }
}));


  // Route that returns(gets) a list of courses.
  //Code from Github Co-Pilot
  router.get('/courses', asyncHandler(async (req, res) => {  
    const courses = await Course.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      },
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded']
    });
    res.status(200).json(courses);
  }));


// Route that creates(posts) a new course.
router.post('/courses', authenticateUser, asyncHandler(async (req, res, next) => {  
  try {
    const newCourse = await Course.create(req.body);
    res.location(`/courses/${newCourse.id}`);
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error)
    }
  }
}));



// Route that returns(gets) a specific course.
router.get('/courses/:id', asyncHandler(async (req, res) => {  
  const course = await Course.findByPk(req.params.id, {
  include: {
    model: User,
    as: 'user',
    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
  },
  attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded']
});
res.status(200).json(course);
}));

// Route that updates a specific course.
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res, next) => {
 
  try {
    // Code from askCodi
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
        // Update the course attributes with new values from the request body
        await course.update(req.body);
        res.status(204).end();
      
      }  catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error);
    }
  }
}));



router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {  
  const courseId = req.params.id;
  const course = await Course.findByPk(courseId);
  
  if (course) {
     // Delete the course
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({message: "Course not found"});
   }
  }));  
  
module.exports = router;


