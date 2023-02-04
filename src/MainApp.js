

import React from 'react';
import Footer from './www/layout/Footer';
import Navbar from './www/layout/Navbar';
import Section from './www/layout/Section';

function MainApp(props) {
   return (
      <div className='main-app'>
         <Navbar />
         <Section />
         <Footer />
      </div>
   );
}

export default MainApp;