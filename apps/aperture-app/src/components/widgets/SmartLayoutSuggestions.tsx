import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  BarChart,
  Clock,
  ChevronRight,
  Star,
  Zap,
  Brain
} from 'lucide-react';
import { Widget } from '../../types/widgets.types';
import {
  WidgetRecommendationService,
  SmartLayoutSuggestion,
  WidgetRecommendation
} from '../../services/widget-recommendations.service';
import { Button } from '../ui/Button';

interface SmartLayoutSuggestionsProps {
  currentWidgets: Widget[];
  onApplyLayout: (widgets: Widget[]) => void;
  onAddWidget: (recommendation: WidgetRecommendation) => void;
  className?: string;
}

export function SmartLayoutSuggestions({
  currentWidgets,
  onApplyLayout,
  onAddWidget,
  className = ''
}: SmartLayoutSuggestionsProps) {
  const [layoutSuggestions, setLayoutSuggestions] = useState<SmartLayoutSuggestion[]>([]);
  const [widgetRecommendations, setWidgetRecommendations] = useState<WidgetRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'layouts' | 'widgets'>('layouts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const layouts = WidgetRecommendationService.getSmartLayoutSuggestions(currentWidgets);
        const widgets = WidgetRecommendationService.getPersonalizedRecommendations(currentWidgets);

        setLayoutSuggestions(layouts);
        setWidgetRecommendations(widgets);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [currentWidgets]);

  const handleApplyLayout = (suggestion: SmartLayoutSuggestion) => {
    const newWidgets = WidgetRecommendationService.applySmartLayout(suggestion);
    onApplyLayout(newWidgets);

    suggestion.widgets.forEach(widget => {
      WidgetRecommendationService.trackWidgetUsage(widget.type, 'add');
    });
  };

  const handleAddWidget = (recommendation: WidgetRecommendation) => {
    onAddWidget(recommendation);
    WidgetRecommendationService.trackWidgetUsage(recommendation.widget.type, 'add');
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      productivity: Target,
      analytics: BarChart,
      collaboration: Users,
      mixed: Sparkles
    };
    return icons[category as keyof typeof icons] || Sparkles;
  };

  const getRecommendationIcon = (category: string) => {
    const icons = {
      trending: TrendingUp,
      personalized: Star,
      complementary: Zap,
      seasonal: Clock
    };
    return icons[category as keyof typeof icons] || Sparkles;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (confidence >= 0.6) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };

  if (isLoading) {
    return (
      <div className={`liquid-glass-sidebar rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-adaptive-primary">AI Workspace Optimizer</h3>
            <p className="text-adaptive-secondary text-sm">Analyzing your usage patterns...</p>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="liquid-glass-section rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg" />
                  <div className="h-4 bg-white/10 rounded flex-1" />
                  <div className="w-16 h-6 bg-white/10 rounded-lg" />
                </div>
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`liquid-glass-sidebar rounded-2xl overflow-hidden ${className}`}>
      <div className="liquid-glass-header p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-xl flex items-center justify-center relative">
            <Brain className="w-5 h-5 text-purple-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-adaptive-primary">AI Workspace Optimizer</h3>
            <p className="text-adaptive-secondary text-sm">Personalized suggestions powered by machine learning</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 liquid-glass-sidebar rounded-lg">
          <button
            onClick={() => setActiveTab('layouts')}
            className={`flex-1 p-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'layouts'
                ? 'liquid-glass-selected text-blue-400'
                : 'text-adaptive-muted hover:text-adaptive-primary liquid-glass-interactive'
            }`}
          >
            Smart Layouts ({layoutSuggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('widgets')}
            className={`flex-1 p-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === 'widgets'
                ? 'liquid-glass-selected text-blue-400'
                : 'text-adaptive-muted hover:text-adaptive-primary liquid-glass-interactive'
            }`}
          >
            Widget Suggestions ({widgetRecommendations.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'layouts' && (
          <div className="space-y-4">
            {layoutSuggestions.length === 0 ? (
              <div className="text-center py-8 text-adaptive-muted">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No layout suggestions available yet.</p>
                <p className="text-xs mt-1">Use your workspace more to get personalized recommendations.</p>
              </div>
            ) : (
              layoutSuggestions.map((suggestion) => {
                const IconComponent = getCategoryIcon(suggestion.category);
                return (
                  <div key={suggestion.id} className="group liquid-glass-section rounded-xl p-4 hover:liquid-glass-selected transition-all duration-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-200">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-adaptive-primary group-hover:text-white transition-colors">{suggestion.name}</h4>
                          <div className={`text-xs px-2 py-0.5 rounded-full border ${getConfidenceColor(suggestion.confidence)}`}>
                            {Math.round(suggestion.confidence * 100)}% match
                          </div>
                        </div>
                        <p className="text-adaptive-secondary text-sm mb-2 group-hover:text-adaptive-muted transition-colors">{suggestion.description}</p>
                        <div className="flex items-center gap-2 text-xs text-adaptive-muted">
                          <IconComponent className="w-3 h-3" />
                          <span className="capitalize">{suggestion.category}</span>
                          <span>•</span>
                          <span>{suggestion.widgets.length} widgets</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 mb-4 p-2 liquid-glass-interactive rounded-lg">
                      {suggestion.widgets.map((widget, index) => (
                        <div
                          key={index}
                          className={`h-4 rounded bg-gradient-to-br transition-all duration-200 ${
                            index % 4 === 0 ? 'from-blue-500/20 to-blue-600/30' :
                            index % 4 === 1 ? 'from-purple-500/20 to-purple-600/30' :
                            index % 4 === 2 ? 'from-green-500/20 to-green-600/30' :
                            'from-orange-500/20 to-orange-600/30'
                          }`}
                          style={{
                            gridColumn: `span ${widget.position.width}`,
                            gridRow: `span ${widget.position.height}`
                          }}
                          title={widget.reason}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={() => handleApplyLayout(suggestion)}
                      className="w-full liquid-button-primary text-sm group-hover:shadow-lg transition-all duration-200"
                      size="sm"
                    >
                      Apply Layout
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="space-y-4">
            {widgetRecommendations.length === 0 ? (
              <div className="text-center py-8 text-adaptive-muted">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No widget recommendations available yet.</p>
                <p className="text-xs mt-1">Add more widgets to get personalized suggestions.</p>
              </div>
            ) : (
              widgetRecommendations.map((recommendation, index) => {
                const IconComponent = getRecommendationIcon(recommendation.category);
                return (
                  <div key={index} className="group liquid-glass-section rounded-xl p-4 hover:liquid-glass-selected transition-all duration-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-200">
                        {recommendation.widget.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-adaptive-primary group-hover:text-white transition-colors">{recommendation.widget.title}</h4>
                          <div className={`text-xs px-2 py-0.5 rounded-full border ${getConfidenceColor(recommendation.confidence)}`}>
                            <IconComponent className="w-3 h-3 inline mr-1" />
                            {recommendation.category}
                          </div>
                        </div>
                        <p className="text-adaptive-secondary text-sm mb-2 group-hover:text-adaptive-muted transition-colors">{recommendation.widget.description}</p>
                        <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20 inline-block">
                          💡 {recommendation.reason}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAddWidget(recommendation)}
                      className="w-full liquid-button-secondary text-sm group-hover:shadow-lg transition-all duration-200"
                      size="sm"
                    >
                      Add Widget
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="liquid-glass-section p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-adaptive-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>AI recommendations update automatically</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <Brain className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400 font-medium">AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}