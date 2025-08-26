import React, { useEffect, useState } from "react"
import { FormControl } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Box, Text } from "@chakra-ui/layout"
import { IconButton, Spinner, useToast } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { BsEmojiSmile } from "react-icons/bs"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import Lottie from "react-lottie"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import io from "socket.io-client"
import axios from "axios"

import "./styles.css"
import { getSender, getSenderFull } from "../config/ChatLogics"
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import ScrollableChat from "./ScrollableChat"
import animationData from "../animations/typing.json"
import { ChatState } from "../context/ChatProvider"

const ENDPOINT = "http://localhost:4000"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  const toast = useToast()
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState()

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" })

  // Emoji handler
  const addEmoji = (emojiData) => {
    const sym = emojiData.unified.split("_")
    const codes = sym.map((el) => "0x" + el)
    const emoji = String.fromCodePoint(...codes)
    setNewMessage(newMessage + emoji)
  }

  // Typing animation config
  const typingAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  }

  // Fetch messages
  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      setLoading(true)
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
      setMessages(data)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  // Send message (Enter key)
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
        const { data } = await axios.post(
          "/api/message",
          { content: newMessage, chatId: selectedChat },
          config
        )
        setNewMessage("")
        socket.emit("new message", data)
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  // Send transcript message (from speech-to-text)
  const sendTranscriptMessage = async (message) => {
    if (!message) return
    socket.emit("stop typing", selectedChat._id)
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.post(
        "/api/message",
        { content: message, chatId: selectedChat },
        config
      )
      socket.emit("new message", data)
      setMessages([...messages, data])
      resetTranscript()
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  // Typing handler
  const typingHandler = (e) => {
    setNewMessage(e.target.value)
    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    const lastTypingTime = new Date().getTime()
    const timerLength = 3000

    setTimeout(() => {
      const timeNow = new Date().getTime()
      if (timeNow - lastTypingTime >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  // Socket setup
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
    // eslint-disable-next-line
  }, [])

  // Load messages when chat changes
  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
    // eslint-disable-next-line
  }, [selectedChat])

  // Handle incoming messages
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageRecieved])
      }
    })
  })

  return (
    <>
      {selectedChat ? (
        <>
          {/* Chat Header */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>

          {/* Chat Messages */}
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#F5E8C7"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Input Section */}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <Lottie
                  options={typingAnimationOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              )}

              <div className="w-full flex items-end p-2 bg-todo rounded-sm relative">
                <Input
                  value={newMessage || transcript}
                  onChange={typingHandler}
                  placeholder="Write your text..."
                  className="w-full bg-transparent outline-none resize-none text-sm"
                />

                {/* Emoji Picker */}
                <span
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="cursor-pointer hover:text-slate-300"
                >
                  <BsEmojiSmile />
                </span>
                {showEmoji && (
                  <div className="absolute right-6">
                    <Picker
                      data={data}
                      emojiSize={20}
                      emojiButtonSize={28}
                      onEmojiSelect={addEmoji}
                      maxFrequentRows={0}
                    />
                  </div>
                )}
              </div>
            </FormControl>

            {/* Voice Input */}
            {browserSupportsSpeechRecognition && (
              <div className="flex flex-row items-center mt-2">
                <p>Microphone: {listening ? "on" : "off"}</p>
                <button
                  className="bg-gray-300 mx-2 p-1 rounded-md"
                  onClick={startListening}
                >
                  Start
                </button>
                <button
                  className="bg-gray-300 mx-2 p-1 rounded-md"
                  onClick={SpeechRecognition.stopListening}
                >
                  Stop
                </button>
                <input
                  type="button"
                  value="Send"
                  className="hover:bg-slate-600 bg-gray-300 m-2 p-1 rounded-md"
                  onClick={() => sendTranscriptMessage(transcript)}
                />
                <p>{transcript}</p>
              </div>
            )}
          </Box>
        </>
      ) : (
        // Placeholder when no chat is selected
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
