import React from "react";
import { ExternalLink, ShieldCheck, HeartPulse, BookOpen } from "lucide-react";
import ChartCard from "./Shared/ChartCard";

export default function ResourcesSection() {
  const resources = [
    {
      title: "Safe Work Australia",
      description: "National workplace standards and ergonomics guidance.",
      link: "https://www.safeworkaustralia.gov.au/",
      icon: <ShieldCheck className="text-blue-600" size={22} />,
    },
    {
      title: "WorkSafe Victoria",
      description:
        "Health and safety resources for Victorian workplaces and employees.",
      link: "https://www.worksafe.vic.gov.au/",
      icon: <HeartPulse className="text-pink-600" size={22} />,
    },
    {
      title: "Australian Government Health",
      description:
        "Information about physical activity, nutrition, and mental wellbeing.",
      link: "https://www.health.gov.au/",
      icon: <BookOpen className="text-green-600" size={22} />,
    },
  ];

  return (
    <div className="space-y-8">
      <ChartCard
        title="Official Health & Safety Resources"
        subtitle="Reliable sources for workplace wellbeing and eye health"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {resources.map((res, i) => (
            <a
              key={i}
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:bg-white/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                {res.icon}
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700">
                  {res.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-snug">
                {res.description}
              </p>
              <div className="mt-auto flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:underline">
                <ExternalLink size={16} />
                Visit Website
              </div>
            </a>
          ))}
        </div>
      </ChartCard>

      <ChartCard
        title="Why These Matter"
        subtitle="How these resources connect to your wellbeing"
      >
        <div className="grid md:grid-cols-2 gap-6 text-slate-700 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">Safe Work Australia</span> ensures
            national ergonomic standards that protect you from repetitive strain
            and posture-related risks at your workstation.
          </p>
          <p>
            <span className="font-semibold">WorkSafe Victoria</span> provides
            detailed health, safety, and compensation guidelines for Victorian
            workplaces—ideal for understanding how to design safe office
            spaces.
          </p>
          <p>
            <span className="font-semibold">
              Australian Government Department of Health
            </span>{" "}
            gives up-to-date information on physical activity, mental health,
            and digital wellbeing programs, ensuring you stay balanced while
            working.
          </p>
        </div>
      </ChartCard>
    </div>
  );
}
