const express = require('express');
const router = express.Router();

const user = require('./admin/user.js');

router.use('/user',user);

module.exports = router;
