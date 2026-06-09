import { Terminal } from "@/components/Terminal";

export default function LabPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">The Lab</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          A scratch <span className="font-mono text-accent">main.go</span>. Edit the code, click
          <span className="font-mono text-accent2"> Run on Go Playground</span> — the snippet opens in a new tab
          with the code copied to your clipboard, ready to paste and execute against the real Go compiler.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        <Terminal />
        <aside className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 h-fit">
          <h3 className="text-sm uppercase tracking-wider text-muted mb-3">Things to try</h3>
          <ul className="space-y-2 text-sm font-mono text-slate-300">
            <li className="text-accent">fmt.Println(&quot;hi&quot;)</li>
            <li className="text-accent">for i := 0; i &lt; 5; i++</li>
            <li className="text-accent">go func() {`{...}`}()</li>
            <li className="text-accent">make(chan int, 3)</li>
            <li className="text-accent">defer cancel()</li>
            <li className="text-accent">switch v := x.(type)</li>
          </ul>
          <div className="mt-5 pt-5 border-t border-slate-800 text-xs text-slate-500">
            Execution happens on go.dev/play — the official sandbox. No install required.
          </div>
        </aside>
      </div>
    </div>
  );
}
