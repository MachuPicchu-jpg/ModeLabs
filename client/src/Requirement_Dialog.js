import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Upload, Sparkles, XCircle } from 'lucide-react';

const RequirementPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '欢迎使用AI模型推荐系统！我看到您选择了"编程开发"场景。让我们通过简单的对话，更好地了解您的具体需求。',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      content: inputText,
      timestamp: new Date()
    }]);

    setInputText('');
    
    // 模拟系统回复
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'system',
        content: getSystemResponse(inputText),
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const getSystemResponse = (userInput) => {
    // 这里是模拟的系统回复逻辑
    const responses = [
      '您需要AI模型主要用于哪种编程语言？',
      '您是需要代码补全、代码生成，还是代码优化方面的帮助？',
      '您的项目规模大概是怎样的？是个人项目还是团队协作？'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setIsAnalyzing(true);
      // 模拟文件分析过程
      setTimeout(() => {
        setIsAnalyzing(false);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'system',
          content: `我已经分析了您上传的${file.name}。这看起来是一个${file.type.split('/')[1]}文件，大小为${(file.size/1024).toFixed(2)}KB。请告诉我您想要用AI模型解决什么具体问题？`,
          timestamp: new Date()
        }]);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回
          </button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">会话进度: 1/3</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              开始推荐
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div 
                    className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-3xl mx-auto">
            {uploadedFile && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {isAnalyzing ? '正在分析...' : uploadedFile.name}
                  </span>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="relative">
              <textarea
                className="w-full rounded-lg border border-gray-200 pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                placeholder="描述您的具体需求..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <label className="cursor-pointer p-2 rounded-lg hover:bg-gray-100">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <button
                  className={`p-2 rounded-lg ${
                    inputText.trim()
                      ? 'text-blue-500 hover:bg-blue-50'
                      : 'text-gray-300'
                  }`}
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementPage;