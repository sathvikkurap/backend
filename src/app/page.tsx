import ContentGenerator from "@/components/ContentGenerator";

export default function Home() {
  return (
    <main className="container mx-auto p-4 pt-8">
      <h1 className="text-3xl font-bold text-center mb-6">Club Content Flow</h1>
      <p className="text-center text-muted-foreground mb-8">
        Generate engaging content for your club's social media and promotional materials
      </p>
      <ContentGenerator />
    </main>
  );
}
