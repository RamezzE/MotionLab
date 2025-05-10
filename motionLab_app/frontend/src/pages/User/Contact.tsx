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
    <div className="flex flex-col items-center gap-y-8 px-8 w-screen text-white">
      <div className="flex flex-col gap-y-4 max-w-3xl text-center">
        <h1 className="font-bold text-5xl md:text-6xl">Contact Us</h1>
        <p className="text-gray-300 text-lg">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6 bg-gray-800/30 backdrop-blur-sm p-8 rounded-lg w-full max-w-2xl"
      >
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <FormField
            type="text"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            label="Name"
            extraStyles="bg-gray-900"
          />
          <FormField
            type="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            extraStyles="bg-gray-900"
          />
        </div>

        <FormField
          type="text"
          id="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          label="Subject"
          extraStyles="bg-gray-900"
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
            className="bg-gray-900 px-4 py-2 border border-gray-700 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-white placeholder-gray-500"
          />
        </div>

        <FormButton
          type="submit"
          label="Send Message"
          loading={loading}
          extraStyles="w-full"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm text-center">
            Thank you for your message! We'll get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactPage;
