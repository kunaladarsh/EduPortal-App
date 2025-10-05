import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  ArrowLeft,
  Plus,
  Users,
  Bell,
  BellOff,
  Pin,
  Archive,
  Trash2,
  Check,
  CheckCheck,
  Image,
  Paperclip,
  Smile,
  Clock,
} from "lucide-react";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

interface MobileMessagingProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: "text" | "image" | "file";
  attachments?: string[];
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  participantRole: "teacher" | "student" | "parent" | "admin";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isArchived: boolean;
  messages: Message[];
}

export const MobileMessaging: React.FC<MobileMessagingProps> = ({
  onPageChange,
  onBack
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  // Mock conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participantId: "teacher1",
      participantName: "Ms. Sarah Johnson",
      participantAvatar: "/avatars/teacher1.jpg",
      participantRole: "teacher",
      lastMessage: "Please submit your assignment by tomorrow",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      isArchived: false,
      messages: [
        {
          id: "1",
          senderId: "teacher1",
          senderName: "Ms. Sarah Johnson",
          content: "Hi! How are you doing with the math homework?",
          timestamp: "10:30 AM",
          read: true,
          type: "text"
        },
        {
          id: "2",
          senderId: user?.id || "me",
          senderName: user?.name || "Me",
          content: "I'm working on it. Should be done by tonight.",
          timestamp: "10:32 AM",
          read: true,
          type: "text"
        },
        {
          id: "3",
          senderId: "teacher1",
          senderName: "Ms. Sarah Johnson",
          content: "Great! Please submit your assignment by tomorrow",
          timestamp: "10:45 AM",
          read: false,
          type: "text"
        }
      ]
    },
    {
      id: "2",
      participantId: "student1",
      participantName: "Alex Chen",
      participantAvatar: "/avatars/student1.jpg",
      participantRole: "student",
      lastMessage: "Can you help me with chemistry?",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isArchived: false,
      messages: [
        {
          id: "1",
          senderId: "student1",
          senderName: "Alex Chen",
          content: "Hey! Can you help me with the chemistry assignment?",
          timestamp: "Yesterday",
          read: true,
          type: "text"
        },
        {
          id: "2",
          senderId: user?.id || "me",
          senderName: user?.name || "Me",
          content: "Sure! Which part are you struggling with?",
          timestamp: "Yesterday",
          read: true,
          type: "text"
        }
      ]
    },
    {
      id: "3",
      participantId: "parent1",
      participantName: "Mrs. Wilson",
      participantAvatar: "/avatars/parent1.jpg",
      participantRole: "parent",
      lastMessage: "Thank you for the update on Emma's progress",
      lastMessageTime: "3 hours ago",
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      isArchived: false,
      messages: [
        {
          id: "1",
          senderId: user?.id || "me",
          senderName: user?.name || "Me",
          content: "Emma is doing great in class. She's very engaged.",
          timestamp: "3 hours ago",
          read: true,
          type: "text"
        },
        {
          id: "2",
          senderId: "parent1",
          senderName: "Mrs. Wilson",
          content: "Thank you for the update on Emma's progress",
          timestamp: "3 hours ago",
          read: true,
          type: "text"
        }
      ]
    }
  ]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || "me",
      senderName: user?.name || "Me",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: "text"
    };

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: newMessage,
            lastMessageTime: "Just now"
          }
        : conv
    ));

    setNewMessage("");
    toast.success("Message sent!");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "teacher": return "bg-blue-100 text-blue-800";
      case "student": return "bg-green-100 text-green-800";
      case "parent": return "bg-purple-100 text-purple-800";
      case "admin": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderConversationList = () => (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* New Chat Button */}
      <Button
        onClick={() => setShowNewChat(true)}
        className="w-full bg-gradient-to-r from-primary to-secondary"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>

      {/* Conversations */}
      <div className="space-y-2">
        {filteredConversations.map((conversation, index) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 rounded-xl cursor-pointer transition-colors ${
              conversation.isPinned ? 'bg-primary/5 border border-primary/20' : 'bg-card border border-border/50'
            } hover:bg-muted/50`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.participantAvatar} />
                  <AvatarFallback>
                    {conversation.participantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium truncate">{conversation.participantName}</h3>
                    <Badge className={`${getRoleColor(conversation.participantRole)} text-xs`}>
                      {conversation.participantRole}
                    </Badge>
                    {conversation.isPinned && (
                      <Pin className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {conversation.lastMessageTime}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground ml-2">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderChat = () => {
    if (!selectedConversation) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedConversation.participantAvatar} />
              <AvatarFallback>
                {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedConversation.participantName}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedConversation.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedConversation.messages.map((message, index) => {
            const isMe = message.senderId === (user?.id || "me");
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
                  {!isMe && (
                    <p className="text-xs text-muted-foreground mb-1 px-3">
                      {message.senderName}
                    </p>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`flex items-center space-x-1 mt-1 px-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                    {isMe && (
                      message.read ? (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Check className="w-3 h-3 text-muted-foreground" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50 bg-card">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MobilePageContent
      title={selectedConversation ? selectedConversation.participantName : "Messages"}
      onBack={selectedConversation ? () => setSelectedConversation(null) : onBack}
      rightAction={
        !selectedConversation && (
          <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
            <Users className="w-4 h-4" />
          </Button>
        )
      }
    >
      <div className="h-full">
        {selectedConversation ? renderChat() : (
          <div className="p-4">
            {renderConversationList()}
          </div>
        )}
      </div>
    </MobilePageContent>
  );
};