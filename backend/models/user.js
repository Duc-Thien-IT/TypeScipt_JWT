const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const user = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false, 
    tableName: 'users'
});


module.exports = user;
