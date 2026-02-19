import CalculatorClient from "./CalculatorClient";

export default function HomePage() {
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "rent-or-buy.homes",
    url: "https://rent-or-buy.homes",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: ["en", "zh"],
    description:
      "Interactive buy vs rent calculator that compares long-term net worth using mortgage, tax, and investment assumptions.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does this calculator compare buying and renting fairly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It compares yearly cash outflows for both paths and invests the cheaper path's savings so both scenarios reflect equivalent spending.",
        },
      },
      {
        "@type": "Question",
        name: "Does the model include taxes and transaction costs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. It includes closing costs, selling costs, mortgage-interest deductions, and capital-gains taxes for property and investments.",
        },
      },
      {
        "@type": "Question",
        name: "Are calculations done on a server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. All calculations run in your browser with no required sign-in and no personal finance data sent to a backend.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share a scenario with someone else?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The Share button creates a URL that encodes your current inputs so recipients can open the same scenario directly.",
        },
      },
    ],
  };

  return (
    <>
      <CalculatorClient />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
