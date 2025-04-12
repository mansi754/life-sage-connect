
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TabData {
  id: string;
  title: string;
  description: string;
  content: string;
}

interface FunctionalTabsProps {
  defaultTab?: string;
  tabs: TabData[];
  onTabChange?: (tabId: string) => void;
}

const FunctionalTabs: React.FC<FunctionalTabsProps> = ({ 
  defaultTab, 
  tabs, 
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 mb-8 w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} className="text-center">
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tab.title}</CardTitle>
              <CardDescription>{tab.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{tab.content}</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default FunctionalTabs;
