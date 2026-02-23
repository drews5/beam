import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, ArrowUpRight, ArrowRight, Mail, Menu, X } from 'lucide-react';
import { supabase } from './supabaseClient';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero & Nav entrance
            const heroTl = gsap.timeline();
            heroTl.from(".nav-entrance", { y: -100, opacity: 0, duration: 1.2, ease: "power4.out" })
                .from(".hero-line", { y: 60, opacity: 0, stagger: 0.15, duration: 1.2, ease: "power4.out" }, "-=0.8")
                .from(".hero-bg-accent", { scale: 0.8, opacity: 0, duration: 2, ease: "power2.out" }, "-=1");

            // About section
            const aboutTl = gsap.timeline({ scrollTrigger: { trigger: "#about", start: "top 80%" } });
            aboutTl.fromTo(".about-item", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power4.out" })
                .fromTo(".about-card", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }, "-=1");

            // Instagram / Feed section
            gsap.from(".feed-header", {
                scrollTrigger: { trigger: "#feed", start: "top 85%" },
                opacity: 0, y: 40, duration: 1.2, ease: "power4.out"
            });
            gsap.from(".feed-item", {
                scrollTrigger: { trigger: "#feed", start: "top 80%" },
                opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "power3.out",
                clearProps: "all"
            });

            // Board section
            const boardTl = gsap.timeline({ scrollTrigger: { trigger: "#board", start: "top 85%" } });
            boardTl.from(".board-header", { opacity: 0, y: 40, duration: 1.2, ease: "power4.out" })
                .from(".board-card", { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "power3.out", clearProps: "all" }, "-=0.8");

            // Contact section
            gsap.from("#contact > div", {
                scrollTrigger: { trigger: "#contact", start: "top 85%" },
                opacity: 0, y: 40, duration: 1.4, ease: "power4.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="paper-texture min-h-screen bg-cream text-ink-black font-body selection:bg-riso-purple selection:text-cream">
            <SmartNavbar />
            <Hero />
            <About />
            <InstagramFeed />
            <Leadership />
            <Contact />
            <Footer />
        </div>
    );
}

function StarField({ count, color = "bg-white/90", maxScale = 1 }) {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {[...Array(count)].map((_, i) => (
                <Star key={i} index={i} color={color} maxScale={maxScale} />
            ))}
        </div>
    );
}

