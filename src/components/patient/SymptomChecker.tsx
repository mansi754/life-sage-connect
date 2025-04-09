
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Search, Loader2, Save, Share, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkSymptoms } from "@/services/symptomCheckerService";
import { Input } from "@/components/ui/input";

type SymptomResult = {
  severity: "low" | "medium" | "high";
  message: string;
  recommendations: string[];
  seekMedicalAttention: boolean;
};

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [duration, setDuration] = useState("recent");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [customBodyPart, setCustomBodyPart] = useState("");
  const [customSymptom, setCustomSymptom] = useState("");
  const [editingRecommendation, setEditingRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const [bodyParts, setBodyParts] = useState([
    "Head",
    "Chest",
    "Abdomen",
    "Back",
    "Arms",
    "Legs",
    "Joints",
    "Skin",
    "General"
  ]);

  const [commonSymptoms, setCommonSymptoms] = useState([
    "Fever",
    "Cough",
    "Headache",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Pain",
    "Rash"
  ]);

  const handleBodyPartChange = (part: string) => {
    if (selectedBodyParts.includes(part)) {
      setSelectedBodyParts(selectedBodyParts.filter(p => p !== part));
    } else {
      setSelectedBodyParts([...selectedBodyParts, part]);
    }
  };

  const handleAddCommonSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom);
    }
  };

  const handleAddCustomBodyPart = () => {
    if (customBodyPart && !bodyParts.includes(customBodyPart)) {
      setBodyParts([...bodyParts, customBodyPart]);
      setSelectedBodyParts([...selectedBodyParts, customBodyPart]);
      setCustomBodyPart("");
      toast({
        title: "Body Part Added",
        description: `Added '${customBodyPart}' to the body parts list.`,
        variant: "default",
      });
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom && !commonSymptoms.includes(customSymptom)) {
      setCommonSymptoms([...commonSymptoms, customSymptom]);
      handleAddCommonSymptom(customSymptom);
      setCustomSymptom("");
      toast({
        title: "Symptom Added",
        description: `Added '${customSymptom}' to your symptoms.`,
        variant: "default",
      });
    }
  };

  const handleCheck = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your symptoms.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await checkSymptoms({
        description: symptoms,
        bodyParts: selectedBodyParts,
        duration: duration
      });
      
      setResult(result);
      setRecommendations(result.recommendations);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setSelectedBodyParts([]);
    setDuration("recent");
    setResult(null);
  };

  const handleUpdateRecommendation = (index: number, value: string) => {
    const updatedRecommendations = [...recommendations];
    updatedRecommendations[index] = value;
    setRecommendations(updatedRecommendations);
  };

  const handleAddRecommendation = () => {
    setRecommendations([...recommendations, "New recommendation"]);
  };

  const handleRemoveRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handleSaveRecommendations = () => {
    if (result) {
      setResult({
        ...result,
        recommendations: recommendations
      });
    }
    setEditingRecommendation(false);
    toast({
      title: "Recommendations Updated",
      description: "Your recommendations have been updated successfully.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="symptoms">Describe your symptoms</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe what you're experiencing in detail..."
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="resize-none"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-health-neutral-500 mb-2">Common symptoms:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add custom symptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    className="text-sm h-8"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddCustomSymptom}
                    disabled={!customSymptom}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCommonSymptom(symptom)}
                    className="text-health-neutral-700"
                  >
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Where are you experiencing symptoms?</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add body part"
                    value={customBodyPart}
                    onChange={(e) => setCustomBodyPart(e.target.value)}
                    className="text-sm h-8"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddCustomBodyPart}
                    disabled={!customBodyPart}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {bodyParts.map((part) => (
                  <div key={part} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`part-${part}`} 
                      checked={selectedBodyParts.includes(part)}
                      onCheckedChange={() => handleBodyPartChange(part)}
                    />
                    <label
                      htmlFor={`part-${part}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {part}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>How long have you been experiencing these symptoms?</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="duration-recent"
                    name="duration"
                    value="recent"
                    checked={duration === "recent"}
                    onChange={() => setDuration("recent")}
                    className="text-health-blue-500 focus:ring-health-blue-500"
                  />
                  <label htmlFor="duration-recent" className="text-sm font-medium">
                    Today / Yesterday
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="duration-week"
                    name="duration"
                    value="week"
                    checked={duration === "week"}
                    onChange={() => setDuration("week")}
                    className="text-health-blue-500 focus:ring-health-blue-500"
                  />
                  <label htmlFor="duration-week" className="text-sm font-medium">
                    This week
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="duration-longer"
                    name="duration"
                    value="longer"
                    checked={duration === "longer"}
                    onChange={() => setDuration("longer")}
                    className="text-health-blue-500 focus:ring-health-blue-500"
                  />
                  <label htmlFor="duration-longer" className="text-sm font-medium">
                    Longer than a week
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCheck} 
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Symptoms...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Check Symptoms
              </span>
            )}
          </Button>
        </>
      ) : (
        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${
            result.severity === "high" ? "bg-red-50 border border-red-200" :
            result.severity === "medium" ? "bg-orange-50 border border-orange-200" :
            "bg-green-50 border border-green-200"
          }`}>
            <div className="flex items-start">
              <AlertCircle className={`h-5 w-5 mr-2 flex-shrink-0 ${
                result.severity === "high" ? "text-red-500" :
                result.severity === "medium" ? "text-orange-500" :
                "text-green-500"
              }`} />
              <div>
                <h3 className={`font-medium ${
                  result.severity === "high" ? "text-red-800" :
                  result.severity === "medium" ? "text-orange-800" :
                  "text-green-800"
                }`}>
                  {result.severity === "high" ? "Urgent: Seek Medical Care" :
                   result.severity === "medium" ? "Medical Attention Recommended" :
                   "Low Severity"
                  }
                </h3>
                <p className="mt-1 text-health-neutral-700">{result.message}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">Recommendations</h3>
              {!editingRecommendation ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingRecommendation(true)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingRecommendation(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveRecommendations}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                </div>
              )}
            </div>
            
            {!editingRecommendation ? (
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-health-blue-500 mt-2 mr-2"></span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={recommendation}
                      onChange={(e) => handleUpdateRecommendation(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveRecommendation(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={handleAddRecommendation}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Recommendation
                </Button>
              </div>
            )}
          </div>
          
          {result.seekMedicalAttention && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-amber-800">
                We recommend you speak with a healthcare professional about your symptoms.
              </p>
              <Button asChild className="mt-2 bg-amber-500 hover:bg-amber-600">
                <a href="/appointments/schedule">Schedule Consultation</a>
              </Button>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Start Over
            </Button>
            <Button className="btn-primary flex-1">
              Request Doctor Consultation
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center">
              <Save className="mr-2 h-4 w-4" /> Save Results
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share className="mr-2 h-4 w-4" /> Share with Doctor
            </Button>
          </div>
          
          <div className="text-sm text-health-neutral-500 bg-health-neutral-50 p-4 rounded-lg">
            <p className="font-medium text-health-neutral-700 mb-1">Important Note</p>
            <p>
              This symptom checker provides general guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
