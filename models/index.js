const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

User.belongsToMany(Post, {
    through: {
      model: Comment,
      unique: false
    }, foreignKey:'user_id'
})

Post.belongsToMany(User, {
    through: {
      model: Comment,
      unique: false
    }, foreignKey:'post_id'
})

module.exports = { User, Post, Comment };
