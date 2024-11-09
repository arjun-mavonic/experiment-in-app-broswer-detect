"use client";

import { useEffect } from 'react';
import { useBrowserDetection } from '@/hooks/useBrowserDetection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chrome, Smartphone, Globe, Monitor } from 'lucide-react';

export function BrowserDetectionDemo() {
  const { browserInfo, isLoading, redirectToNativeBrowser } = useBrowserDetection();

  useEffect(() => {
    // Auto-redirect can be enabled by uncommenting these lines
    // if (browserInfo?.isInApp) {
    //   redirectToNativeBrowser();
    // }
  }, [browserInfo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getIcon = () => {
    if (browserInfo?.isInApp) return Smartphone;
    if (browserInfo?.browser === 'chrome') return Chrome;
    if (browserInfo?.platform === 'mobile') return Smartphone;
    if (browserInfo?.platform === 'desktop') return Monitor;
    return Globe;
  };

  const Icon = getIcon();

  const handleRedirect = () => {
    // Show a brief message before redirect
    const message = document.createElement('div');
    message.className = 'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center text-lg font-medium';
    message.textContent = 'Opening in native browser...';
    document.body.appendChild(message);
    
    // Trigger redirect after showing message
    setTimeout(() => {
      redirectToNativeBrowser();
      // Remove message after a delay
      setTimeout(() => document.body.removeChild(message), 2000);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 sm:p-8">
      <Card className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center">
          <Icon className="h-16 w-16 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-center">Browser Detection</h1>
          
          <div className="grid gap-4 text-lg">
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Environment:</span>
              <span className="text-primary">
                {browserInfo?.isInApp ? 'In-App Browser' : 'Native Browser'}
              </span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Browser:</span>
              <span className="capitalize">{browserInfo?.browser}</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Operating System:</span>
              <span className="capitalize">{browserInfo?.os}</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">Platform:</span>
              <span className="capitalize">{browserInfo?.platform}</span>
            </div>
            
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-semibold">PWA Mode:</span>
              <span>{browserInfo?.isStandalone ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {browserInfo?.isInApp && (
            <div className="pt-4">
              <Button 
                onClick={handleRedirect}
                className="w-full text-lg py-6"
              >
                Open in Native Browser
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}