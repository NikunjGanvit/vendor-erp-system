'use strict';

const express = require('express');
const router = express.Router();
const { createUserAction } = require('../modules/users/controller');

router.post('/users', createUserAction);

module.exports = router;
