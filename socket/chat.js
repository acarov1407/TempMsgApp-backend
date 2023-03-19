const chats = []

function addChat(id) {
    chats.push(id);
    console.log('chats', chats);
}

function existsChat(id) {
    return chats.indexOf(id) !== -1;
}

function deleteChat(id){
    const index = chats.indexOf(id);
    if (index !== -1) return chats.splice(index, 1);
}

export {
    addChat,
    existsChat,
    deleteChat
}