import { AddIcon } from "@chakra-ui/icons"
import { Box, Stack, Text } from "@chakra-ui/layout"
import { useToast } from "@chakra-ui/toast"
import axios from "axios"
import { useEffect, useState } from "react"
import { getSender } from "../config/ChatLogics"
import ChatLoading from "./ChatLoading"
import GroupChatModal from "./miscellaneous/GroupChatModal"
import { Button } from "@chakra-ui/react"
import { ChatState } from "../context/ChatProvider"

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.get("/api/chat", config)
      setChats(data)
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
    // eslint-disable-next-line
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="#818FB4"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Header */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F5E8C7"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#818FB4"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>

                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name}:</b>{" "}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats
