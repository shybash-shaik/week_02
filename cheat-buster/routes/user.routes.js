const express = require('express');
const router = express.Router();
const { searchUser } = require('../controllers/user.controller');

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for a user by email or name
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email address of the user
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: First name of the user
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.get('/search', searchUser);

module.exports = router;
