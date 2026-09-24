import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Import images directly from your src/img folder
import risehome from '../../img/home.png';
import risehome1 from '../../img/home1.png';

const Hero = () => {
  const heroRef = useRef(null);
  const bannerImagesRef = useRef([]);

  const images = [risehome, risehome1];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const imgs = bannerImagesRef.current;
      
      if (!imgs || imgs.length < 2) return;

      // Base setup: sirf pehli image visible rahegi
      gsap.set(imgs, { opacity: 0 });
      gsap.set(imgs[0], { opacity: 1 });

      // Seamless crossfade timeline
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(imgs[0], { opacity: 1, duration: 4 }) // Pehli image ko 4 second roko
        .to(imgs[0], { opacity: 0, duration: 1.5 }, "+=0") // Fade out
        .to(imgs[1], { opacity: 1, duration: 1.5 }, "<")   // Fade in (same time par)
        .to(imgs[1], { opacity: 1, duration: 4 })          // Dusri image ko 4 second roko
        .to(imgs[1], { opacity: 0, duration: 1.5 }, "+=0") // Fade out
        .to(imgs[0], { opacity: 1, duration: 1.5 }, "<");  // Pehli image wapas fade in

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-24 pb-12 bg-white flex justify-center w-full">
      {/* 
        Width ko 99% aur max-width ko 1920px (Full HD) kar diya gaya hai.
        Isse width ke sath-sath height bhi apne aap maximum ho jayegi bina image kate.
      */}
      <div 
        ref={heroRef} 
        className="relative w-[99%] max-w-[1920px] mx-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-white"
      >
        {images.map((imgSrc, index) => (
          <img 
            key={index}
            ref={el => bannerImagesRef.current[index] = el}
            src={imgSrc} 
            alt={`Rise Jhansi Banner ${index + 1}`} 
            /* 
              Pehli image 'relative' hai taaki box ki proper height ban sake.
              Dusri image 'absolute' hai taaki wo pehli ke theek upar aa jaye.
              h-auto ensure karega ki image crop na ho.
            */
            className={`w-full h-auto object-contain ${
              index === 0 ? 'relative' : 'absolute top-0 left-0'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;