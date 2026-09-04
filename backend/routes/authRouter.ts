import { NextFunction, Request, Response, Router } from "express";
import * as authController from "../controllers/authController";
import { auth } from "../middleware/authMiddleware";
import passport from "passport";
import { IUSER } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router = Router();

// http://localhost:8000/api/v1/auth/(register)

router.post("/register", authController.register);
router.post("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.get("/logout", authController.logout);

router.get("/verify-auth", auth, authController.checkUserAuth);

// router.push(`${Base_URL}/auth/google`);

// Passport redirects the browser to Google login/account-selection page.
// Requests profile and email information from Google.
// In web terms, redirect means telling the browser to go to another URL.
// Technically, the server sends a 3xx redirect response (often 302) with a Location URL.

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// http://localhost:8000/api/v1/auth/google/callback ==> from  (google cloud console)
// Complete Google login => triggers GoogleStrategy => done() => req.user

router.get(
  "/google/callback",

  passport.authenticate("google", {
    // If authentication fails, Passport can use: failureRedirect
    failureRedirect: `${process.env.FRONTEND_URL}`,
    session: false,
  }),

  // authentication succeeds then
  // Google redirects to "/google/callback" (the redirect causes the browser to make a GET request to "/google/callback")
  // "/google/callback?code=abc123" ==> ?code=abc123 → Google sends an authorization code
  // The ?code=abc123 is not part of the route path. The route is only /google/callback.
  // Then Passport receives that code and exchanges with google to get oauth tokens and then
  // Passport uses the OAuth token to get the user profile etc...
  // exchange ==> give something to get something back.
  // then Passport runs GoogleStrategy verify cb then
  // Strategy calls done(null, user) then
  // Passport puts user in req.user then this function runs

  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as IUSER;

      const accessToken = generateToken(user);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

// small controller ==> eg of redirect : 302
// export const googleAuth = (req, res) => {
//   return res.status(302).redirect("/auth/google");
// };
