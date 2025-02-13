'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

//redirect to auth login page

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('login');
  }, [router]);

  return null;
};

export default Page;