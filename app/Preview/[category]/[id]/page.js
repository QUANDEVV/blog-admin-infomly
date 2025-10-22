import { notFound } from "next/navigation";
import Image from "next/image";
import Track from "@/components/Track";
import dummyArticles from "../../../../lib/dummyData";

async function getArticle(category, id) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return dummyArticles.find(a => a.category === category && a.id === id) || null;
}

async function getViews(category, id) {
  const article = dummyArticles.find(a => a.category === category && a.id === id);
  return article ? article.views : 0;
}

export async function generateMetadata({ params }) {
  const { category, id } = params;
  const article = await getArticle(category, id);
  if (!article) return {};

  return {
    title: article.title,
    description: article.content.slice(0, 150) + "...",
    openGraph: {
      title: article.title,
      description: article.content.slice(0, 150) + "...",
      images: article.image ? [{ url: article.image, alt: article.title }] : [],
    },
  };
}

export default async function PreviewPage({ params }) {
  const { category, id } = params;
  if (!category || !id) return notFound();

  const article = await getArticle(category, id);
  const views = await getViews(category, id);

  if (!article) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
      {/* Main Content */}


          {/* Sidebar Ad Space */}
          <div className="sm:hidden flex-0.4 lg:w-[320px] lg:absolute lg:left-20  ">
  <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
    <div className="text-xs uppercase text-gray-500 mb-4">Sponsored Content</div>
    <div className="hover:opacity-90 transition">
      <Image
        src="https://cdn.flashtalking.com/203543/4860323/assets/images/ctaRollout.png"
        alt="Rolex Advertisement"
        width={300}
        height={200}
        className="mx-auto shadow rounded-lg"
      />
    </div>
    <p className="text-sm text-gray-600 mt-4">
      Discover timeless luxury with Rolex.
    </p>
  </div>
  </div>

      <div className="flex-1">
        <Track category={category} id={id} />

        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">{article.title}</h1>
        <div className="text-sm text-gray-500 mb-6 text-center">
          <span>Category: {article.category}</span> | <time>{article.date}</time> | <span>Views: {views}</span>
        </div>

        {article.image && (
          <div className="relative w-full h-72 mb-6">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="text-gray-700 leading-relaxed text-justify">{article.content}</div>
      </div>

      {/* Sidebar Ad Space */}
      <div className="flex-0.4 lg:w-[320px] lg:absolute lg:right-20">
  <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
    <div className="text-xs uppercase text-gray-500 mb-4">Sponsored Content</div>
    <div className="hover:opacity-90 transition">
      <Image
        src="https://cdn.flashtalking.com/203543/4860323/assets/images/ctaRollout.png"
        alt="Rolex Advertisement"
        width={300}
        height={200}
        className="mx-auto shadow rounded-lg"
      />
    </div>
    <p className="text-sm text-gray-600 mt-4">
      Discover timeless luxury with Rolex.
    </p>
  </div>
</div>
    </div>
  );
}