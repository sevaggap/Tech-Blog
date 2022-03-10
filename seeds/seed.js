const sequelize = require('../config/connection');
const {User, Post, Comment}  = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force:true });
    
    const user = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const post = await Post.bulkBuild(postData);

    const comment = await Comment.bulkCreate(commentData);

    process.exit(0);
}

seedDatabase();