import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

// --- TYPE DEFINITIONS ---
interface TrendItem {
  name: string;
  description: string;
  popularity: number;
}
interface PricePoint {
  typicalRange: string;
  consumerInsights: string;
  confidence: number;
}
interface TargetAudience {
  ageRange: string;
  keyInterests: string[];
  confidence: number;
}
interface SeasonalOpportunity {
  season: string;
  description: string;
  popularity: number;
}
interface Recommendation {
  recommendation: string;
  impact: number;
}
interface AnalysisData {
  topTrendingProducts: TrendItem[];
  emergingPalettes: TrendItem[];
  pricePointAnalysis: PricePoint;
  targetAudience: TargetAudience;
  seasonalOpportunities: SeasonalOpportunity[];
  actionableRecommendations: Recommendation[];
}

// --- GEMINI SETUP & SCHEMA ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    topTrendingProducts: {
      type: Type.ARRAY, description: "Top 5 trending products and styles.", items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, popularity: { type: Type.INTEGER, description: "Popularity score from 0 to 100" } } }
    },
    emergingPalettes: {
      type: Type.ARRAY, description: "Top 5 emerging color palettes and materials.", items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, popularity: { type: Type.INTEGER, description: "Popularity score from 0 to 100" } } }
    },
    pricePointAnalysis: {
      type: Type.OBJECT, properties: { typicalRange: { type: Type.STRING, description: "Typical price ranges for different item types, presented as a single semicolon-separated string. E.g., 'Small items: $20-$50; Mugs: $30-$70'" }, consumerInsights: { type: Type.STRING }, confidence: { type: Type.INTEGER, description: "Confidence score in this analysis from 0 to 100" } }
    },
    targetAudience: {
      type: Type.OBJECT, properties: { ageRange: { type: Type.STRING }, keyInterests: { type: Type.ARRAY, items: { type: Type.STRING } }, confidence: { type: Type.INTEGER, description: "Confidence score in this analysis from 0 to 100" } }
    },
    seasonalOpportunities: {
      type: Type.ARRAY, description: "Up to 4 seasonal opportunities.", items: { type: Type.OBJECT, properties: { season: { type: Type.STRING, description: "e.g., 'Spring (March-May)'" }, description: { type: Type.STRING }, popularity: { type: Type.INTEGER, description: "Opportunity score from 0 to 100" } } }
    },
    actionableRecommendations: {
      type: Type.ARRAY, description: "Top 6 actionable recommendations for an artisan.", items: { type: Type.OBJECT, properties: { recommendation: { type: Type.STRING }, impact: { type: Type.INTEGER, description: "Potential impact score from 0 to 100" } } }
    },
  },
};

// --- HELPER & UI COMPONENTS ---

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="progress-bar-container">
    <div className="progress-bar" style={{ width: `${value}%` }} />
  </div>
);

const SectionIcon: React.FC<{ type: string }> = ({ type }) => {
    const icons: { [key: string]: React.ReactNode } = {
        trending: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-2.25m3.75 2.25l-2.25 3.75" /></svg>,
        palette: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.62-3.385m-1.622 3.385a15.998 15.998 0 01-3.388 1.62m-5.043-.025a15.998 15.998 0 00-3.388-1.62m1.622 3.385a15.998 15.998 0 013.388-1.62" /></svg>,
        price: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.156 0-2.982C10.544 8.219 11.271 8 12 8c.768 0 1.536.219 2.121.659l.879.659m0 0c-1.171.879-3.07.879-4.242 0M19.5 7.125c0-1.036-1.036-1.875-2.288-1.875S15 6.09 15 7.125c0 1.036 1.036 1.875 2.212 1.875m0 0a2.25 2.25 0 012.288 1.875M19.5 16.875c0 1.036-1.036 1.875-2.288 1.875S15 17.91 15 16.875c0-1.036 1.036 1.875 2.212 1.875m0 0a2.25 2.25 0 012.288-1.875" /></svg>,
        audience: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.228a4.5 4.5 0 00-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 001.13-1.897M16.5 7.5l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v11.25m-7.5-7.5l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5v7.5" /></svg>,
        seasonal: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>,
        recommendations: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    };
    return <div className="icon">{icons[type]}</div>;
};

