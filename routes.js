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
  username: user.emailAddress,
  password: user.password
});
}));

// Route that creates(posts) a new user.
router.post('/users', asyncHandler(async (req, res) => {

  // Attempts to get the validation result from the Request object.
  // Code from Github Co-Pilot
      await User.create({
      "firstName": "req.body.firstName",
      "lastName": "req.body.lastName",
      "emailAddress": "req.body.emailAddress",
      "password": "req.body.password"
      });
        res.location('/');
      res.status(201).json({ "message": "Account successfully created!" });
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
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {  
    const course = await Course.create({
      "title": "req.body.title",
      "description": "req.body.description",
      "userId": 1,
      'estimatedTime': 'req.body.estimatedTime',  
      'materialsNeeded': 'req.body.materialsNeeded'
      });
    res.location(`/courses/${course.id}`);
    res.status(201).end();
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
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {  
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);

    if (course) {
     await course.update({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      },
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded']
     });
     res.status(204).end();
    } else {
      res.status(404).json({message: "Course not found"});
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


