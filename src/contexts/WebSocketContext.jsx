import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createWebSocket = (userId) => {
    const ws = new WebSocket(`ws://localhost:3000?userId=${userId}`);
    ws.onopen = () => console.log("WebSocket connection established.");
    ws.onmessage = (event) => console.log("Message from server:", event.data);
    ws.onclose = () => console.log("WebSocket connection closed.");
    setSocket(ws);
    return ws;
  };

  const fetchData = async (url, method = "POST", body = {}) => {
    try {
      const res = await fetch(`http://localhost:3000${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);

      if (url === "/users/login" && data.user) {
        setUser(data.user);
        createWebSocket(data.user.id);

        console.log(data.user);
        console.log(user);
      }

      if (url === "/users/logout" && socket) {
        setUser(null);
        socket.close();
        setSocket(null);
        console.log("WebSocket connection manually closed on logout.");
      }

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          createWebSocket(data.user.id);
        }
      } catch (error) {
        console.log("No active session:", error.message);
      }
      setTimeout(() => {
        console.log("Xd");
        setLoading(false);
      }, 500);
    };
    checkSession();
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        console.log("WebSocket connection closed on component unmount.");
      }
    };
  }, [socket]);

  const value = {
    socket,
    user,
    loading,
    fetchData,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("not within websocekt provider");
  }
  return context;
}

WebSocketProvider.propTypes = {
  children: PropTypes.element,
};
