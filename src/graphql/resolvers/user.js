import {
    ApolloError
} from "apollo-server-express";

import {
    hash,
    compare
} from 'bcryptjs';
import { kebabCase } from "lodash";

import {
    issueToken,
    serializeUser
} from '../../functions';

import {
    UserRegisterationRules,
    UserAuthenticationRules
} from '../../validators';

export default {
    Query: {
        authUserProfile: async (_, {}, {
            user
        }) => user,
        authenticateUser: async (_, {
            username,
            password
        }, {
            User
        }) => {
            try {
                await UserAuthenticationRules.validate({
                    username,
                    password
                }, {
                    abortEarly: false
                });
                // Find user by username
                let user = await User.findOne({
                    username
                });
                if (!user) {
                    throw new ApolloError("Username not found.");
                }
                // Check for the password
                let isMatch = await compare(password, user.password);
                if (!isMatch) {
                    throw new ApolloError("Invalid password.");
                }
                // Serialize User
                user = user.toObject();
                user.id = user._id;
                user = serializeUser(user);
                // Issues New Authentication Token
                let token = await issueToken(user);
                return {
                    user,
                    token
                }
            } catch (err) {
            	if(err.errors) 
            	{
                  let msg = "";
            	  err.errors.forEach(error => msg = msg + error + '<br />')
                  err.message = msg
            	}
               throw new ApolloError(err.message, 400);
            }
        }
    },
    Mutation: {
        registerUser: async (_, {
            newUser
        }, {
            User
        }) => {
            try {
                await UserRegisterationRules.validate(newUser, {
                    abortEarly: false
                });
                
                let {
                    email,
                    username,
                    cPassword,
                    password
                } = newUser

                // First Check if the username is already taken
                let user;

                user = await User.findOne({
                    username
                });
                if (user) {
                    throw new ApolloError("Username is already taken.");
                }
                // If the email taken
                user = await User.findOne({
                    email
                });
                if (user) {
                    throw new ApolloError("Email is already registred.");
                }
                if (password !== cPassword) {
                    throw new ApolloError("Password dont matched.");
                }

                // Create new User Instance
                user = new User(newUser);
                // Hash the password
                user.password = await hash(newUser.password, 10);
                // The Save the user to the database
                let result = await user.save();
                result = result.toObject();
                result.id = result._id;
                result = serializeUser(result);
                // Issue the Authentication Token
                let token = await issueToken(result);
                return {
                    token,
                    user: result
                }
            } catch (err) {
                let errs;
                if(err.inner){
                    err.inner.forEach(error =>  {
                        if(!errs){
                            errs = error.path+":"+error.errors;
                        }else{
                            errs = errs + "," + error.path+":"+error.errors;
                        }
                    })
                }
                if(!errs){
                    let key = err.message.split(" ")[0].toLowerCase();
                    errs = key+":"+err.message;
                }
                throw new ApolloError(errs, 400);
            }
        }
    }
}
