import type { MetadataRoute } from 'next'
import { DISCIPLINE_CONTENT } from '@/lib/disciplines'
import { PRODUCTS } from '@/lib/boutique/products'
import { getAllPosts } from '@/lib/blog/posts'

const BASE_URL = 'https://xenotif.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const disciplines = Object.keys(DISCIPLINE_CONTENT).map(slug => ({
    url: `${BASE_URL}/disciplines/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const products = PRODUCTS.map(p => ({
    url: `${BASE_URL}/boutique/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogPosts = getAllPosts().map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/boutique`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    ...disciplines,
    ...products,
    ...blogPosts,
  ]
}
