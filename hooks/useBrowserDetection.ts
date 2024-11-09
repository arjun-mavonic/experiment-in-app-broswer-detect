"use client";

import { useEffect, useState } from 'react';
import Bowser from 'bowser';
import inAppSpyDetector from 'inapp-spy';

interface BrowserInfo {
  isInApp: any;
  browser: string;
  os: string;
  platform: string;
  isStandalone: boolean;
}

export const useBrowserDetection = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bowserInfo = Bowser.parse(window.navigator.userAgent);
      
      const info: BrowserInfo = {
        isInApp: inAppSpyDetector(),
        browser: bowserInfo.browser.name?.toLowerCase() || 'unknown',
        os: bowserInfo.os.name?.toLowerCase() || 'unknown',
        platform: bowserInfo.platform.type || 'unknown',
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      };
      
      setBrowserInfo(info);
      setIsLoading(false);
    }
  }, []);

  const redirectToNativeBrowser = () => {
    if (!browserInfo?.isInApp) return;

    const currentUrl = window.location.href;
    
    // iOS specific handling
    if (browserInfo.os === 'ios') {
      // Force open in Safari
      window.location.href = `x-web-search://?${encodeURIComponent(currentUrl)}`;
      
      // Fallback after delay if x-web-search doesn't work
      setTimeout(() => {
        window.location.href = `googlechrome://${currentUrl.substring(8)}`;
      }, 100);
      return;
    }

    // Android specific handling
    if (browserInfo.os === 'android') {
      // Try Chrome first
      window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`;
      
      // Fallback after delay
      setTimeout(() => {
        window.location.href = currentUrl;
      }, 100);
      return;
    }

    // Fallback for other platforms
    window.open(currentUrl, '_blank');
  };

  return {
    browserInfo,
    isLoading,
    redirectToNativeBrowser,
  };
};