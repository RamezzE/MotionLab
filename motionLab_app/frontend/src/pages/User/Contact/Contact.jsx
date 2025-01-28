import React from "react";

const ContactPage = () => {
  return (
    <div className="w-screen min-h-screen text-white flex flex-col items-center px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-300">
          We'd love to hear from you! Please fill out the form below to get in touch.
        </p>
      </div>

      <form className="w-full max-w-3xl p-8 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            rows="5"
            className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition duration-300 shadow-md"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
