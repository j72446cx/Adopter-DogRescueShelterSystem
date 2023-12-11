import {onUnmounted, reactive, readonly, computed} from "vue";
import axios from "axios";

interface Message {
    messageId: number;
    senderId: number;
    receiverId: number;
    type: string;
    title: string;
    body: string;
    date: Date;
    status: number;
}

interface State {
    messages: Message[];
    read_messages: Message[];
    all_messages: Message[];

    hasNewMessage: boolean;
}
//
const watchMessages = () => {
    if (state.messages.length === 0) {
        state.hasNewMessage = false;
    }
};
//
const state = reactive<State>({
    messages: [],
    read_messages: [],
    all_messages:[],
    hasNewMessage: false
});
//
const addMessage = (message: Message) => {
    state.messages.push(message);
    state.hasNewMessage = true;
};
//
const addReadMessage = (message: Message) => {
    state.read_messages.push(message);
}
//
const addAllMessage = (message: Message) => {
    state.all_messages.push(message);
}

//
const sortUnreadMessages = () => {
    state.messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
//
const sortReadMessages = () => {
    state.read_messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
//
const sortAllMessages = () => {
    state.all_messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
//
let webSocket : WebSocket | null = null;
//
const initWebSocket = (token:string) => {
    webSocket = new WebSocket(`ws://localhost:1010/webSocket/${token}`);

    webSocket.onopen = () => {
        console.log("Websocket is opened");
        state.messages = [];
        state.read_messages = [];
        state.all_messages = [];
        state.hasNewMessage = false;
        fetchNewMessages();

    }


    webSocket.onmessage = (event) => {
        state.hasNewMessage = true;
        fetchNewMessages();
        console.log("state.hasNewMsg: " + state.hasNewMessage);
        console.log("all messages: " + state.all_messages);

    };

    webSocket.onclose = () => {
        console.log("Websocket closed");
    };

    webSocket.onerror = (error) => {
        console.error("Websocket error: " + error);
    };
}

const fetchNewMessages = () => {

    axios.get('/api/messages/user', {params: {receiverId: localStorage.getItem("ms_id")}})
        .then(response => {
            const sortedMessages = response.data.data.rows.sort((a: Message, b: Message) => new Date(b.date).getTime() - new Date(a.date).getTime());
            sortedMessages.forEach((newMessage: Message) => {


                if (!state.messages.some(message => message.messageId === newMessage.messageId)) {
                    if (newMessage.status === 0){
                        addMessage(newMessage);

                        console.log("state.hasUnreadMessage: "+ state.hasNewMessage);
                    }

                }

                if (!state.read_messages.some(message => message.messageId === newMessage.messageId)){
                    if (newMessage.status === 1){
                        addReadMessage(newMessage);

                    }
                }

                if (!state.all_messages.some(message => message.messageId === newMessage.messageId)){
                    addAllMessage(newMessage);

                }

            },

            );

        }).then(() => {
            sortAllMessages();
            sortUnreadMessages();
            sortReadMessages();
    })
        .catch(error => {
            console.error("Error when getting information:", error);
        });

};
const markMessageAsRead = (messageId: number) => {
    const messageIndex = state.all_messages.findIndex(message => message.messageId === messageId);
    if (messageIndex !== -1) {
        state.all_messages[messageIndex].status = 1; // 将状态设置为已读
    }

    // 从未读消息列表中移除
    const unreadMessageIndex = state.messages.findIndex(message => message.messageId === messageId);
    if (unreadMessageIndex !== -1) {
        state.messages.splice(unreadMessageIndex, 1);
    }
    watchMessages();
};
//
const disconnectWebSocket = () => {
    if (webSocket) {
        webSocket.close();
        webSocket = null;
    }
};
//
onUnmounted(() => {
    disconnectWebSocket();
})
//
export default {
    state: readonly(state),
    addMessage,
    initWebSocket,
    disconnectWebSocket,
    fetchNewMessages,
    markMessageAsRead,
    watchMessages,
};