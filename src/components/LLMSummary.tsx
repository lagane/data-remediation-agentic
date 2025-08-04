import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Brain, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LLMSummaryProps {
  analysisResult: any;
}

export const LLMSummary: React.FC<LLMSummaryProps> = ({ analysisResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (analysisResult && !summary) {
      generateSummary();
    }
  }, [analysisResult]);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate LLM response generation
    setTimeout(() => {
      const mockSummary = `Based on the analysis of your dataset with ${analysisResult.totalRows.toLocaleString()} rows and ${analysisResult.totalColumns} columns, I've identified several data quality issues that need attention:

**Critical Issues:**
• **Missing Data**: Your dataset contains significant null values, particularly in the 'age' column (47 missing values) and 'name' column (23 missing values). This represents approximately 3.8% of your total data points.

• **Data Integrity**: 8 duplicate rows were detected, which could skew your analysis results and need to be addressed.

• **Schema Validation**: Email format inconsistencies were found, with some entries not following standard email patterns. Additionally, the age column contains non-numeric values that violate the expected integer data type.

**Impact Assessment:**
Your current data quality score is ${Math.max(0, 100 - 15 - 5 - 10)}%, indicating moderate data quality concerns. The primary issues stem from data collection inconsistencies and missing validation during data entry.

**Recommended Actions:**
1. **Data Cleaning**: Remove or deduplicate the 8 duplicate entries
2. **Missing Value Treatment**: Consider mean imputation for numerical age values and validation rules for required name fields
3. **Format Standardization**: Implement email validation and standardize the age column to ensure numeric consistency

**Business Impact:**
Addressing these issues will improve your data reliability by approximately 25% and ensure more accurate analytics outcomes. The remediation process should take minimal time while significantly enhancing data trust and usability.`;

      setSummary(mockSummary);
      setIsGenerating(false);
      setIsOpen(true);
    }, 2000);
  };

  if (!analysisResult) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-foreground">AI Data Quality Summary</CardTitle>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center py-8 space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Generating AI summary...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generateSummary}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Regenerate Summary
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};