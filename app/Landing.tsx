'use client';

import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

const features = [
    'Intuitive Kanban Boards',
    'Real-Time Collaboration',
    'Custom Workflows',
    'Advanced Task Tracking',
];

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LandingPage: React.FC = () => {
    const { resolvedTheme } = useTheme();
    console.log('Current theme:', resolvedTheme);
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
            {/* Hero Section */}
                <motion.div
                    className="container mx-auto px-6 pt-24 pb-12"
                    initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                {/* Content */}
                <div className="text-center space-y-8">
                    {/* Heading */}
                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Organize All Your Work, Projects, And More
                        <br />
                        <style jsx>{`
                            .gradient-text {
                                background: linear-gradient(to right, 
                                    var(--gradient-start, #000), 
                                    var(--gradient-end, #999)
                                );
                                -webkit-background-clip: text;
                                background-clip: text;
                                color: transparent;
                                font-weight: 900;
                            }

                            :global(.dark) .gradient-text {
                                --gradient-start: #ffffff;
                                --gradient-end: #888888;
                            }
                        `}</style>
                        <span className="relative inline-block">
                            <span className="gradient-text">
                                One Task At A Time
                            </span>
                        </span>
                    </motion.h1>
                    {/* Description */}
                    <motion.p
                        className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
                        variants={fadeInUp}
                    >
                        ProjectZen is a project management tool that helps you organize your work,
                        projects, and more. With intuitive Kanban boards, real-time collaboration,
                        custom workflows, and advanced task tracking, you can stay on top of your
                        work and get things done.
                    </motion.p>
                    {/* Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4"
                        variants={fadeInUp}
                    >
                        <Button
                            size="lg"
                            asChild
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <a href="/create-account" className="gap-2">
                                Get Started Today <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            asChild
                            className="hover:scale-105 transition-transform duration-300"
                        >
                            <a href="/login">Sign In</a>
                        </Button>
                    </motion.div>
                </div>

                {/* Features */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 max-w-2xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature}
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                            <span className="text-muted-foreground">{feature}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* App Screenshot */}
            <motion.div
                className="relative w-full h-[400px] sm:h-[500px] bg-background/90 rounded-lg shadow-lg overflow-hidden mx-auto max-w-5xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <Image
                    src={
                        resolvedTheme === 'dark'
                            ? '/images/projectzen-dark.png'
                            : '/images/projectzen-light.png'
                    }
                    alt="ProjectZen App Screenshot"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg"
                    style={{ objectFit: 'cover' }}
                />
            </motion.div>

            {/* Background Gradient */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-3xl"></div>
                </div>
                </div>
                
        </div>
    );
};

export default LandingPage;
