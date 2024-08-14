import { useRouter } from "next/router";
export default function DetailPage() {
  const router = useRouter();
  console.log(router.query.newsId);
  return (
    <h1>Something</h1>
  );
}
