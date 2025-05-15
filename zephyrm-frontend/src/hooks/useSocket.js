import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (uid, url) => {
  const socketRef = useRef();

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
  }, [uid, url]);

  return socketRef.current;
};
