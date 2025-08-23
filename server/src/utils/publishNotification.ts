import client from "../libs/redisClient";
import { Notification } from "../types";



export const publishNotification = async (notification : Notification) => {
        try {
            client.publish("notifications", JSON.stringify(notification));
            
        } catch (error) {
            console.error("publishNotification error:", error);
            
            
        }
};