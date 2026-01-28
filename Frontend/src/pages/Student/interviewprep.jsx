import React, { useState } from 'react';
import { Clock, Target, TrendingUp, Code, Users, Lightbulb, CheckCircle, Circle, BarChart3, Sparkles, FileText, MessageSquare, Play, Building2, Video, Timer, UserPlus, Briefcase, Calendar, DollarSign, AlertTriangle, Award, Download, Mail, Eye, Camera, ChevronRight, Star, BookOpen, ThumbsUp } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { Monitor, Server, Layers, Smartphone, Settings, Cloud, Brain, Database, Shield, CheckSquare,  X,Package, Cpu, Zap, CircuitBoard, Wifi, Activity, Stethoscope, Car, Factory } from 'lucide-react';
import BackBar from '../../components/backbutton';

// Main Interview Prep Component with all features
const InterviewPrep = () => {
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [recordingActive, setRecordingActive] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  
  const practiceModules = [
    {
      title: "Common Interview Questions",
      description: "Practice answering the most frequently asked questions across industries",
      questions: 117,
      duration: "30 min",
      icon: MessageSquare,
      link : "/interviewprep/start-common-questions"
    },
    {
      title: "Coding & Technical Questions",
      description: "Solve real coding problems from top tech companies",
      questions: 100,
      duration: "45 min",
      icon: Code,
      link:"/interviewprep/start-coding-questions"
    }
  ];

  const aiFeatures = [
    {
      title: "AI Mock Interview",
      description: "Experience realistic interview simulations with instant feedback",
      badge: "Popular",
      icon: Sparkles,
      enabled: false,
    },
    {
      title: "Resume-based Questions",
      description: "Get personalized questions generated from your resume",
      badge: "New",
      icon: FileText,
      enabled: false,
    },
    {
      title: "Answer Feedback & Scoring",
      description: "Receive detailed analysis and improvement suggestions",
      badge: null,
      icon: BarChart3,
      enabled: false,
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab practiceModules={practiceModules} aiFeatures={aiFeatures} />;
      case 'company-prep':
        return <CompanySpecificPrep selectedCompany={selectedCompany} setSelectedCompany={setSelectedCompany} />;
      case 'industry-tracks':
        return <IndustrySpecificTracks />;
      case 'mistakes':
        return <CommonMistakes />;
      case 'body-language':
        return <BodyLanguageGuide />;
      case 'email-templates':
        return <FollowUpTemplates />;
      default:
        return <OverviewTab practiceModules={practiceModules} aiFeatures={aiFeatures} />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'company-prep', label: 'Company Prep', icon: Building2 },
    { id: 'industry-tracks', label: 'Industry Tracks', icon: Briefcase },
    { id: 'mistakes', label: 'Common Mistakes', icon: AlertTriangle },
    { id: 'body-language', label: 'Body Language', icon: Eye },
    { id: 'email-templates', label: 'Email Templates', icon: Mail },
  ];

  return (

    <div className="min-h-screen bg-gray-50">
      <BackBar/>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Interview Preparation Hub</h1>
          <p className="text-sm sm:text-base text-gray-600">Complete preparation system with expert resources and AI tools</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Mobile/Tablet dropdown menu */}
          <div className="lg:hidden">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Features</h3>
              <div className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  
  );
};

