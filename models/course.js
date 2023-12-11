'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
//const User = require('./users')


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
      type: DataTypes.TEXT,
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
      type: DataTypes.STRING,  
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },
 }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user',
      foreignKey: { fieldName: 'userId'},
    });
  };
  

  return Course;
};

