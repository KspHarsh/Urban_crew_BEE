import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Home from './Home';
import About from './About';
import Services from './Services';
import Contact from './Contact';

export default function LandingPage() {
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <div className={`preloader ${loading ? '' : 'hidden'}`}>
                    <div className="wrench">
                        <i className="fa-solid fa-wrench" />
                    </div>
                </div>
            )}

            <Navbar />
            <Home />
            <About />
            <Services />
            <Contact />
            <Footer />
        </>
    );
}
