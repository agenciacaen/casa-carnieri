import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Image, 
  Paperclip, 
  MoreVertical, 
  Layout, 
  Settings, 
  MessageSquare, 
  User,
  Menu
} from 'lucide-react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Olá Alexandre! Sou o seu assistente inteligente. Como posso ajudar a editar o site da Casa Carnieri hoje?',
      time: '17:20'
    },
    {
      id: 2,
      type: 'user',
      text: 'Quero adicionar um novo ensaio chamado "Casamento na Serra".',
      time: '17:21'
    },
    {
      id: 3,
      type: 'ai',
      text: 'Perfeito! Por favor, arraste as fotos aqui ou use o ícone de anexo para enviar as imagens do ensaio. Vou precisar também de uma breve descrição.',
      time: '17:21'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simular resposta da IA
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Certo, estou processando seu pedido. O site será atualizado em breve.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>
            <Layout size={24} />
            Casa Carnieri
          </h1>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-item active">
            <MessageSquare size={20} />
            <span>Chat IA</span>
          </div>
          <div className="menu-item">
            <Layout size={20} />
            <span>Ver Site</span>
          </div>
          <div className="menu-item">
            <User size={20} />
            <span>Configurações</span>
          </div>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="main-chat">
        <header className="chat-header">
          <div className="bot-info">
            <div className="status-indicator"></div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Administrador AI</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Online e pronto para editar</p>
            </div>
          </div>
          <button className="icon-btn">
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-content">{msg.text}</div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-box">
            <button className="icon-btn">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Digite aqui sua alteração (ex: Mudar texto do sobre...)" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="icon-btn">
              <Image size={20} />
            </button>
            <button className="icon-btn send-btn" onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
