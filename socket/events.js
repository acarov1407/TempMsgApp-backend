import { addUser, getUser, deleteAllUsersInChat, updateUser, checkUsersInChat } from "./user.js";
import { addChat, existsChat, deleteChat } from "./chat.js";

const startConnection = (io) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} se ha conectado`)

        //Events
        socket.on('create_chat', (chat) => {
            socket.join(chat.id);
            addChat(chat.id);
            const user = { ...chat.owner, chatId: chat.id, socketId: socket.id, connected: true }
            addUser(user);
        });

        socket.on('re_join_chat', (user) => {
            socket.join(user.chatId);
            updateUser({ ...user, socketId: socket.id, connected: true });
        });

        socket.on('send_message', (message) => {
            io.sockets.in(message.chat).emit('new_message', message);
        });

        socket.on('join_chat', (user) => {
            if (!existsChat(user.chatId)) {
                socket.emit('chat_not_found', user.chatId);
                return;
            }

            socket.join(user.chatId);
            addUser({ ...user, socketId: socket.id, connected: true });
            io.sockets.in(user.chatId).emit('member_joined', user);
        });

        socket.on('sending_chat_data', (chat) => {
            socket.broadcast.to(chat.id).emit('receiving_chat_data', chat);
        });

        socket.on('update_chat_name', (chatInfo) => {
            io.sockets.in(chatInfo.id).emit('updated_chat_name', chatInfo);
        });

        socket.on('disconnect', () => {

            const user = getUser(socket.id);

            if (user) {
                
                user.connected = false;
                updateUser(user);

                setTimeout(() => {

                    console.log(`${user.username} desconectado`);
                    const { chatId, ...updatedUser } = user;
                    io.sockets.in(user.chatId).emit('member_logout', updatedUser);

                    const isEmptyChat = checkUsersInChat(user.chatId);

                    if (isEmptyChat) {
                        deleteAllUsersInChat(user.chatId);
                        deleteChat(user.chatId);
                    }

                }, 15000);

            }

        })

    });

}


export {
    startConnection
}