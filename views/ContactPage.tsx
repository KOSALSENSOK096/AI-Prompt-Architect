import React, { useState }  from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log({ name, email, message });
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000); // Reset after 5s
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary dark:from-primary-light dark:via-primary dark:to-primary-dark mb-8 text-center">
        Get in Touch
      </h1>
      
      <div className="bg-white dark:bg-slate-800 shadow-2xl dark:shadow-2xl rounded-2xl p-8 transition-all duration-300 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary-dark"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary-dark/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 dark:bg-primary-dark/5 rounded-full translate-y-16 -translate-x-16"></div>

        {isSubmitted ? (
          <div className="text-center p-8 bg-green-50 dark:bg-green-800/30 rounded-xl transition-all duration-300 transform animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-700/30">
              <svg className="w-8 h-8 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Thank You!</h2>
            <p className="text-green-600 dark:text-green-200">Your message has been "sent" (simulated). We'll get back to you shortly (not really, this is a demo!).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder-slate-400 transition-all duration-200 text-slate-600 placeholder-slate-400"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder-slate-400 transition-all duration-200 text-slate-600 placeholder-slate-400"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="group">
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 transition-colors duration-200">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary-light dark:bg-slate-700/50 dark:text-slate-200 dark:placeholder-slate-400 transition-all duration-200 text-slate-600 placeholder-slate-400 resize-none"
                placeholder="What would you like to tell us?"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="relative w-full group overflow-hidden rounded-xl bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-primary transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:bg-white/10"></div>
              <div className="relative px-6 py-3">
                <span className="text-sm font-semibold text-white dark:text-slate-900">
                  Send Message
                </span>
              </div>
            </button>
          </form>
        )}
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Find us on imaginary social media
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors duration-200 flex items-center">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors duration-200 flex items-center">
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
            <a href="#" className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors duration-200 flex items-center">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;