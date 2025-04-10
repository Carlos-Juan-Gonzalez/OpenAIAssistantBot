// routes/chat.js
import express from "express";
import { handleChatRequest, handleCustomRequest } from "../controllers/chatController.js";

const router = express.Router();

// Un endpoint para manejar las peticiones de chat, por ejemplo, POST /chat
router.post("/", handleChatRequest);
router.post("/custom", handleCustomRequest);

export default router;
