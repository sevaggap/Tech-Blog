const router = require('express').Router();
const  { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req,res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        console.log(posts);
        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/post/:id', async (req,res) => {
    try{
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const post = postData.get({ plain: true });

        if(postData.comment_count != 0) {
            const postData = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                    },
                    {
                        model: Comment,
                        attributes: ['content','date_created','user_id'],
                    },
                ],
            });

            const post = postData.get({ plain: true });

            const comment_user_id = post.comments[0].user_id;
            const usercommentData = await User.findByPk(comment_user_id, { attributes:['username'] });

            const usercomment = usercommentData.get({ plain: true });

            console.log(comment_user_id);
            console.log(usercomment);
            console.log(post);

            res.render('post', {
                ...post, usercomment, logged_in: req.session.logged_in
            });

        } else {
            console.log(post);
            res.render('post', {
                ...post, logged_in: req.session.logged_in
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});



router.get('/dashboard', withAuth, async (req,res) => {
    try{
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Post }],
        });

        const user = userData.get({ plain: true });

        console.log(user);

        res.render('dashboard', {
            ...user, logged_in: req.session.logged_in
        })
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req,res) => {
    if(req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});

module.exports = router;