"use client";

import { useState } from "react";

import type { InstanceDetails } from "@/lib/instances";

type InstanceDashboardProps = InstanceDetails;

function cardClassName() {
  return "rounded-3xl border border-slate-800 bg-slate-900/80 p-6";
}

function valueClassName() {
  return "mt-2 text-sm leading-6 text-slate-300";
}

type StatusTone = {
  badgeClassName: string;
  cardClassName: string;
  label: string;
};

function getStatusTone(status: string): StatusTone {
  switch (status.toLowerCase()) {
    case "red":
    case "high":
      return {
        badgeClassName:
          "border-red-400/40 bg-red-500/15 text-red-50 shadow-[0_0_0_1px_rgba(248,113,113,0.12)]",
        cardClassName: "border-red-400/35 bg-red-500/12",
        label: "Red",
      };
    case "yellow":
    case "medium":
      return {
        badgeClassName:
          "border-yellow-300/40 bg-yellow-300/14 text-yellow-50 shadow-[0_0_0_1px_rgba(253,224,71,0.10)]",
        cardClassName: "border-yellow-300/35 bg-yellow-300/10",
        label: "Yellow",
      };
    case "green":
    case "low":
      return {
        badgeClassName:
          "border-emerald-300/40 bg-emerald-300/14 text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.10)]",
        cardClassName: "border-emerald-300/35 bg-emerald-300/10",
        label: "Green",
      };
    case "blue":
      return {
        badgeClassName:
          "border-sky-300/40 bg-sky-300/14 text-sky-50 shadow-[0_0_0_1px_rgba(125,211,252,0.10)]",
        cardClassName: "border-sky-300/35 bg-sky-300/10",
        label: "Blue",
      };
    default:
      return {
        badgeClassName: "border-slate-600 bg-slate-800 text-slate-100",
        cardClassName: "border-slate-800 bg-slate-900/80",
        label: "Neutral",
      };
  }
}

function signalCardClassName(status: string) {
  const tone = getStatusTone(status);

  return `rounded-2xl border p-4 text-sm transition shadow-sm ${tone.cardClassName}`;
}

function statusLegendItems() {
  return [
    {
      description: "Needs action soon",
      label: "Red",
      tone: getStatusTone("red"),
    },
    {
      description: "Watch / review next",
      label: "Yellow",
      tone: getStatusTone("yellow"),
    },
    {
      description: "On track / clear",
      label: "Green",
      tone: getStatusTone("green"),
    },
    {
      description: "Opportunity / exploratory",
      label: "Blue",
      tone: getStatusTone("blue"),
    },
  ];
}

