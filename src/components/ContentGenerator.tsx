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
  mission: string;
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
};

export type ContentFormat = {
  outputType: 'pdf' | 'social';
  logo: File | null;
};

export type Audience = {
  // Add audience fields if needed, or leave empty
};

// Main Component
export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState('club-profile');
  const [clubProfile, setClubProfile] = useState<ClubProfile>({
    name: '',
    mission: '',
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
    currentMemberCount: ''
  });

  const [contentFormat, setContentFormat] = useState<ContentFormat>({
    outputType: 'pdf',
    logo: null
  });

  const [audience, setAudience] = useState<Audience>({});
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  // Tab icons
  const tabIcons = {
    'club-profile': <Settings className="h-4 w-4" />,
    'content-format': <LayoutTemplate className="h-4 w-4" />,
    'audience': <Users className="h-4 w-4" />,
    'output': <FileText className="h-4 w-4" />,
  };

  // Handle generation
  const handleGenerate = async () => {
    setLoading(true);
    toast.loading('Generating...', { id: 'gen' });

    try {
      const formData = new FormData();
      formData.append('clubInfo', JSON.stringify(clubProfile));
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

  // Download handler
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

  // UI
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
            {/* Modern UI for club profile */}
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Club Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Club Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Club Name *</label>
                  <input
                    type="text"
                    value={clubProfile.name}
                    onChange={(e) => setClubProfile({ ...clubProfile, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Founding Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Founding Date *</label>
                  <input
                    type="date"
                    value={clubProfile.foundingDate}
                    onChange={(e) => setClubProfile({ ...clubProfile, foundingDate: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Mission */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Mission Statement *</label>
                  <input
                    type="text"
                    value={clubProfile.mission}
                    onChange={(e) => setClubProfile({ ...clubProfile, mission: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Upcoming Events */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Upcoming Events (comma separated)</label>
                  <input
                    type="text"
                    value={clubProfile.upcomingEvents}
                    onChange={(e) => setClubProfile({ ...clubProfile, upcomingEvents: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Workshop: Next.js Fundamentals, Hackathon: AI Applications"
                  />
                </div>
                {/* Membership Benefits */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Membership Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={clubProfile.benefits}
                    onChange={(e) => setClubProfile({ ...clubProfile, benefits: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Expert mentorship, Project funding, Networking opportunities"
                  />
                </div>
                {/* Achievements */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Achievements (comma separated)</label>
                  <input
                    type="text"
                    value={clubProfile.achievements}
                    onChange={(e) => setClubProfile({ ...clubProfile, achievements: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Won 2023 Innovation Award, Reached 1000 members"
                  />
                </div>
                {/* Leadership Team */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Leadership Team (comma separated)</label>
                  <input
                    type="text"
                    value={clubProfile.leadershipTeam}
                    onChange={(e) => setClubProfile({ ...clubProfile, leadershipTeam: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. John Doe - President, Jane Smith - VP"
                  />
                </div>
                {/* Social Media Handles */}
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook Handle</label>
                  <input
                    type="text"
                    value={clubProfile.socialMedia.facebook}
                    onChange={(e) =>
                      setClubProfile({
                        ...clubProfile,
                        socialMedia: { ...clubProfile.socialMedia, facebook: e.target.value }
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. techclub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                  <input
                    type="text"
                    value={clubProfile.socialMedia.twitter}
                    onChange={(e) =>
                      setClubProfile({
                        ...clubProfile,
                        socialMedia: { ...clubProfile.socialMedia, twitter: e.target.value }
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. techclub"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram Handle</label>
                  <input
                    type="text"
                    value={clubProfile.socialMedia.instagram}
                    onChange={(e) =>
                      setClubProfile({
                        ...clubProfile,
                        socialMedia: { ...clubProfile.socialMedia, instagram: e.target.value }
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. techclub.official"
                  />
                </div>
                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email *</label>
                  <input
                    type="email"
                    value={clubProfile.contactEmail}
                    onChange={(e) => setClubProfile({ ...clubProfile, contactEmail: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={clubProfile.contactPhone}
                    onChange={(e) => setClubProfile({ ...clubProfile, contactPhone: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. +1-555-123-4567"
                  />
                </div>
                {/* Website URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <input
                    type="text"
                    value={clubProfile.websiteUrl}
                    onChange={(e) => setClubProfile({ ...clubProfile, websiteUrl: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. techclub.dev"
                  />
                </div>
                {/* Meeting Frequency */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Frequency</label>
                  <input
                    type="text"
                    value={clubProfile.meetingFrequency}
                    onChange={(e) => setClubProfile({ ...clubProfile, meetingFrequency: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Every Tuesday 7PM"
                  />
                </div>
                {/* Meeting Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Location</label>
                  <input
                    type="text"
                    value={clubProfile.meetingLocation}
                    onChange={(e) => setClubProfile({ ...clubProfile, meetingLocation: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. Campus Room 203"
                  />
                </div>
                {/* Current Member Count */}
                <div>
                  <label className="block text-sm font-medium mb-2">Current Member Count</label>
                  <input
                    type="number"
                    value={clubProfile.currentMemberCount}
                    onChange={(e) => setClubProfile({ ...clubProfile, currentMemberCount: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button
                  type="button"
                  onClick={() => setActiveTab('content-format')}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 2: Content Format */}
          <TabsContent value="content-format" className="mt-0 p-0">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-bold mb-4">Choose Output Format & Logo</h2>
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setContentFormat((prev) => ({
                      ...prev,
                      outputType: 'pdf',
                    }))
                  }
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    contentFormat.outputType === 'pdf'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <FaFilePdf className="inline mr-2" />
                  PDF Poster
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setContentFormat((prev) => ({
                      ...prev,
                      outputType: 'social',
                    }))
                  }
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    contentFormat.outputType === 'social'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <FaInstagram className="inline mr-2" />
                  Social Media Post
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Logo (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setContentFormat((prev) => ({
                      ...prev,
                      logo: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('club-profile')}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab('audience')}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Step 3: Audience */}
          <TabsContent value="audience" className="mt-0 p-0">
            {/* If you have audience fields, render them here. Otherwise, just a continue button */}
            <div className="p-6">
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('content-format')}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
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
