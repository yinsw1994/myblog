const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/user')
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, (req, res, next) => {
    res.render('signin');
})

router.post('/', checkNotLogin, (req, res, next) => {
    const name = req.fields.name;
    console.log('....是否进来了');
    const password = req.fields.password;
    // 校验参数
    try {
        if (!name.length) {
        throw new Error('请填写用户名')
        }
        if (!password.length) {
        throw new Error('请填写密码')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name).then((user) => {
        console.log('....是否进来了1111', user);
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('back');
        }

        if (sha1(password) !== user.password) {
            req.flash('error', '用户名或密码错误');
            return res.redirect('back');
        }
        req.flash('success', '登录成功');
        delete user.password;
        req.session.user = user;
        res.redirect('/posts');
    }).catch(next);
})

module.exports = router;