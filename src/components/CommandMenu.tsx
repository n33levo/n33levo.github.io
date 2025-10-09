import { Button } from "@/components/ui/button";

interface CommandMenuProps {
  onCommandSelect: (command: string) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

const commands = [
  { cmd: "cat about.txt", desc: "About me" },
  { cmd: "cat experience.txt", desc: "Work experience" },
  { cmd: "cat education.txt", desc: "Education" },
  { cmd: "cat achievements.txt", desc: "Awards & achievements" },
  { cmd: "ls ./skills/", desc: "Technical skills" },
  { cmd: "cd projects", desc: "View projects" },
  { cmd: 'open -a "chai chat"', desc: "Open chai chat" },
  { cmd: "wget resume", desc: "Download resume" },
  { cmd: "whereis socials", desc: "View social links" },
  { cmd: "pwd", desc: "View directory structure" },
];

const CommandMenu = ({ onCommandSelect, onClose, onMinimize, onMaximize }: CommandMenuProps) => {
  const handleCommandClick = (cmd: string) => {
    // Send the full command as typed
    onCommandSelect(cmd);
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Menu Header */}
      <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-destructive hover:bg-red-600 transition-colors cursor-pointer"
            title="Close"
          />
          <button
            onClick={onMinimize}
            className="w-3 h-3 rounded-full bg-terminal-yellow hover:bg-yellow-500 transition-colors cursor-pointer"
            title="Minimize"
          />
          <button
            onClick={onMaximize}
            className="w-3 h-3 rounded-full bg-terminal-green hover:bg-green-500 transition-colors cursor-pointer"
            title="Maximize"
          />
        </div>
        <div className="text-sm text-muted-foreground ml-4">commands</div>
      </div>

      {/* Commands List */}
      <div className="flex-1 p-3 overflow-y-auto">
        <h2 className="text-primary text-base font-bold mb-2">Try these commands:</h2>
        <div className="space-y-1.5">
          {commands.map((item, index) => (
            <button
              key={index}
              onClick={() => handleCommandClick(item.cmd)}
              className="w-full text-left p-2 rounded border border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="text-terminal-cyan font-mono text-sm group-hover:text-primary transition-colors">
                {item.cmd}
              </div>
              <div className="text-muted-foreground text-xs mt-0.5">
                {item.desc}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 p-3 border border-border rounded bg-muted/30">
          <div className="text-primary font-semibold mb-1 text-sm">💡 Pro Tip</div>
          <div className="text-xs text-muted-foreground">
            Click any command to run it in the terminal! You can also type commands directly. Use arrow keys ↑↓ to navigate command history.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
