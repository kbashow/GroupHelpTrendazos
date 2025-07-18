module.exports = ({ GHbot, TGbot, db, config }) => {
  const settingKey = "deleteSystemMessages";

  GHbot.registerPlugin({
    name: "systemdeleter",
    settings: [
      {
        key: settingKey,
        type: "bool",
        default: false,
        menuText: "🗑 Delete System Messages",
        menuOrder: 999,
        infoText: "Automatically deletes system messages (join, leave, etc.)"
      }
    ]
  });

  TGbot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (msg.chat.type !== "group" && msg.chat.type !== "supergroup") return;

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
