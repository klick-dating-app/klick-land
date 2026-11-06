'use client';

import { useEffect } from 'react';
import { usePortal } from '../PortalContext';
import PlansGrid from '../components/PlansGrid';

export default function VisaVIPPage() {
  const { setActiveTopSection } = usePortal();

  useEffect(() => {
    setActiveTopSection('membresia-vip');
  }, [setActiveTopSection]);

  return <PlansGrid variant="vip" />;
}
