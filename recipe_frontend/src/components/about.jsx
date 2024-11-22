import React from 'react';
import '../css/About.css'
import insta from '../assets/social.png'
import fb from '../assets/facebook.png'
import twitter from '../assets/twitter.png'
import pin from '../assets/logo.png'
import banana from '../assets/veg/banana.png'
import capsicum from '../assets/veg/capsicum.png'
import carrot from '../assets/veg/carrot.png'
import cauliflower from '../assets/veg/cauliflower.png'
import mango from '../assets/veg/mango.png'
import tomato from '../assets/veg/tomato.png'

function AboutUs() {
  return (
    <>
      <div id="about-us-container">
        <div id="top">
          <div id="about-us-text">
            <h1>About Us</h1>
            <br />
            <p>
              Our mission at CookBook is to make everyday cooking fun,
              because we believe that cooking is key to a happier and
              healthier life for people, communities and the planet. We
              empower homecooks all over the world to help each other
              by sharing recipes and cooking tips.
            </p>
            <div class="download">
              <button type="button" class="btn"><svg xmlns="http://www.w3.org/2000/svg"
                width="20" height="20" fill="currentColor" class="bi bi-apple mb-1" viewBox="0 0 16 16">
                <path
                  d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
                <path
                  d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43Zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282Z" />
              </svg> <p>Download on the <br /> App Store</p></button>
              <button type="button" class="btn"><svg xmlns="http://www.w3.org/2000/svg"
                width="20" height="20" fill="currentColor" class="bi bi-google-play mb-1" viewBox="0 0 16 16">
                <path
                  d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96 2.694-1.586Zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055l7.294-4.295ZM1 13.396V2.603L6.846 8 1 13.396ZM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27Z" />
              </svg> <p>Get It On <br /> Google Play</p></button>
            </div>
          </div>
          <div id="learn-more">
            <h1>Learn More</h1>
            <br />
            <div id="link">
              <a href="https://cookbook.ai/community" target="_blank" rel="noopener noreferrer">CookBook Community</a>
              <a href="https://cookbook.ai/feedback" target="_blank" rel="noopener noreferrer">Feedback</a>
              <a href="https://cookbook.ai/blog" target="_blank" rel="noopener noreferrer">Blog</a>
              <a href="https://cookbook.ai/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <a href="https://cookbook.ai/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </div>
            <div className="social-media">
              <a href="https://www.instagram.com/cookbook.ai/" target="_blank" rel="noopener noreferrer">
                <img className='social' src={insta} alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/cookbook.ai" target="_blank" rel="noopener noreferrer">
                <img className='social' src={fb} alt="Facebook" />
              </a>
              <a href="https://www.pinterest.com/cookbook_ai/" target="_blank" rel="noopener noreferrer">
                <img className='social' src={pin} alt="Pinterest" />
              </a>
              <a href="https://twitter.com/cookbook_ai" target="_blank" rel="noopener noreferrer">
                <img className='social' src={twitter} alt="Twitter" />
              </a>
            </div>
          </div>
        </div>
        <div className="down">
          <div className="veg">
            <img src={capsicum} alt="" />
            <img src={cauliflower} alt="" />
            <img src={mango} alt="" />
            <img src={tomato} alt="" />
            <img src={banana} alt="" />
            <img src={carrot} alt="" />

          </div>
        </div>

      </div>

    </>

  );
}

export default AboutUs;