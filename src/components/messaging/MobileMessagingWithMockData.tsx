import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Star,
  AlertCircle,
} from "lucide-react";
import { MobilePageContent } from "../shared/MobilePageContent";
import { toast } from "sonner@2.0.3";

// Import centralized mock data functions
import {
  getAllMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  Message
} from "../../services/mockData";

interface MobileMessagingProps {
  onPageChange: (page: string) => void;
  onBack: () => void;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
}

export const MobileMessagingWithMockData: React.FC<MobileMessagingProps> = ({
  onPageChange,
  onBack,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    receiverId: "",
    receiverName: "",
    subject: "",
    content: "",
    priority: "normal" as const
  });

  // Load messages when component mounts
  useEffect(() => {
    loadMessages();
  }, [user]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get all messages for the current user
      const messagesData = await getAllMessages(user.id);
      setMessages(messagesData);
      
      // Group messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      messagesData.forEach(message => {
        const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
        const otherUserName = message.senderId === user.id ? message.receiverName : message.senderName;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            participantId: otherUserId,
            participantName: otherUserName,
            lastMessage: message,
            unreadCount: 0,
            isOnline: Math.random() > 0.5 // Random online status for demo
          });
        } else {
          const existing = conversationMap.get(otherUserId)!;
          if (new Date(message.timestamp) > new Date(existing.lastMessage.timestamp)) {
            existing.lastMessage = message;
          }
        }
        
        // Count unread messages
        if (message.receiverId === user.id && !message.read) {
          const conversation = conversationMap.get(otherUserId)!;
          conversation.unreadCount++;
        }
      });
      
      setConversations(Array.from(conversationMap.values()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;
    
    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;
      
      const messageData = await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: conversation.participantId,
        receiverName: conversation.participantName,
        subject: `Message from ${user.name}`,
        content: newMessage,
        priority: 'normal'
      });
      
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
      
      // Update conversation
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation
            ? { ...conv, lastMessage: messageData }
            : conv
        )
      );
      
      toast.success("Message sent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      toast.error("Failed to send message");
    }
  };

  const handleComposeMessage = async () => {
    if (!composeData.content.trim() || !composeData.receiverName.trim() || !user) return;
    
    try {
      setLoading(true);
      
      const messageData = await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: composeData.receiverId || `user-${Date.now()}`, // Generate ID for demo
        receiverName: composeData.receiverName,
        subject: composeData.subject || `Message from ${user.name}`,
        content: composeData.content,
        priority: composeData.priority
      });
      
      setMessages(prev => [...prev, messageData]);
      setShowCompose(false);
      setComposeData({
        receiverId: "",
        receiverName: "",
        subject: "",
        content: "",
        priority: "normal"
      });
      
      toast.success("Message sent successfully!");
      loadMessages(); // Refresh to update conversations
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsRead(messageId);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
      // Update conversation unread count
      loadMessages();
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
      toast.error("Failed to delete message");
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConversationMessages = (conversationId: string) => {
    return messages
      .filter(msg => 
        (msg.senderId === user?.id && msg.receiverId === conversationId) ||
        (msg.receiverId === user?.id && msg.senderId === conversationId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
          <h3 className="text-lg font-semibold mb-2">Loading Messages</h3>
          <p className="text-muted-foreground">Fetching your conversations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <MobilePageContent
      title="Messages"
      onBack={onBack}
      className="h-screen flex flex-col"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          className="mx-4 mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="mt-2"
          >
            Dismiss
          </Button>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          // Conversations List
          <div className="flex-1 flex flex-col">
            {/* Header with Search */}
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Conversations</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMessages}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowCompose(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedConversation(conversation.id);
                      // Mark messages as read when opening conversation
                      const conversationMessages = getConversationMessages(conversation.id);
                      conversationMessages
                        .filter(msg => msg.receiverId === user?.id && !msg.read)
                        .forEach(msg => handleMarkAsRead(msg.id));
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conversation.participantAvatar} />
                          <AvatarFallback>
                            {conversation.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">
                            {conversation.participantName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="min-w-[20px] h-5 text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate flex-1 ${getPriorityColor(conversation.lastMessage.priority)}`}>
                            {conversation.lastMessage.senderId === user?.id && (
                              <span className="text-muted-foreground mr-1">You: </span>
                            )}
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.lastMessage.priority === 'high' && (
                            <Star className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredConversations.length === 0 && !loading && (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Conversations</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? 'No conversations match your search.' : 'Start a new conversation to get started.'}
                    </p>
                    <Button onClick={() => setShowCompose(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Conversation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 bg-card/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {conversations.find(c => c.id === selectedConversation)?.participantName
                      .split(' ').map(n => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-medium">
                    {conversations.find(c => c.id === selectedConversation)?.participantName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {conversations.find(c => c.id === selectedConversation)?.isOnline 
                      ? 'Online' : 'Offline'}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getConversationMessages(selectedConversation).map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.senderId === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 text-xs ${
                      message.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.senderId === user?.id && (
                        <div className="ml-2">
                          {message.read ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50 bg-card/50">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[40px] max-h-[120px] resize-none pr-20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              className="w-full bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">New Message</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompose(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <Input
                    placeholder="Recipient name..."
                    value={composeData.receiverName}
                    onChange={(e) => setComposeData(prev => ({ ...prev, receiverName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject (Optional)</label>
                  <Input
                    placeholder="Message subject..."
                    value={composeData.subject}
                    onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select
                    value={composeData.priority}
                    onChange={(e) => setComposeData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-lg bg-background"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Type your message..."
                    value={composeData.content}
                    onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1"
                    onClick={handleComposeMessage}
                    disabled={!composeData.content.trim() || !composeData.receiverName.trim() || loading}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCompose(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobilePageContent>
  );
};