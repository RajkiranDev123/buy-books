import passport from "passport";
// passport is an authentication middleware for Express
// Passport is a middleware that simplifies authentication in Node.js by using strategies like
// Google login, JWT, or local login
// and attaching the authenticated user to requests.

import { Strategy as GoggleStrategy } from "passport-google-oauth20";

import dotenv from "dotenv";
import { Request } from "express";
import User, { IUSER } from "../../models/User";
dotenv.config();

// new GoogleStrategy(options, verifyCallback)
// The verify callback runs only after Google successfully authenticates the user and redirects back to your app.
// passReqToCallback: true is used when authentication depends on request-specific data in addition to Google profile data.
passport.use(
  new GoggleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken,
      refreshToken,
      profile,
      done: (error: any, user?: IUSER | false) => void,
    ) => {
      const { emails, displayName, photos } = profile;

      console.log("profile", profile);
      try {
        let user = await User.findOne({ email: emails?.[0]?.value });
        // If user already exists
        // BUT profile picture is empty in DB
        // AND Google provides a photo
        // Then update DB with Google profile photo
        if (user) {
          if (!user.profilePicture && photos?.[0]?.value) {
            user.profilePicture = photos?.[0]?.value;
            await user.save();
          }
          return done(null, user); // Return user to Passport
        }
        // This part is executed when the user does NOT already exist in your database,
        user = await User.create({
          googleId: profile.id,
          name: displayName,
          email: emails?.[0]?.value,
          profilePicture: photos?.[0]?.value,
          isVerified: emails?.[0]?.verified,
          agreeTerms: true,
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

export default passport;
