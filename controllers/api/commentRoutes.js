const router = require('express').Router();
const { Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/add', withAuth, async (req, res) => {
    try{
        const commentData = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.id,

        });

        const comment = commentData.get({ plain: true });    

        console.log(comment);

        const postData = await Post.findByPk(req.body.id);

        const post = postData.get({ plain: true });

        console.log(post);

        const postUpdatedData = await Post.update({
            comment_count: post.comment_count + 1
        }, {
            where: {
                id: req.body.id,
                user_id: req.session.user_id
            }
        });

        res.json({ message: 'Comment successfully posted!' });

    } catch (err) {
            res.status(500).json(err);
    }
});

module.exports = router;