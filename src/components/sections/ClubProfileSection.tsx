"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type ClubProfile } from "../ContentGenerator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { clubTemplates } from "@/data/clubTemplates";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface ClubProfileSectionProps {
  clubProfile: ClubProfile;
  setClubProfile: (profile: ClubProfile) => void;
  onNext: () => void;
}

const FOCUS_AREAS = [
  "Arts & Culture",
  "Sports & Recreation",
  "Education & Learning",
  "Technology",
  "Environment & Nature",
  "Community Service",
  "Professional Development",
  "Health & Wellness",
  "Music & Performance",
  "Food & Cooking",
  "Literature & Writing",
  "Photography & Media",
  "Gaming",
  "Science",
  "Business & Entrepreneurship",
  "Travel & Adventure"
];

export default function ClubProfileSection({
  clubProfile,
  setClubProfile,
  onNext,
}: ClubProfileSectionProps) {
  

  const handleSelectTemplate = (template: ClubProfile) => {
    setClubProfile(template);
  };

  const staggerAnimationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Club Profile</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Load Template</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {clubTemplates.map((template, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleSelectTemplate(template)}
                  className="flex flex-col items-start py-2"
                >
                  <span className="font-medium">{template.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="space-y-4 animate-stagger">
          <motion.div className="space-y-2" {...staggerAnimationProps}>
            <Label htmlFor="name">Club Name</Label>
            <Input
              id="name"
              value={clubProfile.name}
              onChange={(e) => setClubProfile({ ...clubProfile, name: e.target.value })}
              placeholder="e.g., Book Club Society"
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </motion.div>

          
          <motion.div className="space-y-2" {...staggerAnimationProps}>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={clubProfile.mission}
              onChange={(e) => setClubProfile({ ...clubProfile, mission: e.target.value })}
              placeholder="Brief description of your club and its mission"
              rows={3}
              className="transition-all focus:ring-2 focus:ring-primary"
            />
          </motion.div>
        </CardContent>
        <CardFooter className="justify-between">
          <div></div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onNext}
              disabled={!clubProfile.name}
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
