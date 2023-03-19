const users = []

function addUser(user) {
    const existingUser = users.find(_user => _user.username === user.username && _user.chatId === user.chatId );
    if (existingUser) {
        updateUser(user);
        return;
    }

    users.push(user);   
    return user;
}

function updateUser(user){
    deleteUser(user.id);
    users.push(user);

}

function deleteUser(id) {
    const index = users.findIndex(_user => _user.id === id);
    if (index !== -1) return users.splice(index, 1);
}

function getUser(id) {
    const user = users.filter(_user => _user.socketId === id)[0];
    return user;
}

function getUsersInChat(chatId) {
    const usersInChat = users.filter(_user => _user.chatId === chatId);
    return usersInChat;
}

function deleteAllUsersInChat(chatId){
    const usersInChat = getUsersInChat(chatId);
    usersInChat.forEach(_user => {
        deleteUser(_user.id);
    })
}

function checkUsersInChat(chatId){
    const usersInChat = getUsersInChat(chatId);
    return usersInChat.every(_user => _user.connected === false);
}

export {
    addUser,
    deleteUser,
    getUser,
    getUsersInChat,
    deleteAllUsersInChat, 
    updateUser,
    checkUsersInChat
}