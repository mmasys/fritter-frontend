import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

export type Like = {
  _id: Types.ObjectId;
  likerId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  likerId: User;
  freetId: Freet;
};

const LikeSchema = new Schema({
  likerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
