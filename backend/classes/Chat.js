function Chat(id, user, name, password) {
    this.id = id
    this.name = name
    this.password = password
    this.users = [user]
    this.messages = []

    this.sendMessage = (nick, message) => {
        this.messages.push({message: message, user: nick})
    }
    this.leaveChat = (user) => {
        this.users.filter(n => n.id === user.id)
    }

}
exports.Chat = Chat