'use client';

import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Moon, Sun, Code, User, Briefcase, Send } from 'lucide-react';

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['home', 'about', 'projects', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: "Project Alpha",
      description: "A real-time analytics dashboard built with React and D3.js",
      tags: ["React", "D3.js", "Firebase"],
      link: "#",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Beta App",
      description: "Mobile-first e-commerce platform with advanced filtering",
      tags: ["Next.js", "Tailwind", "Stripe"],
      link: "#",
      image: "/api/placeholder/600/400"
    },
    {
      title: "Gamma Platform",
      description: "Cloud-based project management tool for remote teams",
      tags: ["Vue.js", "Node.js", "MongoDB"],
      link: "#",
      image: "/api/placeholder/600/400"
    }
  ];

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const techStack = {
    development: [
      { name: "React", icon: "react-original", type: "Framework" },
      { name: "Node.js", icon: "nodejs-plain", type: "Backend" },
      { name: "TypeScript", icon: "typescript-plain", type: "Language" },
      { name: "Next.js", icon: "nextjs-original", type: "Framework" },
      { name: "MongoDB", icon: "mongodb-plain", type: "Database" },
      { name: "PostgreSQL", icon: "postgresql-plain", type: "Database" }
    ],
    design: [
      { name: "Figma", icon: "figma-plain", type: "Design" },
      { name: "Adobe XD", icon: "xd-plain", type: "Design" },
      { name: "Photoshop", icon: "photoshop-plain", type: "Design" },
      { name: "Illustrator", icon: "illustrator-plain", type: "Design" }
    ],
    tools: [
      { name: "Git", icon: "git-plain", type: "Version Control" },
      { name: "Docker", icon: "docker-plain", type: "DevOps" },
      { name: "AWS", icon: "amazonwebservices-original", type: "Cloud" },
      { name: "Firebase", icon: "firebase-plain", type: "Backend" }
    ]
  };

  const clients = [
    { 
      name: "Tech Corp",
      logo: "/api/placeholder/200/80",
      link: "#"
    },
    { 
      name: "Digital Solutions",
      logo: "/api/placeholder/200/80",
      link: "#"
    },
    { 
      name: "Innovation Labs",
      logo: "/api/placeholder/200/80",
      link: "#"
    },
    { 
      name: "Future Systems",
      logo: "/api/placeholder/200/80",
      link: "#"
    },
    { 
      name: "Smart Tech",
      logo: "/api/placeholder/200/80",
      link: "#"
    },
    { 
      name: "Cloud Solutions",
      logo: "/api/placeholder/200/80",
      link: "#"
    }
  ];

  const NavLink = ({ section, icon: Icon }) => (
    <a
      href={`#${section}`}
      className={`group flex items-center p-2 transition-all duration-300 ${
        activeSection === section ? 'text-white' : 'text-gray-400'
      }`}
    >
      <Icon className="w-6 h-6 mr-2" />
      <span className="text-lg uppercase tracking-wider">{section}</span>
      <span 
        className={`block h-0.5 bg-white transition-all duration-300 ${
          activeSection === section ? 'w-full' : 'w-0 group-hover:w-full'
        }`} 
      />
    </a>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'text-white' : 'text-black'}`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <a href="#home" className="text-4xl font-bold tracking-wider">JD</a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            <NavLink section="home" icon={Code} />
            <NavLink section="about" icon={User} />
            <NavLink section="projects" icon={Briefcase} />
            <NavLink section="clients" icon={Briefcase} />
            <NavLink section="contact" icon={Send} />
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white mb-1.5" />
            <div className="w-6 h-0.5 bg-white" />
          </button>

          {/* Mobile Navigation Menu */}
          <div className={`
            fixed inset-0 bg-black z-50 transition-transform duration-300 md:hidden
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <div className="flex justify-end p-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-4xl"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col items-center space-y-8 p-6">
              <NavLink section="home" icon={Code} />
              <NavLink section="about" icon={User} />
              <NavLink section="projects" icon={Briefcase} />
              <NavLink section="clients" icon={Briefcase} />
              <NavLink section="contact" icon={Send} />
            </div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full transition-colors duration-300 hover:bg-gray-800"
          >
            {isDarkMode ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home" 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute inset-0 bg-grid-white/10" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-8xl md:text-9xl font-bold mb-8 tracking-tighter">
            JOHN
            <br />
            DOE
          </h1>
          <p className="text-3xl md:text-4xl text-gray-400 mb-12 tracking-wide">
            FULL STACK DEVELOPER
          </p>
          <div className="flex space-x-8 justify-center">
            {[Github, Linkedin, Mail].map((Icon, index) => (
              <a 
                key={index}
                href="#" 
                className="transform transition-all duration-300 hover:scale-110 hover:rotate-6"
              >
                <Icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
        
        <ChevronDown 
          className="absolute bottom-12 animate-bounce w-12 h-12 cursor-pointer" 
          onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
        />
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="py-32 px-6 md:px-20 bg-white text-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-black/5 opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-7xl md:text-8xl font-bold mb-16 tracking-tighter">
            ABOUT ME
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
                          <div className="space-y-16">
                <p className="text-2xl md:text-3xl leading-relaxed">
                  I'm a passionate full-stack developer with 5+ years of experience in building modern web applications. 
                  Specializing in scalable, user-centric solutions using cutting-edge technologies.
                </p>

                {/* Skills Section */}
                <div className="space-y-16">
                  <div className="relative">
                    <div className="absolute -inset-4 md:-inset-6">
                      <div className="w-full h-full mx-auto rotate-2 bg-gradient-to-r from-yellow-500/20 to-pink-500/20 blur-lg" />
                    </div>
                    <div className="relative bg-gray-100 rounded-2xl p-8 md:p-12">
                      <h3 className="text-3xl md:text-4xl font-bold mb-8">Development Stack</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {techStack.development.map((tech, index) => (
                          <div 
                            key={index}
                            className="group relative bg-white rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <img 
                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon.split('-')[0]}/${tech.icon}.svg`}
                                alt={tech.name}
                                className="w-12 h-12"
                              />
                              <span className="text-sm font-medium">{tech.name}</span>
                              <span className="text-xs text-gray-500">{tech.type}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-4 md:-inset-6">
                      <div className="w-full h-full mx-auto -rotate-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg" />
                    </div>
                    <div className="relative bg-gray-100 rounded-2xl p-8 md:p-12">
                      <h3 className="text-3xl md:text-4xl font-bold mb-8">Design Tools</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {techStack.design.map((tech, index) => (
                          <div 
                            key={index}
                            className="group relative bg-white rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <img 
                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon.split('-')[0]}/${tech.icon}.svg`}
                                alt={tech.name}
                                className="w-12 h-12"
                              />
                              <span className="text-sm font-medium">{tech.name}</span>
                              <span className="text-xs text-gray-500">{tech.type}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-4 md:-inset-6">
                      <div className="w-full h-full mx-auto rotate-1 bg-gradient-to-r from-green-500/20 to-teal-500/20 blur-lg" />
                    </div>
                    <div className="relative bg-gray-100 rounded-2xl p-8 md:p-12">
                      <h3 className="text-3xl md:text-4xl font-bold mb-8">Tools & Services</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {techStack.tools.map((tech, index) => (
                          <div 
                            key={index}
                            className="group relative bg-white rounded-xl p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              <img 
                                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon.split('-')[0]}/${tech.icon}.svg`}
                                alt={tech.name}
                                className="w-12 h-12"
                              />
                              <span className="text-sm font-medium">{tech.name}</span>
                              <span className="text-xs text-gray-500">{tech.type}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>
            <div className="relative group">
              <img 
                src="/api/placeholder/800/1000" 
                alt="John Doe"
                className="rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105"
              />
            </div>
        
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        className="py-32 px-6 md:px-20 bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-20" ></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-7xl md:text-8xl font-bold mb-16 tracking-tighter">
            PROJECTS
          </h2>
        </div>
          <div className="grid grid-cols-1 gap-16">
            {projects.map((project, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 rounded-3xl overflow-hidden transform transition-all duration-500 hover:bg-white/10"
              >
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  <div className="space-y-6">
                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h3>
                    <p className="text-xl text-gray-400">{project.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-white/10 px-4 py-2 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a 
                      href={project.link}
                      className="inline-flex items-center text-lg text-gray-400 hover:text-white transition-colors duration-300 group"
                    >
                      View Project 
                      <ExternalLink className="ml-2 w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                  <div className="relative h-64 md:h-auto overflow-hidden rounded-xl">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        
      </section>

      {/* Clients Section */}
      <section 
        id="clients" 
        className="py-32 px-6 md:px-20 bg-black text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/10 opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-7xl md:text-8xl font-bold mb-16 tracking-tighter">
            CLIENTS
          </h2>
          <p className="text-2xl md:text-3xl text-gray-400 mb-16 max-w-3xl">
            Proud to have worked with amazing companies across various industries.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {clients.map((client, index) => (
              <a
                key={index}
                href={client.link}
                className="group relative bg-white/5 rounded-xl p-6 md:p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/10"
              >
                <img 
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-12 md:h-20 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </a>
            ))}
          </div>
        </div>

      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="py-32 px-6 md:px-20 bg-white text-black relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-black/5 opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-7xl md:text-8xl font-bold mb-16 tracking-tighter">
            GET IN TOUCH
          </h2>
          <div className="max-w-2xl">
            <p className="text-2xl md:text-3xl mb-12">
              Have a project in mind? Let's work together to bring your ideas to life.
            </p>
            <form className="space-y-8">
              <div className="space-y-3">
                <label className="block text-xl font-medium">Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 text-xl rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors duration-300"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-xl font-medium">Email</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 text-xl rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors duration-300"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-xl font-medium">Message</label>
                <textarea 
                  rows={6}
                  className="w-full px-6 py-4 text-xl rounded-xl bg-gray-100 border-2 border-gray-200 focus:border-black focus:outline-none transition-colors duration-300"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white text-xl px-8 py-6 rounded-xl font-bold transform transition-all duration-300 hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );

};