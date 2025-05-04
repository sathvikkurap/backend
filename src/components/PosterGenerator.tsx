'use client';
import { useState } from 'react';
import { FaFilePdf, FaInstagram } from 'react-icons/fa';

export default function PosterGenerator() {
  const [clubInfo, setClubInfo] = useState({
    name: '',
    description: '',
    foundingDate: '',
    upcomingEvents: '',
    benefits: '',
    achievements: '',
    leadershipTeam: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    meetingFrequency: '',
    meetingLocation: '',
    currentMemberCount: ''
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [outputType, setOutputType] = useState<'pdf' | 'social'>('pdf');

  const handleSocialChange = (platform: string, value: string) => {
    setClubInfo({
      ...clubInfo,
      socialMedia: {
        ...clubInfo.socialMedia,
        [platform]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

      if (outputType === 'pdf') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'club-poster.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
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
        };
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Poster & Social Post Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Output Type Selector */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setOutputType('pdf')}
              className={`px-4 py-2 rounded-lg ${
                outputType === 'pdf'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              PDF Poster
            </button>
            <button
              type="button"
              onClick={() => setOutputType('social')}
              className={`px-4 py-2 rounded-lg ${
                outputType === 'social'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Social Media Post
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Club Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Club Name *</label>
              <input
                type="text"
                value={clubInfo.name}
                onChange={(e) => setClubInfo({ ...clubInfo, name: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* Founding Date */}
            <div>
              <label className="block text-sm font-medium mb-2">Founding Date *</label>
              <input
                type="date"
                value={clubInfo.foundingDate}
                onChange={(e) => setClubInfo({ ...clubInfo, foundingDate: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <input
                type="text"
                value={clubInfo.description}
                onChange={(e) => setClubInfo({ ...clubInfo, description: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* Upcoming Events */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Upcoming Events (comma separated)</label>
              <input
                type="text"
                value={clubInfo.upcomingEvents}
                onChange={(e) => setClubInfo({ ...clubInfo, upcomingEvents: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Workshop: Next.js Fundamentals, Hackathon: AI Applications"
              />
            </div>
            {/* Membership Benefits */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Membership Benefits (comma separated)</label>
              <input
                type="text"
                value={clubInfo.benefits}
                onChange={(e) => setClubInfo({ ...clubInfo, benefits: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Expert mentorship, Project funding, Networking opportunities"
              />
            </div>
            {/* Achievements */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Achievements (comma separated)</label>
              <input
                type="text"
                value={clubInfo.achievements}
                onChange={(e) => setClubInfo({ ...clubInfo, achievements: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Won 2023 Innovation Award, Reached 1000 members"
              />
            </div>
            {/* Leadership Team */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Leadership Team (comma separated)</label>
              <input
                type="text"
                value={clubInfo.leadershipTeam}
                onChange={(e) => setClubInfo({ ...clubInfo, leadershipTeam: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. John Doe - President, Jane Smith - VP"
              />
            </div>
            {/* Social Media Handles */}
            <div>
              <label className="block text-sm font-medium mb-2">Facebook Handle</label>
              <input
                type="text"
                value={clubInfo.socialMedia.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. techclub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter Handle</label>
              <input
                type="text"
                value={clubInfo.socialMedia.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. techclub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram Handle</label>
              <input
                type="text"
                value={clubInfo.socialMedia.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. techclub.official"
              />
            </div>
            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Contact Email *</label>
              <input
                type="email"
                value={clubInfo.contactEmail}
                onChange={(e) => setClubInfo({ ...clubInfo, contactEmail: e.target.value })}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <input
                type="text"
                value={clubInfo.contactPhone}
                onChange={(e) => setClubInfo({ ...clubInfo, contactPhone: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. +1-555-123-4567"
              />
            </div>
            {/* Website URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <input
                type="text"
                value={clubInfo.websiteUrl}
                onChange={(e) => setClubInfo({ ...clubInfo, websiteUrl: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. techclub.dev"
              />
            </div>
            {/* Meeting Frequency */}
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Frequency</label>
              <input
                type="text"
                value={clubInfo.meetingFrequency}
                onChange={(e) => setClubInfo({ ...clubInfo, meetingFrequency: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Every Tuesday 7PM"
              />
            </div>
            {/* Meeting Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Location</label>
              <input
                type="text"
                value={clubInfo.meetingLocation}
                onChange={(e) => setClubInfo({ ...clubInfo, meetingLocation: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder="e.g. Campus Room 203"
              />
            </div>
            {/* Current Member Count */}
            <div>
              <label className="block text-sm font-medium mb-2">Current Member Count</label>
              <input
                type="number"
                value={clubInfo.currentMemberCount}
                onChange={(e) => setClubInfo({ ...clubInfo, currentMemberCount: e.target.value })}
                className="w-full p-2 border rounded-lg"
                min={0}
              />
            </div>
            {/* Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {outputType === 'pdf' ? (
              <FaFilePdf className="w-5 h-5" />
            ) : (
              <FaInstagram className="w-5 h-5" />
            )}
            {loading ? 'Generating...' : `Download ${outputType === 'pdf' ? 'PDF Poster' : 'Social Post'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
