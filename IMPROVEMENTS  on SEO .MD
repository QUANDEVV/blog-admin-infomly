import { notFound } from "next/navigation";
import Image from "next/image";
import Head from "next/head";
import Track from "@/components/Track";

async function getArticle(category, id) {
  const response = await fetch(`https://blog-backend-39wb.onrender.com/blogs/${category}/${id}/`);
  if (!response.ok) return null;
  return response.json();
}

export async function generateMetadata({ params }) {
  if (!params) return {};

  const { category, id } = params;
  const article = await getArticle(category, id);

  if (!article) return {};

  return {
    title: article.title,
    description: article.description || article.content.slice(0, 150) + "...",
    openGraph: {
      title: article.title,
      description: article.description || article.content.slice(0, 150) + "...",
      images: article.image ? [{ url: article.image, alt: article.title }] : [],
    },
  };
}

export default async function PreviewPage({ params }) {
  if (!params) return notFound();

  const { category, id } = params;
  const article = await getArticle(category, id);

  if (!article) return notFound();

  // 🔥 Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description || article.content.slice(0, 150) + "...",
    "image": article.image ? [article.image] : [],
    "author": {
      "@type": "Person",
      "name": "Kennedy Muthenya Kawawa"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Blog Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourblog.com/logo.png"
      }
    },
    "datePublished": article.date,
    "dateModified": article.date
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ✅ Inject JSON-LD into the <head> */}
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Head>

      <Track category={category} id={id} />

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        <span>Category: {article.category}</span> | <time>{article.date}</time>
      </div>

      {article.image && (
        <div className="relative w-full h-64 mb-6">
          <Image src={article.image} alt={article.title} fill className="object-cover rounded-md shadow-md" />
        </div>
      )}

      <div className="text-gray-700 leading-relaxed">{article.content}</div>
    </div>
  );
}





🚀 SEO & Engagement Code Improvements for Next.js Blog
Your code is already well-optimized for SEO, but we can enhance it further to increase organic reach, engagement, and user experience.

Here’s what we can add right now:

1️⃣ Improve Open Graph & Twitter Card Meta Tags
✅ More Clicks from Social Media
Your current openGraph metadata lacks Twitter Cards and additional details. Let’s improve it:

🔹 What to Add?
Twitter meta tags for better Twitter previews
Rich Open Graph data (e.g., article:published_time, author)
Canonical URL (to prevent duplicate content issues)
✅ Updated Metadata Function:
javascript
Copy
Edit
export async function generateMetadata({ params }) {
  if (!params) return {};

  const { category, id } = params;
  const article = await getArticle(category, id);

  if (!article) return {};

  return {
    title: article.title,
    description: article.description || article.content.slice(0, 150) + "...",
    openGraph: {
      type: "article",
      url: `https://yourblog.com/${category}/${id}`,
      title: article.title,
      description: article.description || article.content.slice(0, 150) + "...",
      images: article.image ? [{ url: article.image, alt: article.title }] : [],
      article: {
        publishedTime: article.date,
        modifiedTime: article.date,
        author: "Kennedy Muthenya Kawawa",
      },
    },
    twitter: {
      card: "summary_large_image",
      site: "@your_twitter_handle",
      title: article.title,
      description: article.description || article.content.slice(0, 150) + "...",
      image: article.image || "https://yourblog.com/default-image.jpg",
    },
  };
}
✅ This makes your blog highly optimized for Twitter, Facebook, and Google!

2️⃣ Add Breadcrumbs for SEO & UX
✅ Google Loves Breadcrumbs
Breadcrumbs help search engines understand your site structure and improve click-through rates.

✅ How to Implement Breadcrumb JSON-LD?
javascript
Copy
Edit
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yourblog.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": article.category,
      "item": `https://yourblog.com/${article.category}`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": article.title,
      "item": `https://yourblog.com/${article.category}/${id}`
    }
  ]
};
✅ Inject This Inside <Head>
jsx
Copy
Edit
<Head>
  <script type="application/ld+json">
    {JSON.stringify(breadcrumbJsonLd)}
  </script>
</Head>
🔥 This improves SEO rankings and click-through rates!

3️⃣ Add Estimated Reading Time (User Engagement)
Users like to know how long an article takes to read. We can calculate this dynamically.

✅ Reading Time Function
javascript
Copy
Edit
function calculateReadingTime(content) {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
✅ Use It in JSX
jsx
Copy
Edit
<div className="text-sm text-gray-500 mb-6">
  <span>Category: {article.category}</span> | 
  <time>{article.date}</time> |
  <span>{calculateReadingTime(article.content)} min read</span>
</div>
✅ This keeps users engaged & reduces bounce rate!

4️⃣ Enable Lazy Loading for Images (Page Speed Boost)
Your Next.js <Image> component is great, but adding priority={false} ensures lazy loading:

jsx
Copy
Edit
<Image
  src={article.image}
  alt={article.title}
  fill
  priority={false} // ✅ Lazy loads images below the fold
  className="object-cover rounded-md shadow-md"
/>
✅ This improves page speed & Google rankings!

5️⃣ Auto-Generate SEO-Friendly URLs
Your URLs should be clean & readable. Instead of /category/1234, use /category/blog-title.

✅ Slugify Function
javascript
Copy
Edit
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
✅ Modify Your generateMetadata
javascript
Copy
Edit
const slug = slugify(article.title);
const url = `https://yourblog.com/${category}/${slug}`;
✅ This improves SEO rankings because keywords in URLs matter!

6️⃣ Add Related Posts Section (Boost Engagement)
Users who finish reading should stay on your site longer by clicking related posts.

✅ Fetch Related Posts
javascript
Copy
Edit
async function getRelatedPosts(category, currentId) {
  const response = await fetch(`https://blog-backend-39wb.onrender.com/blogs/${category}/`);
  if (!response.ok) return [];
  const posts = await response.json();
  
  return posts.filter(post => post.id !== currentId).slice(0, 3); // Show 3 related posts
}
✅ Display Related Posts
jsx
Copy
Edit
const relatedPosts = await getRelatedPosts(category, id);

<div className="mt-8">
  <h2 className="text-xl font-bold mb-4">Related Posts</h2>
  <ul>
    {relatedPosts.map((post) => (
      <li key={post.id}>
        <a href={`/${category}/${slugify(post.title)}`} className="text-blue-600 hover:underline">
          {post.title}
        </a>
      </li>
    ))}
  </ul>
</div>
✅ This increases engagement & reduces bounce rate!

🚀 Final Impact: How These Changes Help
Feature	Impact
Open Graph & Twitter Metadata	More clicks & shares from social media
Breadcrumb JSON-LD	Higher SEO rankings & better navigation
Reading Time Display	Users stay longer & read more
Lazy Loading Images	Faster page load & better Google ranking
SEO-Friendly URLs	Better search engine visibility
Related Posts Section	More engagement & reduced bounce rate
🔥 Next Steps: Want Me to Implement These?
Let me know which features you want me to add to your code now, and I’ll optimize it for maximum SEO & engagement! 🚀











Search

Reason

