'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Users, LayoutTemplate, Settings, FileText } from 'lucide-react';
import { FaFilePdf, FaInstagram } from 'react-icons/fa';

// Types
export type ClubProfile = {
  name: string;
  description: string;
  foundingDate: string;
  upcomingEvents: string;
  benefits: string;
  achievements: string;
  leadershipTeam: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  meetingFrequency: string;
  meetingLocation: string;
  currentMemberCount: string;
  focusAreas: string[];
  type: string;
  tone: string;
};

export type ContentFormat = {
  outputType: 'pdf' | 'social';
  logo: File | null;
};

export type Audience = {
  targetGroup: string;
  ageRange: string;
  interestLevel: string;
  priorKnowledge: string;
};

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState('club-profile');
  const [clubProfile, setClubProfile] = useState<ClubProfile>({
    name: '',
    description: '',
    foundingDate: '',
    upcomingEvents: '',
    benefits: '',
    achievements: '',
    leadershipTeam: '',
    socialMedia: { facebook: '', twitter: '', instagram: '' },
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    meetingFrequency: '',
    meetingLocation: '',
    currentMemberCount: '',
    focusAreas: [],
    type: '',
    tone: '',
  });

  const [contentFormat, setContentFormat] = useState<ContentFormat>({
    outputType: 'pdf',
    logo: null,
  });

  const [audience, setAudience] = useState<Audience>({
    targetGroup: 'students',
    ageRange: '18-25',
    interestLevel: 'curious',
    priorKnowledge: 'beginner',
  });
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const tabIcons = {
    'club-profile': <Settings className="h-4 w-4" />,
    'content-format': <LayoutTemplate className="h-4 w-4" />,
    'audience': <Users className="h-4 w-4" />,
    'output': <FileText className="h-4 w-4" />,
  };

  const handleGenerate = async () => {
    setLoading(true);
    toast.loading('Generating...', { id: 'gen' });

    try {
      const formData = new FormData();
      formData.append('clubInfo', JSON.stringify({ ...clubProfile, audience }));
      formData.append('outputType', contentFormat.outputType);
      if (contentFormat.logo) formData.append('logo', contentFormat.logo);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setGeneratedUrl(url);

      toast.success('Generated successfully!', { id: 'gen' });
      setActiveTab('output');
    } catch (err) {
      toast.error('Failed to generate', { id: 'gen' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedUrl) return;
    const a = document.createElement('a');
    a.href = generatedUrl;
    a.download =
      contentFormat.outputType === 'pdf'
        ? 'club-poster.pdf'
        : `social-post-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(generatedUrl);
    setGeneratedUrl(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="w-full overflow-hidden border-primary/10 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1">
            {['club-profile', 'content-format', 'audience', 'output'].map((tab) => (
              <motion.div
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <TabsTrigger
                  value={tab}
                  className={`w-full flex items-center gap-2 ${
                    activeTab === tab ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  disabled={
                    (tab === 'content-format' && !clubProfile.name) ||
                    (tab === 'audience' && !clubProfile.name) ||
                    (tab === 'output' && !generatedUrl)
                  }
                >
                  {tabIcons[tab as keyof typeof tabIcons]}
                  <span className="hidden sm:inline">
                    {tab
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </span>
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>

          {/* Step 1: Club Profile */}
          <TabsContent value="club-profile" className="mt-0 p-0">
            {/* ...your ClubProfileSection code here... */}
          </TabsContent>

          {/* Step 2: Content Format */}
          <TabsContent value="content-format" className="mt-0 p-0">
            {/* ...your ContentFormatSection code here... */}
          </TabsContent>

          {/* Step 3: Audience */}
          <TabsContent value="audience" className="mt-0 p-0">
            {/* ...your AudienceSection code here... */}
          </TabsContent>

          {/* Step 4: Output */}
          <TabsContent value="output" className="mt-0 p-0">
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
              {loading && (
                <div className="text-lg text-gray-600">Generating...</div>
              )}
              {!loading && generatedUrl && (
                <>
                  <div className="mb-6 text-center text-lg">
                    Your {contentFormat.outputType === 'pdf' ? 'PDF Poster' : 'Social Media Post'} is ready!
                  </div>
                  <Button onClick={handleDownload}>
                    Download {contentFormat.outputType === 'pdf' ? 'PDF Poster' : 'Social Media Post'}
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab('content-format')}
                  >
                    Generate Another
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
