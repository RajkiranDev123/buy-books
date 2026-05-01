const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

// .mjs = “this file is definitely using modern JavaScript modules” : always ES Module

// PostCSS is a tool that processes (transforms) your CSS using plugins (Tailwind CSS) during (build time) before it reaches the browser.
// Build time = when your code is prepared before the app runs in the browser



// display: flex; ===> and then...

// now PostCSS (with plugin) converts:

// display: -webkit-box;
// display: -ms-flexbox;
// display: flex;

// Now works in more browsers

// Common plugins :
// Tailwind CSS → classes → real CSS
// Autoprefixer → adds browser support

// Library → you call it
// Plugin → the system calls it
// Compile time	Convert code (TS → JS)
// Build time ==>	Compile + bundle + optimize everything (full production preparation process)