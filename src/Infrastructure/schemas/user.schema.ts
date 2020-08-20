import * as mongoose from 'mongoose';
import { UserStatus } from '../../CRM/Domain/user.model';

export const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true },
    customer: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, default: UserStatus.ACTIVE, required: true }
}, { collection: 'users' });