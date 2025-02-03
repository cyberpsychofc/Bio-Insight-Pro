import React from 'react';

const Footer = React.forwardRef((_, ref) => {
  return (
    <footer
      ref={ref}
      className="text-white bg-gray-950 w-full py-4 text-center"
    >
      <p className="text-xl">
        © Copyright 2025, Bio Insight Pro. All rights reserved.
      </p>
    </footer>
  );
});

export default Footer;