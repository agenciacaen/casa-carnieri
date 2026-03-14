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
  LogIn,
  Lock,
  Loader2
} from 'lucide-react';
import './App.css';

// URL da Edge Function no Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mvbxpnmdcijfzoexwvla.supabase.co';
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function addAIMessage(text) {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }

  function addUserMessage(text) {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }

  // Verificar se tem token salvo
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      addAIMessage('Bem-vindo de volta! Sou o assistente da Casa Carnieri. Como posso ajudar a editar o site hoje?');
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setIsLoggedIn(true);
        localStorage.setItem('admin_token', data.token);
        addAIMessage('Olá! Sou o assistente inteligente da Casa Carnieri. Posso editar textos, adicionar ou remover ensaios do portfólio. O que deseja fazer?');
      } else {
        setLoginError('Senha incorreta. Tente novamente.');
      }
    } catch {
      setLoginError('Erro ao conectar com o servidor.');
    }
  }

  async function handleSend() {
    if (!inputText.trim() || isLoading) return;
    
    const userMsg = inputText;
    addUserMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await res.json();

      if (data.error) {
        addAIMessage(`❌ Erro: ${data.error}`);
      } else {
        let replyText = data.reply;
        
        // Se foi uma ação de sucesso, adicionar emoji
        if (data.action === 'edit_content') {
          replyText = `✏️ ${replyText}`;
        } else if (data.action === 'add_portfolio') {
          replyText = `📸 ${replyText}`;
        } else if (data.action === 'remove_portfolio') {
          replyText = `🗑️ ${replyText}`;
        } else if (data.action === 'list_portfolio' && data.actionResult?.portfolio) {
          const items = data.actionResult.portfolio;
          replyText += '\n\n📋 Ensaios atuais:\n' + items.map((p, i) => `${i + 1}. ${p.title}`).join('\n');
        }

        addAIMessage(replyText);
      }
    } catch {
      addAIMessage('❌ Erro de conexão com o servidor. Verifique se o backend está rodando.');
    }

    setIsLoading(false);
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    addUserMessage(`📎 Enviando imagem: ${file.name}`);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        addAIMessage(`✅ Imagem enviada com sucesso!\nURL da imagem: ${data.imageUrl}\n\nAgora me diga o título do ensaio para essa imagem.`);
      } else {
        addAIMessage(`❌ Erro no upload: ${data.error}`);
      }
    } catch {
      addAIMessage('❌ Erro ao enviar imagem.');
    }

    setIsLoading(false);
    e.target.value = '';
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setToken('');
    setMessages([]);
  }

  // Tela de Login
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">
            <Lock size={48} />
          </div>
          <h1>Casa Carnieri</h1>
          <p>Painel Administrativo</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            {loginError && <p className="login-error">{loginError}</p>}
            <button type="submit" className="login-btn">
              <LogIn size={18} />
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tela principal de Chat
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
          <div className="menu-item" onClick={() => window.open('https://casacarnieri.com.br', '_blank')}>
            <Layout size={20} />
            <span>Ver Site</span>
          </div>
          <div className="menu-item" onClick={handleLogout}>
            <Settings size={20} />
            <span>Sair</span>
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
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gemini • Online e pronto para editar</p>
            </div>
          </div>
          <button className="icon-btn" onClick={handleLogout}>
            <MoreVertical size={20} />
          </button>
        </header>

        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-content typing-indicator">
                <Loader2 size={16} className="spin" />
                <span>Processando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-box">
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Digite aqui sua alteração (ex: Mudar texto do sobre...)" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()}>
              <Image size={20} />
            </button>
            <button className="icon-btn send-btn" onClick={handleSend} disabled={isLoading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
