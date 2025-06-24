import React from 'react';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import Sidebar from '../../components/layout/Sidebar';

const Home = () => {

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard</h1>

            {/* Dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Button1 text="Get Started" className="w-full" />
                  <Button2 text="Schedule for later" className="w-full" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <Input1
                  name="contact"
                  placeholder="Enter phone number or email"
                  variant="outlined"
                  className="mb-4"
                />
                <Input1
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  required={true}
                />
              </div>
            </div>

            {/* Additional section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pricing Options</h2>
              <p className="mb-4">Explore our flexible pricing plans designed to meet your needs.</p>
              <Button1
                inverted={false}
                to="/plans-pricing"
                className="mt-2"
              >
                See Prices <span className="ml-2">→</span>
              </Button1>
            </div>

            {/* Dashboard content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Button1 text="Get Started" className="w-full" />
                  <Button2 text="Schedule for later" className="w-full" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <Input1
                  name="contact"
                  placeholder="Enter phone number or email"
                  variant="outlined"
                  className="mb-4"
                />
                <Input1
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  required={true}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;