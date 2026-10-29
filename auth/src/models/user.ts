import mongoose, { model, Model, Schema } from 'mongoose';
import { Password } from "../services/password";

// This describes what is required to create a User
interface UserAttributes {
    email: string;
    password: string;
}

// This describes what the collections of User look like
interface UserModel extends Model<UserDoc> {
    build(attrs: UserAttributes): UserDoc;
}

// This describes what a single collection looks like
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
}, {
    toJSON: {
        transform(doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    }
});

userSchema.pre('save', async function () {
    // this refers to the current user document
    // we only want to hash the password if it has been modified (or is new)
    // note: when we call build, that is considered as modifying the password
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
})

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

const User = model<UserDoc, UserModel>('User', userSchema);


export { User };




