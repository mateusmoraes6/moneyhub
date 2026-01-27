import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FinancialSummary from './FinancialSummary';
import FutureProjectionCard from './FutureProjectionCard';
import { useAccounts } from '../../../context/AccountsContext';

import AccountBalancesCard from './AccountBalancesCard';

const SummaryCarousel: React.FC = () => {
    const { accounts } = useAccounts();
    const totalBalance = accounts.reduce((acc, account) => acc + Number(account.balance), 0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const slides = [
        <FinancialSummary totalBalance={totalBalance} />,
        <FutureProjectionCard />,
        <AccountBalancesCard />
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Touch handlers for swipe gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const handleButtonClick = (direction: 'next' | 'prev') => {
        if (direction === 'next') {
            nextSlide();
        } else {
            prevSlide();
        }
    };

    return (
        <div className="relative group w-full isolate z-10">
            <div
                className="overflow-hidden rounded-xl"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className="w-full flex-shrink-0">
                            {slide}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={() => handleButtonClick('prev')}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => handleButtonClick('next')}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/80 hover:bg-gray-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-emerald-500 w-4' : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SummaryCarousel;
