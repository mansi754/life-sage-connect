
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FunctionalCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

const FunctionalCard: React.FC<FunctionalCardProps> = ({
  title,
  description,
  children,
  footerContent,
  onClick,
  variant = 'default',
}) => {
  const getCardClassName = () => {
    switch (variant) {
      case 'primary':
        return 'border-primary';
      case 'secondary':
        return 'border-secondary';
      default:
        return '';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${getCardClassName()}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};

export default FunctionalCard;
