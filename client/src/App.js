import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import { useEffect } from "react"
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddFriend from "./pages/AddFriend";
import ChatBox from "./pages/ChatBox";
import Requests from "./pages/Requests";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Protected from "./pages/Protected";
import { useSelector, useDispatch } from 'react-redux'
import { getUsers } from './slices/userSlice'
import { allRequests } from './slices/requestSlice'
import { allConversations } from "./slices/conversationSlice";
import { allRooms } from "./slices/roomSlice";
import RoomChat from "./pages/RoomChat";
import { io } from 'socket.io-client'
import { setSocket } from "./slices/socketSlice";

function App() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(getUsers())
      dispatch(allRequests())
      dispatch(allConversations())
      dispatch(allRooms())
    }

    const newSocket = io('http://localhost:3001', { query: { id: user._id } })
    dispatch(setSocket(newSocket))

    return () => {
      newSocket.close()
    }
  }, [user, dispatch])

  return (
    <div className="App">

      <Router>

        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout user={user} />}>
            <Route
              index
              element={
                <Protected user={user}>
                  <AddFriend user={user} />
                </Protected>
              }
            />

            <Route
              path="requests"
              element={
                <Protected user={user}>
                  <Requests user={user} />
                </Protected>
              }
            />

            <Route
              path="/:username"
              element={
                <Protected user={user}>
                  <ChatBox user={user} />
                </Protected>
              }
            />

            <Route
              path="room/:roomId"
              element={
                <Protected user={user}>
                  <RoomChat user={user} />
                </Protected>
              }
            />

          </Route>

        </Routes>

      </Router>

      <ToastContainer position="top-right" newestOnTop />
    </div>
  );
}

export default App;
