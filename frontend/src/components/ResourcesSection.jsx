import React from "react";
import { ExternalLink, ShieldCheck, HeartPulse, BookOpen } from "lucide-react";
import ChartCard from "./Shared/ChartCard";

export default function ResourcesSection() {
  const resources = [
    {
      title: "Safe Work Australia",
      description:
        "Australia’s national policy body for work health and safety and workers’ compensation, promoting safer, healthier, and more productive workplaces.",
      link: "https://www.safeworkaustralia.gov.au/",
      icon: <ShieldCheck className="text-blue-600" size={22} />,
    },
    {
      title: "WorkSafe Victoria",
      description:
        "Victoria’s workplace health and safety regulator and injury insurer — working to reduce workplace harm and improve outcomes for injured workers.",
      link: "https://www.worksafe.vic.gov.au/",
      icon: <HeartPulse className="text-pink-600" size={22} />,
    },
    {
      title: "Australian Government Health",
      description:
        "National health and aged care department focused on evidence-based policy, prevention programs, and promoting wellbeing across Australia.",
      link: "https://www.health.gov.au/",
      icon: <BookOpen className="text-green-600" size={22} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Official Resources */}
      <ChartCard
        title="Official Health & Safety Resources"
        subtitle="Reliable sources for workplace wellbeing and health information"
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

      {/* Why These Matter */}
      <ChartCard
        title="Why These Matter"
        subtitle="How these organisations support safer, healthier workplaces"
      >
        <div className="grid md:grid-cols-2 gap-6 text-slate-700 text-sm leading-relaxed">
          <p>
            <span className="font-semibold text-slate-900">
              Safe Work Australia
            </span>{" "}
            is the national policy body representing the Commonwealth, states,
            territories, workers, and employers. It leads efforts to reduce
            work-related injuries, illnesses, and fatalities through national
            WHS and workers’ compensation policy. Each year, work-related
            incidents cost the economy billions, Safe Work Australia’s work
            aims to make Australian workplaces safer, healthier, and more
            productive.
          </p>

          <p>
            <span className="font-semibold text-slate-900">
              WorkSafe Victoria
            </span>{" "}
            serves as Victoria’s health and safety regulator and workplace
            injury insurer. It reduces workplace harm through education,
            inspections, and enforcement, while also supporting injured workers
            to recover and return to safe work. For over 35 years, it has
            improved safety outcomes and maintained Victoria as one of the
            world’s safest places to work.
          </p>

          <p className="md:col-span-2">
            <span className="font-semibold text-slate-900">
              Australian Government Department of Health and Aged Care
            </span>{" "}
            leads national programs to improve health and wellbeing for all
            Australians. It develops evidence based policies across physical
            health, mental wellbeing, aged care, and sport, promoting
            preventive care, awareness, and equitable access to health services
            to help Australians live healthier, longer lives.
          </p>
        </div>
      </ChartCard>
    </div>
  );
}
