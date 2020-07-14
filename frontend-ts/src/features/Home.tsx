import React, { FC, useState } from 'react';
import SignUpForm from 'features/auth/SignUpForm';
import Nav from 'components/global/Nav';
import Button from 'components/Button';

const Home: FC = () => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  return (
    <>
      <div className="gradient-gray-900-to-800 px-6 pt-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <header className="pb-12">
            <Nav />
          </header>

          {/* Hero */}
          <div className="flex flex-wrap md:flex-no-wrap">
            <div className="w-full md:w-1/2">
              <h1 className="pb-6 font-bold text-6xl tracking-wide text-gray-300 leading-tighter">Lorem ipsum dolor sit amet</h1>
              <p className="pb-8 font-light text-2xl tracking-wider text-gray-200">Vivamus gravida bibendum est id ornare. In malesuada finibus commodo. Proin id vulputate nisi.</p>
              
              <Button className={`w-full md:w-1/2 ${showSignUpForm ? 'hidden' : ''}`} type="light" size="lg" onClick={() => setShowSignUpForm(true)}>Join Now</Button>
            </div>
            <div className="hidden w-1/2"></div>

            <div className={`w-full md:w-1/2 ${showSignUpForm ? '' : 'hidden'}`}>
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>

      <main>
        Homepage Content
      </main>
    </>
  );
};

export default Home;
