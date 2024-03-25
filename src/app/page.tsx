export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="#"
          className="group bg-primary text-secondary-foreground rounded-lg border border-black px-5 py-4 transition-colors"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>Docs</h2>
          <p className={`opacity-50 m-0 max-w-[30ch] text-sm`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>
      </div>
    </main>
  );
}
