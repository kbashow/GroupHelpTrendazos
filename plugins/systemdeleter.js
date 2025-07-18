module.exports = ({ GHbot, TGbot, db, config }) => {
  const settingKey = "deleteSystemMessages";

  // Crear configuración por grupo si no existe
  GHbot.addOption(settingKey, {
    type: "bool",
    default: false,
    menuText: "🗑 Delete System Messages",
    menuOrder: 99, // ajusta el orden si quieres moverlo en el menú
    infoText: "Automatically deletes system messages (join, leave, etc.)"
  });

  // Manejar mensajes nuevos
  TGbot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    // Validar que sea grupo o supergrupo
    if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") return;

    // Verificar si el grupo tiene la opción activada
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
