import React, { useState } from 'react';
import Header from '../../Componets/MainPageDesign/Header';
import MegaFooter from '../../Componets/HomepageDesign/MegaFooter';
import ChatButton from '../../Componets/ChatButton';
import { HiPhone, HiMapPin, HiClock, HiEnvelope } from 'react-icons/hi2';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-[#F2C46A] to-[#E6B546] bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-8">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F2C46A] focus:ring-2 focus:ring-[#F2C46A]/20 transition-colors duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F2C46A] focus:ring-2 focus:ring-[#F2C46A]/20 transition-colors duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#F2C46A] focus:ring-2 focus:ring-[#F2C46A]/20 transition-colors duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F2C46A] focus:ring-2 focus:ring-[#F2C46A]/20 transition-colors duration-200 resize-vertical"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#F2C46A] to-[#E6B546] text-black font-semibold rounded-lg hover:from-[#E6B546] to-[#D4A532] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-8">Contact Information</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    We're here to help! Reach out to us through any of the following channels, 
                    and we'll respond as quickly as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F2C46A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiEnvelope className="text-xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                      <p className="text-gray-400">support@thegangs.com</p>
                      <p className="text-gray-400">hello@thegangs.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F2C46A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiPhone className="text-xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Phone</h3>
                      <p className="text-gray-400">+1 (555) 123-4567</p>
                      <p className="text-gray-400 text-sm">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F2C46A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiMapPin className="text-xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Address</h3>
                      <p className="text-gray-400">123 Cinema Street</p>
                      <p className="text-gray-400">Hollywood, CA 90028</p>
                      <p className="text-gray-400">United States</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#F2C46A] rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiClock className="text-xl text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Business Hours</h3>
                      <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-400">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
                  <h3 className="text-white font-semibold text-lg mb-3">Quick Support</h3>
                  <p className="text-gray-400 mb-4">
                    Need immediate help? Try our AI-powered chat assistant for instant answers to common questions.
                  </p>
                  <button
                    onClick={() => {
                      // This would trigger the chat button
                      const chatButton = document.querySelector('[data-chat-trigger]') as HTMLElement;
                      if (chatButton) chatButton.click();
                    }}
                    className="px-6 py-2 bg-[#F2C46A] text-black font-medium rounded-lg hover:bg-[#E6B546] transition-colors duration-200"
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
      <ChatButton />
    </>
  );
};

export default Contact;