const express = require("express");
const matchesRouter = express.Router();
const matchesController = require("../controllers/matchs");

matchesRouter.get("/getall", matchesController.getAll);
/**
 * @swagger
 * /matches/getall:
 *    get:
 *      summary: Obtain a list of all matches collections.
 *      security:
 *        - githubAuth: []
 *      tags:
 *        - matches
 *      responses:
 *        200:
 *          description: List of matches successfully retrieved
 *        401:
 *          description: Not authorized
 *        500:
 *          description: Internal server error
 */

matchesRouter.post("/add", matchesController.createMatch);
/**
 * @swagger
 * /matches/add:
 *   post:
 *     summary: Create a new matches.
 *     security:
 *       - githubAuth: []
 *     tags:
 *       - matches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stadium:
 *                 type: string
 *                 example: "Salsalito"
 *               team1:
 *                 type: string
 *                 example: "U Chile"
 *               team2:
 *                 type: string
 *                 example: "catolica"
 *               team1goals:
 *                 type: numeric
 *                 example: 0
 *               team2goals:
 *                 type: numeric
 *                 example: 0
 *               referee:
 *                 type: string
 *                 example: "Pelado Acosta"
 *               date:
 *                 type: numeric
 *                 example: 2024-11-02
 *     responses:
 *       204:
 *         description: Match created successfully. *
 *       401:
 *          description: Not authorized
 *       404:
 *         description: Bad request, invalid input.
 *       500:
 *         description: Internal server error.
 */

matchesRouter.put("/:id", matchesController.updateMatch);
/**
 * @swagger
 * /matches/{id}:
 *   put:
 *     summary: Update an existing match.
 *     security:
 *       - githubAuth: []
 *     tags:
 *       - matches
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the match to update.
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
 *               stadium:
 *                 type: string
 *                 example: "Salsalito"
 *               team1:
 *                 type: string
 *                 example: "U Chile"
 *               team2:
 *                 type: string
 *                 example: "catolica"
 *               team1goals:
 *                 type: numeric
 *                 example: 0
 *               team2goals:
 *                 type: numeric
 *                 example: 0
 *               referee:
 *                 type: string
 *                 example: "Pelado Acosta"
 *               date:
 *                 type: numeric
 *                 example: 2024-11-02
 *     responses:
 *       204:
 *         description: Match updated successfully.
 *       401:
 *          description: Not authorized
 *       404:
 *         description: Match not found.
 *       500:
 *         description: Internal server error.
 */

matchesRouter.delete("/:id", matchesController.deleteMatch);
/**
 * @swagger
 * /matches/{id}:
 *   delete:
 *     summary: Delete a matches by ID.
 *     security:
 *       - githubAuth: []
 *     tags:
 *       - matches
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the matches to delete.
 *         schema:
 *           type: string
 *           example: "67437a358eb4f184bc632bd1"
 *     responses:
 *       204:
 *         description: match deleted successfully.
 *       401:
 *          description: Not authorized
 *       404:
 *         description: Match not found.
 *       500:
 *         description: Internal server error.
 */

module.exports = matchesRouter;
