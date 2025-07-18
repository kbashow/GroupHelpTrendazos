module.exports = ({ TGbot }) => {
  TGbot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    const isSystemMsg =
      msg.new_chat_members ||
      msg.left_chat_member ||
      msg.new_chat_title ||
      msg.new_chat_photo ||
      msg.pinned_message;

    if (isSystemMsg && msg.message_id) {
      try {
        await TGbot.deleteMessage(chatId, msg.message_id);
        console.log(`[deleteSystemMessages] Mensaje del sistema eliminado en ${chatId}`);
      } catch (error) {
        console.error(`[deleteSystemMessages] Error al eliminar mensaje en ${chatId}:`, error.description);
      }
    }
  });
};
