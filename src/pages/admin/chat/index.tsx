import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiSearch, FiPlus, FiX, FiCheck, FiCheckCircle } from 'react-icons/fi'
import PageTransition from '@/components/PageTransition'
import { store } from '@/services/store'
import { getSession } from '@/services/auth'
import { Card, Button, SearchInput, EmptyState, Avatar, Badge } from '@/components/ui'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  readBy: string[]
}

interface Conversation {
  id: string
  participants: string[]
  participantNames: string[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export default function ChatPage() {
  const session = getSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<Conversation[]>(() => store.getCollection<Conversation>('chatConversations'))
  const [allMessages, setAllMessages] = useState<Message[]>(() => store.getCollection<Message>('chatMessages'))
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')

  const users = store.getCollection<any>('users')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation, allMessages])

  const refresh = () => {
    setConversations([...store.getCollection<Conversation>('chatConversations')])
    setAllMessages([...store.getCollection<Message>('chatMessages')])
  }

  const filteredConversations = useMemo(() => {
    if (!session) return []
    return conversations.filter(c => {
      if (!c.participants.includes(session.userId)) return false
      if (search) {
        const name = c.participantNames?.join(' ') || ''
        return name.toLowerCase().includes(search.toLowerCase())
      }
      return true
    }).sort((a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  }, [conversations, session, search])

  const conversationMessages = useMemo(() => {
    return allMessages.filter(m => m.conversationId === activeConversation)
      .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [allMessages, activeConversation])

  const activeConvData = conversations.find(c => c.id === activeConversation)

  const handleSendMessage = () => {
    if (!newMessage.trim() || !session || !activeConversation) return
    const msg = store.create<Message>('chatMessages', {
      conversationId: activeConversation,
      senderId: session.userId,
      senderName: session.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      readBy: [session.userId],
    })
    store.update('chatConversations', activeConversation, {
      lastMessage: newMessage.trim(),
      lastMessageAt: new Date().toISOString(),
    })
    setNewMessage('')
    refresh()
  }

  const handleNewConversation = () => {
    if (!selectedUser || !session) return
    const existing = conversations.find(c =>
      c.participants.length === 2 && c.participants.includes(session.userId) && c.participants.includes(selectedUser)
    )
    if (existing) {
      setActiveConversation(existing.id)
      setShowNewChat(false)
      return
    }
    const user = users.find((u: any) => u.id === selectedUser)
    const conv = store.create<Conversation>('chatConversations', {
      participants: [session.userId, selectedUser],
      participantNames: [session.name, user?.name || 'Unknown'],
      lastMessage: 'Conversation started',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    })
    setActiveConversation(conv.id)
    setSelectedUser('')
    setShowNewChat(false)
    refresh()
  }

  const otherParticipant = activeConvData?.participants.find(p => p !== session?.userId)
  const otherUser = users.find((u: any) => u.id === otherParticipant)
  const isOnline = otherUser?.id ? localStorage.getItem(`online_${otherUser.id}`) === 'true' : false

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Internal Chat</h1>
        <Button size="sm" icon={<FiPlus />} onClick={() => setShowNewChat(true)}>New Chat</Button>
      </div>

      <Card padding="none" className="flex h-[calc(100vh-220px)] min-h-[500px]">
        <div className="w-[300px] border-r border-[var(--border-color)] flex flex-col">
          <div className="p-3 border-b border-[var(--border-color)]">
            <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." className="w-full" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4"><EmptyState title="No conversations" description="Start a new chat" /></div>
            ) : filteredConversations.map(conv => {
              const otherName = conv.participantNames?.find((n: string) => n !== session?.name) || 'Unknown'
              const otherId = conv.participants.find(p => p !== session?.userId) || ''
              const online = localStorage.getItem(`online_${otherId}`) === 'true'
              return (
                <button key={conv.id} onClick={() => setActiveConversation(conv.id)}
                  className={`w-full text-left p-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-color)] last:border-b-0 ${
                    activeConversation === conv.id ? 'bg-[var(--bg-secondary)]' : ''
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar src="" alt={otherName} size="md" />
                      {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--bg-card)] rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)]">{otherName}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)]">{store.formatDate(conv.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-3 border-b border-[var(--border-color)] flex items-center gap-3">
                <Avatar src="" alt={otherUser?.name || 'User'} size="sm" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{otherUser?.name || 'Unknown'}</p>
                  <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-[var(--text-tertiary)]'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversationMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <EmptyState title="No messages yet" description="Start the conversation" />
                  </div>
                ) : conversationMessages.map(msg => {
                  const isMine = msg.senderId === session?.userId
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <Avatar src="" alt={msg.senderName} size="sm" />
                      <div className={`max-w-[70%] ${isMine ? 'items-end' : ''}`}>
                        <div className={`p-3 rounded-2xl text-sm ${
                          isMine ? 'bg-[var(--royal-blue)] text-white rounded-tr-sm' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] text-[var(--text-tertiary)] ${isMine ? 'justify-end' : ''}`}>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMine && <FiCheck size={10} />}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-[var(--border-color)]">
                <div className="flex gap-2">
                  <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm outline-none"
                    placeholder="Type a message..."
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                  <Button size="sm" icon={<FiSend />} onClick={handleSendMessage} disabled={!newMessage.trim()} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState title="Select a conversation" description="Choose a chat from the left or start a new one" />
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showNewChat && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
            onClick={() => setShowNewChat(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md premium-card p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">New Conversation</h2>
                <button onClick={() => setShowNewChat(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"><FiX size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Select User</label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {users.filter((u: any) => u.id !== session?.userId).map((user: any) => (
                      <button key={user.id} onClick={() => setSelectedUser(user.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          selectedUser === user.id ? 'bg-[var(--royal-blue)]/10 border border-[var(--royal-blue)]/30' : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
                        }`}>
                        <Avatar src="" alt={user.name} size="sm" />
                        <div className="text-left">
                          <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{user.department || user.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={handleNewConversation} disabled={!selectedUser}>Start Conversation</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
