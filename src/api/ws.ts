import { message } from "ant-design-vue";
import { ref } from "vue";
import { getToken } from "../utils/auth";
import { useUserStore } from "../store/modules/user";

class WebSocketClient {
    private static instance: WebSocketClient | null = null;
    private socket: WebSocket | null = null;
    private url: string;
    private reconnectInterval: number;
    private reconnectAttempts: number;
    private maxReconnectAttempts: number;

    private heartbeatInterval: number;
    private heartbeatTimeout: number;
    private lastHeartbeatResponseTime: number | null = null;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private heartbeatPending: boolean = false; // 新增标记心跳是否正在等待响应

    public error = ref<string | null>(null);
    public loading = ref<boolean>(false);
    public online = ref<boolean>(false);

    private isManualDisconnect = false;

    private onMessageCallbacks: Array<(message: any) => void> = [];
    private onErrorCallbacks: Array<(error: any) => void> = [];
    private onOpenCallbacks: Array<() => void> = [];
    private onCloseCallbacks: Array<() => void> = [];

    private constructor(url: string, options?: { reconnectInterval?: number, maxReconnectAttempts?: number, heartbeatInterval?: number, heartbeatTimeout?: number }) {
        this.url = url;
        this.reconnectInterval = options?.reconnectInterval || 3000;
        this.maxReconnectAttempts = options?.maxReconnectAttempts || 99;
        this.reconnectAttempts = 0;

        this.heartbeatInterval = options?.heartbeatInterval || 30000; // 默认30秒发送心跳
        this.heartbeatTimeout = options?.heartbeatTimeout || 5000; // 默认5秒内未响应则重连
    }

    public static getInstance(url: string, options?: { reconnectInterval?: number, maxReconnectAttempts?: number, heartbeatInterval?: number, heartbeatTimeout?: number }): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient(url, options);
        }
        return WebSocketClient.instance;
    }

    connect() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocket 已经连接");
            return;
        }

        this.loading.value = true;
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket 连接成功");
            this.reconnectAttempts = 0;
            this.loading.value = false;
            this.online.value = true;
            this.error.value = null;
            this.isManualDisconnect = false;

            this.onOpenCallbacks.forEach(callback => callback());
            this.startHeartbeat(); // 连接成功后开启心跳检测
        };

        this.socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            this.onMessageCallbacks.forEach(callback => callback(response));

            if (response.notifyGroup === "heart_beast_group") {
                this.lastHeartbeatResponseTime = Date.now();
                let token = response.notifyData;
                this.heartbeatPending = false
                console.log('获取新token', token.slice(0, 10));
                let userStore = useUserStore();
                userStore.setToken(`${token}`);
                this.reconnectAttempts = 0;
                this.error.value = null;
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket 错误", error);
            this.error.value = "WebSocket 连接发生错误！";
            this.onErrorCallbacks.forEach(callback => callback(error));
            message.error(this.error.value);

            this.stopHeartbeat(); // 发生错误时停止心跳检测
        };

        this.socket.onclose = () => {
            console.log("WebSocket 连接已关闭");

            if (this.isManualDisconnect) {
                this.online.value = false;
                this.isManualDisconnect = false;
                return;
            }

            this.online.value = false;
            this.onCloseCallbacks.forEach(callback => callback());
            this.reconnectIfNeeded();
            this.stopHeartbeat(); // 连接关闭时停止心跳检测
        };
    }

    sendMessage(msg: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(msg);
            message.success("消息已发送！");
        } else {
            console.warn("WebSocket 未打开，无法发送消息");
            message.warning("WebSocket 未连接，无法发送消息");
        }
    }

    disconnect() {
        if (this.socket) {
            this.isManualDisconnect = true;
            this.socket.close();
        }
    }

    onMessage(callback: (message: any) => void) {
        this.onMessageCallbacks.push(callback);
    }

    onError(callback: (error: any) => void) {
        this.onErrorCallbacks.push(callback);
    }

    onOpen(callback: () => void) {
        this.onOpenCallbacks.push(callback);
    }

    onClose(callback: () => void) {
        this.onCloseCallbacks.push(callback);
    }

    offMessage(callback: (message: any) => void) {
        this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
    }

    offError(callback: (error: any) => void) {
        this.onErrorCallbacks = this.onErrorCallbacks.filter(cb => cb !== callback);
    }

    offOpen(callback: () => void) {
        this.onOpenCallbacks = this.onOpenCallbacks.filter(cb => cb !== callback);
    }

    offClose(callback: () => void) {
        this.onCloseCallbacks = this.onCloseCallbacks.filter(cb => cb !== callback);
    }

    private startHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer); // 清除之前的定时器
        }

        this.heartbeatTimer = setInterval(() => {
            console.log("heartbeat interval");
            if (this.socket && this.socket.readyState === WebSocket.OPEN && !this.heartbeatPending) {
                const jwtToken = getToken();
                if (jwtToken) {
                    const heartbeatMessage = JSON.stringify({ notifyGroup: 'heart_beast_group', notifyData: jwtToken });
                    this.socket.send(heartbeatMessage);
                    console.log("发送心跳包");
                    this.heartbeatPending = true; // 设置为等待响应状态
                    setTimeout(() => {
                        if (this.heartbeatPending) {
                            console.log("心跳超时，进行重连");
                            message.error("WebSocket 心跳超时，正在重连...");
                            this.online.value = false; // 设置为断线状态
                            this.reconnectIfNeeded();
                        }
                    }, this.heartbeatTimeout); // 设置超时机制
                }
            }
        }, this.heartbeatInterval);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null; // 清空定时器
            console.log("停止心跳检测");
        }
    }

    private checkHeartbeatTimeout() {
        const now = Date.now();

        if (this.lastHeartbeatResponseTime && now - this.lastHeartbeatResponseTime > this.heartbeatTimeout) {
            console.log("心跳超时，进行重连");
            message.error("WebSocket 心跳超时，正在重连...");
            this.online.value = false; // 设置为断线状态
            this.reconnectIfNeeded();
        }
    }

    private reconnectIfNeeded() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts += 1;
            console.log(`重连中，间隔 ${this.reconnectInterval}ms... 重连次数: ${this.reconnectAttempts}`);
            message.info(`WebSocket 重连中... (第 ${this.reconnectAttempts} 次)`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectInterval);
        } else {
            console.log("最大重连次数已达到");
            message.error("WebSocket 最大重连次数已达到，无法重新连接！");
        }
    }
}

export default WebSocketClient;