// --- MAIN COMPONENT ---
export const AnalysisPage = () => {
  const [craftType, setCraftType] = useState('');
  const [submittedCraftType, setSubmittedCraftType] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!craftType.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSubmittedCraftType(craftType);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a detailed artisan market analysis for the craft of ${craftType}. Be encouraging and insightful for a creative entrepreneur.`,
        config: { responseMimeType: "application/json", responseSchema: analysisSchema },
      });
      
      const resultJson = JSON.parse(response.text);
      setAnalysisResult(resultJson as AnalysisData);

    } catch (e) {
      console.error('Error generating analysis:', e);
      setError('An error occurred while analyzing the trends. Please try a different craft type or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analysis-page">
      <div className="analysis-form-container">
        <form onSubmit={handleAnalyze}>
          <label htmlFor="craft-type" className="analysis-form-label">Enter Craft Type to Analyze</label>
          <div className="analysis-form">
            <input
              id="craft-type"
              className="analysis-input"
              value={craftType}
              onChange={(e) => setCraftType(e.target.value)}
              placeholder="e.g., pottery, woodworking, jewelry"
              aria-label="Craft type to analyze"
              disabled={isLoading}
            />
            <button type="submit" className="analysis-button" disabled={isLoading || !craftType.trim()}>
              {isLoading ? 'Analyzing...' : 'Analyze Trends'}
            </button>
          </div>
        </form>
      </div>

      {isLoading && <div className="loading-container"><div className="loading-spinner"></div><p>Analyzing market trends...</p></div>}
      {error && <div className="error-container"><p>{error}</p></div>}

      {analysisResult && (
        <div className="analysis-results">
          <h2 className="analysis-results-header">Market Analysis for: <span>{submittedCraftType}</span></h2>
          <div className="analysis-grid">
            {/* Sections */}
            <AnalysisSection title="Top Trending Products & Styles" icon="trending" items={analysisResult.topTrendingProducts} scoreLabel="popularity" />
            <AnalysisSection title="Emerging Palettes & Materials" icon="palette" items={analysisResult.emergingPalettes} scoreLabel="popularity" />
            <PricePointSection data={analysisResult.pricePointAnalysis} />
            <TargetAudienceSection data={analysisResult.targetAudience} />
            <AnalysisSection title="Seasonal Opportunities" icon="seasonal" items={analysisResult.seasonalOpportunities} nameKey="season" scoreLabel="popularity" />
            <AnalysisSection title="Actionable Recommendations" icon="recommendations" items={analysisResult.actionableRecommendations} nameKey="recommendation" descriptionKey="" scoreLabel="impact" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- SECTION COMPONENTS ---

interface AnalysisSectionProps {
  title: string;
  icon: string;
  items: any[];
  nameKey?: string;
  descriptionKey?: string;
  scoreLabel: 'popularity' | 'impact';
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, icon, items, nameKey = 'name', descriptionKey = 'description', scoreLabel }) => (
  <div className="analysis-section">
    <div className="analysis-section-header">
      <SectionIcon type={icon} />
      <h3>{title}</h3>
    </div>
    <ul className="analysis-list">
      {items.map((item, index) => (
        <li key={index} className="analysis-list-item">
          <div className="item-content">
            <h4>{item[nameKey]}</h4>
            {item[descriptionKey] && <p>{item[descriptionKey]}</p>}
          </div>
          <div className="item-score">
            <ProgressBar value={item[scoreLabel]} />
            <span>{item[scoreLabel]}%</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const PricePointSection: React.FC<{data: PricePoint}> = ({ data }) => (
    <div className="analysis-section">
        <div className="analysis-section-header"><SectionIcon type="price" /><h3>Price Point Analysis</h3></div>
        <div className="price-point-content">
            <div>
                <h4>Typical Range:</h4>
                <div className="info-tag-group">
                    {data.typicalRange.split(';').map(range => range.trim() && <span key={range} className="info-tag">{range}</span>)}
                </div>
            </div>
            <p>{data.consumerInsights}</p>
            <div className="confidence-section">
                <h4 className="confidence-label">Confidence:</h4>
                <div className="confidence-bar">
                    <ProgressBar value={data.confidence} />
                </div>
            </div>
        </div>
    </div>
);

const TargetAudienceSection: React.FC<{data: TargetAudience}> = ({ data }) => (
    <div className="analysis-section">
        <div className="analysis-section-header"><SectionIcon type="audience" /><h3>Target Audience</h3></div>
        <div className="target-audience-content">
            <div>
                <h4>Age Range:</h4>
                <div className="info-tag-group"><span className="info-tag">{data.ageRange}</span></div>
            </div>
            <div>
                <h4>Key Interests:</h4>
                <div className="info-tag-group">
                    {data.keyInterests.map(interest => <span key={interest} className="info-tag">{interest}</span>)}
                </div>
            </div>
             <div className="confidence-section">
                <h4 className="confidence-label">Confidence:</h4>
                <div className="confidence-bar">
                    <ProgressBar value={data.confidence} />
                </div>
            </div>
        </div>
    </div>
);
