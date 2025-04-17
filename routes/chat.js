// routes/chat.js
import express from "express";
import {handleAsyncChatRequest, handleCustomRequest } from "../controllers/chatController.js";

const router = express.Router();

// Un endpoint para manejar las peticiones de chat, por ejemplo, POST /chat
router.post("/", handleAsyncChatRequest);
router.post("/custom", handleCustomRequest);

export default router;
