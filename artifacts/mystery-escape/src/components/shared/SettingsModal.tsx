import { useState } from "react";
import { Settings, X, Volume2, Music, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DIFFICULTIES = ["Easy", "Normal", "Hard"] as const;
type Difficulty = typeof DIFFICULTIES[number];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState([70]);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState([50]);
  const [particles, setParticles] = useState(true);
  const [screenShake, setScreenShake] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("Normal");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border border-border max-w-md p-0 overflow-hidden rounded-sm gap-0">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="font-serif text-xl tracking-widest text-foreground uppercase">
            Settings
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-5 space-y-6"
        >
          <SettingsSection icon={<Volume2 className="h-4 w-4" />} title="Sound Effects">
            <SettingsRow
              label="Enable Sound"
              control={
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  data-testid="toggle-sound"
                />
              }
            />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Volume</Label>
              <Slider
                value={soundVolume}
                onValueChange={setSoundVolume}
                min={0}
                max={100}
                step={1}
                disabled={!soundEnabled}
                className="w-full"
                data-testid="slider-sound-volume"
              />
            </div>
          </SettingsSection>

          <SettingsSection icon={<Music className="h-4 w-4" />} title="Music">
            <SettingsRow
              label="Enable Music"
              control={
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                  data-testid="toggle-music"
                />
              }
            />
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Volume</Label>
              <Slider
                value={musicVolume}
                onValueChange={setMusicVolume}
                min={0}
                max={100}
                step={1}
                disabled={!musicEnabled}
                className="w-full"
                data-testid="slider-music-volume"
              />
            </div>
          </SettingsSection>

          <SettingsSection icon={<Zap className="h-4 w-4" />} title="Visual Effects">
            <SettingsRow
              label="Particle Effects"
              control={
                <Switch
                  checked={particles}
                  onCheckedChange={setParticles}
                  data-testid="toggle-particles"
                />
              }
            />
            <SettingsRow
              label="Screen Shake"
              control={
                <Switch
                  checked={screenShake}
                  onCheckedChange={setScreenShake}
                  data-testid="toggle-screen-shake"
                />
              }
            />
          </SettingsSection>

          <SettingsSection icon={<Shield className="h-4 w-4" />} title="Difficulty">
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "py-2 rounded-sm border text-xs font-serif uppercase tracking-widest transition-all",
                    difficulty === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                  data-testid={`btn-difficulty-${d.toLowerCase()}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </SettingsSection>
        </motion.div>

        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full rounded-sm border border-primary/50 bg-primary/10 py-3 font-serif text-sm uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            data-testid="btn-save-settings"
          >
            Save Settings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-primary/80">
        {icon}
        <span className="font-serif text-xs uppercase tracking-widest">{title}</span>
      </div>
      <div className="space-y-3 pl-6">{children}</div>
    </div>
  );
}

function SettingsRow({
  label,
  control,
}: {
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm text-foreground/80">{label}</Label>
      {control}
    </div>
  );
}
