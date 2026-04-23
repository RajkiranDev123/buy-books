import { NextFunction, Request, Response, Router } from "express";
import * as authController from "../controllers/authController";
import { auth } from "../middleware/authMiddleware";
import passport from "passport";
import { IUSER } from "../models/User";
import { generateToken } from "../utils/generateToken";

const router = Router();

// http://localhost:8000/api/v1/auth/register

router.post("/register", authController.register);
router.post("/verify-email/:token", authController.verifyEmail);

router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/logout", authController.logout);
router.get("/verify-auth", auth, authController.checkUserAuth);

// router.push(`${Base_URL}/auth/google`);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// http://localhost:8000/api/v1/auth/google/callback ==> from  (google cloud console)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}`,
    session: false,
  }),
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

// User clicks login → hits /google route
// passport.authenticate("google") runs
// Passport sends HTTP 302 redirect response
// Browser is redirected to Google login page
// User logs in on Google
// User grants permission (profile, email)
// Google redirects user to callback URL with an authorization code
// /google/callback route runs
// Passport exchanges code → accessToken → profile (internally)
// verify callback runs (DB check / create user)
// Passport attaches user → req.user
// Your next middleware runs (JWT, cookie, redirect)

// small controller ==> eg of redirect : 302

// export const googleAuth = (req, res) => {
//   return res.status(302).redirect("/auth/google");
// };
