import express from "express";
import {
  insertTestData,
  getTestData,
} from "../controllers/testController.js";

const router = express.Router();

router.post("/insert", insertTestData);
router.get("/all", getTestData);

export default router;
