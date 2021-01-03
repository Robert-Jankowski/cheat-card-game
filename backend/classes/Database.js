function Database() {
    this.games = []
    this.players = []
    this.chats = []

    this.createGame = (game) => {
        this.games.push(game)
    }
    this.createChat = (chatroom) => {
        this.chats.push(chatroom)
    }
    this.logToChat = (name, password) => {
        const chat = this.chats.find(n => n.name === name && n.password === password)
        return chat !== undefined ? chat.id : null
    }
    this.joinChat = (id, user) => {
        const chat = this.chats.find(n => n.id === id)
        chat.users.push(user)
    }
    this.closeChat = (id) => {
        this.chats = this.chats.filter(n => n.id !== id)
    }
}
exports.Database = Database