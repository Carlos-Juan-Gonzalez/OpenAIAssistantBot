// models/threadStore.js
const threadStore = new Map();

/**
 * Asocia un thread al usuario.
 * @param {string} userId - Identificador único del usuario.
 * @param {string} threadId - Identificador del thread creado.
 */
export const setUserThread = (userId, threadId) => {
  threadStore.set(userId, threadId);
};

/**
 * Obtiene el thread asociado al usuario.
 * @param {string} userId
 * @returns {string|null} threadId o null si no existe.
 */
export const getUserThread = (userId) => {
  return threadStore.get(userId) || null;
};

