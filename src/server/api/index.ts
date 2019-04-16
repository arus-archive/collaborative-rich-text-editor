import express from "express";

import initializationRoute from "./initialization";

const router = express.Router();

router.post("/initialize", initializationRoute);

export default router;
