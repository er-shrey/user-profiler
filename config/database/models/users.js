const Sequelize = require('sequelize');
const db = require('../database');


/**
 * User model for storing user profiles
 */
var Users = db.define('users', {
    user_id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    firstname: { type: Sequelize.STRING },
    lastname: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    phone: { type: Sequelize.NUMBER },
    dob: { type: Sequelize.DATE },
    is_new: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    token: { type: Sequelize.STRING }
});

db.sync().then(() => {
    console.log("\x1b[33m%s\x1b[0m", "Synced table...... Users");
});

module.exports = Users;