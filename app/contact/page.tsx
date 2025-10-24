'use client';

import { useState } from 'react';

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('THANK YOU FOR YOUR MESSAGE! WE\'LL GET BACK TO YOU SOON.');
    setFormData({ name: '', email: '', company: '', project: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen artistic-bg matrix-bg">
      {/* Artistic Navigation */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="/" className="title-artistic text-2xl">NBA FANTASY</a>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  HOME
                </a>
                <a href="/about" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  ABOUT
                </a>
                <a href="/#services" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  SERVICES
                </a>
                <a href="/#portfolio" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  PORTFOLIO
                </a>
                <span className="btn-artistic text-sm px-6 py-2 bg-white text-black">CONTACT</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-yellow-400 p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t-4 border-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                HOME
              </a>
              <a href="/about" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                ABOUT
              </a>
              <a href="/#services" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                SERVICES
              </a>
              <a href="/#portfolio" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                PORTFOLIO
              </a>
              <span className="btn-artistic text-base px-3 py-2 mx-3 bg-white text-black">CONTACT</span>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="title-artistic text-6xl md:text-8xl mb-8 animate-bounceIn">
              GET IN TOUCH
            </h1>
            <p className="subtitle-artistic text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto">
              READY TO START YOUR GAME DEVELOPMENT PROJECT? LET'S DISCUSS YOUR VISION 
              <span className="block text-yellow-400 mt-2">AND BRING IT TO LIFE TOGETHER.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="title-artistic text-3xl mb-8">CONTACT INFORMATION</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="subtitle-artistic text-lg mb-2">EMAIL</h3>
                    <p className="text-artistic mb-1">hello@ply.games</p>
                    <p className="text-artistic">support@ply.games</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="subtitle-artistic text-lg mb-2">PHONE</h3>
                    <p className="text-artistic mb-1">+1 (555) 123-4567</p>
                    <p className="text-artistic">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="subtitle-artistic text-lg mb-2">ADDRESS</h3>
                    <p className="text-artistic mb-1">123 GAME STREET</p>
                    <p className="text-artistic">SAN FRANCISCO, CA 94105</p>
                    <p className="text-artistic">UNITED STATES</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white text-black rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="subtitle-artistic text-lg mb-2">BUSINESS HOURS</h3>
                    <p className="text-artistic mb-1">MONDAY - FRIDAY: 9:00 AM - 6:00 PM</p>
                    <p className="text-artistic">SATURDAY: 10:00 AM - 4:00 PM</p>
                    <p className="text-artistic">SUNDAY: CLOSED</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12">
                <h3 className="subtitle-artistic text-lg mb-4">FOLLOW US</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="leaderboard-artistic p-8">
                <h2 className="title-artistic text-3xl mb-8">SEND US A MESSAGE</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block subtitle-artistic text-sm mb-2">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border-2 border-white text-white focus:border-yellow-400 transition-colors"
                        placeholder="YOUR FULL NAME"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block subtitle-artistic text-sm mb-2">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border-2 border-white text-white focus:border-yellow-400 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block subtitle-artistic text-sm mb-2">
                        COMPANY
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border-2 border-white text-white focus:border-yellow-400 transition-colors"
                        placeholder="YOUR COMPANY NAME"
                      />
                    </div>

                    <div>
                      <label htmlFor="project" className="block subtitle-artistic text-sm mb-2">
                        PROJECT TYPE
                      </label>
                      <select
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black border-2 border-white text-white focus:border-yellow-400 transition-colors"
                      >
                        <option value="">SELECT A PROJECT TYPE</option>
                        <option value="mobile-game">MOBILE GAME</option>
                        <option value="web-game">WEB GAME</option>
                        <option value="console-game">CONSOLE GAME</option>
                        <option value="vr-ar">VR/AR GAME</option>
                        <option value="blockchain">BLOCKCHAIN GAME</option>
                        <option value="consulting">CONSULTING</option>
                        <option value="other">OTHER</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block subtitle-artistic text-sm mb-2">
                      PROJECT DETAILS *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-black border-2 border-white text-white focus:border-yellow-400 transition-colors"
                      placeholder="TELL US ABOUT YOUR PROJECT, TIMELINE, BUDGET, AND ANY SPECIFIC REQUIREMENTS..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-artistic text-xl py-4"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black border-t-4 border-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="title-artistic text-4xl md:text-5xl mb-4">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="subtitle-artistic text-xl text-white">
              COMMON QUESTIONS ABOUT OUR GAME DEVELOPMENT SERVICES.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card-artistic">
              <h3 className="subtitle-artistic text-lg mb-3">
                HOW LONG DOES A TYPICAL GAME DEVELOPMENT PROJECT TAKE?
              </h3>
              <p className="text-artistic">
                PROJECT TIMELINES VARY DEPENDING ON SCOPE AND COMPLEXITY. SIMPLE MOBILE GAMES CAN TAKE 3-6 MONTHS, 
                WHILE MORE COMPLEX CONSOLE OR PC GAMES MAY REQUIRE 12-24 MONTHS. WE'LL PROVIDE A DETAILED TIMELINE 
                AFTER DISCUSSING YOUR SPECIFIC REQUIREMENTS.
              </p>
            </div>

            <div className="card-artistic">
              <h3 className="subtitle-artistic text-lg mb-3">
                WHAT PLATFORMS DO YOU DEVELOP GAMES FOR?
              </h3>
              <p className="text-artistic">
                WE DEVELOP GAMES FOR MULTIPLE PLATFORMS INCLUDING IOS, ANDROID, PC (WINDOWS/MAC/LINUX), 
                PLAYSTATION, XBOX, NINTENDO SWITCH, AND VR HEADSETS. WE ALSO SPECIALIZE IN WEB-BASED GAMES 
                AND BLOCKCHAIN GAMING PLATFORMS.
              </p>
            </div>

            <div className="card-artistic">
              <h3 className="subtitle-artistic text-lg mb-3">
                DO YOU WORK WITH INDIE DEVELOPERS OR ONLY LARGE STUDIOS?
              </h3>
              <p className="text-artistic">
                WE WORK WITH CLIENTS OF ALL SIZES, FROM INDIVIDUAL INDIE DEVELOPERS TO LARGE PUBLISHING COMPANIES. 
                WE'RE PASSIONATE ABOUT HELPING BRING CREATIVE VISIONS TO LIFE, REGARDLESS OF THE PROJECT SIZE OR BUDGET.
              </p>
            </div>

            <div className="card-artistic">
              <h3 className="subtitle-artistic text-lg mb-3">
                WHAT'S INCLUDED IN YOUR GAME DEVELOPMENT SERVICES?
              </h3>
              <p className="text-artistic">
                OUR FULL-SERVICE APPROACH INCLUDES GAME DESIGN, DEVELOPMENT, ART AND ANIMATION, SOUND DESIGN, 
                QUALITY ASSURANCE, PLATFORM OPTIMIZATION, AND PUBLISHING SUPPORT. WE CAN ALSO PROVIDE ONGOING 
                MAINTENANCE AND UPDATES AFTER LAUNCH.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="title-artistic text-2xl mb-4">NBA FANTASY LEAGUE</h3>
              <p className="text-artistic mb-6 max-w-md">
                WE MAKE GAMES, WE'RE PASSIONATE ABOUT CREATING IMMERSIVE GAMING 
                EXPERIENCES AND INNOVATIVE SOLUTIONS.
              </p>
            </div>

            <div>
              <h4 className="subtitle-artistic text-lg mb-4">SERVICES</h4>
              <ul className="space-y-2 text-artistic">
                <li><a href="/#services" className="hover:text-yellow-400 transition-colors">GAME DEVELOPMENT</a></li>
                <li><a href="/#services" className="hover:text-yellow-400 transition-colors">GAME DESIGN</a></li>
                <li><a href="/#services" className="hover:text-yellow-400 transition-colors">CONSULTING</a></li>
                <li><a href="/#services" className="hover:text-yellow-400 transition-colors">ART & ANIMATION</a></li>
              </ul>
            </div>

            <div>
              <h4 className="subtitle-artistic text-lg mb-4">COMPANY</h4>
              <ul className="space-y-2 text-artistic">
                <li><a href="/about" className="hover:text-yellow-400 transition-colors">ABOUT US</a></li>
                <li><a href="/#portfolio" className="hover:text-yellow-400 transition-colors">PORTFOLIO</a></li>
                <li><a href="/contact" className="hover:text-yellow-400 transition-colors">CONTACT</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">CAREERS</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t-2 border-white mt-8 pt-8 text-center text-artistic">
            <p>&copy; 2024 NBA FANTASY LEAGUE. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}