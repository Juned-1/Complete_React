export default function BlogPostPage({ params }) {
  return (
    <main>
        <h1>Post</h1>
        <p>{params.slug}</p>
    </main>
  )
}
