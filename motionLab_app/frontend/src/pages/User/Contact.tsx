import { useState } from "react";
import FormField from "@components/UI/FormField";
import FormButton from "@/components/UI/FormButton";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // TODO: Implement contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-12 px-8 py-12 max-w-7xl mx-auto w-full text-white">
      <div className="flex flex-col gap-y-4 max-w-3xl text-center">
        <h1 className="font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300">Contact Us</h1>
        <p className="text-gray-300 text-lg">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6 backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg w-full max-w-2xl"
      >
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <FormField
            type="text"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            label="Name"
            extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50"
          />
          <FormField
            type="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50"
          />
        </div>

        <FormField
          type="text"
          id="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          label="Subject"
          extraStyles="bg-black/20 backdrop-blur-sm border-white/5 focus:border-purple-500/50"
        />

        <div className="flex flex-col gap-y-2">
          <label htmlFor="message" className="text-gray-300 text-sm">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Your message..."
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="bg-black/20 backdrop-blur-sm px-4 py-2 border border-white/5 focus:border-purple-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 w-full text-white placeholder-gray-400 resize-none"
          />
        </div>

        <FormButton
          type="submit"
          label="Send Message"
          loading={loading}
          extraStyles="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600/90 hover:to-blue-600/90 backdrop-blur-sm"
        />

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm text-center">
              Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
