const express = require("express");
const footballClubs = express.Router();
const footballClubsController = require("../controllers/footballClubs.js");

footballClubs.get("/getall", footballClubsController.getAll);
/**
 * @swagger
 * /club/getall:
 *    get:
 *      summary: Obtain a list of all clubs in the collection.
 *      security:
 *        - apiAuth: []
 *      tags:
 *        - club
 *      responses:
 *        200:
 *          description: List of clubs successfully retrieved
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Internal server error
 */

footballClubs.post("/add", footballClubsController.createClub);
/**
 * @swagger
 * /club/add:
 *   post:
 *     summary: Create a new club.
 *     security:
 *        - apiAuth: []
 *     tags:
 *       - club
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FC Barcelona"
 *               country:
 *                 type: string
 *                 example: "Spain"
 *               city:
 *                 type: string
 *                 example: "Barcelona"
 *               stadium:
 *                 type: string
 *                 example: "Camp Nou"
 *               capacity:
 *                 type: numeric
 *                 example: 99354
 *               foundedYear:
 *                 type: numeric
 *                 example: 1899
 *               coach:
 *                 type: string
 *                 example: "Xavi Hernandez"
 *     responses:
 *       204:
 *         description: User created successfully. *
 *       401:
 *          description: Not authorized
 *       404:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal server error.
 */

footballClubs.put("/:id", footballClubsController.updateClub);
/**
 * @swagger
 * /club/{id}:
 *   put:
 *     summary: Update an existing user.
 *     security:
 *        - apiAuth: []
 *     tags:
 *       - club
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *           example: "67439c820e89da4a29d66186"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FC Barcelona"
 *               country:
 *                 type: string
 *                 example: "Spain"
 *               city:
 *                 type: string
 *                 example: "Barcelona"
 *               stadium:
 *                 type: string
 *                 example: "Camp Nou"
 *               capacity:
 *                 type: numeric
 *                 example: 99354
 *               foundedYear:
 *                 type: numeric
 *                 example: 1899
 *               coach:
 *                 type: string
 *                 example: "Xavi Hernandez"
 *     responses:
 *       204:
 *         description: Club updated successfully.
 *       401:
 *          description: Not authorized
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

footballClubs.delete("/:id", footballClubsController.deleteClub);
/**
 * @swagger
 * /club/{id}:
 *   delete:
 *     summary: Delete a club by ID.
 *     security:
 *        - apiAuth: []
 *     tags:
 *       - club
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the club to delete.
 *         schema:
 *           type: string
 *           example: "67437a358eb4f184bc632bd1"
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       401:
 *          description: Not authorized
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

module.exports = footballClubs;

// component swagger
/**
 * @swagger
 * components:
 *    securitySchemes:
 *      apiAuth:
 *        type: apiKey
 *        in: header
 *        name: apiKey
 *
 */
