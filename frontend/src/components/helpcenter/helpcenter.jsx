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
    <div className="pt-20 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-emerald-50 w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-5 border border-emerald-100">
            <LifeBuoy className="text-emerald-600 w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Help Center</h1>
          <p className="text-base text-gray-500 max-w-lg mx-auto mb-8">
            Find answers to common questions about the Zim-REC platform and renewable energy certificates.
          </p>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index}>
              <div className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${openFaqIndex === index ? 'border-emerald-200 shadow-sm' : 'border-gray-100'}`}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-5 text-left text-sm font-semibold text-gray-800 hover:text-emerald-700 focus:outline-none transition-colors"
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 flex-shrink-0 ml-4 ${openFaqIndex === index ? 'rotate-180 text-emerald-500' : ''}`}
                  />
                </button>
                <div
                  className={`px-5 text-sm text-gray-500 leading-relaxed transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <Mail className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Still need help?</h2>
            <p className="text-sm text-gray-500">Send us a message and we will get back to you within 24 hours</p>
          </div>

          <form className="space-y-3.5">
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="Your Email"
            />
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="Subject"
            />
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
              placeholder="Describe your issue..."
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all duration-200 text-sm"
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