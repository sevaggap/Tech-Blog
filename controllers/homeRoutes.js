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

            console.log(post);

            const user_ids = [];
            const user_names = [];
            const comments = [];

            for(i=0;i<post.comments.length;i++){
                let user_id = post.comments[i].user_id;
                user_ids.push(user_id);
            }

            console.log(user_ids);

            for(i=0;i<user_ids.length;i++){
                const usercommentData = await User.findByPk(user_ids[i], { attributes:['username'] });

                const user_name = usercommentData.get({ plain: true });

                user_names.push(user_name);
            }

            console.log(user_names);


            for(i=0;i<postData.comments.length;i++) {
                const comment = {
                    content: postData.comments[i].content,
                    date_created: postData.comments[i].date_created,
                    user_id: postData.comments[i].user_id,
                    user_name: user_names[i].username,
                }

                comments.push(comment);
            }
            
            console.log(comments);

            res.render('post', {
                ...post, comments, logged_in: req.session.logged_in
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