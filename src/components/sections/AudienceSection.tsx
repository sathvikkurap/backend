"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type Audience } from "../ContentGenerator";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Dispatch, SetStateAction } from 'react';
interface AudienceSectionProps {
  audience: Audience;
  setAudience: Dispatch<SetStateAction<Audience>>;
  onBack: () => void;
  onNext: () => Promise<void>; // Updated to match Promise<void> return type
  loading: boolean; // Added the missing loading prop
}

export default function AudienceSection({
  audience,
  setAudience,
  onBack,
  onNext,
}: AudienceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Target Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 animate-stagger">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Label htmlFor="targetGroup">Target Group</Label>
            <Select
              value={audience.targetGroup}
              onValueChange={(value) => setAudience({ ...audience, targetGroup: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select target group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="professionals">Working Professionals</SelectItem>
                <SelectItem value="researchers">Academics & Researchers</SelectItem>
                <SelectItem value="enthusiasts">Hobbyists & Enthusiasts</SelectItem>
                <SelectItem value="beginners">Beginners</SelectItem>
                <SelectItem value="families">Families</SelectItem>
                <SelectItem value="seniors">Seniors</SelectItem>
                <SelectItem value="community">Local Community</SelectItem>
                <SelectItem value="youth">Youth</SelectItem>
                <SelectItem value="general">General Public</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Label htmlFor="ageRange">Age Range</Label>
            <Select
              value={audience.ageRange}
              onValueChange={(value) => setAudience({ ...audience, ageRange: value })}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-13">Under 13</SelectItem>
                <SelectItem value="13-17">13-17</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-50">36-50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
                <SelectItem value="all-ages">All Ages</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Label>Interest Level</Label>
            <RadioGroup
              value={audience.interestLevel}
              onValueChange={(value) => setAudience({ ...audience, interestLevel: value })}
              className="flex flex-col space-y-1"
            >
              {[
                { value: "curious", label: "Curious (new to the topic)" },
                { value: "interested", label: "Interested (some exposure)" },
                { value: "engaged", label: "Engaged (follows developments)" },
                { value: "passionate", label: "Passionate (highly involved)" }
              ].map((item, index) => (
                <motion.div
                  key={item.value}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + (index * 0.1) }}
                >
                  <RadioGroupItem
                    value={item.value}
                    id={`interest-${item.value}`}
                    className="transition-all"
                  />
                  <Label htmlFor={`interest-${item.value}`} className="cursor-pointer">
                    {item.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Label>Prior Knowledge</Label>
            <RadioGroup
              value={audience.priorKnowledge}
              onValueChange={(value) => setAudience({ ...audience, priorKnowledge: value })}
              className="flex flex-col space-y-1"
            >
              {[
                { value: "beginner", label: "Beginner (no background)" },
                { value: "intermediate", label: "Intermediate (some knowledge)" },
                { value: "advanced", label: "Advanced (solid background)" },
                { value: "expert", label: "Expert (specialized knowledge)" }
              ].map((item, index) => (
                <motion.div
                  key={item.value}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.4 + (index * 0.1) }}
                >
                  <RadioGroupItem
                    value={item.value}
                    id={`knowledge-${item.value}`}
                    className="transition-all"
                  />
                  <Label htmlFor={`knowledge-${item.value}`} className="cursor-pointer">
                    {item.label}
                  </Label>
                </motion.div>
              ))}
            </RadioGroup>
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
              className="relative overflow-hidden group bg-gradient-to-r from-primary to-primary/80"
            >
              <span className="relative z-10">Generate</span>
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
