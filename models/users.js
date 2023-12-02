'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
//const Course = require('./course')


module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name is required'
        },
        notEmpty: {
          msg: 'Please provide a name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
      notNull: {
        msg: 'An email is required'
      },
      notEmpty: {
        msg: 'Please provide an email address'
      },
     }
    },
    password: {
      type: DataTypes.STRING,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [6, 100],
        },
      },
      set(val) {
        console.log('Password before hashing:', val);
          const hashedPassword = bcrypt.hashSync(val, 10);
          console.log('Hashed password:', hashedPassword);
          this.setDataValue('password', hashedPassword);
        },
      }
  }, { sequelize });
 
 User.associate = (models) => {
  User.hasMany(models.Course, {
    as: 'courses',
    foreignKey: { fieldName: 'userId'},
  });
};

 //User.hasMany(Course, { as:'courses', foreignKey: 'userId'})

  return User;
};
