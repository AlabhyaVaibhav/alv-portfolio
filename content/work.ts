export type Position = {
  title: string;
  dates: string;
  bullets: string[];
};

export type Highlight = {
  title: string;
  metric: string;
  line: string;
};

export type Company = {
  name: string;
  location: string;
  years: string;
  isInternship?: boolean;
  // Condensed cards for the Day job chapter.
  highlights?: Highlight[];
  positions: Position[];
};

export const workHistory: Company[] = [
  {
    name: "CommerceIQ",
    location: "Bengaluru",
    years: "2021–now",
    highlights: [
      { title: "Ally · AI Insights", metric: "New ARR + GDR", line: "Omni-channel AI recommendations surfaced inside the platform." },
      { title: "Reporting platform", metric: "−79% manual work · ~$500K/yr", line: "Automated cross-product decks so CSMs could focus on customers." },
      { title: "RBAC & user mgmt", metric: "+10% adoption QoQ", line: "Modular roles that pulled the product suite onto one platform." },
      { title: "Product discovery", metric: "4 features shipped", line: "Customer discovery plus adoption tracking to steer the roadmap." },
    ],
    positions: [
      {
        title: "Product Manager, Platform",
        dates: "Mar 2023 – Present",
        bullets: [
          "Led development of the Omni Channel AI Insights Platform (Ally), driving new ARR growth and strengthening GDR positioning by surfacing AI-driven recommendations",
          "Launched a cross-product reporting platform with automated decks, reducing manual reporting effort by 79% — leading to ~$500K annual savings and enabling CSMs to focus on strategic customer engagements",
          "Owned end-to-end transition from traditional user management to a modular RBAC and User Management system, improving UX & technology, enabling integration of product offerings into a unified platform, boosting adoption 10% QoQ",
          "Spearheaded product discovery with customers to find opportunities, launched 4 new features, and implemented adoption tracking to guide roadmap decisions",
        ],
      },
      {
        title: "Sr. Product Analyst, Professional Services",
        dates: "Oct 2022 – Mar 2023",
        bullets: [
          "Co-led development of a strategy and planning product that enabled product-led growth, improving prospect conversion rates by 3x",
          "Became SME in Amazon Marketing Cloud, leading strategic customer engagements, crucial for expanding the product suite",
        ],
      },
      {
        title: "Product Analyst, Data Platform",
        dates: "Jun 2021 – Oct 2022",
        bullets: [
          "Designed and delivered strategic reporting for a global beverage company's tentpole campaigns, securing $400K in net new ARR",
          "Owned concept-to-launch of a 1-Pager reporting product that standardised client reporting and saved ~5,000 analyst hours annually",
        ],
      },
    ],
  },
  {
    name: "Soroco",
    location: "Bengaluru",
    years: "2020–21",
    positions: [
      {
        title: "Business Analyst, Store Insights",
        dates: "Apr 2020 – Jun 2021",
        bullets: [
          "Developed an email clustering framework using LDA topic modelling to classify business-critical communications, enabling process mining and unlocking new automation opportunities",
          "Delivered customer-facing reports and automation strategies that identified efficiency improvements and informed clients' operational decision-making",
        ],
      },
    ],
  },
  {
    name: "Quikr",
    location: "Bengaluru",
    years: "2018–20",
    positions: [
      {
        title: "Full Stack Developer, Quikr Jobs",
        dates: "Oct 2018 – Apr 2020",
        bullets: [
          "Built a Progressive Web App to manage third-party associate operations end-to-end, improving operational workflows and driving a 15% revenue increase",
          "Developed a new online classified ad category that enabled recruiters to schedule and manage interviews seamlessly, enhancing the hiring experience for employers and candidates, unlocking additional ~$150K revenue annually",
        ],
      },
    ],
  },
  {
    name: "McKinsey & Company",
    location: "Gurgaon",
    years: "2018",
    isInternship: true,
    positions: [
      {
        title: "IoT Research Intern, Labs",
        dates: "May 2018 – Aug 2018",
        bullets: [
          "Developed real-time facial recognition and sensor data processing infrastructure using AWS Kinesis, Lambda and DynamoDB, with rule-based notification engines",
        ],
      },
    ],
  },
];
