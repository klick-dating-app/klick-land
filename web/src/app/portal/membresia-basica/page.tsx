'use client';

import { useEffect } from 'react';
import { usePortal } from '../PortalContext';
import PlansGrid from '../components/PlansGrid';

export default function VisaBásicoPage() {
  const { setActiveTopSection } = usePortal();

  useEffect(() => {
    setActiveTopSection('membresia-basica');
  }, [setActiveTopSection]);

  return <PlansGrid variant="basico" />;
}
