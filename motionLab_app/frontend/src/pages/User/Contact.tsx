import { useState, useEffect } from "react";
import FormField from "@components/UI/FormField";
import FormButton from "@/components/UI/FormButton";

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-500/40 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 10}s`
          }}
        />
      ))}
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulated API call with animated wait
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-y-12 px-8 py-12 max-w-7xl mx-auto w-full text-white overflow-hidden">
      <ParticleBackground />
      
      <div className={`flex flex-col gap-y-4 max-w-3xl text-center z-10 transition-all duration-700 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 animate-gradient-x">Contact Us</h1>
        <p className="text-gray-300 text-lg">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className={`relative flex flex-col gap-y-6 backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg w-full max-w-2xl z-10 transition-all duration-700 delay-100 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover:shadow-xl hover:border-white/20`}
      >
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-mesh-pattern opacity-5 rounded-xl pointer-events-none"></div>
        
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
            <FormField
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              label="Name"
              extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50 focus:shadow-glow-sm"
            />
            {focusedField === 'name' && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur -z-10"></div>
            )}
          </div>
          
          <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
            <FormField
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              label="Email"
              extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50 focus:shadow-glow-sm"
            />
            {focusedField === 'email' && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur -z-10"></div>
            )}
          </div>
        </div>

        <div className={`relative transition-all duration-300 ${focusedField === 'subject' ? 'scale-[1.02]' : ''}`}>
          <FormField
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => handleFocus('subject')}
            onBlur={handleBlur}
            label="Subject"
            extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50 focus:shadow-glow-sm"
          />
          {focusedField === 'subject' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur -z-10"></div>
          )}
        </div>

        <div className={`flex flex-col gap-y-2 relative transition-all duration-300 ${focusedField === 'message' ? 'scale-[1.02]' : ''}`}>
          <label htmlFor="message" className="text-gray-300 text-sm">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            onFocus={() => handleFocus('message')}
            onBlur={handleBlur}
            required
            rows={6}
            className="bg-black/20 backdrop-blur-sm px-4 py-2 border border-white/5 focus:border-purple-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:shadow-glow-sm w-full text-white placeholder-gray-400 resize-none transition-all duration-300"
          />
          {focusedField === 'message' && (
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur -z-10"></div>
          )}
        </div>

        <div className="relative">
          <FormButton
            type="submit"
            label={loading ? "Sending..." : "Send Message"}
            loading={loading}
            extraStyles="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600/90 hover:to-blue-600/90 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]"
          />
          {loading && (
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 animate-shimmer" style={{ backgroundSize: '200% 100%', width: `${Math.random() * 100}%` }}></div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-3 animate-pulse-slow">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-3 animate-pulse-slow">
            <div className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 text-sm text-center">
                Thank you for your message! We'll get back to you soon.
              </p>
            </div>
          </div>
        )}
      </form>
      
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/5 to-black/0 pointer-events-none"></div>
    </div>
  );
};

export default ContactPage;
