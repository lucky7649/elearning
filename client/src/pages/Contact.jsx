import React from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
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
            We'd love to hear from you
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]">
            <span
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500"
            >
              Get In Touch
            </span>
          </h1>

          <p className="text-base text-muted-foreground dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Have a question, suggestion, or just want to say hello? Our team is always happy to help.
          </p>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Mail,
              title: "Email Us",
              line1: "support@elearning.com",
              line2: "info@elearning.com",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Phone,
              title: "Call Us",
              line1: "+1 (234) 567-890",
              line2: "Mon–Fri, 9am–5pm EST",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              line1: "123 Learning Way,",
              line2: "EdTech City, NY 10001",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: Clock,
              title: "Response Time",
              line1: "Within 24 hours",
              line2: "on business days",
              color: "text-orange-500",
              bg: "bg-orange-500/10",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <card.icon size={20} />
              </div>
              <h3 className="font-bold text-base mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground">{card.line1}</p>
              <p className="text-xs text-muted-foreground">{card.line2}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FORM + IMAGE SPLIT */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Image + Quick Info */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/15 rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Contact Us"
                className="relative rounded-2xl shadow-2xl border border-border object-cover h-[300px] w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                <MessageSquare size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Live Chat</h4>
                  <p className="text-xs text-muted-foreground">Chat with our support agents in real time during business hours.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm mb-1">Help Center</h4>
                  <p className="text-xs text-muted-foreground">Browse our documentation and FAQs for quick answers to common questions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-1">Send us a message</h2>
            <p className="text-xs text-muted-foreground mb-6">We typically respond within 24 hours.</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground"
                  placeholder="Tell us more about your query..."
                />
              </div>

              <Button type="submit" className="w-full h-11 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                <Send size={16} />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
