// controllers/chatController.js
import { loadAssistant, createThread, createUserMessage, runAssistant, listThreadMessages, runAssistantStream } from "../services/assistantService.js";
import { getUserThread, setUserThread } from "../db/mongoService.js";


// handler para peticiones de chat no asincronas
export const handleChatRequest = async (req, res) => {
  try {
    const { userId, message } = req.body; // Esperamos que WordPress envíe al menos userId y message

    // Validar que se reciban los parámetros necesarios
    if (!userId || !message) {
      return res.status(400).json({ success: false, error: "userId y message son requeridos." });
    }
    // Cargar el assistant en memoria
    const assistant = await loadAssistant();

    // Comprobar si ya existe un thread para ese usuario; si no, crear uno.
    let threadId = getUserThread(userId);
    if (!threadId) {
      const threadData = await createThread();
      threadId = threadData.id;
      setUserThread(userId, threadId);
    }

    // Crear el mensaje del usuario en el thread
    await createUserMessage(threadId, message);

    // Ejecutar el assistant para procesar el thread
    const runData = await runAssistant(threadId, assistant.id);

    if (runData.status === "completed") {
      // Obtener todos los mensajes del thread
      const messagesResult = await listThreadMessages(threadId);
      // Opcional: podrías transformar y ordenar los mensajes aquí.
      const mensajes = messagesResult.data.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content[0].text.value,
      }));
      return res.json({ success: true, messages: mensajes.slice(1) }); // Excluimos el primer mensaje que es el del usuario
    } else {
      return res.status(202).json({ success: false, status: runData.status });
    }
  } catch (error) {
    console.error("Error al procesar la petición:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// handler para peticiones de prueba
export const handleCustomRequest = async (req, res) => {
    const {userId} = req.body; // Esperamos que WordPress envíe el threadId
    setUserThread(userId, "testThreadId"); // Guardamos el threadId en la base de datos

    res.status(200).json({
        success: true,
    });
};


export const handleAsyncChatRequest = async (req, res) => {
  try {
    const { userId, message } = req.body; // Esperamos que WordPress envíe al menos userId y message

    // Validar parámetros
    if (!userId || !message) {
      return res.status(400).json({ success: false, error: "userId y message son requeridos." });
    }
    
    // Configurar header para respuesta en streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // Cargar el assistant en memoria
    const assistant = await loadAssistant();

    // Comprobar si ya existe un thread para ese usuario; si no, crear uno.
    let threadId = await getUserThread(userId);
    if (!threadId) {
      const threadData = await createThread();
      threadId = threadData.id;
      setUserThread(userId, threadId);
    }

    // Crear el mensaje del usuario en el thread
    await createUserMessage(threadId, message);

    // Ejecutar el assistant para procesar el thread y enviar el stream al cliente
    await runAssistantStream(threadId, assistant.id, res);

    // Al finalizar el stream, se termina la respuesta HTTP
    res.end();
    
  } catch (error) {
    console.error("Error al procesar la petición:", error);
    // En caso de error, enviar el status 500
    res.status(500).json({ success: false, error: error.message });
  }
};


