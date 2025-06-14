
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
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">Contact Us</h1>
      
      <div className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-lg p-8 transition-colors duration-300">
        {isSubmitted ? (
          <div className="text-center p-6 bg-green-50 dark:bg-green-800 dark:bg-opacity-30 text-green-700 dark:text-green-300 rounded-md">
            <h2 className="text-2xl font-semibold">Thank You!</h2>
            <p className="mt-2">Your message has been "sent" (simulated). We'll get back to you shortly (not really, this is a demo!).</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark dark:hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Send Message (Simulated)
              </button>
            </div>
          </form>
        )}
        <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
          Alternatively, you can find us on imaginary social media: <br/>
          <a href="#" className="text-primary dark:text-primary-light hover:underline">@AIPromptArchitect</a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;