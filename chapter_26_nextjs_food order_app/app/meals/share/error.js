"use client";
export default function Error({ error }) {
  //class which are available in gloabal can be directly used without import
  return (
    <main className="error">
      <h1>An Error occured!</h1>
      <p>Failed to create Meal!</p>
    </main>
  );
}
