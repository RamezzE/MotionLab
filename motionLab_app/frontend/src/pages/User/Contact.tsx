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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center gap-y-4 px-8 w-screen text-white">
      <div className="flex flex-col gap-y-4 text-center">
        <h1 className="font-bold text-5xl">Contact Us</h1>
        <p className="text-gray-300 text-sm sm:text-lg">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      <form className="flex flex-col gap-y-6 rounded-lg w-full max-w-3xl">
        <FormField
          label="Name"
          id="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
        />

        <FormField
          label="Email"
          id="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
        />

        <FormField
          label="Subject"
          id="subject"
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />

        <FormField
          label="Message"
          id="message"
          type="textarea"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
        />

        <div className="text-center">
          <FormButton
            label="Send Message"
            onClick={() => { }}
            loading={false}
            theme="default"
            fullWidth={false}
            textSize="lg"
          />

        </div>
      </form>
    </div>
  );
};

export default ContactPage;
