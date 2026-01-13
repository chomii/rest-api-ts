import express from "express";

import authRouter from "./auth.ts";
import userRouter from "./users.ts";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

// 404 handler for undefined routes
router.use((req, res) => {
  res.status(404).json({
    errors: [`The requested route ${req.originalUrl} does not exist`],
    message: "Route not found",
    statusCode: 404,
  });
});

export default router;
