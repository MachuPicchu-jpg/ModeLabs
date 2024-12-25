import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Code, BookOpen, Brain, Send, Sparkles, Globe } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';


const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate(); // 使用 useNavigate 钩子
  const [customRequirement, setCustomRequirement] = useState('');
  const [activeScenario, setActiveScenario] = useState(null);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commonScenarios = [
    {
      id: 'chat',
      icon: MessageSquare,
      title: t('日常对话'),
      description: t('寻找最适合日常交流、问答的AI助手'),
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      hoverColor: 'hover:bg-teal-50/50',
      borderColor: 'border-teal-100',
    },
    {
      id: 'coding',
      icon: Code,
      title: t('编程开发'),
      description: t('代码补全、Debug、技术咨询的最佳模型'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-50/50',
      borderColor: 'border-blue-100',
    },
    {
      id: 'study',
      icon: BookOpen,
      title: t('学习辅导'),
      description: t('课程辅导、知识解答、论文写作的AI工具'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-50/50',
      borderColor: 'border-purple-100',
    },
    {
      id: 'research',
      icon: Brain,
      title: t('专业研究'),
      description: t('科研分析、专业领域问题的解决方案'),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-50/50',
      borderColor: 'border-indigo-100',
    },
  ];

  const handleScenarioClick = (scenario) => {
    setActiveScenario(scenario);
    let recommendation = '';
  
    switch (scenario.id) {
      case 'chat':
        recommendation = t(
          '根据您的需求，我们推荐：\n1. deepseek-ai/DeepSeek-V2.5\n2. Qwen/Qwen2-VL-72B-Instruct\n3. meta-llama/Llama-3.3-70B-Instruct'
        );
        break;
      case 'coding':
        recommendation = t(
          '根据您的需求，我们推荐：\n1. deepseek-ai/DeepSeek-V2.5\n2. Qwen/Qwen2-VL-72B-Instruct\n3. meta-llama/Llama-3.3-70B-Instruct'
        );
        break;
      case 'study':
        recommendation = t(
          '根据您的需求，我们推荐：\n1. Qwen/Qwen2-VL-72B-Instruct\n2. meta-llama/Llama-3.3-70B-Instruct\n3. deepseek-ai/DeepSeek-V2.5'
        );
        break;
      case 'research':
        recommendation = t(
          '根据您的需求，我们推荐：\n1. Qwen/Qwen2-VL-72B-Instruct\n2. deepseek-ai/DeepSeek-V2.5\n3. meta-llama/Llama-3.3-70B-Instruct'
        );
        break;
      default:
        recommendation = t('没有找到合适的推荐');
    }
  
    setMessages([
      {
        id: Date.now(),
        type: 'system',
        content: recommendation,
      },
    ]);
    setIsCustomInput(false);
  };
  

  const handleCustomInputClick = () => {
    setIsCustomInput(true);
    setActiveScenario(null);
    setMessages([
      {
        id: Date.now(),
        type: 'system',
        content: t(
          '请描述您的具体需求，我们将为您推荐最合适的AI模型。您可以描述：\n• 您想要解决的具体问题\n• 您的使用场景\n• 特殊的性能要求\n• 预算考虑'
        ),
      },
    ]);
  };

  const handleSend = () => {
    if (!customRequirement.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        content: customRequirement,
      },
    ]);

    setCustomRequirement('');
    setIsLoading(true);

    // 模拟系统回复
    setTimeout(() => {
      const userMessage = customRequirement;
      let systemReply = '';

      if (userMessage.includes('I want a gpt that can help me plan a space-themed birthday party')) {
        systemReply = 'It looks like you need assistance in planning a space-themed birthday party. Could you share more details like the age group of the attendees or any specific ideas you have in mind? ';
      }
      if (userMessage.includes('我想要一个代码补全的gpt')) {
        systemReply = '你是想要一个可以帮助你完成代码的AI助手吗？如果是的话，你可以告诉我编程语言和任务，我会尽力提供支持。';
      } else if (userMessage.includes('python for ml')) {
        systemReply = '你对机器学习的需求是什么呢？你更希望代码执行速度快一些，还是希望模型的准确性更高一些？';
        navigate('/recommendation'); 
      } else if(userMessage.includes('我想要更高的准确率')) {
        systemReply = '好的，我已经为你找到满足你要求的模型。';

      }

      
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          content: systemReply,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Layout>
    <div className="min-h-screen bg-[#FAFAFA] font-sans relative">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/80 -z-10" />
      
      <div className="container mx-auto px-4 py-12 relative">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
          <div className="flex items-center p-1 gap-1">
            <Globe className="w-4 h-4 text-gray-400" />
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                i18n.language === 'en'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </button>
            <button
              className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                i18n.language === 'zh'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => i18n.changeLanguage('zh')}
            >
              中
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20" />
              <Sparkles className="w-12 h-12 text-blue-600 relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            {t('找到最适合你的AI模型')}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('选择您的使用场景，或描述具体需求，我们将为您推荐最合适的AI模型。')}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {commonScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  onClick={() => handleScenarioClick(scenario)}
                  className={`group cursor-pointer transition-all duration-300 rounded-2xl
                    bg-white border ${scenario.borderColor} ${scenario.hoverColor}
                    hover:shadow-lg hover:shadow-gray-100/50 ${
                      activeScenario?.id === scenario.id
                        ? `${scenario.bgColor} border-2`
                        : 'border'
                    }`}
                >
                  <div className="p-8">
                    <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center
                      ${scenario.bgColor} ${scenario.color} transition-transform
                      group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-xl font-semibold mb-3 ${scenario.color}`}>
                      {scenario.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {scenario.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Messages Area */}
            {messages.length > 0 && (
              <div className="pt-8 px-8 max-h-[500px] overflow-y-auto scrollbar-thin 
                            scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <TransitionGroup className="space-y-6">
                  {messages.map((message) => (
                    <CSSTransition key={message.id} timeout={300} classNames="fade">
                      <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} 
                                    transition-all duration-300`}>
                        <div
                          className={`group max-w-[80%] transition-all ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 text-gray-900'
                          } rounded-2xl px-6 py-4 shadow-sm hover:shadow`}
                        >
                          <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                            {message.content}
                          </pre>
                          
                          {/* Timestamp */}
                          <div className={`mt-2 text-xs ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </CSSTransition>
                  ))}
                  {isLoading && (
                    <CSSTransition key="loading" timeout={300} classNames="fade">
                      <div className="flex justify-start">
                        <div className="max-w-[80%] bg-gray-50 rounded-2xl px-6 py-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="relative w-5 h-5">
                              <div className="absolute inset-0 rounded-full border-2 border-blue-600/20 
                                            border-t-blue-600 animate-spin" />
                              <div className="absolute inset-1 rounded-full border-2 border-blue-400/20 
                                            border-t-blue-400 animate-spin-reverse" />
                            </div>
                            <span className="text-gray-500 font-medium">
                              {t('正在生成推荐...')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CSSTransition>
                  )}
                </TransitionGroup>
                <div ref={messagesEndRef} className="h-8" />
              </div>
            )}

            {/* Input Area */}
            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              {!messages.length && !isCustomInput ? (
                <div
                  onClick={handleCustomInputClick}
                  className="group cursor-pointer rounded-xl bg-white p-6 border border-gray-100
                           hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-blue-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">
                      {t('没有找到合适的场景？点击这里描述您的具体需求')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Input area with buttons */}
                  <div className="flex items-center gap-2 p-4">
                    {/* Auto-resizing textarea */}
                    <div className="relative flex-grow">
                      <div
                        className="invisible h-0 overflow-hidden whitespace-pre-wrap break-words pr-4 text-base"
                        style={{
                          width: 'calc(100% - 1rem)'
                        }}
                      >
                        {customRequirement + ' '}
                      </div>
                      <textarea
                        className="absolute top-0 w-full resize-none bg-transparent
                                text-gray-900 text-base placeholder-gray-400
                                focus:outline-none overflow-hidden"
                        style={{
                          height: 'var(--textarea-height, 24px)',
                          minHeight: '24px',
                          maxHeight: '200px'
                        }}
                        placeholder={t('输入您的需求...')}
                        value={customRequirement}
                        onChange={(e) => {
                          const scrollHeight = e.target.scrollHeight;
                          document.documentElement.style.setProperty(
                            '--textarea-height',
                            `${Math.min(200, Math.max(24, scrollHeight))}px`
                          );
                          setCustomRequirement(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                    </div>

                    {/* Action buttons - only show when there's input */}
                    {customRequirement.trim() && (
                      <div className="flex items-center gap-2 ml-2">
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => {/* Handle attachment */}}
                        >
                          <svg 
                            className="w-5 h-5" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={handleSend}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom info bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>回车发送，Shift + 回车换行</span>
                      {customRequirement.length > 0 && (
                        <span>{customRequirement.length} / 500</span>
                      )}
                    </div>
                    <div>
                      {!customRequirement.trim() && (
                        <span className="text-gray-400">
                          您可以描述您的具体需求，我们将为您推荐最合适的AI模型
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="flex justify-center gap-6">
            {[
              { text: t('已评估 100+ AI模型'), icon: '🎯' },
              { text: t('整合 20+ 评估机构数据'), icon: '📊' },
              { text: t('服务 10,000+ 用户'), icon: '🚀' },
            ].map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-6 py-3 bg-white rounded-xl
                         border border-gray-100 hover:border-blue-200 hover:shadow-lg 
                         hover:shadow-blue-50 transition-all cursor-default"
              >
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default WelcomePage;