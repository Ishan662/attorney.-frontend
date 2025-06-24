import React from 'react';
import Header from '../../components/layout/Header';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
        {/* Add your home page content here */}
      </main>
    </div>
  );
};

export default Home;