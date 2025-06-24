import React from 'react';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
        {/* Add your home page content here */}

        <div className="flex flex-col items-start mt-8">
          <Button1 text="Get Started" className="mb-4" />
          <Button1 inverted={false} to="/plans-pricing">
            See Prices <span className="ml-2">→</span>
          </Button1>
          <Button2 text="Learn More" href="https://example.com" className="mt-4" />

          <br />
          <Input1
            name="contact"
            placeholder="Enter phone number or email"
            variant="outlined"
          />
          <Input1 
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required={true}
          />
          <Input1
            name="email"
            placeholder="Enter your email"
            error="Please enter a valid email address"
          />


        </div>


      </main>
    </div>
  );
};

export default Home;