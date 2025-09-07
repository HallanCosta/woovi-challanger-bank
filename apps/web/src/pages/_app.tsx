import React, { Suspense } from 'react';
import type { AppProps } from 'next/app';
import '../styles/index.css';

import { ReactRelayContainer } from '../relay/ReactRelayContainer';
import { Toaster } from '../components/ui/Toaster';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback="loading">
      <ReactRelayContainer Component={Component} props={pageProps} />
      <Toaster />
    </Suspense>
  );
}
