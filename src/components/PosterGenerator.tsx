"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FaFilePdf, FaInstagram, FaFileImage } from "react-icons/fa";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ClubProfile } from "./ContentGenerator";

export default function PosterGenerator({ clubProfile }: { clubProfile: ClubProfile }) {
  // Initialize with data from clubProfile where possible
  const [clubInfo, setClubInfo] = useState({
    name: clubProfile.name || "",
    mission: clubProfile.description || "",
    foundingDate: "",
    upcomingEvents: "",
    benefits: clubProfile.focusAreas.join(", ") || "",
    achievements: "",
    leadershipTeam: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: ""
    },
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    meetingFrequency: "",
    meetingLocation: "",
    currentMemberCount: ""
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputType, setOutputType] = useState<'pdf' | 'social'>('pdf');
  
  // Add the handleSocialChange function
  const handleSocialChange = (platform: string, value: string) => {
    setClubInfo({
      ...clubInfo,
      socialMedia: {
        ...clubInfo.socialMedia,
        [platform]: value
      }
    });
  };

  // Add the handleSubmit function (same as in your provided code)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Generating content...", { id: "generating" });

    try {
      const formData = new FormData();
      formData.append('clubInfo', JSON.stringify(clubInfo));
      formData.append('outputType', outputType);
      if (logo) formData.append('logo', logo);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Generation failed');
      toast.dismiss("generating");

      if (outputType === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'club-poster.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("PDF poster generated successfully!");
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const img = new window.Image();
        img.src = url;
        img.onload = () => {
          const a = document.createElement('a');
          a.href = url;
          a.download = `social-post-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success("Social media post generated successfully!");
        };
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  // Form UI (similar to your provided code but using your UI components)
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Generate Club Materials</h2>
        <p className="text-muted-foreground mb-6">Create a poster or social media post with your club information</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Output Type Selector */}
          <div className="flex gap-4 mb-4">
            <Button
                type="button"
                onClick={() => setOutputType('pdf')}
                className={`flex items-center gap-2 ${
                outputType === 'pdf' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                <FaFilePdf /> PDF Poster
            </Button>
            <Button
                type="button"
                onClick={() => setOutputType('social')}
                className={`flex items-center gap-2 ${
                outputType === 'social' 
                    ? 'bg-pink-600 text-white hover:bg-pink-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                <FaInstagram /> Social Media Post
            </Button>
            </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields - similar structure to your provided code */}
            {/* Include all the form fields from your page.tsx */}
            {/* For brevity, I'm showing just a few key fields */}
            
            <div>
              <Label>Club Name</Label>
              <Input
                value={clubInfo.name}
                onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label>Founding Date</Label>
              <Input
                type="date"
                value={clubInfo.foundingDate}
                onChange={(e) => setClubInfo({ ...clubInfo, foundingDate: e.target.value })}
                className="w-full"
                required
              />
            </div>
            
            {/* Add all other fields from the original form */}
            
            <div className="md:col-span-2">
              <Label>Upload Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
          >
            {outputType === 'pdf' ? (
              <FaFilePdf className="w-5 h-5" />
            ) : (
              <FaInstagram className="w-5 h-5" />
            )}
            {loading ? 'Generating...' : `Download ${outputType === 'pdf' ? 'PDF Poster' : 'Social Post'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
