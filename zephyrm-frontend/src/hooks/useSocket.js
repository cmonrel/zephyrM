/**
 * useSocket custom hook.
 *
 * Custom hook to manage socket connection.
 *
 * @module hooks/useSocket
 */

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Custom hook to manage socket connection.
 *
 * @param {string} uid - User's uid.
 * @param {string} url - Socket url.
 * @returns {Socket} - Socket instance.
 */
export const useSocket = (uid, url) => {
  const socketRef = useRef();

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
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (data) => {
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
