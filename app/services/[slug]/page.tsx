import ServiceBuilder from "./service-builder";

export const dynamicParams = true;

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceBuilder slug={slug} />;
}
