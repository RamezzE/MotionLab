import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="w-screen h-[80vh] flex flex-col items-center justify-center bg-gray-900 text-white px-4 py-10">
      <h1 className="text-6xl md:text-8xl font-bold mb-6">404</h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-12">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="bg-purple-600 text-white px-8 py-4 rounded-md hover:bg-purple-700 transition duration-300 text-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;