function Star({ color, maxScale, index }) {
    const starRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const animateFade = (isFirstRun) => {
                if (!starRef.current) return;

                const maxOpacity = Math.random() * 0.6 + 0.3;
                const maxStarScale = (Math.random() * 0.5 + 0.5) * maxScale;
                const durationIn = Math.random() * 4 + 3;
                const durationOut = Math.random() * 4 + 3;
                const waitTime = isFirstRun ? Math.random() * 4 : Math.random() * 3 + 1;

                if (!isFirstRun) {
                    gsap.set(starRef.current, {
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`
                    });
                }

                gsap.timeline({ onComplete: () => animateFade(false) })
                    .to(starRef.current, { duration: waitTime })
                    .to(starRef.current, {
                        opacity: maxOpacity,
                        scale: maxStarScale,
                        duration: durationIn,
                        ease: "sine.inOut"
                    })
                    .to(starRef.current, {
                        opacity: 0,
                        scale: 0,
                        duration: durationOut,
                        ease: "sine.inOut"
                    });
            };

            gsap.set(starRef.current, {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
                scale: 0
            });

            // Some stars start fully visible so the sky isn't empty at load
            if (index % 3 === 0) {
                gsap.set(starRef.current, {
                    opacity: Math.random() * 0.6 + 0.2,
                    scale: (Math.random() * 0.5 + 0.3) * maxScale
                });
                gsap.to(starRef.current, {
                    opacity: 0,
                    scale: 0,
                    duration: Math.random() * 4 + 3,
                    ease: "sine.inOut",
                    onComplete: () => animateFade(false)
                });
            } else {
                animateFade(true);
            }
        });
        return () => ctx.revert();
    }, [maxScale, index]);

    return (
        <div
            ref={starRef}
            className={`absolute rounded-full ${color} mix-blend-screen opacity-0`}
            style={{
                width: '5px',
                height: '5px',
                boxShadow: `0 0 15px rgba(255,255,255,0.8)`
            }}
        />
    );
}

function ShootingStar({ index }) {
    const starRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const animate = (isFirstRun) => {
                if (!starRef.current) return;

                const yPos = Math.random() * 90 + 5; // Height percentage
                const duration = 12; // Flat 12s duration for everyone

                if (isFirstRun) {
                    // Stagger the first run heavily so there's an even distribution on screen
                    const initialX = 90 - (index * 35); // 90vw, 55vw, 20vw, -15vw, -50vw
                    gsap.set(starRef.current, {
                        x: `${initialX}vw`,
                        y: `${yPos}vh`,
                        opacity: 0.8,
                        scaleX: 1, // Force exact same size
                        rotation: 0
                    });

                    // Proportional duration to finish their first trip
                    const remainingDist = 110 - initialX;
                    const travelTime = (remainingDist / 130) * duration;

                    gsap.to(starRef.current, {
                        x: "110vw",
                        duration: travelTime,
                        ease: "none",
                        onComplete: () => {
                            gsap.to(starRef.current, { opacity: 0, duration: 1, onComplete: () => animate(false) });
                        }
                    });
                    return;
                }

                gsap.set(starRef.current, {
                    x: "-20vw",
                    y: `${yPos}vh`,
                    opacity: 0,
                    scaleX: 1, // Same size
                    rotation: 0 // Straight horizontal
                });

                gsap.to(starRef.current, {
                    opacity: 0.8,
                    x: "110vw",
                    duration: duration,
                    delay: Math.random() * 2, // Short random delay between respawns
                    ease: "none",
                    onComplete: () => {
                        gsap.to(starRef.current, {
                            opacity: 0,
                            duration: 1,
                            onComplete: () => animate(false)
                        });
                    }
                });
            };
            animate(true);
        });
        return () => ctx.revert();
    }, [index]);

    return (
        <div
            ref={starRef}
            className="absolute top-0 left-0 h-[2px] w-[150px] bg-gradient-to-r from-transparent via-white to-transparent opacity-0 mix-blend-screen pointer-events-none"
            style={{ transformOrigin: "left center" }}
        />
    );
}

function WordScroller() {
    const listRef = useRef(null);
    const words = [
        "creative industries",
        "entertainment",
        "the arts",
        "music business",
        "filmmaking",
        "designing",
        "production",
        "sporting events",
        "curation",
        "content creation",
        "creative industries"
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // Hold first word
            tl.to({}, { duration: 4.5 });

            const mid = words.length / 2;

            // Scroll through others smoothly
            for (let i = 1; i < words.length - 1; i++) {
                const distFromMid = Math.abs(i - mid);
                const speedMult = distFromMid / mid;
                // Fast in the middle, slow at the edges
                const dur = 0.15 + (speedMult * 0.35);
                const hold = 0.1 + (speedMult * 0.45);

                const label = `move${i}`;
                tl.addLabel(label);

                tl.to(listRef.current, {
                    yPercent: -(i * (100 / words.length)),
                    duration: dur,
                    ease: "power2.inOut"
                }, label);

                tl.to(listRef.current, {
                    filter: "blur(3px)",
                    duration: dur / 2,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                }, label);

                tl.to({}, { duration: hold });
            }

            // Go to the last word (creative industries clone) - slow down at arrival
            const lastDist = Math.abs((words.length - 1) - mid);
            const durFinal = 0.15 + ((lastDist / mid) * 0.35);

            tl.addLabel("moveLast");

            tl.to(listRef.current, {
                yPercent: -((words.length - 1) * (100 / words.length)),
                duration: durFinal,
                ease: "power3.inOut"
            }, "moveLast");

            tl.to(listRef.current, {
                filter: "blur(2px)",
                duration: durFinal / 2,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut"
            }, "moveLast");

            // Jump back to true beginning seamlessly
            tl.set(listRef.current, { yPercent: 0, filter: "blur(0px)" });
        });
        return () => ctx.revert();
    }, [words.length]);

    return (
        <span className="relative inline-flex overflow-hidden align-bottom h-[1.3em]">
            <span className="opacity-0 pointer-events-none block whitespace-nowrap">creative industries</span>
            <span ref={listRef} className="absolute left-0 top-0 flex flex-col w-full text-left">
                {words.map((word, i) => (
                    <span key={i} className="h-[1.3em] flex items-center whitespace-nowrap text-left block">{word}</span>
                ))}
            </span>
        </span>
    );
}

// ————— COMPONENTS ————— //

function Navbar({ theme = "dark", style = {}, className = "", onMenuToggle, menuOpen }) {
    // theme "dark" = Transparent/Hero style (White text)
    // theme "light" = White Glass style (Black text)

    const isHero = theme === "dark" && !menuOpen;
    const showBackground = theme === "light" || menuOpen;

    return (
        <nav
            style={style}
            className={`pointer-events-auto flex w-full items-center justify-between transition-all duration-700 rounded-[2.5rem] border ${className} ${isHero ? `max-w-[1400px] ${showBackground ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-transparent border-transparent'} py-4 px-6 md:px-12` : 'max-w-[1000px] bg-white/40 backdrop-blur-[60px] saturate-[200%] border-white/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15),inset_0_2px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.05)] py-3 px-6 md:px-8'}`}
        >
            <div className="flex items-center gap-4 relative z-20 shrink-0">
                <a href="#" className="transform transition-transform duration-300 hover:scale-110 block">
                    <div
                        className="h-8 md:h-9 w-24 md:w-28 relative overflow-hidden"
                        style={{
                            maskImage: 'url(/logo-dark.svg)',
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskImage: 'url(/logo-dark.svg)',
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                        }}
                    >
                        {isHero ? (
                            <div className="absolute inset-0 bg-white"></div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-[#1a0b2e]"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-riso-purple via-[#1a0b2e] to-black scale-150"></div>
                                <div className="absolute inset-0 opacity-100">
                                    <StarField count={40} maxScale={0.3} color="bg-white" />
                                </div>
                            </>
                        )}
                    </div>
                </a>
            </div>

            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 lg:gap-12 font-serif text-lg lg:text-xl tracking-wide w-auto justify-center">
                <a href="#" className="group relative">
                    <span className={`transition-all duration-500 hover:text-riso-purple drop-shadow-sm ${isHero ? 'text-white hover:text-riso-purple' : 'text-ink-black/80 hover:text-ink-black'}`}>Home</span>
                </a>
                <a href="#about" className="group relative">
                    <span className={`transition-all duration-500 hover:text-riso-purple drop-shadow-sm ${isHero ? 'text-white hover:text-riso-purple' : 'text-ink-black/80 hover:text-ink-black'}`}>About</span>
                </a>
                <a href="#feed" className="group relative">
                    <span className={`transition-all duration-500 hover:text-riso-purple drop-shadow-sm ${isHero ? 'text-white hover:text-riso-purple' : 'text-ink-black/80 hover:text-ink-black'}`}>Instagram</span>
                </a>
                <a href="#board" className="group relative">
                    <span className={`transition-all duration-500 hover:text-riso-purple drop-shadow-sm ${isHero ? 'text-white hover:text-riso-purple' : 'text-ink-black/80 hover:text-ink-black'}`}>Board</span>
                </a>
            </div>

            <div className="relative z-20 hidden md:block shrink-0">
                <a href="#contact" className={`group relative inline-flex items-center justify-center px-7 py-2.5 overflow-hidden border transition-all duration-500 font-serif text-lg rounded-[2rem] hover:-translate-y-0.5 ${isHero ? 'border-white/40 bg-white/10 text-white hover:bg-white hover:text-ink-black backdrop-blur-md' : 'border-white/80 bg-white/60 text-ink-black backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:bg-white/90 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]'}`}>
                    <span className="relative z-10 transition-colors duration-300">Contact</span>
                </a>
            </div>

            <button className={`md:hidden relative z-20 p-2 transition-colors ${isHero ? 'text-white' : 'text-ink-black/80 hover:text-ink-black'}`} onClick={onMenuToggle}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </nav>
    );
}

function SmartNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [clipTop, setClipTop] = useState(100); // Percentage or px? Let's use px.

    useEffect(() => {
        const updateClip = () => {
            const aboutSection = document.getElementById('about');
            const footerSection = document.querySelector('footer');

            if (!aboutSection) return;

            const aboutRect = aboutSection.getBoundingClientRect();
            const footerRect = footerSection ? footerSection.getBoundingClientRect() : null;

            // The nav is at the top. We want to show the "Light" nav (z-50) 
            // only where it's over the "Light" sections (About to just before Footer).

            // top of clipping is basically where the About section starts
            const start = Math.max(0, aboutRect.top);
            // bottom of clipping is where the Footer starts (Dark again)
            const end = footerRect ? Math.max(0, footerRect.top) : window.innerHeight * 2;

            setClipTop({ start, end });
        };

        window.addEventListener('scroll', updateClip);
        window.addEventListener('resize', updateClip);
        updateClip(); // Initial check

        return () => {
            window.removeEventListener('scroll', updateClip);
            window.removeEventListener('resize', updateClip);
        };
    }, []);

    // If menu is open, we just show the light theme fully for simplicity and usability
    // We use a polygon that covers the portion of the viewport where light-themed content exists.
    // Since Layer 2 is absolute inset-0 within a fixed-to-top container, 
    // clipping Layer 2 to these coordinates will correctly reveal/hide it over the background.
    const lightClipPath = menuOpen
        ? 'inset(0% 0% 0% 0%)'
        : `polygon(0 ${clipTop.start}px, 100% ${clipTop.start}px, 100% ${clipTop.end}px, 0 ${clipTop.end}px)`;

    return (
        <div className="nav-entrance fixed top-0 w-full z-50 flex flex-col items-center pt-4 md:pt-6 px-4 transition-all duration-700 pointer-events-none">
            {/* Layer 1: Dark/Hero Theme (Always there, but behind) */}
            <div className="absolute inset-0 w-full flex flex-col items-center pt-4 md:pt-6 px-4 pointer-events-none z-40">
                <Navbar
                    theme="dark"
                    menuOpen={menuOpen}
                    onMenuToggle={() => setMenuOpen(!menuOpen)}
                />
            </div>

            {/* Layer 2: Light/Scrolled Theme (Clipped to show only over white areas) */}
            <div
                className="absolute inset-0 w-full flex flex-col items-center pt-4 md:pt-6 px-4 pointer-events-none transition-none z-50"
                style={{
                    clipPath: lightClipPath
                }}
            >
                <Navbar
                    theme="light"
                    menuOpen={menuOpen}
                    onMenuToggle={() => setMenuOpen(!menuOpen)}
                />
            </div>


            {/* Mobile Menu Dropdown (Clipped to light theme usually, or just its own thing) */}
            <div className={`pointer-events-auto md:hidden overflow-hidden transition-all duration-500 ease-in-out w-full max-w-[1000px] mt-2 bg-white/40 backdrop-blur-[60px] saturate-[200%] border border-white/80 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15),inset_0_2px_2px_rgba(255,255,255,1)] rounded-3xl ${menuOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0 border-transparent shadow-none'}`}>
                <div className="flex flex-col items-center gap-6 font-serif text-2xl">
                    <a href="#" onClick={() => setMenuOpen(false)} className="text-ink-black/80 hover:text-riso-purple transition-colors">Home</a>
                    <a href="#about" onClick={() => setMenuOpen(false)} className="text-ink-black/80 hover:text-riso-purple transition-colors">About</a>
                    <a href="#feed" onClick={() => setMenuOpen(false)} className="text-ink-black/80 hover:text-riso-purple transition-colors">Instagram</a>
                    <a href="#board" onClick={() => setMenuOpen(false)} className="text-ink-black/80 hover:text-riso-purple transition-colors">Board</a>
                    <a href="#contact" onClick={() => setMenuOpen(false)} className="inline-block mt-2 px-8 py-3 bg-white/60 border border-white/80 shadow-sm rounded-[2rem] text-ink-black text-lg hover:bg-white transition-all">Contact Us</a>
                </div>
            </div>
        </div>
    );
}


function Hero() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: sbError } = await supabase
                .from('mailing_list')
                .insert([{ email }]);

            if (sbError) throw sbError;

            setSubmitted(true);
            setEmail("");
        } catch (err) {
            console.error('Error submitting to mailing list:', err);
            setError("Something went wrong. Please try again.");
            // Even if there's an error, we might want to pretend it worked for UX 
            // but let's be honest for now.
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-8 md:pl-12 md:pr-24 pt-24 pb-12 overflow-hidden bg-[#1a0b2e]">
            {/* Space background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-riso-purple/40 via-[#1a0b2e] to-[#0A0512]"></div>

            {/* Dynamic Star Field - Reduced Count */}
            <StarField count={40} />

            {/* Moving shooting stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <ShootingStar key={`hero-shoot-${i}`} index={i} />
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto w-full relative z-10 py-12">
                <h1 className="hero-line font-serif text-[clamp(2.5rem,8.5vw,8.5rem)] leading-[1.05] md:leading-[0.95] tracking-tight mb-10 text-cream drop-shadow-[0_0_20px_rgba(142,103,181,0.6)]">
                    Shining a light on <br />
                    <span className="relative inline-block">
                        {/* White Light Flare */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-white/20 blur-[50px] rounded-full -z-10 animate-pulse"></div>
                        <span className="italic text-riso-purple drop-shadow-[0_0_15px_rgba(142,103,181,0.8)] relative z-10 -ml-1"><WordScroller /></span>
                    </span> <br />
                    at the University of Minnesota.
                </h1>
                <div className="hero-line flex flex-col sm:flex-row gap-6 mt-12 items-center sm:items-stretch max-w-2xl w-full">
                    {submitted ? (
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 text-cream font-serif italic text-xl animate-in zoom-in duration-500">
                            Thanks! You've been added to the list. ✨
                        </div>
                    ) : (
                        <div className="w-full flex flex-col gap-2">
                            <form onSubmit={handleSubmit} className="flex w-full flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center bg-transparent sm:bg-white/95 sm:backdrop-blur-lg sm:rounded-full sm:p-2 sm:border sm:border-white/60 sm:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.15)] focus-within:border-riso-purple focus-within:ring-2 focus-within:ring-riso-purple/50 transition-all opacity-100 disabled:opacity-50">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email..."
                                    required
                                    disabled={loading}
                                    className="flex-1 bg-white/95 sm:bg-transparent px-6 py-4 sm:py-0 font-body text-ink-black placeholder:text-ink-black/50 outline-none w-full rounded-full border border-white/60 sm:border-none shadow-sm sm:shadow-none h-14 sm:h-auto"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-riso-purple text-cream px-6 sm:px-8 py-4 sm:py-3 rounded-full font-serif text-lg sm:text-xl whitespace-nowrap hover:bg-ink-black transition-colors shrink-0 shadow-md transform hover:-translate-y-0.5 w-full sm:w-auto h-14 sm:h-auto disabled:bg-riso-purple/50"
                                >
                                    {loading ? "Joining..." : "Join mailing list"}
                                </button>
                            </form>
                            {error && <p className="text-red-400 font-serif text-sm ml-6">{error}</p>}
                        </div>
                    )}
                    <a href="#about" className="hidden sm:inline-flex shrink-0 items-center justify-center px-10 py-3 border border-white/40 bg-white/10 backdrop-blur-md text-white font-serif italic text-lg hover:bg-white hover:text-ink-black transition-all duration-300 rounded-full h-14 sm:h-auto">
                        Learn more
                    </a>
                </div>
            </div>
        </section>
    );
}

function InstagramFeed() {
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        fetch("https://feeds.behold.so/qt0p7IwGv9w7iKxyMGl5")
            .then(res => res.json())
            .then(data => {
                // Behold specific integration based on user provided feed URL logic
                if (data && Array.isArray(data)) {
                    setFeed(data.slice(0, 4));
                } else if (data && data.posts) {
                    setFeed(data.posts.slice(0, 4));
                }
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <section id="feed" className="py-24 px-8 md:px-12 bg-cream-dark border-t-2 border-ink-black relative before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRkRGQkY3Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjYsIDE2LCAyNCwgMC4wNSkiPjwvcmVjdD4KPC9zdmc+')]">
            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="feed-header flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b-2 border-ink-black pb-4 gap-6">
                    <h2 className="font-serif text-5xl md:text-7xl">Instagram</h2>
                    <a href="https://instagram.com/beam.umn" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-riso-purple text-cream px-8 py-3 rounded-full font-serif text-lg hover:bg-ink-black transition-colors shadow-[4px_4px_0_0_#1A1018] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#1A1018]">
                        <Instagram size={20} /> follow @beam.umn
                    </a>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {feed.length > 0 ? feed.map((post, i) => (
                        <a key={i} href={post.permalink} target="_blank" rel="noreferrer" className="feed-item block relative aspect-[4/5] overflow-hidden group riso-card">
                            <img src={post.mediaUrl} alt={post.caption || "Instagram Post"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[30%] contrast-125 sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0" />
                            <div className="absolute inset-0 bg-ink-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                <p className="relative z-10 text-white font-body text-sm line-clamp-3 mb-4">{post.caption}</p>
                                <ArrowUpRight className="relative z-10 text-white" size={24} />
                            </div>
                        </a>
                    )) : (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-cream riso-card animate-pulse"></div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="about" className="py-32 md:py-48 px-8 md:px-12 relative overflow-hidden">
            <div className="about-item absolute top-0 right-0 w-1/2 h-full bg-riso-gradient opacity-30 -z-10 clip-path-polygon"></div>

            <div className="max-w-[1000px] mx-auto text-center md:text-left">

                <h2 className="about-item font-serif text-5xl md:text-7xl mb-12">Welcome to BEAM!</h2>

                <p className="about-item font-body text-xl md:text-2xl text-ink-black/80 leading-relaxed mb-16 relative before:absolute before:-left-8 before:top-2 before:h-full before:w-1 before:bg-riso-purple/40 before:rounded-full">
                    The Business of Entertainment, Arts, and Music (BEAM) at the University of Minnesota was founded to bridge the gap between students and the industries that shape culture and creativity. Recognizing the growing intersection of business and the arts, this organization provides a space for students to explore career paths, gain industry knowledge, and build connections with professionals. Through events and hands-on experiences, BEAM prepares its members to navigate and contribute to the evolving world of entertainment, arts, and media.
                </p>

                <div className="about-card riso-card p-10 md:p-16 relative overflow-hidden bg-cream">
                    {/* Halftone texture overlay */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 halftone-accent opacity-20 pointer-events-none rounded-full rotate-45"></div>

                    <h3 className="font-serif italic text-4xl md:text-5xl mb-8 text-riso-purple relative z-10">Our Mission</h3>

                    <p className="font-body text-xl md:text-2xl text-ink-black/80 leading-relaxed relative z-10">
                        BEAM's mission as a student organization is to educate current students at the University of Minnesota on the different careers and opportunities that exist within the arts and entertainment industry. BEAM also intends to bring different events and connections in the fields of entertainment, arts, and culture to students involved with the club. BEAM's goal is to allow students the chance to expand their knowledge on the ever-changing world of business from the perspective of industries such as fine arts, music, film, television, theater, and sports.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Leadership() {
    const [selectedMember, setSelectedMember] = useState(null);

    const board = [
        {
            name: "Sophia Lancaster",
            role: "President",
            email: "lanca095@umn.edu",
            linkedin: "#",
            bio: "Sophia is a junior in the Carlson School of Management at the University of Minnesota, majoring in Marketing and minoring in Business Analytics! Outside of Carlson, she is also pursuing a double major in Strategic Communication at the Hubbard School of Journalism. Within the university, Sophia is a part of Delta Sigma Pi, which is a professional business fraternity. She is also a member of Vocal U, which is an a cappella group on campus! Sophia has always been interested in the world of arts, entertainment, and music, and how it intersects with business; therefore, she co-founded BEAM so students with a similar interest at the University of Minnesota could get an inside look into the business side of the arts and entertainment industry. She looks forward to the future of BEAM and how it will shape the next generation of business leaders in creative industries!"
        },
        {
            name: "Drew Scheid",
            role: "Vice President",
            email: "schei468@umn.edu",
            linkedin: "#",
            bio: "Drew is a junior majoring in Management Information Systems and Business Analytics at the Carlson School of Management - University of Minnesota. At Carlson, he serves as Vice President of Diversity, Equity, and Inclusion on the Business Board and is involved as a Carlson Crew TA, community advisor, on the Undergraduate Student Government's Technology and Innovation committee, and the CoMIS international case competition board as Co-Director of Corporate Relations. He's also the treasurer of Vocal U A Cappella, a competitive vocal music group on campus. When not being a part of student organizations, Drew loves game nights with friends, discovering restaurants, and finding new hobbies. Drew has a passion for connecting business with creativity, which inspired him to get involved with starting BEAM. Through BEAM, his goal is to inspire students to follow their interests in entertainment, arts, and music, along with practical business experiences. He's excited to help shape this exciting new part of the student experience at the U!"
        },
        {
            name: "Ananya Sarangalwar",
            role: "Treasurer",
            email: "saran053@umn.edu",
            linkedin: "#",
            bio: "Ananya is a junior in the Carlson School of Management, majoring in Finance and Business Analytics with a minor in Business Law. Within the university Ananya is a part of Delta Sigma Pi, a professional business fraternity, Business Board, the undergraduate student government, and the Carlson Consulting Enterprise. Ananya has been interested in the performing arts since she was young with a passion for supporting artists and performers. As a co-founder of BEAM, she looks forward to connecting with other students who share similar interests and exploring the intersections of the entertainment, art, and music industries with various business sectors!"
        },
        {
            name: "Sophie Sullivan",
            role: "Vice President of Events",
            email: "sull1244@umn.edu",
            bio: "Sophie Sullivan is the Vice President of Events for BEAM. She is a sophomore majoring in Economics and Art History with a minor in Museum and Curatorial Studies. Sophie got involved with BEAM as it bridges her two majors and she wants to help bring a fine arts and museum focused perspective to the club. Her hobbies include reading, rock climbing, and going to art museums!"
        },
        {
            name: "Emma Vasa",
            role: "Vice President of Communications",
            email: "vasa0029@umn.edu",
            linkedin: "#",
            bio: "Hi, I'm Emma Vasa, a senior studying English and Strategic Communication. Music and the arts have played a major role in my life since I was young, and I have grown passionate about sharing that love with others. I see BEAM as an opportunity to connect with people who share a similar passion while growing one's knowledge and connections within the entertainment industry. When I'm not involved with BEAM, you can usually find me outdoors whether it's camping, hiking, trail running, or hammocking at the park. I also love spending my free time reading, bouldering, spending time with friends, or baking banana bread."
        },
        { name: "Sophie Nemo", role: "Vice President of Graphic Design" },
    ];

    return (
        <section id="board" className="py-24 px-8 md:px-12 bg-cream border-t-2 border-ink-black overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="board-header flex justify-between items-end mb-16">
                    <h2 className="font-serif text-5xl md:text-7xl">Meet the Board</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {board.map((m, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedMember(m)}
                            className="board-card riso-card group flex flex-col p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:bg-riso-purple/5"
                        >
                            <h3 className="font-serif text-3xl mb-2 group-hover:text-riso-purple transition-colors">{m.name}</h3>
                            <p className="font-serif text-lg italic text-riso-purple/80">{m.role}</p>
                            <div className="mt-8 flex items-center text-riso-purple font-serif text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Read Bio</span>
                                <ArrowUpRight size={18} className="ml-1" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal - only shown when a member is selected */}
            {selectedMember && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-black/60 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="riso-card bg-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 relative animate-in slide-in-from-bottom-8 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-riso-purple/10 rounded-full transition-colors"
                        >
                            <X size={32} className="text-riso-purple" />
                        </button>

                        <div className="mb-8 border-b-2 border-riso-purple/20 pb-6">
                            <h2 className="font-serif text-4xl md:text-5xl mb-2">{selectedMember.name}</h2>
                            <p className="font-serif text-xl italic text-riso-purple">{selectedMember.role}</p>
                        </div>

                        <div className="mb-10">
                            {selectedMember.bio ? (
                                <p className="font-body text-lg md:text-xl text-ink-black/80 leading-relaxed whitespace-pre-wrap">
                                    {selectedMember.bio}
                                </p>
                            ) : (
                                <p className="font-body text-lg text-ink-black/40 italic">Bio coming soon...</p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 font-serif">
                            {selectedMember.linkedin && (
                                <a
                                    href={selectedMember.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-3 bg-ink-black text-cream rounded-full hover:bg-riso-purple transition-colors flex items-center gap-2"
                                >
                                    LinkedIn
                                </a>
                            )}
                            {selectedMember.email && (
                                <a
                                    href={`mailto:${selectedMember.email}`}
                                    className="px-8 py-3 bg-riso-purple text-cream rounded-full hover:bg-ink-black transition-colors flex items-center gap-2 shadow-[4px_4px_0_0_#1A1018] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1A1018]"
                                >
                                    <Mail size={20} /> Contact
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="py-32 px-8 md:px-12 bg-cream-dark relative">
            <div className="max-w-[1400px] mx-auto text-center">
                <h2 className="font-serif text-5xl md:text-7xl mb-8">Get in Touch</h2>
                <p className="font-body text-xl md:text-2xl text-ink-black/60 max-w-2xl mx-auto mb-16">
                    Interested in learning more about the intersection of business and the arts? We'd love to hear from you.
                </p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                    <a href="mailto:hello@beamumn.org" className="group flex flex-col items-center gap-4 p-8 riso-card bg-cream min-w-[300px] hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-riso-purple/10 rounded-full flex items-center justify-center text-riso-purple group-hover:bg-riso-purple group-hover:text-cream transition-colors duration-300">
                            <Mail size={32} />
                        </div>
                        <h3 className="font-serif text-2xl">Email Us</h3>
                        <p className="font-body text-riso-purple font-medium">hello@beamumn.org</p>
                    </a>

                    <a href="https://instagram.com/beam.umn" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-4 p-8 riso-card bg-cream min-w-[300px] hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 bg-riso-purple/10 rounded-full flex items-center justify-center text-riso-purple group-hover:bg-riso-purple group-hover:text-cream transition-colors duration-300">
                            <Instagram size={32} />
                        </div>
                        <h3 className="font-serif text-2xl">Follow Us</h3>
                        <p className="font-body text-riso-purple font-medium">@beam.umn</p>
                    </a>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="relative bg-[#1a0b2e] text-cream py-8 px-8 overflow-hidden border-t-2 border-riso-purple/40">
            {/* Space background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-riso-purple/20 via-[#1a0b2e] to-[#0A0512]"></div>

            {/* Dynamic Star Field */}
            <StarField count={30} color="bg-white/70" maxScale={0.7} />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <img src="/logo-dark.svg" alt="BEAM" className="h-6 brightness-0 invert opacity-80" />
                    <div className="text-left">
                        <p className="text-white/60 font-body text-sm">
                            © 2026 Business of Entertainment, Arts, and Music.
                        </p>
                        <p className="text-white/40 font-body text-[10px] md:text-xs">
                            This group is a Registered Student Organization and is independent from the University of Minnesota.
                        </p>
                    </div>
                </div>

                <a href="https://instagram.com/beam.umn" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-all duration-300">
                    <Instagram size={20} />
                </a>
            </div>

            <style>{`
                @keyframes shootingStarAnim {
                    0% { transform: translateX(0) scale(1); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateX(110vw) scale(0.2); opacity: 0; }
                }
                .shooting-star {
                    animation: shootingStarAnim 6s linear infinite;
                }
            `}</style>
        </footer>
    );
}


