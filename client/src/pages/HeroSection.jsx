import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Users, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '10,000+', label: 'Students' },
  { icon: BookOpen, value: '50+', label: 'Courses' },
  { icon: Award, value: '100%', label: 'Expert Instructors' },
];

const HeroSection = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (searchText.trim() !== '') {
      navigate(`/course/search?query=${searchText}`);
    }
    setSearchText('');
  };

  return (
    <div className="relative overflow-hidden bg-[#0f0c29] text-white">
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[120px] animate-pulse" />
        <div className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse delay-700" />
        <div className="absolute bottom-0 left-1/2 w-[350px] h-[350px] rounded-full bg-blue-600/20 blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 md:py-36 text-center flex flex-col items-center gap-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm font-medium backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping inline-block" />
          Your Gateway to World-Class Learning
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Learn{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Smarter.
          </span>
          <br />
          Grow{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Faster.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl">
          Discover expert-led courses, earn certificates, and advance your career — all in one place.
        </p>

        {/* Search */}
        <form
          onSubmit={onSubmitHandler}
          className="flex items-center w-full max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 shadow-xl"
        >
          <Search className="ml-3 text-gray-400 shrink-0" size={18} />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="What do you want to learn today?"
            className="flex-grow bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-400 px-4 text-sm"
          />
          <Button
            type="submit"
            className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 text-sm font-semibold shadow-md"
          >
            Search
          </Button>
        </form>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => navigate('/course/search?query')}
            variant="outline"
            className="rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6"
          >
            Explore All Courses
          </Button>
          <Button
            onClick={() => navigate('/login')}
            className="rounded-full bg-white text-purple-700 hover:bg-gray-100 font-semibold px-6"
          >
            Start for Free →
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mt-6 flex flex-wrap gap-8 justify-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-300">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Icon size={16} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm leading-tight">{value}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
};

export default HeroSection;
