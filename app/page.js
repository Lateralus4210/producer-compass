import DevPanel from "@/app/components/DevPanel";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <iframe
        src="/skill-tree.html"
        className="w-full h-full border-0"
        title="Producer Compass Skill Tree"
      />
      <DevPanel />
    </div>
  );
}
