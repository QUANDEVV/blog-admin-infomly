// const BASE_URL = "https://infomly.com";

async function fetchArticles(category) {
//   try {
//     const response = await fetch(`https://blog-backend-39wb.onrender.com/blogs/${category}/`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch articles for category: ${category}`);
//     }
//     return await response.json();
//   } catch (error) {
//     // Error fetching articles for category
//     return [];
//   }
}

export default async function sitemap() {
//   const categories = ["Health", "News", "Tech", "AI"];
//   const lastModified = new Date().toISOString();

//   const staticRoutes = ["/", "/AI", "/Health", "/Tech" , "/News"].map((route) => ({
//     url: `${BASE_URL}${route}`,
//     lastModified,
//   }));

//   const dynamicRoutes = (await Promise.all(categories.map(fetchArticles)))
//     .flat()
//     .map((article) => ({
//       url: `${BASE_URL}/Preview/${article.category}/${article.id}`,
//       lastModified: article.date || lastModified,
//     }));

//   const sitemapData = [...staticRoutes, ...dynamicRoutes];

//   console.log("Generated Sitemap:", JSON.stringify(sitemapData, null, 2));

  return sitemapData;
}
