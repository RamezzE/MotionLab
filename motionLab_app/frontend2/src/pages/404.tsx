import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-gray-900 px-4 py-10 w-screen h-[80vh] text-white">
            <h1 className="mb-6 font-bold text-6xl md:text-8xl">404</h1>
            <p className="mb-12 text-gray-300 text-xl md:text-2xl">
                Oops! The page you’re looking for doesn’t exist.
            </p>
            <Link
                to="/"
                className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-md text-white text-lg transition duration-300"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFoundPage;