'use client';

import { useState } from 'react';

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <span className="subtitle-artistic text-yellow-400 px-3 py-2 text-sm">ABOUT</span>
                <a href="/#services" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  SERVICES
                </a>
                <a href="/#portfolio" className="subtitle-artistic text-white hover:text-yellow-400 px-3 py-2 text-sm transition-colors">
                  PORTFOLIO
                </a>
                <a href="/#contact" className="btn-artistic text-sm px-6 py-2">
                  CONTACT US
                </a>
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
              <span className="subtitle-artistic text-yellow-400 block px-3 py-2 text-base">ABOUT</span>
              <a href="/#services" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                SERVICES
              </a>
              <a href="/#portfolio" className="subtitle-artistic text-white hover:text-yellow-400 block px-3 py-2 text-base">
                PORTFOLIO
              </a>
              <a href="/#contact" className="btn-artistic text-base px-3 py-2 mx-3">
                CONTACT US
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="title-artistic text-6xl md:text-8xl mb-8 animate-bounceIn">
              ABOUT NBA FANTASY
            </h1>
            <p className="subtitle-artistic text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto">
              WE ARE PASSIONATE GAME DEVELOPERS DEDICATED TO CREATING 
              <span className="block text-yellow-400 mt-2">INNOVATIVE AND IMMERSIVE GAMING EXPERIENCES</span>
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="title-artistic text-4xl md:text-5xl mb-8">
                OUR STORY
              </h2>
              <div className="space-y-6 text-artistic text-lg">
                <p>
                  FOUNDED IN 2019, NBA FANTASY LEAGUE BEGAN AS A SMALL TEAM OF PASSIONATE DEVELOPERS 
                  WHO BELIEVED IN THE POWER OF GAMES TO BRING PEOPLE TOGETHER AND CREATE 
                  MEANINGFUL EXPERIENCES.
                </p>
                <p>
                  OVER THE YEARS, WE'VE GROWN INTO A FULL-SERVICE GAME DEVELOPMENT STUDIO, 
                  WORKING WITH CLIENTS FROM INDIE DEVELOPERS TO MAJOR PUBLISHERS. OUR MISSION 
                  REMAINS THE SAME: TO CREATE GAMES THAT INSPIRE, ENTERTAIN, AND CONNECT PEOPLE.
                </p>
                <p>
                  WE SPECIALIZE IN CUTTING-EDGE TECHNOLOGIES INCLUDING BLOCKCHAIN GAMING, 
                  VR/AR EXPERIENCES, AND MOBILE GAME DEVELOPMENT, ALWAYS PUSHING THE 
                  BOUNDARIES OF WHAT'S POSSIBLE IN INTERACTIVE ENTERTAINMENT.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="card-artistic text-center">
                <div className="title-artistic text-3xl mb-2">50+</div>
                <div className="subtitle-artistic text-sm">GAMES DEVELOPED</div>
              </div>
              <div className="card-artistic text-center">
                <div className="title-artistic text-3xl mb-2">10M+</div>
                <div className="subtitle-artistic text-sm">PLAYERS WORLDWIDE</div>
              </div>
              <div className="card-artistic text-center">
                <div className="title-artistic text-3xl mb-2">5+</div>
                <div className="subtitle-artistic text-sm">YEARS EXPERIENCE</div>
              </div>
              <div className="card-artistic text-center">
                <div className="title-artistic text-3xl mb-2">15+</div>
                <div className="subtitle-artistic text-sm">TEAM MEMBERS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="title-artistic text-4xl md:text-5xl mb-4">
              OUR VALUES
            </h2>
            <p className="subtitle-artistic text-xl text-white max-w-4xl mx-auto">
              THE PRINCIPLES THAT GUIDE EVERYTHING WE DO AT NBA FANTASY LEAGUE.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-artistic">
              <div className="text-4xl mb-6">👥</div>
              <h3 className="subtitle-artistic text-xl mb-4">COLLABORATION</h3>
              <p className="text-artistic">
                WE BELIEVE THE BEST GAMES COME FROM DIVERSE TEAMS WORKING TOGETHER 
                TOWARDS A SHARED VISION.
              </p>
            </div>

            <div className="card-artistic">
              <div className="text-4xl mb-6">💻</div>
              <h3 className="subtitle-artistic text-xl mb-4">INNOVATION</h3>
              <p className="text-artistic">
                WE'RE CONSTANTLY EXPLORING NEW TECHNOLOGIES AND CREATIVE APPROACHES 
                TO GAME DEVELOPMENT.
              </p>
            </div>

            <div className="card-artistic">
              <div className="text-4xl mb-6">⭐</div>
              <h3 className="subtitle-artistic text-xl mb-4">QUALITY</h3>
              <p className="text-artistic">
                EVERY GAME WE CREATE MEETS OUR HIGH STANDARDS FOR POLISH, 
                PERFORMANCE, AND PLAYER EXPERIENCE.
              </p>
            </div>

            <div className="card-artistic">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="subtitle-artistic text-xl mb-4">PASSION</h3>
              <p className="text-artistic">
                WE'RE DRIVEN BY OUR LOVE FOR GAMES AND OUR DESIRE TO CREATE 
                EXPERIENCES THAT PLAYERS WILL REMEMBER.
              </p>
            </div>

            <div className="card-artistic">
              <div className="text-4xl mb-6">🌍</div>
              <h3 className="subtitle-artistic text-xl mb-4">INCLUSIVITY</h3>
              <p className="text-artistic">
                WE CREATE GAMES THAT WELCOME PLAYERS FROM ALL BACKGROUNDS 
                AND CELEBRATE DIVERSITY.
              </p>
            </div>

            <div className="card-artistic">
              <div className="text-4xl mb-6">✅</div>
              <h3 className="subtitle-artistic text-xl mb-4">RELIABILITY</h3>
              <p className="text-artistic">
                WE DELIVER ON OUR PROMISES AND MAINTAIN LONG-TERM RELATIONSHIPS 
                WITH OUR CLIENTS AND PARTNERS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="title-artistic text-4xl md:text-5xl mb-4">
              MEET OUR TEAM
            </h2>
            <p className="subtitle-artistic text-xl text-white max-w-4xl mx-auto">
              THE TALENTED INDIVIDUALS WHO MAKE NBA FANTASY LEAGUE POSSIBLE.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">JS</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">JOHN SMITH</h3>
              <p className="text-yellow-400 mb-3">CEO & LEAD DEVELOPER</p>
              <p className="text-artistic text-sm">
                VISIONARY LEADER WITH 10+ YEARS IN GAME DEVELOPMENT AND BLOCKCHAIN TECHNOLOGY.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">MJ</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">MARIA JOHNSON</h3>
              <p className="text-yellow-400 mb-3">CREATIVE DIRECTOR</p>
              <p className="text-artistic text-sm">
                AWARD-WINNING GAME DESIGNER WITH EXPERTISE IN USER EXPERIENCE AND VISUAL DESIGN.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">DW</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">DAVID WILSON</h3>
              <p className="text-yellow-400 mb-3">TECHNICAL DIRECTOR</p>
              <p className="text-artistic text-sm">
                SENIOR ENGINEER SPECIALIZING IN GAME ENGINES AND PERFORMANCE OPTIMIZATION.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">SB</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">SARAH BROWN</h3>
              <p className="text-yellow-400 mb-3">ART DIRECTOR</p>
              <p className="text-artistic text-sm">
                TALENTED ARTIST WITH EXPERIENCE IN BOTH 2D AND 3D GAME ASSET CREATION.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">MD</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">MIKE DAVIS</h3>
              <p className="text-yellow-400 mb-3">SOUND DESIGNER</p>
              <p className="text-artistic text-sm">
                AUDIO SPECIALIST CREATING IMMERSIVE SOUNDSCAPES AND MEMORABLE GAME MUSIC.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-white text-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="title-artistic text-4xl">LT</span>
              </div>
              <h3 className="subtitle-artistic text-xl mb-2">LISA TAYLOR</h3>
              <p className="text-yellow-400 mb-3">QA MANAGER</p>
              <p className="text-artistic text-sm">
                QUALITY ASSURANCE EXPERT ENSURING EVERY GAME MEETS OUR HIGH STANDARDS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black border-t-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="title-artistic text-4xl md:text-5xl mb-6">
            READY TO WORK WITH US?
          </h2>
          <p className="subtitle-artistic text-xl text-white mb-8 max-w-4xl mx-auto">
            LET'S DISCUSS YOUR GAME DEVELOPMENT PROJECT AND SEE HOW WE CAN BRING YOUR VISION TO LIFE.
          </p>
          <a
            href="/#contact"
            className="btn-artistic text-xl px-12 py-6 inline-block"
          >
            GET STARTED
          </a>
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
                <li><a href="/#contact" className="hover:text-yellow-400 transition-colors">CONTACT</a></li>
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