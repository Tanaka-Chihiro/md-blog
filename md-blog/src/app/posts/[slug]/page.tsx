import fs from "fs";
import path from "path";
import Link from "next/link";
import React from "react";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { rehype } from "rehype";
import rehypeRaw from "rehype-raw";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import rehypeExternalLinks from "rehype-external-links";
import { PostItem } from "../../lib/types";
import { Metadata, ResolvingMetadata } from "next";
import { getPostData } from "../../lib/functions";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await createPostData(params.slug);
  return {
    title: `${post.title} | ブログタイトル`,
    description: `${post.description ?? post.title}`,
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDirectory);
  const posts = await getPostData();
  return posts.map((post: PostItem) => {
    return {
      path: `/posts/${post.slug}`,
      slug: post.slug,
    };
  });
}

async function createPostData(slug: string): Promise<PostItem> {
  const filePath = path.join(process.cwd(), "posts", `${slug}`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  const rehypedContent = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeRaw)
    .use(rehypePrism)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["nofollow"] })
    .use(rehypeStringify)
    .process(contentHtml);

  return {
    slug: slug,
    title: data.title,
    description: data.description,
    date: data.date,
    image: data.image,
    tags: data.tags,
    contentHtml: rehypedContent.value.toString(),
  };
}

export default async function Post({ params }: Props) {
  const postData = await createPostData(params.slug);

  return (
    <>
      <Header />
      <div className="flex mx-20 my-10">
        {postData.image && (
          <div className="flex justify-center mb-3">
            <picture>
              <img
                src={`${postData.image}`}
                alt={postData.title}
                width={400}
                height={300}
                className="object-contain max-w-full h-auto"
                style={{ maxHeight: "224px" }}
              />
            </picture>
          </div>
        )}
        <div className="mx-10 w-1/2">
          <h1 className="text-lg">{postData?.title}</h1>
          <div>{postData?.date}</div>
          <div className="space-x-2">
            {postData?.tags &&
              postData.tags?.map((category) => (
                <span key={category} className="badge bg-secondary">
                  <Link href={`/tags/${category}`}>#{category}</Link>
                </span>
              ))}
          </div>
          <div className="row">
            <div
              className={"markdown-content col-md-12 text-sm"}
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
            ></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
