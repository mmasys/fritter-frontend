import type {Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import {constructLikeResponse} from './util';
import FreetCollection from '../freet/collection';

const router = express.Router();

/**
 * Like a freet.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The freet to be liked
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or already liked
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    likeValidator.canUserLike
  ],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.addOne(req.session.userId, req.body.id);
    if (like) {
      res.status(201).json({
        message: 'You have successfully liked the freet.',
        like: constructLikeResponse(like)
      });
    }
  }
);

/**
 * Remove a like from a freet
 *
 * @name DELETE /api/likes/:freetId
 *
 * @return {string} - A success message if the like is removed, otherwise an error message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or like does not exist on that freet
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    likeValidator.canUserUnlike
  ],
  async (req: Request, res: Response) => {
    const freetId = req.body.id as string;
    const like = await LikeCollection.deleteOne(req.session.userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your like from the freet.',
      freetId
    });
  }
);

/**
 * Get all the freets that the user has liked
 *
 * @name GET /api/likes/:userId
 *
 * @return {LikeResponse[]}
 * @throws {403} - If the user is not logged in or does not exist
 */
router.get(
  '/:userId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userLikes = await LikeCollection.findUserLikedFreets(req.session.userId);
    const response = userLikes.map(like => constructLikeResponse(like));
    res.status(200).json(response);
  }
);

/**
 * Return true if the user has liked this freet, false otherwise.
 *
 * @name GET /api/likes/:freetId
 *
 * @return {boolean} - True if like exists, false otherwise
 * @throws {403} - If user is not logged in
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/:freetId?',
  [userValidator.isUserLoggedIn, likeValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const like = await LikeCollection.findLike(req.session.userId, req.body.id);
    if (like) {
      res.status(200).json(true);
    } else {
      res.status(200).json(false);
    }
  }
);

export {router as likeRouter};
