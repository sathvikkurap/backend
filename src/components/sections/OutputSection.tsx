"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Clipboard, Save, Wand2, ArrowLeft, Download } from "lucide-react";

interface OutputSectionProps {
  generatedContent: string;
  onRegenerate: () => void;
  onBack: () => void;
}

export default function OutputSection({
  generatedContent,
  onRegenerate,
  onBack,
}: OutputSectionProps) {
  const [editableContent, setEditableContent] = useState(generatedContent);

  // Update the editable content when the generated content changes
  useEffect(() => {
    setEditableContent(generatedContent);
  }, [generatedContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    toast.success("Content copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([editableContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "club-content.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Content downloaded!");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-5 w-5 text-primary animate-pulse" />
            <CardTitle>Generated Content</CardTitle>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {generatedContent ? (
            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Textarea
                  className="min-h-[300px] font-mono resize-none transition-all focus:ring-2 focus:ring-primary"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                />
              </motion.div>
              <motion.div className="flex flex-wrap gap-2" variants={item}>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1 flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Clipboard className="h-4 w-4" />
                  <span>Copy to Clipboard</span>
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button
                  onClick={() => toast.success("Content saved as template!")}
                  variant="outline"
                  className="flex-1 flex items-center gap-2 hover:bg-accent transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save as Template</span>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center min-h-[300px] border rounded-md p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-muted-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Complete the previous steps to generate content
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onRegenerate}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  Generate Content
                </Button>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-primary/5">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 transition-all duration-200 hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onRegenerate}
              className="relative overflow-hidden group flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
            >
              <Wand2 className="h-4 w-4" />
              <span className="relative z-10">Regenerate</span>
              <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
