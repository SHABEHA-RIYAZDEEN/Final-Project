import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function HomePage() {
    const [current, setCurrent] = useState(0);
    const topics = [
        {
            "src": "https://png.pngtree.com/background/20230614/original/pngtree-woman-s-face-using-artificial-intelligence-technology-picture-image_3529531.jpg",
            "title": "Emotion Detection Technology",
            "description": "Explore emotion detection technology designed to analyze students' facial expressions, providing insights into their emotional states and enhancing emotional intelligence development."
        },
        {
            "src": "https://t4.ftcdn.net/jpg/02/45/20/23/360_F_245202356_XXc5PeS1xbFP2SJ0zz2zCfLwoVAixAlL.jpg",
            "title": "Interactive Emotional Learning Tools",
            "description": "Discover interactive learning tools equipped with emotion recognition capabilities, facilitating student engagement and fostering empathy and social-emotional learning."
        },
        {
            "src": "https://theleaflet.in/wp-content/uploads/2022/04/Facial-Recognition-9.png",
            "title": "Emotion-Aware Content Management System",
            "description": "Optimize educational content delivery with an emotion-aware content management system, utilizing facial recognition technology to adapt content based on students' emotional responses for personalized learning journeys."
        }
    ];
    
    
    

    const nextSlide = () => {
        setCurrent(current === topics.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? topics.length - 1 : current - 1);
    };

    return (
        <div className="relative ">
            <div className="max-w-screen-xl mx-auto">
                {topics.map((slide, index) => (
                    <div key={index} className={`${index === current ? 'block' : 'hidden'} relative w-full bg-black `}>
                        <img  src={slide.src} alt="Travel Image" className="w-full h-96 object-cover"/>
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center flex-col text-white p-4">
                            <h1 className="text-4xl font-bold">{slide.title}</h1>
                            <p className="text-xl mt-2">{slide.description}</p>
                        </div>
                    </div>
                ))}
                <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full focus:outline-none ml-4">
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 rounded-full focus:outline-none mr-4">
                    <FontAwesomeIcon icon={faAngleRight} />
                </button>
            </div>
        </div>
    );
}

export default HomePage;