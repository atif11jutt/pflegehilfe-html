module.exports = {
  mode: 'jit',
  purge: [
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // ====================Font Family============================
      fontFamily: {
        'cera-pro': 'Cera Pro',
        'roboto': 'Roboto',
        'barlow': 'Barlow',
      },
      // ====================font size============================
      fontSize: {
        '40': '40px',
        '28': '28px',
      },
      // ====================Line Height============================
      lineHeight: {
        '50': '50px',
        '42': '42px',
      },
      // ====================Colors============================
      colors: {
        'dark-black': '#111111',
        'primary-dark': '#1679D0',
        'primary': '#54A7EB',
        'gray-light': '#F9F9F9',
        'blue-primary': '#4192D9',
        'sky-blue': '#F2F9FF',
        'navy': '#004B8D',
        'orange': '#FCBD03',
        'light': '#363636',
        'dark': "#002E57",
      },
      // ====================Grid columns============================
      gridTemplateColumns: {
        'customer': '1fr minmax(400px , 600px)',
        'service': '1fr minmax(400px , 765px)',
        'number-line': '1fr min-content 1fr',
      },

      // ====================Max Width============================
      maxWidth: {
        '1920': '1920px',
        '1270': '1270px',
        '850': '850px',
      },
      // ====================width===========================
      width: {
        '1538': '1538px',
        '1018': '1018px',
        '600': '600px',
        '180': '180px',
      },
      // ====================Height===========================
      height: {
        '50px': '50px',
        '700': '700px',
        '460': '460px',
        '1538': '1538px',
        '1018': '1018px',
        '600': '600px',
        '70': '70px',
      },

      // ====================Background Image============================
      backgroundImage: {
        'hero-gradient': 'linear-gradient(73.24deg, #004B8D 40.99%, #54A7EB )',
        'card-gradient': 'linear-gradient(21.73deg, #004B8D 2.22%, #4192D9 106.94%)',
        'footer-gradient': 'linear-gradient(23.37deg, #004B8D 4.49%, #4192D9 129.7%)',
      },

      // ====================Z-INDEX============================
      zIndex: {
        'back': "-1",
      },

      // ====================Z-INDEX============================
      borderRadius: {
        '5px': "5px",
        '10px': "10px",
      },

      // ====================FILTER DROP SHADOW============================
      dropShadow: {
        'service-img': "10px 20px 40px rgba(0, 75, 141, 0.25)",
        'header-img': "\-10px 40px 70px rgba(0, 42, 80, 0.5)",
      },

      // ====================BOX SHADOW============================
      boxShadow: {
        'service-card': "0px 20px 40px -2px rgba(186, 228, 230, 0.5)",
        'btn-cta': "0px 15px 30px -2px rgba(2, 68, 126, 0.4)",
      },

      // ====================SPACING============================
      spacing: {
        '25px': "25px",
        '50px': "50px",
        '60px': "60px",
        '70px': "70px",
        '90px': "90px",
        '100px': "100px",
      },

      // ====================SPACING============================
      inset: {
        '90%': '90%',
      },


    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}