/**
 * useSocket custom hook.
 *
 * Custom hook to manage socket connection.
 *
 * @module hooks/useSocket
 */

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Custom hook to manage socket connection.
 *
 * @param {string} uid - User's uid.
 * @param {string} url - Socket url.
 * @returns {Socket} - Socket instance.
 */
export const useSocket = (uid: string, url: string): Socket | undefined => {
  const socketRef = useRef<Socket | undefined>(undefined);

  /**
   * Effect hook to set up socket connection.
   */
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url);
    }

    if (uid) {
      socketRef.current.emit("register", uid);
    }

    socketRef.current.on("connect", () => {
      if (!socketRef.current) return;
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (data: { message: string }) => {
      alert(data.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("notification");
        socketRef.current.disconnect();
      }
    };
  }, [uid]);

  return socketRef.current;
};
