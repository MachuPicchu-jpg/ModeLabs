import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Code, BookOpen, Brain, Send } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './WelcomePage.css'; // 导入自定义样式和动画
import { useTranslation } from 'react-i18next';

const WelcomePage = () => {
  const { t, i18n } = useTranslation();

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
      recommendation: t(
        '根据您的需求，我们推荐：\n1. Claude 3.5 - 最自然的对话体验\n2. GPT-4 - 强大的通用对话能力\n3. Gemini Pro - 优秀的多模态交互'
      ),
    },
    {
      id: 'coding',
      icon: Code,
      title: t('编程开发'),
      description: t('代码补全、Debug、技术咨询的最佳模型'),
      recommendation: t(
        '根据您的需求，我们推荐：\n1. GitHub Copilot - 代码补全的最佳选择\n2. Claude 3.5 - 优秀的代码解释能力\n3. CodeLlama - 专注于代码生成的开源模型'
      ),
    },
    {
      id: 'study',
      icon: BookOpen,
      title: t('学习辅导'),
      description: t('课程辅导、知识解答、论文写作的AI工具'),
      recommendation: t(
        '根据您的需求，我们推荐：\n1. Claude 3.5 - 最适合学术写作\n2. GPT-4 - 优秀的知识解答能力\n3. Anthropic Claude 2 - 出色的推理能力'
      ),
    },
    {
      id: 'research',
      icon: Brain,
      title: t('专业研究'),
      description: t('科研分析、专业领域问题的解决方案'),
      recommendation: t(
        '根据您的需求，我们推荐：\n1. GPT-4 - 最强大的推理能力\n2. Claude 3.5 - 优秀的专业领域理解\n3. PaLM 2 - 良好的科研文献理解'
      ),
    },
  ];

  const handleScenarioClick = (scenario) => {
    setActiveScenario(scenario);
    setMessages([
      {
        id: Date.now(),
        type: 'system',
        content: scenario.recommendation,
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
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          content: t(
            '根据您的描述，我们推荐：\n1. [具体推荐模型] - [推荐理由]\n2. [替代方案] - [方案优势]\n3. [其他选择] - [特点说明]'
          ),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  // 切换语言
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="container mx-auto px-4 py-12">
        {/* 语言切换 */}
        <div className="flex justify-end mb-4">
          <button
            className={`px-4 py-2 text-sm ${
              i18n.language === 'en' ? 'text-blue-600 font-bold' : 'text-gray-600'
            }`}
            onClick={() => switchLanguage('en')}
          >
            English
          </button>
          <button
            className={`px-4 py-2 text-sm ${
              i18n.language === 'zh' ? 'text-blue-600 font-bold' : 'text-gray-600'
            }`}
            onClick={() => switchLanguage('zh')}
          >
            中文
          </button>
        </div>

        {/* 欢迎标题 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
            {t('找到最适合你的AI模型')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('选择您的使用场景，或描述具体需求，我们将为您推荐最合适的AI模型。')}
          </p>
        </div>

        {/* 主体内容区域 */}
        <div className="max-w-4xl mx-auto">
          {/* 场景选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {commonScenarios.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={scenario.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg rounded-lg p-6
                                bg-white border ${
                                  activeScenario?.id === scenario.id
                                    ? 'border-blue-500 shadow-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                  onClick={() => handleScenarioClick(scenario)}
                >
                  <Icon className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-gray-500 text-sm">{scenario.description}</p>
                </div>
              );
            })}
          </div>

          {/* 自定义输入区域 */}
          <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
            {/* 消息区域 */}
            {messages.length > 0 && (
              <div className="mb-6 space-y-4 max-h-[400px] overflow-y-auto">
                <TransitionGroup>
                  {messages.map((message) => (
                    <CSSTransition key={message.id} timeout={300} classNames="fade">
                      <div
                        className={`rounded-2xl p-4 max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white ml-auto'
                            : 'bg-gray-100 border border-gray-200 text-gray-800'
                        } shadow-sm`}
                      >
                        <pre className="whitespace-pre-wrap font-sans text-base">
                          {message.content}
                        </pre>
                      </div>
                    </CSSTransition>
                  ))}
                  {isLoading && (
                    <CSSTransition key="loading" timeout={300} classNames="fade">
                      <div className="rounded-2xl p-4 max-w-[80%] bg-gray-100 border border-gray-200 text-gray-800 shadow-sm">
                        <div className="flex items-center">
                          <div className="loader mr-2"></div>
                          <span>{t('正在生成推荐...')}</span>
                        </div>
                      </div>
                    </CSSTransition>
                  )}
                </TransitionGroup>
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* 输入区域 */}
            <div
              className={`relative transition-all duration-300 ${
                !messages.length && !isCustomInput ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {!messages.length && !isCustomInput ? (
                <div
                  className="p-4 text-center text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCustomInputClick}
                >
                  {t('没有找到合适的场景？点击这里描述您的具体需求')}
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    className="w-full min-h-[80px] p-4 rounded-lg border border-gray-200 
                                 bg-white resize-none focus:outline-none focus:ring-2 
                                 focus:ring-blue-500 placeholder-gray-400"
                    placeholder={t(
                      '请描述您的具体需求，例如："我需要一个能帮助我写Python代码的AI助手"...'
                    )}
                    value={customRequirement}
                    onChange={(e) => setCustomRequirement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-4">
                    <button
                      className={`p-2 rounded-full transition-colors ${
                        customRequirement.trim()
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={handleSend}
                      disabled={!customRequirement.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 信任指标 */}
        <div className="mt-16 text-center">
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <div>{t('已评估 100+ AI模型')}</div>
            <div>{t('整合 20+ 评估机构数据')}</div>
            <div>{t('服务 10,000+ 用户')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
