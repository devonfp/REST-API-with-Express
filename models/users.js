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
      validate: {
       isEmail: true,
      },
      notNull: {
        msg: 'An email is required'
      },
      notEmpty: {
        msg: 'Please provide an email address'
      },
},
    password: {
      type: DataTypes.VIRTUAL,  
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: {
          args: [8, 20],
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
      set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confirmedPassword', hashedPassword);
        },
      },
  { sequelize }
 );

 
 User.associate = (models) => {
  User.hasMany(models.Course, {
    as: 'courses',
    foreignKey: { fieldName: 'userId'},
  });
};

 //User.hasMany(Course, { as:'courses', foreignKey: 'userId'})

  return User;
};

