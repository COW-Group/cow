import React, { useState } from 'react';
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Horizon Principle */}
      <div className="bg-gradient-to-b from-cerulean-deep to-cerulean text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-light">Contact Support</h1>
            <p className="mt-4 text-xl font-light text-cerulean-ice max-w-2xl mx-auto leading-relaxed">
              Get in touch with our support team. We're here to help you with your Performance RWA platform.
            </p>
          </div>
        </div>
      </div>

      {/* Gradient transition */}
      <div className="bg-gradient-to-b from-cerulean via-cerulean-ice to-white h-16"></div>

      {/* Contact Options & Form */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-cerulean-ice rounded-xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-cerulean-deep" />
                </div>
                <h3 className="text-lg font-normal text-ink-black">Live Chat</h3>
              </div>
              <p className="text-sm font-light text-ink-charcoal leading-relaxed">
                Get instant help from our support team
              </p>
              <a
                href="/chat"
                className="mt-4 inline-block text-sm font-light text-cerulean-deep hover:text-cerulean transition-colors"
              >
                Start chat →
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-cerulean-ice rounded-xl flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-cerulean-deep" />
                </div>
                <h3 className="text-lg font-normal text-ink-black">Email</h3>
              </div>
              <p className="text-sm font-light text-ink-charcoal leading-relaxed mb-2">
                support@cow.group
              </p>
              <p className="text-xs font-light text-ink-charcoal opacity-70">
                We respond within 24 hours
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-earth-stone to-earth-clay"></div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-cerulean-ice rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-cerulean-deep" />
                </div>
                <h3 className="text-lg font-normal text-ink-black">Availability</h3>
              </div>
              <p className="text-sm font-light text-ink-charcoal leading-relaxed">
                24/7 support available
              </p>
              <p className="text-xs font-light text-ink-charcoal opacity-70 mt-1">
                Around-the-clock assistance
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-8">
              <h2 className="text-2xl font-normal text-ink-black mb-6">Send us a message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-light text-ink-black mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-light text-ink-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-light text-ink-black mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account & Security</option>
                    <option value="assets">Assets & Trading</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-light text-ink-black mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cerulean-deep focus:border-transparent font-light resize-none"
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cerulean-deep text-white px-6 py-3 rounded-xl hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light"
                >
                  Send Message
                </button>

                <p className="text-xs font-light text-ink-charcoal text-center">
                  We'll respond to your inquiry within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info - Earth grounding */}
      <div className="bg-earth-clay border-t-4 border-earth-terra">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-normal text-ink-black">
              Need help right away?
            </h3>
            <p className="mt-2 text-sm font-light text-ink-charcoal leading-relaxed max-w-2xl mx-auto">
              For urgent issues, our live chat provides immediate assistance from our support team
            </p>
            <div className="mt-6">
              <a
                href="/chat"
                className="inline-flex items-center space-x-2 bg-cerulean-deep text-white px-6 py-3 rounded-xl hover:bg-cerulean hover:shadow-lg transition-all duration-200 font-light"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Start Live Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
