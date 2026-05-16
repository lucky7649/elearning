import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Users, Award, Star, CheckCircle, 
  ArrowRight, PlayCircle, Shield, Briefcase, Zap, HelpCircle,
  Code, Database, Cpu, Lock, Layout, BarChart, Linkedin, Twitter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetAllCoursesQuery } from "@/api/courseApi";
import Course from "./Course";

const LandingPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllCoursesQuery();
  const [searchText, setSearchText] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) navigate(`/course/search?query=${searchText}`);
  };

  return (
    <div className="flex flex-col w-full bg-background">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-background dark:bg-[#0A0A0A] text-foreground dark:text-white py-12 md:py-20 px-6 transition-colors duration-300 border-b border-border">
        {/* Subtle background glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold shadow-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Trusted by 10,000+ students worldwide
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-['Caveat',cursive] font-bold tracking-tight leading-[1.1]">
              Master In-Demand <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Skills For The Future</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg text-muted-foreground dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Unlock your potential with premium expert-led courses, hands-on projects, and a global community dedicated to your growth.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg mx-auto lg:mx-0">
              <div className="relative w-full flex-grow group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="What do you want to learn today?"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground dark:text-white placeholder:text-muted-foreground font-medium text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6 rounded-xl w-full sm:w-auto font-bold text-base shadow-md hover:shadow-lg transition-all">
                Search
              </Button>
            </form>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-1">
              <Button onClick={() => navigate('/course/search?query')} size="lg" variant="outline" className="h-12 px-6 rounded-xl border-border text-foreground hover:bg-muted font-semibold shadow-sm transition-all">
                Explore All Courses
              </Button>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex-1 hidden lg:block relative w-full max-w-lg mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 bg-card transform hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Students learning together" 
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div className="bg-background/90 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Industry Certified</h3>
                      <p className="text-sm text-muted-foreground">Learn from top tech companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION (MARQUEE) */}
      <section className="py-12 bg-gray-50 dark:bg-black border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">Trusted by industry leaders worldwide</p>
          
          <div className="relative">
            {/* Gradient Mask for fading edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-50 dark:from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gray-50 dark:from-black to-transparent z-10" />

            <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all items-center">
              {[
                "Google", "Microsoft", "AWS", "Meta", "Stanford", "IIT Bombay", "Udemy", "Coursera", "LinkedIn", "Harvard"
              ].map((brand, i) => (
                <span key={i} className="text-2xl md:text-3xl font-bold tracking-tight">{brand}</span>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                "Google", "Microsoft", "AWS", "Meta", "Stanford", "IIT Bombay", "Udemy", "Coursera", "LinkedIn", "Harvard"
              ].map((brand, i) => (
                <span key={`dup-${i}`} className="text-2xl md:text-3xl font-bold tracking-tight">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Top Categories</h2>
            <p className="text-muted-foreground">Pick a category and start your journey today.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Web Dev', icon: Code, color: 'bg-blue-500' },
              { name: 'Data Science', icon: Database, color: 'bg-green-500' },
              { name: 'AI & ML', icon: Cpu, color: 'bg-purple-500' },
              { name: 'Security', icon: Shield, color: 'bg-red-500' },
              { name: 'UI/UX', icon: Layout, color: 'bg-pink-500' },
              { name: 'Business', icon: BarChart, color: 'bg-orange-500' },
            ].map((cat) => (
              <div key={cat.name} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all text-center cursor-pointer">
                <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-bold text-sm">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED COURSES SECTION */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Courses</h2>
              <p className="text-muted-foreground">Learn from the best with our highest-rated courses.</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/course/search?query')} className="text-primary font-bold">View All <ArrowRight size={16} className="ml-2" /></Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)
            ) : data?.courses?.length > 0 ? (
              data.courses.slice(0, 4).map((course) => <Course key={course._id} course={course} />)
            ) : (
              <div className="col-span-full text-center py-10 text-muted-foreground border border-dashed rounded-2xl">
                <p>No courses available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">Why Choose Our Learning Platform?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'Expert Mentors', desc: 'Learn from industry pros with years of experience.', icon: Users },
                { title: 'Lifetime Access', desc: 'One-time payment, access forever on any device.', icon: Zap },
                { title: 'Certifications', desc: 'Earn recognized certificates to boost your resume.', icon: Award },
                { title: 'Live Projects', desc: 'Build real-world projects to showcase your skills.', icon: Briefcase },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 rounded-3xl p-8 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Why us" className="rounded-2xl shadow-xl border border-primary/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <PlayCircle size={40} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Your journey to mastery in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-24 right-24 h-px border-t border-dashed border-primary/30" />
            {[
              { step: '01', title: 'Choose Course', desc: 'Select from 500+ top-rated courses.' },
              { step: '02', title: 'Learn with Videos', desc: 'Watch high-quality expert-led videos.' },
              { step: '03', title: 'Practice Projects', desc: 'Apply knowledge to real-world tasks.' },
              { step: '04', title: 'Get Certificate', desc: 'Earn your recognized achievement.' },
            ].map((item) => (
              <div key={item.step} className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold shadow-xl border-4 border-background">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTRUCTORS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Top Instructors</h2>
          <p className="text-muted-foreground">Learn from industry leaders who are passionate about teaching.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Dr. Sarah Johnson', role: 'AI Specialist', exp: '10+ Years', img: 'https://i.pravatar.cc/150?u=sarah' },
            { name: 'Mark Wilson', role: 'Full Stack Developer', exp: '8+ Years', img: 'https://i.pravatar.cc/150?u=mark' },
            { name: 'Emily Chen', role: 'UX Design Lead', exp: '12+ Years', img: 'https://i.pravatar.cc/150?u=emily' },
          ].map((ins) => (
            <div key={ins.name} className="group p-6 rounded-2xl border border-border bg-card hover:shadow-xl transition-all text-center">
              <img src={ins.img} alt={ins.name} className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-primary/10 group-hover:scale-105 transition-transform" />
              <h3 className="text-xl font-bold">{ins.name}</h3>
              <p className="text-primary font-medium text-sm mb-2">{ins.role}</p>
              <p className="text-xs text-muted-foreground mb-4">{ins.exp} Experience</p>
              <div className="flex justify-center gap-4 text-muted-foreground">
                <Linkedin size={18} className="hover:text-primary cursor-pointer" />
                <Twitter size={18} className="hover:text-primary cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 px-6 bg-muted/50 dark:bg-[#0f0c29] text-foreground dark:text-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-muted-foreground dark:text-gray-400">Join thousands of successful students worldwide.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Alex Rivera', role: 'Software Engineer', text: 'The courses here changed my life. I went from zero to a job at Google in 8 months!', img: 'https://i.pravatar.cc/150?u=alex' },
            { name: 'Priya Sharma', role: 'Data Analyst', text: 'High quality content and amazing support. The certificates really helped me in my career.', img: 'https://i.pravatar.cc/150?u=priya' },
            { name: 'James Doe', role: 'Designer', text: 'Best platform for learning modern design. The mentors are top-notch and the community is great.', img: 'https://i.pravatar.cc/150?u=james' },
          ].map((tes) => (
            <div key={tes.name} className="p-8 rounded-2xl bg-background dark:bg-white/5 border border-border dark:border-white/10 flex flex-col gap-6 shadow-sm">
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="italic text-foreground/80 dark:text-gray-300">"{tes.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={tes.img} alt={tes.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold">{tes.name}</h4>
                    <p className="text-xs text-muted-foreground dark:text-gray-500">{tes.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      {/* 9. STATISTICS */}
      <section className="py-20 border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: '50K+', label: 'Students' },
            { val: '500+', label: 'Courses' },
            { val: '100+', label: 'Mentors' },
            { val: '95%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label}>
              <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{stat.val}</h2>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. CERTIFICATIONS */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Certificate Preview" 
              className="relative rounded-2xl shadow-2xl border border-border rotate-2 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -right-6 bg-background p-4 rounded-2xl shadow-xl border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <p className="text-xs font-bold">Shareable on LinkedIn</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Earn Recognized Certifications</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Complete any course and receive a professional certificate to showcase your skills to potential employers worldwide.
            </p>
            <ul className="space-y-4 mb-8">
              {['Industry-validated certificates', 'Unique verification ID', 'Add to LinkedIn with one click', 'Download in PDF format'].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle size={18} className="text-primary" />
                  {feat}
                </li>
              ))}
            </ul>
            <Button size="lg" className="rounded-full px-8">View Sample Certificate</Button>
          </div>
        </div>
      </section>

      {/* 11. PRICING PLANS */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-muted-foreground">Get unlimited access to everything we offer.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Free', price: '₹0', feat: ['Access to free courses', 'Community support', 'Basic resources'], btn: 'Get Started' },
            { name: 'Pro', price: '₹4,999', feat: ['Unlimited access', 'Verified certificates', 'Premium projects', 'Live mentorship'], btn: 'Upgrade Now', popular: true },
            { name: 'Premium', price: '₹9,999', feat: ['Everything in Pro', 'One-on-one calls', 'Job placement help', 'Offline downloads'], btn: 'Go Premium' },
          ].map((plan) => (
            <div key={plan.name} className={`relative p-8 rounded-3xl border bg-card flex flex-col gap-8 ${plan.popular ? 'border-primary shadow-2xl scale-105 z-10' : 'border-border'}`}>
              {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</span>}
              <div className="text-center">
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <h2 className="text-4xl font-extrabold">{plan.price}</h2>
                <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
              </div>
              <ul className="space-y-4 flex-grow">
                {plan.feat.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2 text-muted-foreground">
                    <CheckCircle size={16} className="text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'default' : 'outline'} className="rounded-full w-full py-6 font-bold">{plan.btn}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* 12. FAQ SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our platform.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Are the certificates valid?', a: 'Yes, our certificates are recognized by industry leaders and can be shared on platforms like LinkedIn.' },
              { q: 'Is lifetime access included?', a: 'Absolutely! Once you buy a course, you have access to it and all future updates forever.' },
              { q: 'Can I learn on mobile?', a: 'Yes, our platform is fully responsive. You can learn on your phone, tablet, or laptop.' },
              { q: 'Is there placement support?', a: 'Our Premium and Pro plans include resume reviews, interview prep, and job referral assistance.' },
            ].map((faq, i) => (
              <details key={i} className="group p-6 rounded-2xl border border-border bg-card open:border-primary transition-all">
                <summary className="flex justify-between items-center font-bold cursor-pointer list-none list-inside">
                  {faq.q}
                  <HelpCircle size={18} className="text-muted-foreground group-open:rotate-180 group-open:text-primary transition-all" />
                </summary>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 13. CTA BANNER */}
      <section className="pt-20 pb-0 px-6 bg-background dark:bg-[#0f0c29] transition-colors duration-300">
        <div className="max-w-7xl mx-auto rounded-t-[3rem] rounded-b-none bg-gradient-to-r from-purple-600 to-indigo-700 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">Start Your Learning Journey Today 🚀</h2>
            <p className="text-purple-100 text-lg md:text-xl max-w-2xl mx-auto">
              Join thousands of students and start mastering new skills with the world's best instructors.
            </p>
            <Button size="lg" onClick={() => navigate('/login')} className="rounded-full bg-white text-purple-700 hover:bg-gray-100 px-12 py-8 text-xl font-bold shadow-2xl hover:scale-105 transition-transform">Enroll Now</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
