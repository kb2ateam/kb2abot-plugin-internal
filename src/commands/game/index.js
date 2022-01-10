import { Command } from "kb2abot"
import GameManager from "./GameManager"

export {default as GameSchema} from "./GameSchema"
export {default as StateManager} from "./StateManager"
export const gameManager = new GameManager()
export default class Game extends Command {
	keywords = ["game"];
	description = "Chơi game\nHiện tại gồm các game: " + gameManager.getList().join(", ");
	guide = "<game>";
	permission = {
		"*": "*"
	};

	// Called after this command is inited (like an async constructor)
	async load() {}

	// Called when this command is used by client
	async onCall(thread, message, reply, api) {
		const gameName = message.args[0]
		const gameParam = message.args.slice(1).join(" ")
		if (gameManager.hasGame(gameName)) {
			try {
				gameManager.run(gameName, {
					api,
					masterID: message.senderID,
					threadID: message.threadID,
					param: gameParam,
					isGroup: message.isGroup
				})
			} catch(e) {
				return `Không thể tạo game ${gameName}\nLời nhắn: ${e.stack}`
			}
		} else
			return `Không tìm thấy game nào có tên ${gameName}!\n\nList các game:\n- ${gameManager.getList().join("\n- ")}`
	}

	hook(thread, message, reply, api) {
		for (const game of gameManager.items) {
			if (game.participants.includes(message.senderID) && (game.threadID === message.threadID || !message.isGroup)) {
				game.onMessage(thread, message, reply)
			}
		}
	}
}