// 1. Overview Tab
const OverviewTab = ({ practiceModules, aiFeatures }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-5">Practice Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practiceModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gray-100 mr-3">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{module.questions} questions</span>
                    <span className="text-gray-300">•</span>
                    <span>{module.duration}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">{module.description}</p>
                <button onClick={()=>navigate(module.link)} className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Start Practice
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-5">AI-Powered Tools</h2>
        <div className="space-y-4">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 mr-4">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                        {feature.badge && (
                          <span className="text-xs font-medium bg-gray-900 text-white px-2 py-0.5 rounded">
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    disabled={!feature.enabled}
                    className={`ml-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-all
                      ${feature.enabled
                        ? "text-gray-700 hover:bg-gray-50 opacity-100 cursor-pointer"
                        : "text-gray-400 opacity-50 cursor-not-allowed"}
                    `}
                  >
                    <Play className="w-4 h-4" />
                    Try Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. Company-Specific Prep
const CompanySpecificPrep = ({ selectedCompany, setSelectedCompany }) => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  
  const companies = [
    {
      name: "Google",
      logo: "https://imgs.search.brave.com/qLV18Yvc_FQC_ulFIpahpxR8FHmAYjTiryMcK4mqnpY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9w/YXBlcmN1dC8xMjAw/L2dvb2dsZS1sb2dv/LmpwZw",
      difficulty: "Very Hard",
      rounds: 5,
      focus: ["Data Structures", "Algorithms", "System Design"],
      tips: "Focus on scalability and clean code. Expect behavioral questions about teamwork.",
      color: "bg-blue-500"
    },
    {
      name: "Amazon",
      logo: "https://imgs.search.brave.com/0fjKkMcTQ_yYeBHZi6ELqKTqTWUASi0ZMAfXVE75CYA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y2l0eXBuZy5jb20v/cHVibGljL3VwbG9h/ZHMvcHJldmlldy9i/bGFjay1zcXVhcmUt/bW9iaWxlLWFwcC1h/bWF6b24tbG9nby1p/Y29uLTcwMTc1MTY5/NTEzMzM4MGZyc3Fw/cm90eHUucG5n",
      difficulty: "Hard",
      rounds: 4,
      focus: ["Leadership Principles", "System Design", "Coding"],
      tips: "Study all 16 leadership principles. Use STAR method for behavioral questions.",
      color: "bg-orange-500"
    },
    {
      name: "Microsoft",
      logo: "https://imgs.search.brave.com/_opwAgY4GyasSwE70tgklfC55bl3UxFFcWIu1E_Dwa4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L21pY3Jvc29mdC1s/b2dvLWltYWdlLTIz/LnBuZw",
      difficulty: "Hard",
      rounds: 4,
      focus: ["Problem Solving", "System Design", "Culture Fit"],
      tips: "Emphasize collaboration and growth mindset. Technical depth is important.",
      color: "bg-blue-600"
    },
    {
      name: "Meta",
      logo: "https://imgs.search.brave.com/M2d9MKJXnPJxcO00MkiF-iCKZYukXWVUl923nxOPCCo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9ibG9n/LmxvZ29teXdheS5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMTEvbWV0YS1s/b2dvLTEwMjR4OTg2/LnBuZw",
      difficulty: "Very Hard",
      rounds: 5,
      focus: ["Coding", "System Design", "Product Sense"],
      tips: "Move fast, be bold. Show impact-driven thinking and product understanding.",
      color: "bg-blue-700"
    },
    {
      name: "Apple",
      logo: "https://imgs.search.brave.com/tFiV6AzclY4Hn9MT3NfR9BdvESgJ9CDy9-daDlPNrnU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/ZnJlZXBuZ2xvZ29z/LmNvbS91cGxvYWRz/L2FwcGxlLWxvZ28t/cG5nL2FwcGxlLWxv/Z28taWNvbi0xNi5w/bmc",
      difficulty: "Hard",
      rounds: 4,
      focus: ["Technical Excellence", "Attention to Detail", "Innovation"],
      tips: "Quality over quantity. Show passion for products and attention to detail.",
      color: "bg-gray-800"
    },
    {
      name: "Netflix",
      logo: "https://imgs.search.brave.com/bG-xPD1-pu6r_82Ng7Quwo5_-vgop94F01k_siJATSY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMTcv/Mzk2LzgxNC9zbWFs/bC9uZXRmbGl4LW1v/YmlsZS1hcHBsaWNh/dGlvbi1sb2dvLWZy/ZWUtcG5nLnBuZw",
      difficulty: "Very Hard",
      rounds: 6,
      focus: ["Culture Fit", "Technical Excellence", "Independent Thinking"],
      tips: "Culture is paramount. Be prepared for intense cultural discussions.",
      color: "bg-red-600"
    },{
  name: "Tesla",
  logo: "T",
  difficulty: "Very Hard",
  rounds: 5,
  focus: ["Embedded Systems", "Problem Solving", "Innovation"],
  tips: "Be ready for rapid-fire technical questions and real-world engineering tradeoffs.",
  color: "bg-red-500"
},
{
  name: "Uber",
  logo: "https://imgs.search.brave.com/YXLFzkhvIwa9ajA8SnSMeEF7dNm0iFu-XATUf2olqsM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi93ZWIt/MTgzMjgyOTMxLmpw/Zw",
  difficulty: "Hard",
  rounds: 4,
  focus: ["System Design", "Scalability", "APIs"],
  tips: "Focus on distributed systems and handling large-scale real-time data.",
  color: "bg-black"
},
{
  name: "Airbnb",
  logo: "https://imgs.search.brave.com/yyug71OkbQF5cxqbjap3yrSPzDLi5r-HjvNAXGZcpZU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE2/LzEwL2FpcmJuYi1s/b2dvLTAucG5n",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Frontend Architecture", "System Design", "Culture Fit"],
  tips: "Strong emphasis on culture and product thinking.",
  color: "bg-pink-500"
},
{
  name: "Stripe",
  logo: "https://imgs.search.brave.com/OEp3NdOsjSOJJ97S0tGCVCZYoJf6sgnOGHlCCXvXQhQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuY2RubG9nby5j/b20vbG9nb3Mvcy85/OS9zdHJpcGVfdGh1/bWIucG5n",
  difficulty: "Very Hard",
  rounds: 5,
  focus: ["APIs", "Payments", "System Design"],
  tips: "Expect deep technical discussions and clean API design questions.",
  color: "bg-indigo-600"
},
{
  name: "LinkedIn",
  logo: "https://imgs.search.brave.com/FWdw2aGz0wyZa971we15DklsJAvxjzg4VKsFMqM8KYQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjMv/OTg2LzU2OC9zbWFs/bC9saW5rZWRpbi1s/b2dvLWxpbmtlZGlu/LWxvZ28tdHJhbnNw/YXJlbnQtbGlua2Vk/aW4taWNvbi10cmFu/c3BhcmVudC1mcmVl/LWZyZWUtcG5nLnBu/Zw",
  difficulty: "Hard",
  rounds: 4,
  focus: ["System Design", "Data Modeling", "Behavioral"],
  tips: "Be prepared to discuss scalable social platforms and data pipelines.",
  color: "bg-blue-700"
},
{
  name: "Salesforce",
  logo: "https://imgs.search.brave.com/REIrvqWUv7wJk5mYngaayNnzEvDgIrj6g-rZkrWIevg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzgxLzQ1/LzQ5LzgxNDU0OWMz/OTk0ZmFkNjUxYjE2/NDM2NDc1YjVkNDBm/LmpwZw",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Cloud Architecture", "Apex", "System Design"],
  tips: "Strong focus on enterprise systems and customer-centric solutions.",
  color: "bg-sky-500"
},
{
  name: "Oracle",
  logo: "https://imgs.search.brave.com/NiboZG35JUkM91k0uvjRY3hsdxuDZCYnUHrxL-HkfMo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvMjMvT3Jh/Y2xlLUxvZ28tUE5H/LUZpbGUucG5n",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Databases", "System Design", "Backend Engineering"],
  tips: "Deep knowledge of databases and large-scale systems is expected.",
  color: "bg-red-700"
},
{
  name: "Flipkart",
  logo: "https://imgs.search.brave.com/ZEXxYhVYbeOlxO6xeLExte4n0ciC1ATJ2lcXASj16pc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzI4LzIvZmxpcGth/cnQtbG9nby1wbmdf/c2Vla2xvZ28tMjg0/NDIyLnBuZw",
  difficulty: "Hard",
  rounds: 4,
  focus: ["System Design", "Scalability", "E-commerce"],
  tips: "Expect questions on high-traffic systems, order processing, and scaling.",
  color: "bg-yellow-500"
},
{
  name: "Swiggy",
  logo: "https://imgs.search.brave.com/fF4LuHoy6k2byZ9MmY5NWA6ugBKI4LWdVa6Fc_pvt04/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzUv/MTk1LzM5NC9zbWFs/bC9zd2lnZ3ktbG9n/by1yb3VuZGVkLXNx/dWFyZS1nbG9zc3kt/aWNvbi13aXRoLXRy/YW5zcGFyZW50LWJh/Y2tncm91bmQtZnJl/ZS1wbmcucG5n",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Distributed Systems", "Real-time Tracking", "APIs"],
  tips: "Be prepared for system design around delivery, maps, and logistics.",
  color: "bg-orange-500"
},
{
  name: "Zomato",
  logo: "Z",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Scalability", "Product Sense", "Backend"],
  tips: "Focus on handling traffic spikes and optimizing user experience.",
  color: "bg-red-500"
},
{
  name: "Paytm",
  logo: "P",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Payments", "Security", "Scalable Systems"],
  tips: "Expect questions on payment gateways, security, and reliability.",
  color: "bg-blue-500"
},
{
  name: "PhonePe",
  logo: "P",
  difficulty: "Hard",
  rounds: 4,
  focus: ["UPI Systems", "Distributed Systems", "Security"],
  tips: "Deep understanding of UPI flows and transaction consistency is important.",
  color: "bg-purple-600"
},
{
  name: "Razorpay",
  logo: "R",
  difficulty: "Very Hard",
  rounds: 5,
  focus: ["Payments", "APIs", "System Design"],
  tips: "Be ready for low-level design and payment workflow questions.",
  color: "bg-indigo-600"
},
{
  name: "Ola",
  logo: "O",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Real-time Systems", "Maps", "Scalability"],
  tips: "Think about ride matching, location updates, and surge pricing.",
  color: "bg-green-600"
},
{
  name: "Byju’s",
  logo: "B",
  difficulty: "Medium",
  rounds: 3,
  focus: ["EdTech", "Scalability", "Frontend"],
  tips: "Focus on content delivery, user engagement, and learning flows.",
  color: "bg-purple-500"
},
{
  name: "Meesho",
  logo: "M",
  difficulty: "Medium",
  rounds: 3,
  focus: ["E-commerce", "Backend", "Product Thinking"],
  tips: "Expect practical product and backend questions.",
  color: "bg-pink-500"
},
{
  name: "CRED",
  logo: "C",
  difficulty: "Hard",
  rounds: 4,
  focus: ["FinTech", "Security", "Backend"],
  tips: "Strong focus on secure systems and clean architecture.",
  color: "bg-black"
},
{
  name: "Dream11",
  logo: "D",
  difficulty: "Hard",
  rounds: 4,
  focus: ["High Traffic Systems", "Caching", "Backend"],
  tips: "Be ready for peak-load traffic and real-time updates.",
  color: "bg-red-600"
},
{
  name: "Udaan",
  logo: "U",
  difficulty: "Medium",
  rounds: 3,
  focus: ["B2B Commerce", "Scalability", "APIs"],
  tips: "Focus on order workflows and vendor management systems.",
  color: "bg-blue-700"
},
{
  name: "Freshworks",
  logo: "F",
  difficulty: "Medium",
  rounds: 3,
  focus: ["SaaS", "System Design", "APIs"],
  tips: "Expect SaaS architecture and customer-centric design questions.",
  color: "bg-green-500"
},
{
  name: "Groww",
  logo: "https://imgs.search.brave.com/G0EPtXVmENsziEq6n6yTJf0aZzk_Wf_zyqrYj3oIBjk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQzLzIvZ3Jvd3ct/bG9nby1wbmdfc2Vl/a2xvZ28tNDMwNTM2/LnBuZw",
  difficulty: "Medium",
  rounds: 3,
  focus: ["FinTech", "Frontend", "APIs"],
  tips: "Emphasis on UX, reliability, and regulatory compliance.",
  color: "bg-green-600"
},
{
  name: "Postman",
  logo: "P",
  difficulty: "Hard",
  rounds: 4,
  focus: ["APIs", "Developer Tools", "System Design"],
  tips: "Expect API design and developer experience discussions.",
  color: "bg-orange-600"
},
{
  name: "Adobe",
  logo: "A",
  difficulty: "Medium",
  rounds: 3,
  focus: ["Frontend", "Creative Systems", "Product Thinking"],
  tips: "Emphasis on user experience and cross-team collaboration.",
  color: "bg-red-500"
},
{
  name: "IBM",
  logo: "I",
  difficulty: "Medium",
  rounds: 3,
  focus: ["Cloud", "Enterprise Systems", "AI Concepts"],
  tips: "Focus on enterprise use cases and problem-solving skills.",
  color: "bg-blue-800"
},
{
  name: "Spotify",
  logo: "S",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Data Engineering", "Scalability", "APIs"],
  tips: "Expect questions around streaming data and personalization.",
  color: "bg-green-600"
},
{
  name: "Twitter (X)",
  logo: "X",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Scalable Systems", "APIs", "Backend"],
  tips: "Think about real-time systems and performance bottlenecks.",
  color: "bg-black"
},
{
  name: "Pinterest",
  logo: "P",
  difficulty: "Medium",
  rounds: 3,
  focus: ["Frontend", "Product Sense", "APIs"],
  tips: "Product intuition and UX-driven thinking matter a lot.",
  color: "bg-red-600"
},
{
  name: "Snap",
  logo: "S",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Mobile Systems", "Realtime", "AR"],
  tips: "Be comfortable with mobile performance and real-time data.",
  color: "bg-yellow-400"
},
{
  name: "Zoom",
  logo: "Z",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Distributed Systems", "Networking", "Performance"],
  tips: "Expect questions on low-latency systems and scalability.",
  color: "bg-blue-500"
},
{
  name: "PayPal",
  logo: "P",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Payments", "Security", "System Design"],
  tips: "Security, reliability, and payment workflows are key.",
  color: "bg-blue-600"
},
{
  name: "Atlassian",
  logo: "A",
  difficulty: "Medium",
  rounds: 3,
  focus: ["System Design", "Collaboration Tools", "APIs"],
  tips: "Strong emphasis on teamwork and collaborative software.",
  color: "bg-blue-500"
},
{
  name: "Reddit",
  logo: "R",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Scalability", "Backend", "Caching"],
  tips: "Think about traffic spikes and content moderation systems.",
  color: "bg-orange-600"
},
{
  name: "Dropbox",
  logo: "D",
  difficulty: "Hard",
  rounds: 4,
  focus: ["Storage Systems", "Syncing", "System Design"],
  tips: "Expect deep dives into file systems and consistency models.",
  color: "bg-blue-600"
}

  ];
const visibleCompanies = showAll ? companies : companies.slice(0, 6);
 
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start mb-6">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 mr-3">
            <Building2 className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Company-Specific Preparation
            </h2>
            <p className="text-sm text-gray-600">
              Tailored insights and questions for your target companies
            </p>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCompanies.map((company, index) => (
            <div
              key={index}
              onClick={() => setSelectedCompany(company)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedCompany?.name === company.name
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-1"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <span className="text-xs text-gray-600">
                    {company.rounds} rounds
                  </span>
                </div>
              </div>

              <div className="text-xs font-medium text-orange-600 mb-2">
                {company.difficulty}
              </div>

              <div className="flex flex-wrap gap-1">
                {company.focus.slice(0, 2).map((focus, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {companies.length > 6 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showAll ? "Show Less" : "See More"}
            </button>
          </div>
        )}
      </div>

      {/* Selected Company Details */}
      {selectedCompany && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preparing for {selectedCompany.name}
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Key Focus Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCompany.focus.map((focus, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-700 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Pro Tips
                  </h4>
                  <p className="text-sm text-blue-800">
                    {selectedCompany.tips}
                  </p>
                </div>
              </div>
            </div>

            <button onClick={()=>navigate(`/interviewprep/${selectedCompany.name}`)
} className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Start {selectedCompany.name} Practice Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Industry-Specific Tracks
const IndustrySpecificTracks = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      name: "Software Development Engineer (SDE)",
      icon: Code,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      salary: "₹8-40 LPA",
      topics: ["DSA", "System Design", "OOP", "Problem Solving"],
      salaryBreakdown: {
        fresher: "₹8-12 LPA",
        midLevel: "₹15-25 LPA",
        senior: "₹28-40 LPA",
        lead: "₹45-70 LPA"
      },
      responsibilities: [
        "Design, develop, and maintain software applications",
        "Write clean, efficient, and well-documented code",
        "Participate in code reviews and mentor junior developers",
        "Collaborate with cross-functional teams to deliver features",
        "Optimize application performance and scalability",
        "Debug and resolve technical issues",
        "Contribute to architectural decisions"
      ],
      ctcBreakdown: "CTC typically includes base salary (70-80%), performance bonus (10-15%), stocks/ESOPs (5-10%), and benefits like health insurance, PF, gratuity (5-10%). Top tech companies offer higher stock components."
    },
    {
      name: "Frontend Developer",
      icon: Monitor,
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
      salary: "₹6-25 LPA",
      topics: ["React", "JavaScript", "CSS", "Web Performance"],
      salaryBreakdown: {
        fresher: "₹6-10 LPA",
        midLevel: "₹12-18 LPA",
        senior: "₹20-25 LPA",
        lead: "₹28-40 LPA"
      },
      responsibilities: [
        "Build responsive and interactive user interfaces",
        "Implement designs with pixel-perfect accuracy",
        "Optimize web applications for performance and accessibility",
        "Work closely with designers and backend developers",
        "Maintain and improve existing frontend codebases",
        "Ensure cross-browser compatibility",
        "Implement state management and routing solutions"
      ],
      ctcBreakdown: "CTC includes base salary (75-85%), variable pay (10-15%), and benefits. Startups may offer ESOPs. Remote-first companies often provide tech stipends and flexible benefits."
    },
    {
      name: "Backend Developer",
      icon: Server,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      salary: "₹7-30 LPA",
      topics: ["APIs", "Databases", "Node.js", "Microservices"],
      salaryBreakdown: {
        fresher: "₹7-11 LPA",
        midLevel: "₹14-22 LPA",
        senior: "₹25-30 LPA",
        lead: "₹35-50 LPA"
      },
      responsibilities: [
        "Design and develop server-side logic and APIs",
        "Manage database architecture and optimization",
        "Implement security and data protection measures",
        "Integrate third-party services and APIs",
        "Write efficient and scalable backend code",
        "Monitor and optimize server performance",
        "Collaborate with frontend teams for seamless integration"
      ],
      ctcBreakdown: "CTC composition: base salary (70-80%), annual bonus (10-15%), stocks in product companies (5-15%), and standard benefits. Backend roles often command premium in fintech and enterprise sectors."
    },
    {
      name: "Full Stack Developer",
      icon: Layers,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      salary: "₹8-35 LPA",
      topics: ["MERN", "REST APIs", "DevOps", "Cloud Services"],
      salaryBreakdown: {
        fresher: "₹8-12 LPA",
        midLevel: "₹15-24 LPA",
        senior: "₹28-35 LPA",
        lead: "₹40-60 LPA"
      },
      responsibilities: [
        "Develop end-to-end features from UI to database",
        "Build and maintain RESTful APIs",
        "Manage deployment and CI/CD pipelines",
        "Work on both client and server-side code",
        "Optimize application performance across the stack",
        "Handle database design and management",
        "Troubleshoot issues across the entire application"
      ],
      ctcBreakdown: "CTC typically split: base (70-75%), performance bonus (12-18%), ESOPs in startups (10-15%), benefits. Full-stack developers often receive higher compensation due to versatility."
    },
    {
      name: "AI / ML Engineer",
      icon: Brain,
      color: "bg-violet-50 text-violet-700 border-violet-200",
      salary: "₹12-50 LPA",
      topics: ["Deep Learning", "NLP", "TensorFlow", "PyTorch"],
      salaryBreakdown: {
        fresher: "₹12-18 LPA",
        midLevel: "₹22-35 LPA",
        senior: "₹40-50 LPA",
        lead: "₹60-100 LPA"
      },
      responsibilities: [
        "Design and implement machine learning models",
        "Train, validate and deploy ML models to production",
        "Perform data preprocessing and feature engineering",
        "Optimize model performance and accuracy",
        "Research and implement latest ML techniques",
        "Collaborate with data scientists and engineers",
        "Monitor model performance and retrain as needed"
      ],
      ctcBreakdown: "CTC structure: base salary (65-75%), signing bonus (5-10%), annual bonus (15-20%), stock options (10-20%). AI/ML roles command premium salaries, especially in big tech and research-focused companies."
    },
    {
      name: "Data Scientist",
      icon: Database,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      salary: "₹10-45 LPA",
      topics: ["Python", "Statistics", "ML Models", "Data Viz"],
      salaryBreakdown: {
        fresher: "₹10-15 LPA",
        midLevel: "₹18-30 LPA",
        senior: "₹35-45 LPA",
        lead: "₹50-80 LPA"
      },
      responsibilities: [
        "Analyze complex datasets to extract insights",
        "Build predictive models and statistical analyses",
        "Create data visualizations and dashboards",
        "Communicate findings to stakeholders",
        "Design and run A/B tests and experiments",
        "Collaborate with engineering teams to deploy models",
        "Identify trends and patterns in data"
      ],
      ctcBreakdown: "CTC includes base pay (70-75%), performance bonus (15-20%), stocks in product companies (10-15%). Analytics-heavy industries like fintech and e-commerce offer higher packages."
    },
    {
      name: "DevOps Engineer",
      icon: Settings,
      color: "bg-orange-50 text-orange-700 border-orange-200",
      salary: "₹9-35 LPA",
      topics: ["Docker", "Kubernetes", "CI/CD", "Terraform"],
      salaryBreakdown: {
        fresher: "₹9-14 LPA",
        midLevel: "₹16-25 LPA",
        senior: "₹28-35 LPA",
        lead: "₹40-55 LPA"
      },
      responsibilities: [
        "Build and maintain CI/CD pipelines",
        "Manage cloud infrastructure and deployments",
        "Implement monitoring and alerting systems",
        "Automate operational processes",
        "Ensure system reliability and uptime",
        "Manage containerization and orchestration",
        "Optimize infrastructure costs and performance"
      ],
      ctcBreakdown: "CTC breakdown: base salary (72-78%), retention bonus (12-18%), cloud certifications bonus (2-5%), benefits. Cloud-native companies offer competitive packages with learning budgets."
    },
    {
      name: "Cloud Engineer",
      icon: Cloud,
      color: "bg-sky-50 text-sky-700 border-sky-200",
      salary: "₹10-40 LPA",
      topics: ["AWS", "Azure", "GCP", "Cloud Architecture"],
      salaryBreakdown: {
        fresher: "₹10-15 LPA",
        midLevel: "₹18-28 LPA",
        senior: "₹32-40 LPA",
        lead: "₹45-65 LPA"
      },
      responsibilities: [
        "Design and implement cloud infrastructure solutions",
        "Migrate on-premise applications to cloud",
        "Optimize cloud costs and resource utilization",
        "Ensure security and compliance in cloud environments",
        "Manage multi-cloud or hybrid cloud architectures",
        "Implement disaster recovery and backup solutions",
        "Provide technical guidance on cloud best practices"
      ],
      ctcBreakdown: "CTC composition: base (70-75%), performance bonus (15-20%), certification incentives (2-5%), stocks/ESOPs (8-12%). Cloud engineers are in high demand with excellent growth trajectory."
    },
    {
      name: "Product Manager (Tech)",
      icon: Package,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      salary: "₹15-60 LPA",
      topics: ["Product Strategy", "Analytics", "Roadmaps", "User Research"],
      salaryBreakdown: {
        fresher: "₹15-22 LPA",
        midLevel: "₹25-40 LPA",
        senior: "₹45-60 LPA",
        lead: "₹70-120 LPA"
      },
      responsibilities: [
        "Define product vision and strategy",
        "Prioritize features and maintain product roadmap",
        "Conduct user research and gather requirements",
        "Work with engineering, design, and business teams",
        "Analyze product metrics and user feedback",
        "Make data-driven product decisions",
        "Present product updates to stakeholders"
      ],
      ctcBreakdown: "CTC typically includes base (60-70%), annual bonus (20-30%), ESOPs (10-20%). PM roles offer highest variable component tied to product success and company performance."
    },
    {
      name: "Cybersecurity Engineer",
      icon: Shield,
      color: "bg-red-50 text-red-700 border-red-200",
      salary: "₹9-38 LPA",
      topics: ["Network Security", "Pentesting", "SIEM", "IAM"],
      salaryBreakdown: {
        fresher: "₹9-14 LPA",
        midLevel: "₹17-26 LPA",
        senior: "₹30-38 LPA",
        lead: "₹42-60 LPA"
      },
      responsibilities: [
        "Identify and mitigate security vulnerabilities",
        "Conduct security assessments and penetration testing",
        "Monitor security incidents and respond to threats",
        "Implement security policies and procedures",
        "Manage security tools like SIEM and firewalls",
        "Conduct security awareness training",
        "Ensure compliance with security standards"
      ],
      ctcBreakdown: "CTC breakdown: base salary (75-80%), risk allowance (5-10%), certifications bonus (3-5%), performance bonus (10-15%). Financial services and healthcare sectors pay premium for security roles."
    },
    {
      name: "Data Analyst",
      icon: BarChart3,
      color: "bg-teal-50 text-teal-700 border-teal-200",
      salary: "₹5-20 LPA",
      topics: ["SQL", "Excel", "Tableau", "Power BI"],
      salaryBreakdown: {
        fresher: "₹5-8 LPA",
        midLevel: "₹10-15 LPA",
        senior: "₹16-20 LPA",
        lead: "₹22-35 LPA"
      },
      responsibilities: [
        "Extract and analyze data from various sources",
        "Create reports and dashboards for stakeholders",
        "Identify trends and patterns in business data",
        "Support data-driven decision making",
        "Perform ad-hoc analysis as requested",
        "Ensure data quality and accuracy",
        "Collaborate with business teams to understand requirements"
      ],
      ctcBreakdown: "CTC includes base pay (80-85%), performance bonus (10-15%), benefits. Entry-level friendly role with good growth potential into data science or analytics management."
    },
    {
      name: "Mobile App Developer",
      icon: Smartphone,
      color: "bg-pink-50 text-pink-700 border-pink-200",
      salary: "₹6-28 LPA",
      topics: ["React Native", "Flutter", "iOS", "Android"],
      salaryBreakdown: {
        fresher: "₹6-10 LPA",
        midLevel: "₹13-20 LPA",
        senior: "₹22-28 LPA",
        lead: "₹32-45 LPA"
      },
      responsibilities: [
        "Develop native or cross-platform mobile applications",
        "Implement mobile UI/UX designs",
        "Integrate with backend APIs and services",
        "Optimize app performance and battery usage",
        "Handle app store submissions and updates",
        "Debug and fix mobile-specific issues",
        "Ensure app works across different devices and OS versions"
      ],
      ctcBreakdown: "CTC structure: base (75-80%), app success bonus (10-15%), ESOPs in consumer apps (5-10%), benefits. Mobile developers are highly valued in consumer tech and fintech."
    },
    {
      name: "FinTech Engineer",
      icon: DollarSign,
      color: "bg-green-50 text-green-700 border-green-200",
      salary: "₹10-45 LPA",
      topics: ["Payment Systems", "Blockchain", "Security", "Financial APIs"],
      salaryBreakdown: {
        fresher: "₹10-16 LPA",
        midLevel: "₹20-32 LPA",
        senior: "₹36-45 LPA",
        lead: "₹50-75 LPA"
      },
      responsibilities: [
        "Build secure payment processing systems",
        "Integrate with banking and financial APIs",
        "Ensure compliance with financial regulations",
        "Implement fraud detection mechanisms",
        "Develop blockchain and cryptocurrency solutions",
        "Optimize transaction processing performance",
        "Handle sensitive financial data securely"
      ],
      ctcBreakdown: "CTC breakdown: base (65-70%), performance bonus (15-25%), stocks (10-20%). FinTech offers highest packages among specialized domains due to regulatory complexity and revenue impact."
    },
    {
      name: "QA / Test Engineer",
      icon: CheckSquare,
      color: "bg-lime-50 text-lime-700 border-lime-200",
      salary: "₹5-22 LPA",
      topics: ["Selenium", "Test Automation", "API Testing", "JIRA"],
      salaryBreakdown: {
        fresher: "₹5-8 LPA",
        midLevel: "₹10-16 LPA",
        senior: "₹18-22 LPA",
        lead: "₹25-35 LPA"
      },
      responsibilities: [
        "Design and execute test plans and test cases",
        "Automate testing processes using frameworks",
        "Perform functional, integration, and regression testing",
        "Identify, document, and track bugs",
        "Collaborate with developers to resolve issues",
        "Ensure quality standards are met before release",
        "Conduct performance and load testing"
      ],
      ctcBreakdown: "CTC includes base salary (80-85%), performance bonus (10-12%), benefits. Automation skills and SDET roles command higher packages than manual testing."
    },
    {
      name: "Business Analyst",
      icon: TrendingUp,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      salary: "₹6-25 LPA",
      topics: ["Requirements", "Process Modeling", "SQL", "Documentation"],
      salaryBreakdown: {
        fresher: "₹6-10 LPA",
        midLevel: "₹12-18 LPA",
        senior: "₹20-25 LPA",
        lead: "₹28-40 LPA"
      },
      responsibilities: [
        "Gather and document business requirements",
        "Bridge communication between business and tech teams",
        "Create process flows and documentation",
        "Analyze business processes and recommend improvements",
        "Facilitate meetings and workshops with stakeholders",
        "Validate solutions meet business needs",
        "Support project planning and execution"
      ],
      ctcBreakdown: "CTC composition: base (75-80%), performance bonus (12-18%), benefits. BA roles offer good work-life balance and transition paths into product management or consulting."
    }
  ];

  const RoleDetail = ({ role, onClose }) => {
    const Icon = role.icon;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl">
          <div className={`${role.color} p-6 rounded-t-2xl border-b-2`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{role.name}</h2>
                  <p className="text-lg font-semibold mt-1 opacity-80">{role.salary}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Salary Breakdown by Experience</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Fresher (0-2 years)</p>
                  <p className="text-xl font-bold text-gray-900">{role.salaryBreakdown.fresher}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Mid-Level (3-5 years)</p>
                  <p className="text-xl font-bold text-gray-900">{role.salaryBreakdown.midLevel}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Senior (6-8 years)</p>
                  <p className="text-xl font-bold text-gray-900">{role.salaryBreakdown.senior}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Lead (9+ years)</p>
                  <p className="text-xl font-bold text-gray-900">{role.salaryBreakdown.lead}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">CTC Composition</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed">{role.ctcBreakdown}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {role.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-900 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Key Skills & Topics</h3>
              <div className="flex flex-wrap gap-2">
                {role.topics.map((topic, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium border border-gray-300">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Career Tracks for India</h1>
          <p className="text-lg text-gray-600">Choose your path and start preparing for your dream role</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div 
                key={index} 
                className={`border-2 rounded-xl p-3 ${role.color} hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 mt-3 flex-1">
                    <h3 className="text-lg font-semibold leading-tight min-h-[56px]">
                      {role.name}
                    </h3>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 opacity-75">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.topics.map((topic, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded-md font-medium">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-current border-opacity-20 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium opacity-75">Salary Range</span>
                    <span className="text-lg font-bold">{role.salary}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedRole(role)}
                  className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Explore Track
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedRole && (
        <RoleDetail role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}
    </div>
  );
};


// 7. Interview Scheduler
const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState([
    { id: 1, company: "Google", role: "Senior SWE", date: "2026-01-08", time: "10:00 AM", type: "Technical", status: "upcoming" },
    { id: 2, company: "Amazon", role: "SDE II", date: "2026-01-10", time: "2:00 PM", type: "Behavioral", status: "upcoming" },
    { id: 3, company: "Microsoft", role: "Software Engineer", date: "2025-12-28", time: "11:00 AM", type: "Technical", status: "completed" }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 mr-3">
              <Calendar className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Interview Schedule</h2>
              <p className="text-sm text-gray-600">Track and manage all your interviews</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Add Interview
          </button>
        </div>

        <div className="space-y-3">
          {interviews.map(interview => (
            <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{interview.company}</h3>
                  <p className="text-sm text-gray-600">{interview.role}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(interview.status)}`}>
                  {interview.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {interview.date} at {interview.time}
                </div>
                <span className="text-gray-300">•</span>
                <span>{interview.type} Round</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                  Prep Materials
                </button>
                <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                  Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preparation Timeline</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <div className="w-0.5 h-full bg-blue-200" />
            </div>
            <div className="flex-1 pb-4">
              <div className="text-sm font-medium text-gray-900">3 days before</div>
              <div className="text-sm text-gray-600 mt-1">Review company research and practice common questions</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <div className="w-0.5 h-full bg-blue-200" />
            </div>
            <div className="flex-1 pb-4">
              <div className="text-sm font-medium text-gray-900">1 day before</div>
              <div className="text-sm text-gray-600 mt-1">Take mock interview and prepare questions for interviewer</div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Interview day</div>
              <div className="text-sm text-gray-600 mt-1">Get good sleep, arrive early, and stay confident</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// 9. Common Mistakes Gallery
const CommonMistakes = () => {
  const mistakes = [
    {
      category: "Preparation",
      title: "Not Researching the Company",
      impact: "High",
      description: "Showing up without knowing the company's products, culture, or recent news",
      solution: "Spend 2-3 hours researching before every interview",
      example: "Asking 'What does your company do?' in an interview"
    },
    {
      category: "Communication",
      title: "Speaking Negatively About Past Employers",
      impact: "Critical",
      description: "Complaining about previous managers, colleagues, or company policies",
      solution: "Focus on what you learned and how you grew from challenges",
      example: "My last boss was terrible and the company had no direction"
    },
    {
      category: "Technical",
      title: "Not Thinking Out Loud",
      impact: "High",
      description: "Solving problems silently without explaining your thought process",
      solution: "Verbalize your approach, even if you're unsure",
      example: "Working on a coding problem in complete silence"
    },
    {
      category: "Behavioral",
      title: "Rambling Without Structure",
      impact: "Medium",
      description: "Telling long, unfocused stories without clear points",
      solution: "Use the STAR method to structure answers",
      example: "So basically, um, there was this time when..."
    },
    {
      category: "Communication",
      title: "Not Asking Questions",
      impact: "Medium",
      description: "Saying 'No, I don't have any questions' at the end",
      solution: "Prepare 5-7 thoughtful questions beforehand",
      example: "Nope, I'm all good!"
    },
    {
      category: "Preparation",
      title: "Being Late or Unprepared",
      impact: "Critical",
      description: "Arriving late, forgetting materials, or technical issues",
      solution: "Test everything 30 minutes early, arrive 10 minutes early",
      example: "Sorry, my internet crashed and I couldn't find my resume"
    }
  ];

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'High': return 'bg-orange-100 text-orange-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start mb-6">
          <div className="p-2 rounded-lg bg-red-50 border border-red-200 mr-3">
            <AlertTriangle className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Common Interview Mistakes</h2>
            <p className="text-sm text-gray-600">Learn from others' errors and avoid these pitfalls</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mistakes.map((mistake, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600 uppercase">{mistake.category}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${getImpactColor(mistake.impact)}`}>
                  {mistake.impact} Impact
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{mistake.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{mistake.description}</p>
              
              <div className="bg-red-50 border border-red-100 rounded p-3 mb-3">
                <div className="text-xs font-semibold text-red-900 mb-1">❌ Example</div>
                <p className="text-xs text-red-800 italic">"{mistake.example}"</p>
              </div>
              
              <div className="bg-green-50 border border-green-100 rounded p-3">
                <div className="text-xs font-semibold text-green-900 mb-1">✓ Solution</div>
                <p className="text-xs text-green-800">{mistake.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Red Flags to Avoid</h3>
        <div className="space-y-3">
          {[
            "Checking your phone during the interview",
            "Appearing disinterested or unenthusiastic",
            "Lying or exaggerating your experience",
            "Being unprofessional in dress or demeanor",
            "Not following up after the interview"
          ].map((flag, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-900">{flag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 12. Body Language Guide
const BodyLanguageGuide = () => {
  const dos = [
    {
      title: "Maintain Good Posture",
      description: "Sit upright with shoulders back. Shows confidence and engagement.",
      icon: ThumbsUp
    },
    {
      title: "Make Eye Contact",
      description: "60-70% eye contact. In virtual interviews, look at the camera.",
      icon: Eye
    },
    {
      title: "Smile Naturally",
      description: "Smile when appropriate to appear friendly and approachable.",
      icon: ThumbsUp
    },
    {
      title: "Use Open Gestures",
      description: "Keep hands visible and use purposeful gestures to emphasize points.",
      icon: ThumbsUp
    }
  ];

  const donts = [
    {
      title: "Don't Cross Arms",
      description: "Appears defensive or closed off. Keep arms relaxed.",
      icon: AlertTriangle
    },
    {
      title: "Avoid Fidgeting",
      description: "Don't tap, play with hair, or bounce leg. Shows nervousness.",
      icon: AlertTriangle
    },
    {
      title: "Don't Slouch",
      description: "Poor posture signals disinterest or lack of confidence.",
      icon: AlertTriangle
    },
    {
      title: "Avoid Touching Face",
      description: "Can signal dishonesty or nervousness. Keep hands away from face.",
      icon: AlertTriangle
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start mb-6">
          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 mr-3">
            <Eye className="w-5 h-5 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Body Language Guide</h2>
            <p className="text-sm text-gray-600">Master non-verbal communication for interviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-bold">✓</span>
              </div>
              Do These
            </h3>
            <div className="space-y-3">
              {dos.map((item, index) => (
                <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-green-800">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-700 font-bold">✗</span>
              </div>
              Avoid These
            </h3>
            <div className="space-y-3">
              {donts.map((item, index) => (
                <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-red-800">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Virtual Interview Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Camera Position</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Position at eye level
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Arms length distance
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Center yourself in frame
              </li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Lighting & Background</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Face light source
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Clean, uncluttered background
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                Neutral or professional setting
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// 13. Follow-Up Email Templates
const FollowUpTemplates = () => {
  const templates = [
    {
      title: "Thank You After Interview",
      timing: "Within 24 hours",
      subject: "Thank you - [Position] Interview",
      body: `Dear [Interviewer Name],

Thank you for taking the time to meet with me today to discuss the [Position] role at [Company]. I enjoyed learning more about the team's work on [specific project/topic discussed] and was particularly excited about [specific aspect of the role].

Our conversation reinforced my interest in this opportunity, especially [mention something specific from the interview]. I believe my experience in [relevant skill/experience] would allow me to contribute meaningfully to [specific team goal/project].

Please don't hesitate to reach out if you need any additional information. I look forward to hearing from you about the next steps.

Best regards,
[Your Name]`
    },
    {
      title: "Follow-Up After No Response",
      timing: "1-2 weeks after interview",
      subject: "Following up - [Position] Interview",
      body: `Dear [Interviewer Name],

I hope this email finds you well. I wanted to follow up on my interview for the [Position] role on [date]. I remain very interested in the opportunity and excited about the possibility of joining [Company].

If there's any additional information I can provide to assist in the decision-making process, please let me know. I'm happy to answer any questions or provide additional references.

Thank you again for your time and consideration.

Best regards,
[Your Name]`
    },
    {
      title: "Accepting an Offer",
      timing: "Within 48 hours of receiving offer",
      subject: "Acceptance of Offer - [Position]",
      body: `Dear [Hiring Manager Name],

I am delighted to formally accept the offer for the [Position] role at [Company]. Thank you for this wonderful opportunity.

As discussed, I understand the start date is [date], the salary is [amount], and [other key terms]. I'm excited to join the team and contribute to [specific project/goal].

Please let me know what next steps I should take before my start date. I look forward to working with you and the team.

Best regards,
[Your Name]`
    },
    {
      title: "Declining an Offer Professionally",
      timing: "As soon as decision is made",
      subject: "Re: [Position] Offer",
      body: `Dear [Hiring Manager Name],

Thank you so much for offering me the [Position] role at [Company]. I truly appreciate the time you and your team invested in the interview process and the opportunity to learn about the organization.

After careful consideration, I have decided to pursue another opportunity that aligns more closely with my career goals at this time. This was not an easy decision, as I was impressed by [specific positive aspect].

I hope we can stay in touch, and I wish you and the team continued success.

Best regards,
[Your Name]`
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start mb-6">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 mr-3">
            <Mail className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Follow-Up Email Templates</h2>
            <p className="text-sm text-gray-600">Professional templates for every interview stage</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => setSelectedTemplate(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTemplate === index
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {template.title}
            </button>
          ))}
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{templates[selectedTemplate].title}</h3>
              <button className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                Copy Template
              </button>
            </div>
            <div className="text-xs text-gray-600 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {templates[selectedTemplate].timing}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Subject: {templates[selectedTemplate].subject}
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {templates[selectedTemplate].body}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-green-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Do
            </h4>
            {[
              "Send within 24 hours of interview",
              "Personalize with specific details from conversation",
              "Keep it concise (3-4 short paragraphs)",
              "Proofread carefully for errors",
              "Express genuine enthusiasm"
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Don't
            </h4>
            {[
              "Use generic, template-sounding language",
              "Send to the wrong person or company",
              "Make demands or appear pushy",
              "Include new salary negotiations",
              "Wait too long to send follow-up"
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;