export function InstanceDashboard({ manifest, instance }: InstanceDashboardProps) {
  const tabs = manifest.dashboardConfig.tabs;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "overview");
  const activeTabId = tabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : tabs[0]?.id ?? "overview";

  const domain = manifest.generatedViews.domain;
  const brand = manifest.generatedViews.brand;
  const market = manifest.generatedViews.market;
  const product = manifest.generatedViews.product;

  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTabId)?.label ?? activeTabId;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
              Generated instance
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              {manifest.client.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-400">
              {manifest.overview.executiveSummary}
            </p>
          </div>
          <div className={cardClassName()}>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Instance status
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-300">
              {instance.status}
            </div>
            <div className="mt-3 text-sm text-slate-400">
              Route:{" "}
              <span className="text-slate-200">{instance.dashboardRoute}</span>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    "rounded-2xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-950/50 text-slate-300 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Active tab
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{activeTabLabel}</h2>
            </div>
            <div className="text-sm text-slate-400">
              {domain.label} · {domain.audienceLabel}
            </div>
          </div>

          {activeTabId !== "overview" && (
            <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/60 px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Color legend
                </div>
                <div className="flex flex-wrap gap-2">
                  {statusLegendItems().map((item) => (
                    <div
                      key={item.label}
                      className={[
                        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                        item.tone.badgeClassName,
                      ].join(" ")}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                      <span className="font-medium">{item.label}</span>
                      <span className="text-current/75">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTabId === "overview" && (
            <div className="grid gap-6 xl:grid-cols-12">
              <section className={`xl:col-span-8 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Overview
                </div>
                <h3 className="mt-2 text-2xl font-semibold">
                  {manifest.overview.workflowStatus}
                </h3>
                <p className={valueClassName()}>{manifest.overview.monthlyGoal}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {manifest.overview.focusAreas.map((area) => (
                    <div
                      key={area}
                      className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm"
                    >
                      {area}
                    </div>
                  ))}
                </div>
              </section>

              <section className={`xl:col-span-4 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Brand
                </div>
                <div className="mt-2 text-xl font-semibold">{brand.mission}</div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div>
                    <span className="text-slate-500">Founded:</span> {brand.founded}
                  </div>
                  <div>
                    <span className="text-slate-500">Industry:</span> {brand.industry}
                  </div>
                  <div>
                    <span className="text-slate-500">Generated for:</span>{" "}
                    {manifest.projectContext.generatedFor}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTabId === "intake" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Content intake
              </div>
              <div className="mt-4 space-y-4">
                  {manifest.focusNodes.map((node) => (
                    <div
                      key={node.id}
                      className={signalCardClassName(node.status)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="font-medium text-slate-50">{node.label}</div>
                        <div
                          className={[
                            "rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                            getStatusTone(node.status).badgeClassName,
                          ].join(" ")}
                        >
                          {getStatusTone(node.status).label} · {node.priority}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-100/90">{node.currentGap}</div>
                    <div className="mt-3 text-sm font-medium text-slate-50">
                      {node.recommendedAction}
                    </div>
                    <div className="mt-3 text-xs text-slate-100/75">
                      Platforms: {node.recommendedPlatforms.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTabId === "pipeline" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Content pipeline
              </div>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                  {manifest.deliverables.map((deliverable) => (
                    <div
                      key={deliverable.title}
                      className={signalCardClassName(deliverable.priority)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="font-medium text-slate-50">{deliverable.title}</div>
                        <div
                          className={[
                            "rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                            getStatusTone(deliverable.priority).badgeClassName,
                          ].join(" ")}
                        >
                          {deliverable.type} · {deliverable.priority}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-100/90">
                      {deliverable.purpose}
                    </div>
                    <div className="mt-3 text-xs text-slate-100/75">
                      Platforms: {deliverable.platforms.join(", ")}
                    </div>
                    <div className="mt-2 text-xs text-slate-100/70">
                      Linked gap: {deliverable.linkedGap} · Status: {deliverable.status}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTabId === "signals" && (
            <div className="grid gap-6 xl:grid-cols-12">
              <section className={`xl:col-span-6 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Visibility signals
                </div>
                <p className={valueClassName()}>{manifest.visibilitySignals.summary}</p>
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <div className="text-slate-500">Strong signals</div>
                    <ul className="mt-2 space-y-2 text-slate-300">
                      {manifest.visibilitySignals.strongSignals.map((signal) => (
                        <li key={signal}>• {signal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-slate-500">Weak signals</div>
                    <ul className="mt-2 space-y-2 text-slate-300">
                      {manifest.visibilitySignals.weakSignals.map((signal) => (
                        <li key={signal}>• {signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className={`xl:col-span-6 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Keyword tracker
                </div>
                <div className="mt-4 space-y-3">
                  {manifest.keywords.map((keyword) => (
                    <div
                      key={keyword.keyword}
                      className={signalCardClassName(keyword.priority)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="font-medium text-slate-50">{keyword.keyword}</div>
                        <div
                          className={[
                            "rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
                            getStatusTone(keyword.priority).badgeClassName,
                          ].join(" ")}
                        >
                          {keyword.priority}
                        </div>
                      </div>
                      <div className="mt-2 text-slate-100/90">
                        {keyword.category} · {keyword.intentType} ·{" "}
                        {keyword.currentVisibility}
                      </div>
                      <div className="mt-2 font-medium text-slate-50">
                        {keyword.recommendedAction}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTabId === "keywords" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Keyword tracker
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Keyword</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Visibility</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {manifest.keywords.map((keyword) => (
                      <tr key={keyword.keyword}>
                        <td className="px-4 py-3 font-medium">{keyword.keyword}</td>
                        <td className="px-4 py-3 text-slate-400">{keyword.category}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {keyword.currentVisibility}
                        </td>
                        <td className="px-4 py-3 text-emerald-300">
                          {keyword.recommendedAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTabId === "competitors" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Competitor snapshot
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Brand</th>
                      <th className="px-4 py-3">Observed strength</th>
                      <th className="px-4 py-3">Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {manifest.competitors.map((competitor) => (
                      <tr key={competitor.name}>
                        <td className="px-4 py-3 font-medium">{competitor.name}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {competitor.observedStrength}
                        </td>
                        <td className="px-4 py-3 text-emerald-300">
                          {competitor.opportunity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTabId === "review" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Review and guardrails
              </div>
              <div className="mt-4 grid gap-6 xl:grid-cols-2">
                <div>
                  <div className="text-slate-500">Required approvals</div>
                  <div className="mt-2 text-emerald-300">
                    {manifest.guardrails.approvalRequired ? "Yes" : "No"}
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {manifest.guardrails.notes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-slate-500">Restricted claims</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {manifest.guardrails.restrictedClaims.map((claim) => (
                      <li key={claim}>• {claim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTabId === "report" && (
            <section className={cardClassName()}>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Monthly report
              </div>
              <p className={valueClassName()}>{manifest.monthlyReport.summary}</p>
              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div>
                  <div className="text-slate-500">Next month plan</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {manifest.monthlyReport.nextMonthPlan.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-slate-500">Risks or blockers</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {manifest.monthlyReport.risksOrBlockers.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTabId === "research" && (
            <div className="grid gap-6 xl:grid-cols-12">
              <section className={`xl:col-span-6 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Research summary
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="text-xs text-slate-500">Sources</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {manifest.researchSummary.sourcesReviewed}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="text-xs text-slate-500">Competitors</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {manifest.researchSummary.competitorsReviewed}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="text-xs text-slate-500">Keywords</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {manifest.researchSummary.keywordsReviewed}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="text-xs text-slate-500">Segments</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {manifest.researchSummary.regionsOrSegmentsChecked}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-sm text-slate-400">
                  Last updated: {manifest.researchSummary.lastUpdated}
                </div>
              </section>

              <section className={`xl:col-span-6 ${cardClassName()}`}>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Generated views
                </div>
                <div className="mt-4 space-y-4 text-sm text-slate-300">
                  <div>
                    <div className="text-slate-500">Market signals</div>
                    <div className="mt-1">{market.marketStats.join(" • ")}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Market positioning</div>
                    <div className="mt-1">{brand.industry}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Product focus</div>
                    <div className="mt-1">{product.names.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">High-frequency signals</div>
                    <ul className="mt-2 space-y-2">
                      {manifest.notebooklmMeta.highFrequencySignals.map((signal) => (
                        <li key={signal}>• {signal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Generated at {instance.generatedAt}
        </div>
      </div>
    </main>
  );
}
