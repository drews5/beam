import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, MapPin, Calendar, Clock, ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { events } from '../data/events';
import gsap from 'gsap';

export default function EventDetail() {
    const { eventId } = useParams();
    const event = events.find(e => e.id === eventId);
    const containerRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const ctx = gsap.context(() => {
            gsap.from(".fade-in", {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 1,
                ease: "power3.out"
            });
            gsap.from(".image-zoom", {
                scale: 1.1,
                duration: 2,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, [eventId]);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e] text-cream">
                <div className="text-center font-serif">
                    <h1 className="text-4xl mb-4 text-riso-purple">Event not found</h1>
                    <Link to="/" className="text-white/60 hover:text-white transition-colors border-b border-white/20 pb-1">Return Home</Link>
                </div>
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-cream text-ink-black selection:bg-riso-purple selection:text-cream">
            {/* Soft Nav Backup Layer */}
            <div className="fixed top-0 w-full h-24 bg-cream/90 backdrop-blur-md z-10 pointer-events-none"></div>

            <Link
                to="/"
                className="fixed top-6 left-6 md:top-8 md:left-12 z-50 flex items-center gap-2 px-6 py-3 bg-white border border-ink-black/10 shadow-md rounded-full font-serif text-ink-black hover:bg-riso-purple hover:text-cream hover:border-riso-purple transition-all duration-300 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Main Page
            </Link>

            {/* Main Content Layout */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 pt-32 md:pt-40 pb-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Left Column: Image Area */}
                    <div className="lg:col-span-5 fade-in">
                        <div className="lg:sticky lg:top-32">
                            <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-xl border border-ink-black/5 transform hover:-translate-y-1 transition-transform duration-500">
                                <div className="rounded-[1.5rem] overflow-hidden bg-cream-dark">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="image-zoom w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info Area */}
                    <div className="lg:col-span-7 flex flex-col gap-10">

                        {/* Title and Categories */}
                        <div className="fade-in">
                            {event.isFeatured && (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-riso-purple/10 text-riso-purple rounded-full font-serif italic text-sm mb-6">
                                    <Star size={14} className="fill-riso-purple" /> Featured Event
                                </div>
                            )}

                            <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight tracking-tight text-ink-black">
                                {event.title}
                            </h1>

                            {event.categories && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {event.categories.map((cat, i) => (
                                        <span key={i} className="px-4 py-1.5 bg-white border border-ink-black/10 text-ink-black/70 rounded-full text-sm font-medium tracking-wide shadow-sm">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Logistics Dashboard */}
                        <div className="fade-in bg-white rounded-[2rem] p-8 shadow-lg border border-ink-black/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-riso-purple/10 rounded-xl flex items-center justify-center text-riso-purple shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="text-xs uppercase tracking-wider text-ink-black/50 font-bold mb-1">Date</p>
                                        <p className="text-lg md:text-xl font-serif text-ink-black">{event.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-riso-purple/10 rounded-xl flex items-center justify-center text-riso-purple shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="text-xs uppercase tracking-wider text-ink-black/50 font-bold mb-1">Time</p>
                                        <p className="text-lg md:text-xl font-serif text-ink-black">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 md:col-span-2">
                                    <div className="w-12 h-12 bg-riso-purple/10 rounded-xl flex items-center justify-center text-riso-purple shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="pt-0.5">
                                        <p className="text-xs uppercase tracking-wider text-ink-black/50 font-bold mb-1">Location</p>
                                        <p className="text-lg md:text-xl font-serif text-ink-black mb-1">{event.location}</p>
                                        <a
                                            href={event.directions}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-riso-purple hover:underline font-serif italic text-base"
                                        >
                                            View on Google Maps <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-ink-black/5">
                                <a
                                    href={event.directions}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-riso-purple text-cream rounded-2xl font-serif text-xl hover:bg-ink-black transition-colors duration-300 shadow-md transform hover:-translate-y-0.5"
                                >
                                    Get Directions
                                </a>
                                <button
                                    onClick={handleShare}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-cream border border-ink-black/10 text-ink-black rounded-2xl font-serif text-xl hover:bg-ink-black/5 transition-colors duration-300 shadow-sm"
                                >
                                    <Share2 size={20} /> Share Event
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="fade-in bg-white rounded-[2rem] p-8 shadow-lg border border-ink-black/5">
                            <h3 className="font-serif italic text-2xl md:text-3xl mb-6 text-riso-purple">About the Event</h3>
                            <p className="font-body text-lg md:text-xl text-ink-black/80 leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {/* Highlights (if they exist) */}
                        {event.highlights && (
                            <div className="fade-in bg-[#f4f2ee] rounded-[2rem] p-8 md:p-10 shadow-lg border border-ink-black/5 relative overflow-hidden">
                                <h3 className="font-serif italic text-2xl md:text-3xl mb-6 relative z-10 text-ink-black">Event Highlights</h3>
                                <ul className="space-y-4 relative z-10">
                                    {event.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-ink-black/10 text-riso-purple flex items-center justify-center shrink-0 mt-1">
                                                <Star size={10} className="fill-riso-purple" />
                                            </div>
                                            <span className="font-body text-xl md:text-2xl text-ink-black/90">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
