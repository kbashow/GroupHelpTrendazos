module.exports = ({ GHbot, TGbot, db, config }) => {
  const settingKey = "deleteSystemMessages";

  // Este hook asegura que se registre en el momento correcto
  GHbot.onLoad(() => {
    GHbot.addOption(settingKey, {
      type: "bool",
      default: false,
      menuText: "🗑 Delete System Messages",
      menuOrder: 99,
      infoText: "Automatically deletes system messages (join, leave, etc.)"
    });
  });

  // Escucha mensajes entrantes
  TGbot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    // Solo aplica en grupos o supergrupos
    if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") return;

    // Verificar si está activada la opción
    const settings = await db.get(chatId);
    if (!settings || !settings[settingKey]) return;

    const isSystemMsg =
      msg.new_chat_members ||
      msg.left_chat_member ||
      msg.new_chat_title ||
      msg.new_chat_photo ||
      msg.pinned_message;

    if (isSystemMsg && msg.message_id) {
      try {
        await TGbot.deleteMessage(chatId, msg.message_id);
        console.log(`[systemdeleter] Mensaje del sistema eliminado en ${chatId}`);
      } catch (error) {
        console.error(`[systemdeleter] Error al eliminar mensaje en ${chatId}:`, error?.description || error);
      }
    }
  });
};
