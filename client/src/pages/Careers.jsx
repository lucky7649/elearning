import React from "react";
import { Globe, HeartPulse, BookOpen, Coffee, Laptop, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Careers = () => {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-background dark:bg-[#0A0A0A] py-14 px-6 border-b border-border">
        {/* Decorative Grid Background */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              We're Hiring
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
              <span
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500"
              >
                Do the best work<br className="hidden md:block" /> of your life.
              </span>
            </h1>

            <p className="text-base text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
              Join a passionate team dedicated to transforming global education. We're looking for builders, creators, and visionaries.
            </p>

            <Button
              size="lg"
              className="h-12 px-6 text-base font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
              onClick={() =>
                document.getElementById("positions")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Open Roles
            </Button>
          </div>

          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1522071901873-411886a10004?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our Team working"
                className="w-full h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Perks & Benefits</h2>
            <p className="text-sm text-muted-foreground">We take care of our team so they can take care of our students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Work Anywhere", desc: "We are a remote-first company. Work from anywhere in the world." },
              { icon: HeartPulse, title: "Health & Wellness", desc: "Comprehensive health insurance and wellness stipends." },
              { icon: BookOpen, title: "Learning Budget", desc: "$1,000 annual budget for courses, books, and conferences." },
              { icon: Laptop, title: "Home Office Setup", desc: "We provide you with the best gear to do your best work." },
              { icon: Coffee, title: "Flexible Time Off", desc: "Take the time you need to recharge. No strict limits." },
              { icon: Zap, title: "Impactful Work", desc: "Build products that directly improve people's lives." },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <benefit.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OPEN POSITIONS */}
      <section id="positions" className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Open Positions</h2>
            <p className="text-sm text-muted-foreground">Find your next role and help us shape the future.</p>
          </div>

          <div className="space-y-4">
            {[
              { role: "Senior Frontend Engineer", dept: "Engineering", type: "Remote • Full-time" },
              { role: "Backend Developer (Node.js)", dept: "Engineering", type: "Remote • Full-time" },
              { role: "Product Designer (UI/UX)", dept: "Design", type: "Remote • Full-time" },
              { role: "Course Content Creator", dept: "Content", type: "New York, NY • Part-time" },
              { role: "Developer Advocate", dept: "Marketing", type: "Remote • Full-time" },
            ].map((job) => (
              <div
                key={job.role}
                className="group p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    {job.dept}
                  </span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{job.role}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{job.type}</p>
                </div>
                <Button
                  variant="ghost"
                  className="group-hover:bg-primary group-hover:text-white rounded-full h-10 w-10 p-0 shrink-0 transition-colors"
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-br from-primary/10 via-indigo-500/10 to-transparent border border-primary/20 rounded-3xl p-8 text-center shadow-inner">
            <h3 className="text-xl font-bold mb-3">Don't see a perfect fit?</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future openings.
            </p>
            <Button variant="outline" size="default" className="rounded-full border-primary/50 hover:bg-primary/10 font-bold px-6">
              Submit Open Application
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
