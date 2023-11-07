'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('./users')


module.exports = (sequelize) => {
  class Course extends Model {}
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
    },
    estimatedTime: {
      type: DataTypes.VIRTUAL,  
      allowNull: false,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
  },
 }, { sequelize });

 Course.belongsTo(User, { as:'user', foreignKey: 'userId'})

  return Course;
};

