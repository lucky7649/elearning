import React from "react";
import { Target, Eye, Heart, Users } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-background dark:bg-[#0A0A0A] text-foreground dark:text-white py-14 px-6 border-b border-border">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Our Story
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            <span style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500"
            >
              Democratizing Education for All
            </span>
          </h1>

          <p className="text-base text-muted-foreground dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            We are on a mission to empower learners worldwide with expert-led courses, flexible learning paths, and an engaging, supportive community.
          </p>
        </div>
      </section>

      {/* 2. OUR VALUES GRID */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">What Drives Us</h2>
            <p className="text-sm text-muted-foreground">The core principles behind everything we do.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", desc: "To create a world where anyone, anywhere has the power to transform their life through accessible, high-quality learning.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Eye, title: "Our Vision", desc: "To be the global catalyst for lifelong learning and professional advancement, bridging the gap between talent and opportunity.", color: "text-purple-500", bg: "bg-purple-500/10" },
              { icon: Heart, title: "Our Values", desc: "Innovation, Inclusivity, Excellence, and Community. We believe in putting our students first and fostering continuous growth.", color: "text-pink-500", bg: "bg-pink-500/10" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-card hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. IMPACT SECTION */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/15 rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Our Team"
              className="relative rounded-2xl shadow-2xl border border-border object-cover h-[360px] w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-2xl shadow-2xl border border-border hidden md:flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                <Users size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">100+</h3>
                <p className="text-xs text-muted-foreground font-semibold">Team Members</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Building the Future of <br />
              <span className="text-primary">Online Education</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Since our founding, we've been committed to breaking down barriers to education. We partner with industry leaders to bring you curriculum that is relevant, up-to-date, and designed for real-world application.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { val: "50K+", label: "Learners" },
                { val: "500+", label: "Courses" },
                { val: "150+", label: "Countries" },
                { val: "4.8/5", label: "Avg Rating" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1 p-4 rounded-xl bg-card border border-border">
                  <h4 className="text-3xl font-black text-foreground">{stat.val}</h4>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
