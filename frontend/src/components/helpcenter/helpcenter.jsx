import React from 'react';
import { useState } from 'react';
import { ChevronDown, Mail, LifeBuoy, Search } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  
  const faqs = [
    {
      question: "How do I register a new device?",
      answer: "Navigate to your dashboard and click 'Add New Device'. Fill in the required details about your renewable energy installation."
    },
    {
      question: "What documentation is needed for REC certification?",
      answer: "You'll need facility registration documents, ownership proof, metering evidence, and technical specifications."
    },
    {
      question: "How long does verification take?",
      answer: "Typically 5-7 business days after submission of all required documents."
    },
    {
      question: "What are the costs associated with REC registration?",
      answer: "AICTS and Silver Carbon absorb all application and registration costs. Project owners don't need to pay upfront as costs are recovered once the RECs are sold."
    },
    {
      question: "Can small-scale renewable energy initiatives participate?",
      answer: "Yes, both large and small renewable energy projects can qualify, provided they meet the minimum generation capacity and reporting standards."
    }
  ];

  const toggleFaq = (index) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 opacity-100 transform translate-y-0 transition-all duration-500">
          <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-2xl mx-auto mb-6">
            <LifeBuoy className="text-green-600 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800">FAQs</h2>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="opacity-100 transition-opacity duration-500" 
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none"
                >
                  {faq.question}
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div 
                  className={`px-4 pb-4 text-gray-600 transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg transform scale-100 transition-transform duration-500">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Mail className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold">Still need help?</h2>
            <p className="text-gray-600 mb-4">Contact our support team directly</p>
          </div>
          
          <form className="space-y-4">
            <div>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Your Email"
              />
            </div>
            <div>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Subject"
              />
            </div>
            <div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Message"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;