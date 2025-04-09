
import { useState } from "react";
import { analyzeSymptoms } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setAnalysis("Please describe your symptoms first.");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      setAnalysis("An error occurred while analyzing symptoms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          AI Symptom Analyzer
        </CardTitle>
        <CardDescription>
          Describe your symptoms in detail for AI-assisted analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="mb-4 border-yellow-500 bg-yellow-50">
          <Shield className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Important health disclaimer</AlertTitle>
          <AlertDescription>
            This tool provides general information only and is not a substitute for professional medical advice.
            Always consult with a healthcare provider for diagnosis and treatment.
          </AlertDescription>
        </Alert>

        {showApiKeyInput ? (
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Enter your OpenAI API Key
            </label>
            <input
              id="api-key"
              type="password"
              className="w-full p-2 border rounded"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <Button 
              onClick={() => {
                localStorage.setItem("openai-api-key", apiKey);
                setShowApiKeyInput(false);
              }}
              size="sm"
            >
              Save Key
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowApiKeyInput(true)}
            className="text-xs"
          >
            Configure API Key
          </Button>
        )}

        <div className="space-y-2">
          <label htmlFor="symptoms" className="text-sm font-medium">
            Describe your symptoms
          </label>
          <Textarea
            id="symptoms"
            placeholder="Describe your symptoms in detail (e.g., 'I've had a severe headache for 3 days, accompanied by nausea and sensitivity to light')"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={loading || !symptoms.trim()} 
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Symptoms"
          )}
        </Button>

        {analysis && (
          <div className="mt-4 p-4 bg-health-neutral-50 rounded-md">
            <h3 className="font-medium mb-2">Analysis Result:</h3>
            <div className="whitespace-pre-line text-health-neutral-700">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-health-neutral-500">
        Your data is processed securely and not stored permanently
      </CardFooter>
    </Card>
  );
};

export default SymptomAnalyzer;
