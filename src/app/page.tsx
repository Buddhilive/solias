import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-6">
      <Image src="/logo/solias_logo_no_bg.png" alt="Solias KMS" width={200} height={200} />
      <h1 className="text-4xl font-bold">Welcome to Solias KMS</h1>
      <a href="/dashboard" className="btn p-3 bg-primary text-primary-foreground rounded-2xl">Go to Dashboard</a>
    </div>
  );
}
