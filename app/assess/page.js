import DevPanel from "@/app/components/DevPanel";

export const metadata = {
  title: "Compass Skill Tree Assessment",
};

export default function Assess() {
  return (
    <div className="relative w-full h-screen">
      <iframe
        src="/skill-tree.html"
        className="w-full h-full border-0"
        title="Compass Skill Tree Assessment"
      />
      <DevPanel />
    </div>
  );
}
