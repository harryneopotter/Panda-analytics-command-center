import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InstanceDashboard } from "@/components/instance-dashboard/instance-dashboard";
import { loadInstance, listInstanceSummaries } from "@/lib/instances";

export const dynamic = "force-dynamic";

type InstancePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: InstancePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadInstance(slug);

  if (!data) {
    return {
      title: "Client Instance",
      description: "Generated client dashboard instance",
    };
  }

  return {
    title: `${data.manifest.client.name} | Client Dashboard`,
    description: data.manifest.overview.executiveSummary,
  };
}

export async function generateStaticParams() {
  const instances = await listInstanceSummaries();
  return instances.map((instance) => ({
    slug: instance.slug,
  }));
}

export default async function InstancePage({ params }: InstancePageProps) {
  const { slug } = await params;
  const data = await loadInstance(slug);

  if (!data) {
    notFound();
  }

  return <InstanceDashboard {...data} />;
}
