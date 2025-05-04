"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type ContentFormat } from "../ContentGenerator";
import { motion } from "framer-motion";
import { LayoutTemplate } from "lucide-react";

interface ContentFormatSectionProps {
  contentFormat: ContentFormat;
  setContentFormat: (format: ContentFormat) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ContentFormatSection({
  contentFormat,
  setContentFormat,
  onBack,
  onNext,
}: ContentFormatSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          <CardTitle>Content Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 animate-stagger">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="platform">Platform</Label>
            <Select
              value={contentFormat.platform}
              onValueChange={(value) => setContentFormat({ ...contentFormat, platform: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="poster">Print Poster</SelectItem>
                <SelectItem value="flyer">Print Flyer</SelectItem>
                <SelectItem value="newsletter">Email Newsletter</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Label htmlFor="formatType">Content Type</Label>
            <Select
              value={contentFormat.formatType}
              onValueChange={(value) => setContentFormat({ ...contentFormat, formatType: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">Regular Post</SelectItem>
                <SelectItem value="event">Event Announcement</SelectItem>
                <SelectItem value="workshop">Workshop Promotion</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
                <SelectItem value="meetup">Meetup Invitation</SelectItem>
                <SelectItem value="announcement">General Announcement</SelectItem>
                <SelectItem value="recruitment">Member Recruitment</SelectItem>
                <SelectItem value="spotlight">Member Spotlight</SelectItem>
                <SelectItem value="news">News Update</SelectItem>
                <SelectItem value="tip">Tips & Advice</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="achievements">Achievements Showcase</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label htmlFor="contentLength">Content Length</Label>
            <Select
              value={contentFormat.contentLength}
              onValueChange={(value) => setContentFormat({ ...contentFormat, contentLength: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (50-100 words)</SelectItem>
                <SelectItem value="medium">Medium (100-200 words)</SelectItem>
                <SelectItem value="long">Long (200-300 words)</SelectItem>
                <SelectItem value="extended">Extended (300+ words)</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox
              id="includeHashtags"
              checked={contentFormat.includeHashtags}
              onCheckedChange={(checked) =>
                setContentFormat({ ...contentFormat, includeHashtags: checked === true })
              }
              className="transition-all data-[state=checked]:animate-pulse"
            />
            <Label htmlFor="includeHashtags" className="cursor-pointer">
              Include relevant hashtags
            </Label>
          </motion.div>

          <motion.div
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Checkbox
              id="includeCTA"
              checked={contentFormat.includeCTA}
              onCheckedChange={(checked) =>
                setContentFormat({ ...contentFormat, includeCTA: checked === true })
              }
              className="transition-all data-[state=checked]:animate-pulse"
            />
            <Label htmlFor="includeCTA" className="cursor-pointer">
              Include call-to-action
            </Label>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={onBack} className="transition-all duration-200 hover:bg-accent">
              Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onNext}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Next</span>
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
