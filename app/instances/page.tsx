import type { Metadata } from "next";
import Link from "next/link";

import { listInstanceSummaries } from "@/lib/instances";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Generated Instances",
  description: "Client dashboard packages generated from research briefs",
};

export default async function InstancesIndexPage() {
  const instances = await listInstanceSummaries();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Generated instances
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Client dashboard packages
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Open a generated client package to view the manifest-driven dashboard
            output.
          </p>
        </div>

        <div className="grid gap-4">
          {instances.map((instance) => (
            <Link
              key={instance.slug}
              href={`/instances/${instance.slug}`}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-emerald-500/60 hover:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-medium">{instance.name}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {instance.domainLabel} · {instance.domainId}
                  </div>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <div className="text-emerald-300">{instance.status}</div>
                  <div className="mt-1">{instance.generatedAt}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-300">
                Open {instance.route}
              </div>
            </Link>
          ))}

          {instances.length === 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
              No instances found. Generate one with the bootstrap script first.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
